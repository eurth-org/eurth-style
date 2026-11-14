/**
 * A design lives in its link. The whole state goes into the query string (not the # part, so a
 * Worker could read it one day), compact and with a version in front, so a link made today
 * still opens after the tool has grown:
 *
 *   https://flag.eurth.org/?d=1.eyJkaXYiOiJoMyJ9
 *
 * A tool may write its own shorter, readable form instead (Flagwright's simple flags do); this
 * is the default for everything else. Either way: what arrives in a link is someone else's
 * input. decodeState never throws, and the tool checks and clamps every value before using it.
 */

const toBase64Url = (bytes) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (text) => {
  const binary = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

/**
 * The state as the value of a query parameter: "<version>.<compact JSON, base64url>".
 * @param {unknown} value anything JSON can hold; keep its keys short
 * @param {number} [version] raise it when the shape changes, and keep reading the old ones
 */
export function encodeState(value, version = 1) {
  return `${version}.${toBase64Url(new TextEncoder().encode(JSON.stringify(value)))}`;
}

/**
 * Reads a state back. Null for anything that isn't one: too long, malformed, not JSON.
 * @param {string | null | undefined} text
 * @param {{ maxLength?: number }} [options] longest text accepted (default 8000 characters)
 * @returns {{ version: number, value: unknown } | null}
 */
export function decodeState(text, { maxLength = 8000 } = {}) {
  if (typeof text !== 'string' || text.length > maxLength) return null;
  const found = /^(\d{1,4})\.([A-Za-z0-9_-]*)$/.exec(text);
  if (!found) return null;
  try {
    const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(fromBase64Url(/** @type {string} */ (found[2]))));
    return { version: Number(found[1]), value };
  } catch {
    return null;
  }
}

/** Nothing to say: null, or an object or list with nothing in it. */
const empty = (value) => value == null || (typeof value === 'object' && Object.keys(value).length === 0);

/**
 * The link for a state: the page's own address with the state as its only query parameter.
 * A state with nothing in it (the tool's defaults) is the plain address, with no parameter.
 * @param {unknown} value
 * @param {{ version?: number, param?: string, base?: string }} [options] base: the page's address (default: where we are)
 */
export function stateLink(value, { version = 1, param = 'd', base } = {}) {
  const url = new URL(base ?? location.href);
  url.search = '';
  url.hash = '';
  if (!empty(value)) url.searchParams.set(param, encodeState(value, version));
  return url.toString();
}

/**
 * The state in the address bar, if there is one.
 * @param {{ param?: string, maxLength?: number }} [options]
 */
export function stateFromLocation({ param = 'd', maxLength } = {}) {
  return decodeState(new URLSearchParams(location.search).get(param), { maxLength });
}

/**
 * Keeps the address bar in step with the state, without adding to the Back button's history.
 * Nothing is stored: the address is the save.
 * @param {unknown} value
 * @param {{ version?: number, param?: string }} [options]
 */
export function stateToLocation(value, options = {}) {
  history.replaceState(history.state, '', stateLink(value, options));
}
