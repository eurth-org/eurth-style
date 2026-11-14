/** @typedef {import('../build.js').Site & { host: string }} Site */
/**
 * @typedef {object} Options
 * @property {RegExp[]} [offlineSkip]  Files the service worker shouldn't keep up front (large galleries), matched against paths like "flags/be.svg".
 * @property {string[]} [connect]      More sources the pages may fetch from, for the rare tool with a Worker elsewhere. Same-origin needs nothing.
 */
/** Every file under a folder, as paths relative to it with forward slashes. @param {string} dir */
export function filesIn(dir: string): string[];
/**
 * The inline scripts of a page that run (data blocks such as JSON-LD don't, so they need no hash).
 * @param {string} html
 * @returns {string[]}
 */
export function inlineScripts(html: string): string[];
/** The Content-Security-Policy source for an inline script. @param {string} body */
export function scriptHash(body: string): string;
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
export function securityHeaders(hashes: string[], connect?: string[]): string;
/**
 * Writes the files a built site needs. Called by the integration; exported for tests.
 * @param {string} dist the built site's folder
 * @param {Site} site
 * @param {Options} [options]
 */
export function finishBuild(dist: string, site: Site, options?: Options): {
    hashes: number;
    kept: number;
    missing: string[];
};
/**
 * The integration. Returns two (the sitemap, then ours): Astro takes the list as it is.
 * @param {Site} site from defineSite() in eurth.config.mjs
 * @param {Options} [options]
 * @returns {import('astro').AstroIntegration[]}
 */
export default function eurth(site: Site, options?: Options): import("astro").AstroIntegration[];
export type Site = import("../build.js").Site & {
    host: string;
};
export type Options = {
    /**
     * Files the service worker shouldn't keep up front (large galleries), matched against paths like "flags/be.svg".
     */
    offlineSkip?: RegExp[] | undefined;
    /**
     * More sources the pages may fetch from, for the rare tool with a Worker elsewhere. Same-origin needs nothing.
     */
    connect?: string[] | undefined;
};
