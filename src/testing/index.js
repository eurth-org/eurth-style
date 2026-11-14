/**
 * The checks every tool runs, as ready-made Vitest suites. A tool's tests/shell.test.js is three lines:
 *
 *   import { standardSuites } from '@eurth/style/testing';
 *   import { site } from '../eurth.config.mjs';
 *   standardSuites({ site });
 *
 * Most of them read the built site (dist/), so CI builds first and tests after, as Flagwright
 * does. Without a build they are skipped, loudly.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { filesIn, inlineScripts, scriptHash } from '../astro/integration.js';
import { buildTime, findTool, githubLinksAllowed, unlaunchedTools } from '../build.js';
import { checkPairs, PAIRS } from '../contrast.js';

/** @typedef {import('../build.js').Site & { host: string }} Site */

const tokens = () => JSON.parse(readFileSync(new URL('../../tokens.json', import.meta.url), 'utf8'));
const text = (/** @type {string} */ dist, /** @type {string} */ file) => readFileSync(join(dist, file), 'utf8');
const built = (/** @type {string} */ dist) => existsSync(join(dist, '_headers'));
const pagesOf = (/** @type {string} */ dist) => filesIn(dist).filter((f) => f.endsWith('.html'));
const isText = (/** @type {string} */ file) => /\.(html|js|mjs|css|json|txt|xml|svg|webmanifest)$/.test(file) || file === '_headers';

/**
 * Contrast: every text pair of the suite's tokens, in both themes, at WCAG AAA. Add a tool's
 * own pairs as [foreground token, background token, minimum]; a tool with colours of its own
 * that aren't tokens (a palette people pick from) tests those itself with contrast().
 * @param {[string, string, number][]} [more]
 */
export function contrastSuite(more = []) {
  describe('contrast (WCAG AAA)', () => {
    it.each(checkPairs(tokens(), [...PAIRS, ...more]))('$theme: $fg on $bg reaches $min:1', ({ ratio, min }) => {
      expect(ratio).toBeGreaterThanOrEqual(min);
    });
  });
}

/**
 * Security headers: inline scripts are allowed only by their hashes, and every inline script
 * of every built page is on the list, or the page would break in silence.
 * @param {{ dist?: string }} [options]
 */
export function headersSuite({ dist = 'dist' } = {}) {
  describe.skipIf(!built(dist))('security headers', () => {
    const headers = () => text(dist, '_headers');

    it('allow scripts only from the site itself, and inline ones only by hash', () => {
      const csp = /Content-Security-Policy: (.*)/.exec(headers())?.[1] ?? '';
      expect(csp).toContain("default-src 'self'");
      expect(csp).toMatch(/script-src 'self'( 'sha256-[A-Za-z0-9+/=]+')*;/);
      expect(csp).not.toMatch(/script-src[^;]*'unsafe-(inline|eval)'/);
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("frame-ancestors 'self' https://eurth.org https://*.eurth.org");
    });

    it('turn off what the site never uses', () => {
      expect(headers()).toMatch(/Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/);
      expect(headers()).toContain('X-Content-Type-Options: nosniff');
    });

    it('list every inline script of the built pages', () => {
      const pages = pagesOf(dist);
      expect(pages.length).toBeGreaterThan(0);
      for (const page of pages) {
        for (const body of inlineScripts(text(dist, page))) expect(headers(), `${page}: ${body.slice(0, 60)}`).toContain(scriptHash(body));
      }
    });
  });
}

/**
 * Privacy: nothing stored, nothing fetched from anywhere else. The built files never mention
 * browser storage or cookies, and no page loads a script, style, font, picture or frame from
 * another address.
 * @param {{ dist?: string }} [options]
 */
export function privacySuite({ dist = 'dist' } = {}) {
  describe.skipIf(!built(dist))('privacy: nothing stored, nothing from elsewhere', () => {
    it('never touches cookies, localStorage, sessionStorage or IndexedDB', () => {
      // Scripts only: a page may well say in words that it uses none of these.
      for (const file of filesIn(dist).filter((f) => /\.(html|js|mjs)$/.test(f) && f !== 'sw.js')) {
        const code = file.endsWith('.html') ? inlineScripts(text(dist, file)).join('\n') : text(dist, file);
        const found = /\b(localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore)\b/.exec(code);
        expect(found?.[0], `${file} uses ${found?.[0]}`).toBeUndefined();
      }
    });

    it('loads nothing from another address', () => {
      const loads = /<(?:script|img|iframe|source|video|audio|embed|object|track)\b[^>]*?\s(?:src|data|srcset|poster)="(https?:)?\/\/[^"]*"|<link\b(?=[^>]*\srel="(?:stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|icon|apple-touch-icon|manifest)")[^>]*?\shref="(https?:)?\/\/[^"]*"/i;
      for (const page of pagesOf(dist)) expect(loads.exec(text(dist, page))?.[0], page).toBeUndefined();
      for (const file of filesIn(dist).filter((f) => f.endsWith('.css'))) expect(/url\(\s*['"]?(https?:)?\/\//.exec(text(dist, file))?.[0], file).toBeUndefined();
      for (const page of pagesOf(dist)) expect(/<style[^>]*>[^<]*url\(\s*['"]?(https?:)?\/\//.exec(text(dist, page))?.[0], page).toBeUndefined();
    });
  });
}

/**
 * No spoilers: until a tool's door opens, no built file names its address; and until
 * 25 December 2026 no page links to GitHub. Judged at build time (EURTH_BUILD_TIME, or now).
 * @param {{ site: Site, dist?: string }} options
 */
export function spoilerSuite({ site, dist = 'dist' }) {
  describe.skipIf(!built(dist))('launch: no spoilers', () => {
    const at = buildTime();

    it('mentions no tool whose door is still closed', () => {
      const closed = unlaunchedTools(at)
        .filter((tool) => tool.id !== site.id)
        .map((tool) => new URL(tool.url).host);
      for (const file of filesIn(dist).filter(isText)) {
        const content = text(dist, file);
        for (const host of closed) expect(content.includes(host), `${file} mentions ${host}`).toBe(false);
      }
    });

    it.skipIf(githubLinksAllowed(at))('links to GitHub from no page', () => {
      for (const page of pagesOf(dist)) expect(/href="https?:\/\/(www\.)?github\.com[^"]*"/.exec(text(dist, page))?.[0], page).toBeUndefined();
    });
  });
}

/** The width and height of a PNG. @param {Buffer} png */
function pngSize(png) {
  return png.subarray(1, 4).toString() === 'PNG' ? [png.readUInt32BE(16), png.readUInt32BE(20)] : [0, 0];
}

/**
 * Pages: what search engines, link previews and assistive technology each need from every page.
 * @param {{ site: Site, dist?: string }} options
 */
export function pagesSuite({ site, dist = 'dist' }) {
  describe.skipIf(!built(dist))('pages', () => {
    const pages = () => pagesOf(dist).filter((p) => p !== '404.html');
    const meta = (/** @type {string} */ html, /** @type {string} */ attr, /** @type {string} */ name) =>
      new RegExp(`<meta\\b[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, 'i').exec(html)?.[1];

    it('come with the files that go around them', () => {
      for (const file of ['sitemap-index.xml', 'robots.txt', 'llms.txt', 'manifest.webmanifest', 'sw.js', '404.html', 'favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og.png']) {
        expect(existsSync(join(dist, file)), `${file} is missing`).toBe(true);
      }
      expect(text(dist, 'robots.txt')).toContain(`Sitemap: ${site.url}/sitemap-index.xml`);
    });

    it('have a web manifest an app can be installed from', () => {
      const manifest = JSON.parse(text(dist, 'manifest.webmanifest'));
      expect(manifest.name).toBe(site.name);
      expect(manifest.display).toBe('standalone');
      expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
      const sizes = manifest.icons.map((/** @type {{ sizes: string }} */ icon) => icon.sizes);
      expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
      expect(manifest.icons.some((/** @type {{ purpose?: string }} */ icon) => icon.purpose?.includes('maskable'))).toBe(true);
    });

    it('each have one h1, a language, a skip link and the theme script', () => {
      for (const page of pages()) {
        const html = text(dist, page);
        expect(html.match(/<h1[\s>]/g)?.length, `${page}: h1`).toBe(1);
        expect(html, page).toMatch(/<html[^>]*lang="en-GB"/);
        expect(html, page).toMatch(/<a[^>]*class="eu-skip"[^>]*href="#main"/);
        expect(html, page).toContain('id="main"');
        expect(html, page).toContain('eurth:1:');
      }
    });

    it('each have their own title, description and canonical link', () => {
      const titles = new Map();
      const descriptions = new Map();
      for (const page of pages()) {
        const html = text(dist, page);
        const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '';
        const description = meta(html, 'name', 'description') ?? '';
        expect(title.length, `${page}: title`).toBeGreaterThan(10);
        expect(description.length, `${page}: description is ${description.length} characters`).toBeGreaterThanOrEqual(50);
        expect(description.length, `${page}: description is ${description.length} characters`).toBeLessThanOrEqual(200);
        expect(titles.get(title), `${page} shares its title with ${titles.get(title)}`).toBeUndefined();
        expect(descriptions.get(description), `${page} shares its description with ${descriptions.get(description)}`).toBeUndefined();
        titles.set(title, page);
        descriptions.set(description, page);
        const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
        expect(canonical, `${page}: canonical`).toBe(new URL(`/${page.replace(/(^|\/)index\.html$/, '$1')}`, site.url).href);
      }
    });

    it('each have a link preview: a 1200 by 630 PNG with alt text', () => {
      for (const page of pages()) {
        const html = text(dist, page);
        const image = meta(html, 'property', 'og:image') ?? '';
        expect(image.startsWith(`${site.url}/`), `${page}: og:image is ${image}`).toBe(true);
        const file = join(dist, new URL(image).pathname);
        expect(existsSync(file), `${page}: ${image} isn't in the build`).toBe(true);
        expect(pngSize(readFileSync(file)), `${page}: ${image}`).toEqual([1200, 630]);
        expect((meta(html, 'property', 'og:image:alt') ?? '').length, `${page}: og:image:alt`).toBeGreaterThan(10);
        expect(meta(html, 'name', 'twitter:card'), page).toBe('summary_large_image');
      }
    });

    it('each carry structured data that parses, with Eurth as the organisation', () => {
      for (const page of pages()) {
        const blocks = [...text(dist, page).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(/** @type {string} */ (json)));
        const types = blocks.map((block) => block['@type']);
        expect(types, page).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
      }
      const start = [...text(dist, 'index.html').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(/** @type {string} */ (json))['@type']);
      if (findTool(site.id)?.kind === 'tool') expect(start, 'the maker says it is a WebApplication').toContain('WebApplication');
    });
  });
}

/**
 * Launch: the LAUNCH_AT file holds the door's time, with its offset, and agrees with tools.json
 * once the tool is listed there.
 * @param {{ site: Site, root?: string }} options
 */
export function launchSuite({ site, root = '.' }) {
  describe('launch', () => {
    it('LAUNCH_AT is an ISO time with its offset, the same as in tools.json', () => {
      const file = join(root, 'LAUNCH_AT');
      expect(existsSync(file), 'the LAUNCH_AT file is missing').toBe(true);
      const at = readFileSync(file, 'utf8').trim();
      expect(at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/);
      const tool = findTool(site.id);
      if (tool) expect(new Date(at).getTime(), `tools.json says ${tool.launch}`).toBe(new Date(tool.launch).getTime());
    });
  });
}

/**
 * All of the above.
 * @param {{ site: Site, dist?: string, root?: string, pairs?: [string, string, number][] }} options
 */
export function standardSuites({ site, dist = 'dist', root = '.', pairs = [] }) {
  if (!built(dist)) console.warn(`@eurth/style/testing: no build in ${dist}/, so the checks of the built site are skipped. Run "npm run build" first.`);
  contrastSuite(pairs);
  headersSuite({ dist });
  privacySuite({ dist });
  spoilerSuite({ site, dist });
  pagesSuite({ site, dist });
  launchSuite({ site, root });
}
