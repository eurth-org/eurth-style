/**
 * Links to other websites. Safe anywhere: build time and browser code alike.
 */
/**
 * Links to other websites carry ?ref=<our host>, so the sites we link to can see where their
 * visitors came from. Links within the site, and anything that isn't https, stay as they are.
 * @param {string} href
 * @param {string} host the linking site's host: site.host at build time, location.host in the browser
 */
export function ref(href: string, host: string): string;
/** A Wikipedia article's address, from its title. @param {string} title @param {string} host */
export function wikipedia(title: string, host: string): string;
