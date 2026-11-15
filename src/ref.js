/**
 * Links to other websites. Safe anywhere: build time and browser code alike.
 */

/**
 * Links to other websites carry ?ref=<our host>, so the sites we link to can see where their
 * visitors came from. Links within the site, and anything that isn't https, stay as they are.
 * @param {string} href
 * @param {string} host the linking site's host: site.host at build time, location.host in the browser
 */
export function ref(href, host) {
  try {
    const url = new URL(href);
    if (url.host === host || url.protocol !== 'https:') return href;
    url.searchParams.set('ref', host);
    return url.toString();
  } catch {
    return href;
  }
}

/** A Wikipedia article's address, from its title. @param {string} title @param {string} host */
export function wikipedia(title, host) {
  return ref(`https://en.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_'))}`, host);
}
