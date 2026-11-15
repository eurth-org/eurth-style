/**
 * The Astro side of @eurth/style: one entry in a tool's astro.config.mjs sets the site up the
 * way Flagwright is set up, and after the build writes the files every tool needs, so no tool
 * carries its own copy of this.
 *
 *   import svelte from '@astrojs/svelte';
 *   import eurth from '@eurth/style/astro';
 *   import { site } from './eurth.config.mjs';
 *   export default defineConfig({ integrations: [svelte(), eurth(site)] });
 *
 * Settings: static output, addresses ending in a slash, the stylesheet inside each page (one
 * download for the first paint), scripts as separate files (so the Content-Security-Policy can
 * allow only the site's own), and a sitemap.
 *
 * After the build, in dist/:
 *   _headers              security headers, with the hash of every inline script
 *   sw.js                 the service worker, with the files to keep and a version from their contents
 *   manifest.webmanifest  for installing the tool as an app
 *   robots.txt, llms.txt  for search engines and language models
 * A file of the same name in public/ wins, except _headers and sw.js, which are always written here.
 */
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveColors } from '../contrast.js';
import { THEME_COLOR } from '../generated.js';

/** @typedef {import('../build.js').Site & { host: string }} Site */

/**
 * @typedef {object} Options
 * @property {RegExp[]} [offlineSkip]  Files the service worker shouldn't keep up front (large galleries), matched against paths like "flags/be.svg".
 * @property {string[]} [connect]      More sources the pages may fetch from, for the rare tool with a Worker elsewhere. Same-origin needs nothing.
 */

/** Every file under a folder, as paths relative to it with forward slashes. @param {string} dir */
export function filesIn(dir) {
  /** @type {string[]} */
  const files = [];
  /** @param {string} at */
  const walk = (at) => {
    for (const entry of readdirSync(at, { withFileTypes: true })) {
      const path = join(at, entry.name);
      if (entry.isDirectory()) walk(path);
      else files.push(relative(dir, path).split(sep).join('/'));
    }
  };
  walk(dir);
  return files.sort();
}

/**
 * The inline scripts of a page that run (data blocks such as JSON-LD don't, so they need no hash).
 * @param {string} html
 * @returns {string[]}
 */
export function inlineScripts(html) {
  const found = [];
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attrs ?? '') || /type="application\/(ld\+)?json"/.test(attrs ?? '') || !body?.trim()) continue;
    found.push(body);
  }
  return found;
}

/** The Content-Security-Policy source for an inline script. @param {string} body */
export function scriptHash(body) {
  return `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
}

/**
 * The security headers, as a Cloudflare _headers file. The Content-Security-Policy lets only
 * the site's own files run, plus the inline scripts Astro writes into each page (the theme
 * before first paint, the loaders for islands), allowed by their hashes. Styles may be inline:
 * the stylesheet is inside each page. Embedding is allowed on eurth.org. There's no
 * upgrade-insecure-requests: Cloudflare redirects to HTTPS, and the directive breaks local
 * testing over http.
 * @param {string[]} hashes
 * @param {string[]} [connect]
 */
export function securityHeaders(hashes, connect = []) {
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    `connect-src 'self' ${connect.join(' ')}`.trim(),
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self' https://eurth.org https://*.eurth.org",
  ].join('; ');
  return `# Written by @eurth/style after the build. Don't edit: see HANDBOOK.md, Privacy.
/*
  Content-Security-Policy: ${csp}
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()
  Cross-Origin-Opener-Policy: same-origin
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: no-cache
`;
}

/** Not kept for offline: sharing images, the server's files, the 404 page, what search engines read. */
const NEVER_KEPT = /^(og[\w-]*\.png$|_headers$|_redirects$|404\.html$|sw\.js$|robots\.txt$|llms\.txt$|sitemap)/;

/**
 * Writes the files a built site needs. Called by the integration; exported for tests.
 * @param {string} dist the built site's folder
 * @param {Site} site
 * @param {Options} [options]
 */
export function finishBuild(dist, site, options = {}) {
  let files = filesIn(dist);
  const has = (/** @type {string} */ name) => files.includes(name);
  const write = (/** @type {string} */ name, /** @type {string} */ text) => writeFileSync(join(dist, name), text);

  // Search engines and language models.
  if (!has('robots.txt')) {
    write('robots.txt', `# ${site.name}, ${site.host}: everything here is meant to be found.\nUser-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`);
  }
  if (!has('llms.txt')) {
    const pages = site.pages.map((page) => `- [${page.label}](${new URL(page.href, site.url).href})`).join('\n');
    write(
      'llms.txt',
      `# ${site.name}\n\n> ${site.description}\n\n${site.name} is free, runs in the browser and needs no account. It is made by Eurth (https://eurth.org), a worldbuilding and roleplay community since 2004. Nothing a visitor makes is stored: a design lives in its link.\n\n## Pages\n\n${pages}\n${site.llms ? `\n${site.llms.trim()}\n` : ''}`,
    );
  }

  // Installing as an app.
  if (!has('manifest.webmanifest')) {
    const tokens = JSON.parse(readFileSync(new URL('../../tokens.json', import.meta.url), 'utf8'));
    write(
      'manifest.webmanifest',
      `${JSON.stringify(
        {
          name: site.name,
          short_name: site.name,
          description: site.description,
          lang: 'en-GB',
          start_url: '/',
          display: 'standalone',
          background_color: THEME_COLOR.light,
          theme_color: resolveColors(tokens, 'light')['eurth-blue'],
          icons: [
            { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        null,
        2,
      )}\n`,
    );
  }

  // The Content-Security-Policy, with the hash of every inline script the built pages carry.
  files = filesIn(dist);
  const hashes = new Set();
  for (const file of files.filter((f) => f.endsWith('.html'))) {
    for (const body of inlineScripts(readFileSync(join(dist, file), 'utf8'))) hashes.add(scriptHash(body));
  }
  write('_headers', securityHeaders([...hashes].sort(), options.connect));

  // The service worker: what to keep, and a version made from its contents.
  const skip = (/** @type {string} */ path) => NEVER_KEPT.test(path) || (options.offlineSkip ?? []).some((pattern) => pattern.test(path));
  const app = files.filter((f) => !skip(f) && f !== '_headers');
  const version = createHash('sha256');
  for (const file of app) version.update(file).update(readFileSync(join(dist, file)));
  const urls = app.map((f) => `/${f.replace(/(^|\/)index\.html$/, '$1')}`);
  const worker = readFileSync(new URL('../offline/sw.js', import.meta.url), 'utf8')
    .replace("'__NAME__'", JSON.stringify(`eurth-${site.id}`))
    .replace("'__VERSION__'", JSON.stringify(version.digest('hex').slice(0, 12)))
    .replace('__APP__', JSON.stringify(urls));
  write('sw.js', worker);

  const missing = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og.png'].filter((name) => !has(name));
  return { hashes: hashes.size, kept: urls.length, missing };
}

/**
 * The integration. Returns two (the sitemap, then ours): Astro takes the list as it is.
 * @param {Site} site from defineSite() in eurth.config.mjs
 * @param {Options} [options]
 * @returns {import('astro').AstroIntegration[]}
 */
export default function eurth(site, options = {}) {
  return [
    sitemap({ filter: (page) => !/\/404\/?$/.test(page), changefreq: 'monthly', lastmod: new Date() }),
    {
      name: '@eurth/style',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            site: site.url,
            output: 'static',
            trailingSlash: 'always',
            build: { inlineStylesheets: 'always' },
            vite: {
              build: { assetsInlineLimit: 0 },
              // Both packages ship their source (.astro, .svelte), which Vite must read itself.
              ssr: { noExternal: ['@eurth/style', '@eurth/profile'] },
            },
          });
        },
        'astro:build:done': ({ dir, logger }) => {
          const result = finishBuild(fileURLToPath(dir), site, options);
          logger.info(`${result.hashes} inline script hashes in the Content-Security-Policy; the service worker keeps ${result.kept} files`);
          if (result.missing.length) logger.warn(`missing from public/: ${result.missing.join(', ')} (make them with '@eurth/style/images')`);
        },
      },
    },
  ];
}
