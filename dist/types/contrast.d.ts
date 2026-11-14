/**
 * Contrast, as WCAG 2.2 measures it, and the pairs of tokens that must meet it. The suite aims
 * for AAA: 7:1 for text, 4.5:1 for large text (24px, or 19px bold), 3:1 for what isn't text
 * (control borders, focus rings, icons that carry meaning).
 *
 * tests/contrast.test.js runs every pair in both themes. A tool with its own pairs (say, a
 * palette it lets people pick from) can run them through the same functions.
 */
/** @typedef {{ name: string, value: string | Record<string, string>, usage?: string }} Token */
/** @typedef {{ color: { themes: { id: string, name: string }[], tokens: Token[] } }} Tokens */
/** Relative luminance of a #rrggbb colour. */
export function luminance(hex: any): number;
/** The contrast ratio between two #rrggbb colours, from 1 to 21. */
export function contrast(a: any, b: any): number;
/**
 * Every colour token as a plain value for one theme, with {aliases} followed.
 * @param {Tokens} tokens
 * @param {string} theme 'light' or 'dark'
 * @returns {Record<string, string>}
 */
export function resolveColors(tokens: Tokens, theme: string): Record<string, string>;
/**
 * Checks pairs against the tokens, in every theme.
 * @param {Tokens} tokens
 * @param {[string, string, number][]} [pairs]
 * @returns {{ theme: string, fg: string, bg: string, min: number, ratio: number, ok: boolean }[]}
 */
export function checkPairs(tokens: Tokens, pairs?: [string, string, number][]): {
    theme: string;
    fg: string;
    bg: string;
    min: number;
    ratio: number;
    ok: boolean;
}[];
export const TEXT: 7;
export const LARGE_TEXT: 4.5;
export const NOT_TEXT: 3;
/**
 * [foreground, background, minimum ratio]. Text on a hovered control is ink, so muted and link
 * colours aren't paired with hover.
 * @type {[string, string, number][]}
 */
export const PAIRS: [string, string, number][];
export type Token = {
    name: string;
    value: string | Record<string, string>;
    usage?: string;
};
export type Tokens = {
    color: {
        themes: {
            id: string;
            name: string;
        }[];
        tokens: Token[];
    };
};
