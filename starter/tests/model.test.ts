import { decodeState, encodeState } from '@eurth/style';
import { describe as group, expect, it } from 'vitest';
import { clean, compact, defaults, describe, markdown, plateSvg, templates } from '../src/tool/model';

group('a plate in its link', () => {
  it('comes back as it went in', () => {
    for (const { plate } of templates) expect(clean(decodeState(encodeState(compact(plate)))?.value)).toEqual(plate);
  });

  it('is empty when nothing differs from the defaults', () => {
    expect(compact(defaults)).toEqual({});
  });

  it('is checked and clamped: a link is someone else’s input', () => {
    expect(clean(null)).toEqual(defaults);
    expect(clean({ n: '<b>Orioni</b>', m: 7, g: 1e9, s: 'huge' })).toEqual({ nation: 'bOrioni/b', motto: defaults.motto, gravitas: 100, style: 'plain' });
    expect(clean({ n: 'x'.repeat(500) }).nation).toHaveLength(60);
    expect(clean({ g: Number.NaN }).gravitas).toBe(defaults.gravitas);
  });
});

group('the result', () => {
  it('is described in words', () => {
    expect(describe(templates[1]!.plate)).toBe('The motto of Hohenfels: “We were here first”. A grand plate, carved in granite (gravitas 96 out of 100).');
  });

  it('is written as Markdown, with what a visitor typed kept literal', () => {
    const text = markdown({ ...defaults, nation: '# Loud *Isles*', motto: 'One | two' }, 'https://starter.eurth.org/?d=1.x');
    expect(text).toContain('## \\# Loud \\*Isles\\*');
    expect(text).toContain('> One \\| two');
    expect(text).toContain('| Gravitas | Style |');
    expect(text).toContain('[Open this plate in Starter](https://starter.eurth.org/?d=1.x)');
  });

  it('is drawn without letting text become markup', () => {
    const svg = plateSvg({ ...defaults, nation: 'A & B', motto: '"quoted"' });
    expect(svg).toContain('A &amp; B');
    expect(svg).not.toContain('"quoted"</text>');
    expect(svg).toContain('viewBox="0 0 1200 630"');
  });
});
