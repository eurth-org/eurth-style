import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkPairs, contrast, resolveColors } from '../src/contrast.js';
import { contrastSuite } from '../src/testing/index.js';

const tokens = JSON.parse(readFileSync(new URL('../tokens.json', import.meta.url), 'utf8'));
const css = readFileSync(new URL('../dist/eurth.css', import.meta.url), 'utf8');

// Every text pair, both themes, WCAG AAA: the same suite the tools run.
contrastSuite();

describe('the colours the handbook names', () => {
  const light = resolveColors(tokens, 'light');
  const dark = resolveColors(tokens, 'dark');

  it('are the ones in tokens.json', () => {
    expect(light['eurth-blue']).toBe('#2698d4');
    expect(dark['eurth-blue']).toBe('#2698d4');
    expect([dark.ink, dark.surface, dark['surface-raised'], dark['ink-muted'], dark['accent-text'], dark['line-strong']]).toEqual(['#fcf6e1', '#002b36', '#0d353f', '#bac1b5', '#80c8e5', '#798c88']);
    expect([light.ink, light.surface, light['ink-muted'], light['accent-text'], light['line-strong']]).toEqual(['#222222', '#ffffff', '#545454', '#12577b', '#646464']);
    expect(light['on-accent-small']).toBe('#002b36');
  });

  it('reach the ratios the handbook quotes', () => {
    const ratio = (a, b) => Math.round(contrast(a, b) * 10) / 10;
    expect(ratio(dark.ink, dark.surface)).toBe(13.9);
    expect(ratio(dark['ink-muted'], dark.surface)).toBe(8.1);
    expect(ratio(dark['accent-text'], dark.surface)).toBe(8.1);
    expect(ratio(light['ink-muted'], light.surface)).toBe(7.6);
    expect(ratio(light['accent-text'], light.surface)).toBe(7.9);
  });

  it('are caught when a pair fails', () => {
    expect(checkPairs(tokens, [['eurth-blue', 'paper', 7]]).every((pair) => !pair.ok)).toBe(true);
  });
});

describe('the stylesheet', () => {
  const block = (selector) => {
    const start = css.indexOf(`${selector} {`);
    return css.slice(start, css.indexOf('}', start)).replace(/^.*\{/s, '').replace(/\s+/g, ' ').trim();
  };

  it('uses the same dark colours with and without the theme switch', () => {
    expect(block(':root:not([data-theme])')).toBe(block("[data-theme='dark']"));
  });

  it('is up to date with tokens.json and src/css (run: npm run build)', async () => {
    const before = css;
    const { execFileSync } = await import('node:child_process');
    execFileSync(process.execPath, ['build/build.mjs'], { cwd: new URL('..', import.meta.url), stdio: 'ignore' });
    expect(readFileSync(new URL('../dist/eurth.css', import.meta.url), 'utf8')).toBe(before);
  });

  it('writes no colour by hand outside the tokens', () => {
    const rules = css.slice(css.indexOf('/* Base:'));
    expect(rules.match(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/gi)).toBeNull();
  });
});
