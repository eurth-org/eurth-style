/**
 * The choices held in a window.name value; the defaults if it holds anything else.
 * @param {string} name
 * @returns {Prefs}
 */
export function decodePrefs(name: string): Prefs;
/**
 * The window.name value for these choices: empty when they are all the defaults.
 * @param {Prefs} prefs
 */
export function encodePrefs(prefs: Prefs): string;
/** This visit's choices. */
export function getPrefs(): {
    theme: Theme;
    sound: boolean;
    motion: boolean;
};
/**
 * Changes one or more of this visit's choices and tells everything that listens.
 * @param {Partial<Prefs>} change
 */
export function setPrefs(change: Partial<Prefs>): void;
/**
 * Calls back whenever a choice changes. Returns a function that stops it.
 * @param {(prefs: Prefs) => void} listener
 */
export function onPrefs(listener: (prefs: Prefs) => void): () => boolean;
/** Whether to hold still: the device asks for reduced motion, or the visitor switched motion off. */
export function calm(): boolean;
/** Whether sounds may play: only once the visitor has switched them on. */
export function soundOn(): boolean;
/** @type {Prefs} */
export const DEFAULTS: Prefs;
export type Theme = "auto" | "light" | "dark";
export type Prefs = {
    theme: Theme;
    sound: boolean;
    motion: boolean;
};
