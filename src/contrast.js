/**
 * Contrast, as WCAG 2.2 measures it, and the pairs of tokens that must meet it. The suite aims
 * for AAA: 7:1 for text, 4.5:1 for large text (24px, or 19px bold), 3:1 for what isn't text
 * (control borders, focus rings, icons that carry meaning).
 *
 * One exception, and it is the brand's: white with eurth-blue, as eurth.org pairs them, is
 * 3.2:1 (BRAND_TEXT). In the blue bars and on primary buttons the label is 19px bold, which
 * makes it large text and meets AA. On a chosen option the label is smaller and bold, which
 * falls short of AA; the brand's look is kept there on purpose, and a tick marks the choice
 * as well as the colour.
 *
 * tests/contrast.test.js runs every pair in both themes. A tool with its own pairs (say, a
 * palette it lets people pick from) can run them through the same functions.
 */

/** @typedef {{ name: string, value: string | Record<string, string>, usage?: string }} Token */
/** @typedef {{ color: { themes: { id: string, name: string }[], tokens: Token[] } }} Tokens */

/** Relative luminance of a #rrggbb colour. */
export function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * /** @type {number} */ (r) + 0.7152 * /** @type {number} */ (g) + 0.0722 * /** @type {number} */ (b);
}

/** The contrast ratio between two #rrggbb colours, from 1 to 21. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (/** @type {number} */ (hi) + 0.05) / (/** @type {number} */ (lo) + 0.05);
}

/**
 * Every colour token as a plain value for one theme, with {aliases} followed.
 * @param {Tokens} tokens
 * @param {string} theme 'light' or 'dark'
 * @returns {Record<string, string>}
 */
export function resolveColors(tokens, theme) {
  const first = tokens.color.themes[0]?.id ?? 'light';
  /** @type {Record<string, string>} */
  const raw = {};
  for (const token of tokens.color.tokens) {
    raw[token.name] = typeof token.value === 'string' ? token.value : (token.value[theme] ?? token.value[first] ?? '');
  }
  const resolve = (value, depth = 0) => {
    const alias = /^\{([\w.-]+)\}$/.exec(value);
    if (!alias) return value;
    if (depth > 10 || !(alias[1] in raw)) throw new Error(`tokens: ${value} leads nowhere`);
    return resolve(raw[alias[1]], depth + 1);
  };
  return Object.fromEntries(Object.entries(raw).map(([name, value]) => [name, resolve(value)]));
}

export const TEXT = 7;
export const LARGE_TEXT = 4.5;
export const NOT_TEXT = 3;
/** White with eurth-blue: the brand's pair, 3.2:1. The one exception to the suite's contrast rules. */
export const BRAND_TEXT = 3;

/**
 * [foreground, background, minimum ratio]. Text on a hovered control is ink, so muted and link
 * colours aren't paired with hover.
 * @type {[string, string, number][]}
 */
export const PAIRS = [
  ['ink', 'surface', TEXT],
  ['ink', 'surface-raised', TEXT],
  ['ink', 'hover', TEXT],
  ['ink-muted', 'surface', TEXT],
  ['ink-muted', 'surface-raised', TEXT],
  ['accent-text', 'surface', TEXT],
  ['accent-text', 'surface-raised', TEXT],
  ['on-highlight', 'highlight', TEXT],
  ['danger-text', 'surface', TEXT],
  ['danger-text', 'surface-raised', TEXT],
  ['success-text', 'surface', TEXT],
  ['success-text', 'surface-raised', TEXT],
  ['caution-text', 'surface', TEXT],
  ['caution-text', 'surface-raised', TEXT],
  // Toasts and tooltips turn the page inside out.
  ['surface', 'ink', TEXT],

  // The brand pair: white labels on eurth-blue, and eurth-blue labels on the white pills of
  // the blue bars. Always 19px bold or larger, which makes them large text.
  ['on-accent', 'accent-fill', BRAND_TEXT],
  ['accent-fill', 'on-accent', BRAND_TEXT],
  // A chosen option: the same pair, at the label's size.
  ['on-selected', 'selected', BRAND_TEXT],
  // Night on the brand fill, for marks that aren't labels, and white on the pill of the page you're on.
  ['on-accent-small', 'accent-fill', LARGE_TEXT],
  ['on-accent', 'night', TEXT],

  ['line-strong', 'surface', NOT_TEXT],
  ['line-strong', 'surface-raised', NOT_TEXT],
  ['focus-ring', 'surface', NOT_TEXT],
  ['focus-ring', 'surface-raised', NOT_TEXT],
  ['accent-fill', 'surface', NOT_TEXT],
  ['selected', 'surface', NOT_TEXT],
  ['selected', 'surface-raised', NOT_TEXT],
  ['danger', 'surface', NOT_TEXT],
  ['success', 'surface', NOT_TEXT],
];

/**
 * Checks pairs against the tokens, in every theme.
 * @param {Tokens} tokens
 * @param {[string, string, number][]} [pairs]
 * @returns {{ theme: string, fg: string, bg: string, min: number, ratio: number, ok: boolean }[]}
 */
export function checkPairs(tokens, pairs = PAIRS) {
  return tokens.color.themes.flatMap(({ id }) => {
    const colors = resolveColors(tokens, id);
    return pairs.map(([fg, bg, min]) => {
      const a = colors[fg];
      const b = colors[bg];
      if (!/^#[0-9a-f]{6}$/i.test(a ?? '') || !/^#[0-9a-f]{6}$/i.test(b ?? '')) throw new Error(`tokens: ${fg} on ${bg} needs two #rrggbb colours in the ${id} theme`);
      const ratio = contrast(/** @type {string} */ (a), /** @type {string} */ (b));
      return { theme: id, fg, bg, min, ratio, ok: ratio >= min };
    });
  });
}
