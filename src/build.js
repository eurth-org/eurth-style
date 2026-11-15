/**
 * @eurth/style at build time: the list of tools and what has launched, a tool's own facts, and
 * the structured data search engines read.
 *
 * BUILD TIME ONLY. Use this in astro.config.mjs and in the frontmatter of .astro files, never
 * in a Svelte component or a <script>: tools.json names tools whose doors haven't opened, and
 * anything imported by browser code ends up in the files visitors download. (The spoiler test
 * in '@eurth/style/testing' looks for exactly that.) Nothing here reads the visitor's clock:
 * what a site shows is decided when it is built.
 */
import catalogue from '../tools.json' with { type: 'json' };

/**
 * @typedef {object} Tool
 * @property {string} id       Its subdomain, and its key everywhere: 'flag' for flag.eurth.org.
 * @property {'tool' | 'hub' | 'site'} kind
 * @property {string} name
 * @property {string} url
 * @property {string} pitch    One line, no full stop.
 * @property {string} launch   ISO time with offset.
 * @property {number} [door]   Its door in the advent calendar.
 */

/**
 * @typedef {object} Site
 * @property {string} id           The tool's id in tools.json ('flag'); for a site that isn't a tool, its subdomain.
 * @property {string} name         Title Case: "Flagwright".
 * @property {string} url          "https://flag.eurth.org", no slash at the end.
 * @property {string} title        The start page's title: "<Name>: free online <thing> maker for worldbuilders".
 * @property {string} description  The start page's description, and the default for pages without their own.
 * @property {string} tagline      A few words: "Flags made to fly".
 * @property {{ href: string, label: string }[]} pages  The tool's own pages for the header, start page first.
 * @property {string} repo         "https://github.com/eurth-org/eurth-flag".
 * @property {string} ogAlt        What the sharing image shows, in a sentence.
 * @property {string} [category]   schema.org applicationCategory (default "DesignApplication").
 * @property {boolean} [sound]     The tool makes a sound somewhere: the footer then offers the sound switch.
 * @property {string} [llms]       Extra lines for llms.txt, as Markdown.
 */

/** From this moment pages may link to GitHub; before it, none does. */
export const GITHUB_FROM = '2026-12-25T00:00:00+01:00';

/** The rest of Eurth, linked from every footer. */
export const EURTH = /** @type {const} */ ({
  home: 'https://eurth.org',
  join: 'https://eurth.org/signup',
  forums: 'https://eurth.org',
  map: 'https://map.eurth.org',
  news: 'https://news.eurth.org',
  status: 'https://status.eurth.org',
  orioni: 'https://iiwiki.com/w/Orioni',
});

/**
 * The moment this build counts as "now". The launch workflow sets EURTH_BUILD_TIME to the
 * door's time, builds ahead of it and deploys when it arrives; every other build uses the clock
 * of the machine that builds.
 */
export function buildTime() {
  const set = typeof process !== 'undefined' ? process.env.EURTH_BUILD_TIME : undefined;
  if (!set) return new Date();
  const time = new Date(set);
  if (Number.isNaN(time.getTime())) throw new Error(`EURTH_BUILD_TIME isn't a time: ${set}`);
  return time;
}

/** Every tool, launched or not. For the hub's locked doors and for tests; never print names from it. @returns {Tool[]} */
export function everyTool() {
  return /** @type {Tool[]} */ (catalogue.tools);
}

/** @param {string} id @returns {Tool | undefined} */
export function findTool(id) {
  return everyTool().find((tool) => tool.id === id);
}

/** @param {Tool} tool @param {Date} [at] */
export function hasLaunched(tool, at = buildTime()) {
  return new Date(tool.launch).getTime() <= at.getTime();
}

/** The tools and sites whose launch date has passed, in tools.json's order. @param {Date} [at] */
export function launchedTools(at = buildTime()) {
  return everyTool().filter((tool) => hasLaunched(tool, at));
}

/** Not launched yet: what no page may mention. @param {Date} [at] */
export function unlaunchedTools(at = buildTime()) {
  return everyTool().filter((tool) => !hasLaunched(tool, at));
}

/** Whether pages may link to GitHub yet. @param {Date} [at] */
export function githubLinksAllowed(at = buildTime()) {
  return at.getTime() >= new Date(GITHUB_FROM).getTime();
}

/**
 * A tool's own facts, checked once so mistakes show at build time.
 * @param {Site} site
 * @returns {Site & { host: string }}
 */
export function defineSite(site) {
  for (const key of /** @type {const} */ (['id', 'name', 'url', 'title', 'description', 'tagline', 'repo', 'ogAlt'])) {
    if (typeof site[key] !== 'string' || !site[key]) throw new Error(`defineSite: "${key}" is missing`);
  }
  if (!Array.isArray(site.pages) || !site.pages.length) throw new Error('defineSite: "pages" needs at least the start page');
  const url = new URL(site.url);
  if (url.protocol !== 'https:' || url.pathname !== '/' || site.url.endsWith('/')) throw new Error(`defineSite: "url" should look like https://flag.eurth.org, not ${site.url}`);
  return { ...site, host: url.host };
}

export { ref, wikipedia } from './ref.js';

/**
 * A page's <title>: the start page carries the site's own; every other page its name, then the site's.
 * @param {Site} site @param {string} path @param {string} [title]
 */
export function pageTitle(site, path, title) {
  return path === '/' || !title ? site.title : `${title} · ${site.name}`;
}

// Structured data (JSON-LD), one builder per kind the handbook asks for.

/** Eurth itself: the publisher of every tool. */
export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://eurth.org/#organization',
    name: 'Eurth',
    url: 'https://eurth.org',
    description: 'A worldbuilding and roleplay community since 2004.',
    foundingDate: '2004',
  };
}

/** The site, on every page. @param {Site} site */
export function webSite(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#site`,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    inLanguage: 'en-GB',
    publisher: { '@id': 'https://eurth.org/#organization' },
  };
}

/**
 * The maker: a free application that runs in the browser.
 * @param {Site} site
 * @param {{ featureList?: string[], screenshot?: string }} [more]
 */
export function webApplication(site, more = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${site.url}/#app`,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    applicationCategory: site.category ?? 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Runs in any modern browser.',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    inLanguage: 'en-GB',
    publisher: { '@id': 'https://eurth.org/#organization' },
    ...more,
  };
}

/**
 * The trail from the start page to this one.
 * @param {Site} site
 * @param {{ name: string, path: string }[]} trail below the start page, in order
 */
export function breadcrumbs(site, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: site.name, path: '/' }, ...trail].map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: new URL(step.path, site.url).href,
    })),
  };
}

/**
 * A glossary. Each term's anchor is its id on the page.
 * @param {Site} site
 * @param {{ name: string, path: string, terms: { id: string, term: string, definition: string }[] }} glossary
 */
export function definedTermSet(site, { name, path, terms }) {
  const url = new URL(path, site.url).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${url}#terms`,
    name,
    url,
    inLanguage: 'en-GB',
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${url}#${t.id}`,
      name: t.term,
      description: t.definition,
      url: `${url}#${t.id}`,
      inDefinedTermSet: `${url}#terms`,
    })),
  };
}

/**
 * Questions and answers shown on the page.
 * @param {{ q: string, a: string }[]} faq
 */
export function faqPage(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
}

/**
 * A written page (a guide), with the day it was last brought up to date.
 * @param {Site} site
 * @param {{ headline: string, path: string, description: string, updated: string }} article updated: YYYY-MM-DD
 */
export function article(site, { headline, path, description, updated }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: new URL(path, site.url).href,
    dateModified: updated,
    inLanguage: 'en-GB',
    author: { '@id': 'https://eurth.org/#organization' },
    publisher: { '@id': 'https://eurth.org/#organization' },
  };
}
