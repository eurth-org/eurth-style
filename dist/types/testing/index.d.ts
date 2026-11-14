/**
 * Contrast: every text pair of the suite's tokens, in both themes, at WCAG AAA. Add a tool's
 * own pairs as [foreground token, background token, minimum]; a tool with colours of its own
 * that aren't tokens (a palette people pick from) tests those itself with contrast().
 * @param {[string, string, number][]} [more]
 */
export function contrastSuite(more?: [string, string, number][]): void;
/**
 * Security headers: inline scripts are allowed only by their hashes, and every inline script
 * of every built page is on the list, or the page would break in silence.
 * @param {{ dist?: string }} [options]
 */
export function headersSuite({ dist }?: {
    dist?: string;
}): void;
/**
 * Privacy: nothing stored, nothing fetched from anywhere else. The built files never mention
 * browser storage or cookies, and no page loads a script, style, font, picture or frame from
 * another address.
 * @param {{ dist?: string }} [options]
 */
export function privacySuite({ dist }?: {
    dist?: string;
}): void;
/**
 * No spoilers: until a tool's door opens, no built file names its address; and until
 * 25 December 2026 no page links to GitHub. Judged at build time (EURTH_BUILD_TIME, or now).
 * @param {{ site: Site, dist?: string }} options
 */
export function spoilerSuite({ site, dist }: {
    site: Site;
    dist?: string;
}): void;
/**
 * Pages: what search engines, link previews and assistive technology each need from every page.
 * @param {{ site: Site, dist?: string }} options
 */
export function pagesSuite({ site, dist }: {
    site: Site;
    dist?: string;
}): void;
/**
 * Launch: the LAUNCH_AT file holds the door's time, with its offset, and agrees with tools.json
 * once the tool is listed there.
 * @param {{ site: Site, root?: string }} options
 */
export function launchSuite({ site, root }: {
    site: Site;
    root?: string;
}): void;
/**
 * All of the above.
 * @param {{ site: Site, dist?: string, root?: string, pairs?: [string, string, number][] }} options
 */
export function standardSuites({ site, dist, root, pairs }: {
    site: Site;
    dist?: string;
    root?: string;
    pairs?: [string, string, number][];
}): void;
export type Site = import("../build.js").Site & {
    host: string;
};
