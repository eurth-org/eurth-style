/**
 * This visit's choices: theme, sound and motion. Nothing is stored: no cookies, no localStorage,
 * no sessionStorage, no IndexedDB. The choices ride along in window.name, which belongs to the
 * tab, is never written to disk and is gone when the tab closes. So every visit starts on Auto,
 * with sound off and motion as the device asks; a choice made on one page holds on the next,
 * and on the next Eurth tool opened in the same tab.
 *
 * window.name can be set by whoever opened the tab, so it is read as someone else's input: one
 * fixed shape, or it is ignored. The head script (src/generated.js) reads the same shape.
 */

/** @typedef {'auto' | 'light' | 'dark'} Theme */
/** @typedef {{ theme: Theme, sound: boolean, motion: boolean }} Prefs */

const SHAPE = /^eurth:1:([ald]):([01]):([a0])$/;
const LETTER = /** @type {const} */ ({ auto: 'a', light: 'l', dark: 'd' });
const THEME = /** @type {Record<string, Theme>} */ ({ a: 'auto', l: 'light', d: 'dark' });

/** @type {Prefs} */
export const DEFAULTS = Object.freeze({ theme: 'auto', sound: false, motion: true });

/**
 * The choices held in a window.name value; the defaults if it holds anything else.
 * @param {string} name
 * @returns {Prefs}
 */
export function decodePrefs(name) {
  const found = SHAPE.exec(name);
  if (!found) return { ...DEFAULTS };
  return { theme: /** @type {Theme} */ (THEME[/** @type {string} */ (found[1])]), sound: found[2] === '1', motion: found[3] === 'a' };
}

/**
 * The window.name value for these choices: empty when they are all the defaults.
 * @param {Prefs} prefs
 */
export function encodePrefs(prefs) {
  if (prefs.theme === 'auto' && !prefs.sound && prefs.motion) return '';
  return `eurth:1:${LETTER[prefs.theme] ?? 'a'}:${prefs.sound ? 1 : 0}:${prefs.motion ? 'a' : 0}`;
}

const here = typeof window !== 'undefined';
let current = decodePrefs(here ? window.name : '');
/** @type {Set<(prefs: Prefs) => void>} */
const listeners = new Set();

/** This visit's choices. */
export function getPrefs() {
  return { ...current };
}

/**
 * Changes one or more of this visit's choices and tells everything that listens.
 * @param {Partial<Prefs>} change
 */
export function setPrefs(change) {
  current = { ...current, ...change };
  if (here) {
    // Leave another page's window.name alone unless there's something of ours to say.
    const value = encodePrefs(current);
    if (value || SHAPE.test(window.name)) window.name = value;
    if (current.motion) delete document.documentElement.dataset.motion;
    else document.documentElement.dataset.motion = 'still';
  }
  for (const listener of listeners) listener({ ...current });
}

/**
 * Calls back whenever a choice changes. Returns a function that stops it.
 * @param {(prefs: Prefs) => void} listener
 */
export function onPrefs(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Whether to hold still: the device asks for reduced motion, or the visitor switched motion off. */
export function calm() {
  return !current.motion || (here && matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/** Whether sounds may play: only once the visitor has switched them on. */
export function soundOn() {
  return current.sound;
}
