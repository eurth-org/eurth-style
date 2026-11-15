import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { finishBuild } from '../src/astro/integration.js';
import { ref as browserRef, wikipedia } from '../src/index.js';
import { describe, expect, it } from 'vitest';
import { GITHUB_FROM, defineSite, everyTool, githubLinksAllowed, launchedTools, pageTitle, ref, unlaunchedTools, webApplication, breadcrumbs, definedTermSet } from '../src/build.js';
import { decodeState, encodeState, stateLink } from '../src/link.js';
import { DEFAULTS, decodePrefs, encodePrefs } from '../src/prefs.js';
import { APPROVED, seasonOf } from '../src/seasonal.js';
import { ART } from '../src/seasonal-art.js';
import { markdownText, shareTargets } from '../src/share.js';
import { HEAD_SCRIPT } from '../src/generated.js';

const site = defineSite({
  id: 'flag',
  name: 'Flagwright',
  url: 'https://flag.eurth.org',
  title: 'Flagwright: free online flag maker for worldbuilders',
  description: 'A free online flag maker.',
  tagline: 'Flags made to fly',
  pages: [{ href: '/', label: 'Maker' }],
  repo: 'https://github.com/eurth-org/eurth-flag',
  ogAlt: 'A row of flags.',
});

describe('tools.json and the advent calendar', () => {
  const doors = everyTool().filter((tool) => tool.door);

  it('has fifteen doors, one a day from 10 to 24 December, at midnight in Brussels', () => {
    expect(doors.map((tool) => tool.door)).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
    doors.forEach((tool, i) => expect(tool.launch).toBe(`2026-12-${10 + i}T00:00:00+01:00`));
    expect(doors.map((tool) => tool.id)).toEqual(['arms', 'seats', 'names', 'cities', 'stats', 'dynasty', 'cal', 'time', 'bank', 'passport', 'rank', 'anthem', 'prompt', 'wiki', 'card']);
  });

  it('gives every tool an id that is its subdomain, a name, a pitch and a time with its offset', () => {
    for (const tool of everyTool()) {
      expect(tool.url).toBe(`https://${tool.id}.eurth.org`);
      expect(tool.name).toMatch(/^[A-Z]/);
      expect(tool.pitch).not.toMatch(/\.$/);
      expect(tool.launch).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    }
    expect(new Set(everyTool().map((tool) => tool.id)).size).toBe(everyTool().length);
  });

  it('shows only what has launched at build time', () => {
    const names = (at) => launchedTools(new Date(at)).map((tool) => tool.id);
    expect(names('2026-11-14T12:00:00+01:00')).toEqual(['map', 'news', 'gov', 'flag']);
    expect(names('2026-11-14T23:59:59+01:00')).not.toContain('tools');
    expect(names('2026-11-15T00:00:00+01:00')).toContain('tools');
    expect(names('2026-12-09T23:59:59+01:00')).not.toContain('arms');
    expect(names('2026-12-10T00:00:00+01:00')).toContain('arms');
    expect(names('2026-12-10T00:00:00+01:00')).not.toContain('seats');
    expect(unlaunchedTools(new Date('2026-12-24T00:00:00+01:00'))).toEqual([]);
  });

  it('follows EURTH_BUILD_TIME, so a launch can be built ahead of its door', () => {
    process.env.EURTH_BUILD_TIME = '2026-12-13T00:00:00+01:00';
    try {
      expect(launchedTools().at(-1)?.id).toBe('cities');
      process.env.EURTH_BUILD_TIME = 'soon';
      expect(() => launchedTools()).toThrow(/isn't a time/);
    } finally {
      delete process.env.EURTH_BUILD_TIME;
    }
  });

  it('keeps GitHub links back until 25 December', () => {
    expect(GITHUB_FROM).toBe('2026-12-25T00:00:00+01:00');
    expect(githubLinksAllowed(new Date('2026-12-24T23:59:59+01:00'))).toBe(false);
    expect(githubLinksAllowed(new Date('2026-12-25T00:00:00+01:00'))).toBe(true);
  });
});

describe('a site and its pages', () => {
  it('is checked when defined', () => {
    expect(site.host).toBe('flag.eurth.org');
    expect(() => defineSite({ ...site, url: 'https://flag.eurth.org/' })).toThrow(/url/);
    expect(() => defineSite({ ...site, pages: [] })).toThrow(/pages/);
    expect(() => defineSite({ ...site, ogAlt: '' })).toThrow(/ogAlt/);
  });

  it('titles the start page with the pattern and other pages with their name', () => {
    expect(pageTitle(site, '/')).toBe('Flagwright: free online flag maker for worldbuilders');
    expect(pageTitle(site, '/guide/', 'Guide')).toBe('Guide · Flagwright');
  });

  it('marks outbound links, and only those', () => {
    expect(ref('https://eurth.org/', site.host)).toBe('https://eurth.org/?ref=flag.eurth.org');
    expect(ref('https://flag.eurth.org/guide/', site.host)).toBe('https://flag.eurth.org/guide/');
    expect(ref('/guide/', site.host)).toBe('/guide/');
    expect(ref('mailto:x@example.org', site.host)).toBe('mailto:x@example.org');
  });

  it('offers the same helpers to browser code', () => {
    expect(browserRef).toBe(ref);
    expect(wikipedia('Nordic cross flag', site.host)).toBe('https://en.wikipedia.org/wiki/Nordic_cross_flag?ref=flag.eurth.org');
  });

  it('describes itself to search engines', () => {
    expect(webApplication(site)).toMatchObject({ '@type': 'WebApplication', isAccessibleForFree: true, offers: { price: '0' } });
    expect(breadcrumbs(site, [{ name: 'Guide', path: '/guide/' }]).itemListElement.map((step) => step.item)).toEqual(['https://flag.eurth.org/', 'https://flag.eurth.org/guide/']);
    const set = definedTermSet(site, { name: 'Glossary', path: '/glossary/', terms: [{ id: 'canton', term: 'Canton', definition: 'The upper hoist quarter.' }] });
    expect(set.hasDefinedTerm[0]).toMatchObject({ '@type': 'DefinedTerm', url: 'https://flag.eurth.org/glossary/#canton' });
  });
});

describe("this visit's choices", () => {
  it('start on Auto, sound off, motion as the device asks', () => {
    expect(decodePrefs('')).toEqual(DEFAULTS);
    expect(encodePrefs(DEFAULTS)).toBe('');
  });

  it('survive the trip through window.name', () => {
    for (const theme of ['auto', 'light', 'dark']) {
      for (const sound of [true, false]) {
        for (const motion of [true, false]) {
          const prefs = { theme, sound, motion };
          if (encodePrefs(prefs)) expect(decodePrefs(encodePrefs(prefs))).toEqual(prefs);
        }
      }
    }
    expect(encodePrefs({ theme: 'dark', sound: false, motion: true })).toBe('eurth:1:d:0:a');
  });

  it("ignore a window.name that isn't theirs", () => {
    for (const name of ['popup', 'eurth:1:x:0:a', 'eurth:2:d:0:a', 'eurth:1:d:0:a<script>', '{"theme":"dark"}']) expect(decodePrefs(name)).toEqual(DEFAULTS);
  });

  it('are read by the head script in the same shape', () => {
    expect(HEAD_SCRIPT).toContain('/^eurth:1:([ald]):([01]):([a0])$/');
    expect(HEAD_SCRIPT).toContain("'#002b36':'#ffffff'");
    expect(HEAD_SCRIPT).not.toMatch(/localStorage|sessionStorage|cookie/);
  });
});

describe('a design in its link', () => {
  it('comes back as it went in', () => {
    const design = { n: 'Ørioni “the Great”', c: ['#fff', 1, null], deep: { ok: true } };
    expect(decodeState(encodeState(design, 3))).toEqual({ version: 3, value: design });
    expect(encodeState(design)).toMatch(/^1\.[A-Za-z0-9_-]+$/);
  });

  it('is the only thing in the query string, and absent when there is nothing to say', () => {
    expect(stateLink({ n: 'Orioni' }, { base: 'https://flag.eurth.org/?ref=x&d=old#top' })).toBe(`https://flag.eurth.org/?d=${encodeState({ n: 'Orioni' })}`);
    expect(stateLink({}, { base: 'https://flag.eurth.org/?d=old' })).toBe('https://flag.eurth.org/');
    expect(stateLink(null, { base: 'https://flag.eurth.org/guide/' })).toBe('https://flag.eurth.org/guide/');
  });

  it("never throws on a link that isn't one", () => {
    for (const text of [null, undefined, '', 'x', '1.', '1.!!!', '1.e30=', `1.${'A'.repeat(9000)}`, '99999.e30', '1.eyJh']) {
      expect(() => decodeState(text)).not.toThrow();
    }
    expect(decodeState('1.!!!')).toBeNull();
    expect(decodeState(`1.${'A'.repeat(9000)}`)).toBeNull();
    expect(decodeState('1.eyJh')).toBeNull();
  });
});

describe('sharing', () => {
  const targets = shareTargets({ url: 'https://flag.eurth.org/?d=1.e30', title: 'Orioni & co', text: 'A flag. Made with Flagwright.' });

  it('offers the suite’s ten places, the Eurth forum first, as plain https or mailto links', () => {
    expect(targets.map((t) => t.label)).toEqual(['Eurth forum', 'Reddit', 'Bluesky', 'X', 'Facebook', 'LinkedIn', 'Tumblr', 'WhatsApp', 'Telegram', 'Email']);
    for (const target of targets) expect(target.href).toMatch(/^(https:\/\/|mailto:)/);
    expect(targets[0].href).toBe('https://eurth.org/new-topic?title=Orioni%20%26%20co&body=A%20flag.%20Made%20with%20Flagwright.%0A%0Ahttps%3A%2F%2Fflag.eurth.org%2F%3Fd%3D1.e30');
  });

  it('keeps a typed name from turning into Markdown', () => {
    expect(markdownText('*Orioni* [x](y)')).toBe('\\*Orioni\\* \\[x\\]\\(y\\)');
  });
});

describe('the service worker', () => {
  const worker = readFileSync(new URL('../src/offline/sw.js', import.meta.url), 'utf8');

  it('keeps one cache and clears every other, whatever an older worker called it', () => {
    expect(worker).toContain('keys.filter((k) => k !== CACHE)');
    expect(worker).not.toContain('startsWith(`${NAME}-`) &&');
  });

  it('leaves the tool\'s own API alone', () => {
    expect(worker).toContain("url.pathname.startsWith('/api/')");
  });

  it('is written with what to keep now, and what to keep once fetched', () => {
    const dist = mkdtempSync(join(tmpdir(), 'eurth-dist-'));
    try {
      mkdirSync(join(dist, 'flags'));
      mkdirSync(join(dist, '_astro'));
      writeFileSync(join(dist, 'index.html'), '<html><head><script>let a = 1;</script><script type="application/ld+json">{}</script></head></html>');
      writeFileSync(join(dist, '_astro/app.abc123.js'), 'export {};');
      writeFileSync(join(dist, 'flags/be.svg'), '<svg/>');
      writeFileSync(join(dist, 'og.png'), '');
      const result = finishBuild(dist, site, { offlineSkip: [/^flags\//] });
      const built = readFileSync(join(dist, 'sw.js'), 'utf8');
      expect(built).toContain('const NAME = "eurth-flag";');
      expect(built).toContain('const APP = ["/_astro/app.abc123.js","/"');
      expect(built).not.toContain('"/flags/be.svg"');
      expect(built).not.toContain('"/og.png"');
      expect(built).toContain('const LATER = ["^flags\\\\/"].map(');
      expect(result).toMatchObject({ hashes: 1, kept: 3 });
      expect(readFileSync(join(dist, '_headers'), 'utf8')).toMatch(/script-src 'self' 'sha256-[A-Za-z0-9+/=]+';/);
      expect(JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'))).toMatchObject({ name: 'Flagwright', description: site.description, display: 'standalone' });
      expect(readFileSync(join(dist, 'robots.txt'), 'utf8')).toContain('Sitemap: https://flag.eurth.org/sitemap-index.xml');
    } finally {
      rmSync(dist, { recursive: true, force: true });
    }
  });
});

describe('the seasonal yurt', () => {
  const on = (date) => seasonOf(new Date(date), { approvedOnly: false });

  it("keeps the design kit's dates", () => {
    expect([on('2027-02-01'), on('2027-02-14'), on('2027-02-15')]).toEqual(['valentines', 'valentines', null]);
    expect([on('2027-04-15'), on('2027-04-16'), on('2027-04-22'), on('2027-04-23')]).toEqual([null, 'earth-day', 'earth-day', null]);
    expect([on('2027-06-01'), on('2027-06-30'), on('2027-07-01')]).toEqual(['pride', 'pride', null]);
    expect([on('2026-10-31'), on('2026-11-14'), on('2026-12-01'), on('2026-12-31'), on('2027-01-01')]).toEqual(['halloween', null, 'december', 'december', null]);
  });

  it('shows only approved yurts on the tools, and all five are', () => {
    expect([...APPROVED].sort()).toEqual(['december', 'earth-day', 'halloween', 'pride', 'valentines']);
    expect(seasonOf(new Date('2027-06-10'))).toBe('pride');
    expect(seasonOf(new Date('2026-12-10'))).toBe('december');
    expect(seasonOf(new Date('2026-11-14'))).toBeNull();
  });

  it("never changes the yurt's own shape", () => {
    const yurt = /<g transform="translate\(0\.6,-193\.986\)" fill="#[0-9a-f]{6}"><path d="M68\.9,319L46,384\.1[^"]*"><\/path><path d="M110\.4,261\.1[^"]*"><\/path><\/g>/;
    for (const art of Object.values(ART)) expect(art).toMatch(yurt);
  });
});
