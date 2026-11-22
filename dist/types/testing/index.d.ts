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
 * Adopted: the parts of the suite a tool has to build itself, which no update of the package
 * can do for it. They are checked in the built pages of every tool, launched or not, in
 * tools.json or not yet. The hub and the other sites in tools.json are not tools and are left
 * alone, and so is a site that says so itself (the docs: `tool: false`). A tool that keeps a
 * design of its own is held to its mark alone.
 *
 * A scheduled launch and the nightly update set EURTH_SKIP_ADOPTION, so a tool that hasn't
 * caught up still opens its door and still takes the package's updates; every push and pull
 * request stays red until it has.
 * @param {{ site: Site, dist?: string, root?: string, tool?: boolean }} options
 *   tool: false for a site that is not a tool and not in tools.json (the docs)
 */
export function adoptionSuite({ site, dist, root, tool: isTool }: {
    site: Site;
    dist?: string;
    root?: string;
    tool?: boolean;
}): void;
/**
 * Every suite at once: what a tool's tests/shell.test.js calls.
 * @param {{ site: Site, dist?: string, root?: string, pairs?: [string, string, number][], tool?: boolean }} options
 *   tool: false for a site that is not a tool (the docs), which then isn't asked for a tool's parts
 */
export function standardSuites({ site, dist, root, pairs, tool }: {
    site: Site;
    dist?: string;
    root?: string;
    pairs?: [string, string, number][];
    tool?: boolean;
}): void;
export type Site = import("../build.js").Site & {
    host: string;
};
