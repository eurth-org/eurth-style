// The docs site is held to the same checks as a tool (it isn't one, so it has no launch date).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { site } from '../site/eurth.config.mjs';
import { everyTool, unlaunchedTools } from '../src/build.js';
import { PAIRS, TEXT } from '../src/contrast.js';
import { headersSuite, pagesSuite, privacySuite, spoilerSuite } from '../src/testing/index.js';

const dist = 'site/dist';
headersSuite({ dist });
privacySuite({ dist });
spoilerSuite({ site, dist });
pagesSuite({ site, dist });

describe.skipIf(!existsSync(`${dist}/index.html`))("the profile's schema on the site", () => {
  it('is served at its own address only once every door has opened', () => {
    const file = `${dist}/schemas/eurth-profile-1.json`;
    expect(existsSync(file)).toBe(unlaunchedTools().length === 0);
    if (existsSync(file)) expect(JSON.parse(readFileSync(file, 'utf8')).$id).toBe('https://style.eurth.org/schemas/eurth-profile-1.json');
  });
});

describe.skipIf(!existsSync(`${dist}/handbook/index.html`))('the handbook on the site', () => {
  const html = readFileSync(`${dist}/handbook/index.html`, 'utf8');

  it('carries the rules', () => {
    for (const heading of ['Stack and hosting', 'Look', 'Shell', 'Privacy: nothing stored', 'Sharing', 'Writing', 'Done, for every tool']) expect(html).toContain(heading);
  });

  it('says nothing of the launch before the hub has opened (run today)', () => {
    const hub = everyTool().find((tool) => tool.kind === 'hub');
    const open = new Date(hub.launch).getTime() <= Date.now();
    expect(html.includes('id="launch"')).toBe(open);
    if (!open) expect(html).not.toMatch(/advent/i);
  });

  // Highlighted code is coloured by custom properties (site/astro.config.mjs) that the page
  // points at tokens. A ready-made highlighter theme brings colours of its own, and the
  // default one's reach only 5.5:1.
  describe('its highlighted code', () => {
    const blocks = html.match(/<pre class="astro-code[\s\S]*?<\/pre>/g) ?? [];
    const mapped = Object.fromEntries([...html.matchAll(/--astro-code-([\w-]+):\s*var\(--([\w-]+)\)/g)].map(([, name, token]) => [name, token]));
    const used = [...new Set(blocks.flatMap((block) => [...block.matchAll(/var\(--astro-code-([\w-]+)\)/g)].map(([, name]) => name)))];

    it('is there to be checked: an example tagged js, in more than one colour', () => {
      expect(blocks.some((block) => block.includes('data-language="js"'))).toBe(true);
      expect(used).toContain('token-keyword');
    });

    it('carries no colour of its own (in its styles: an example may well show one)', () => {
      const styles = blocks.flatMap((block) => [...block.matchAll(/style="([^"]*)"/g)].map(([, style]) => style));
      expect(styles.length).toBeGreaterThan(0);
      for (const style of styles) expect(style.match(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/gi), style).toBeNull();
    });

    it('takes every colour from a text token that the contrast test holds to 7:1 on its ground', () => {
      expect(mapped.background).toBe('surface-raised');
      const text = PAIRS.filter(([, bg, min]) => bg === mapped.background && min === TEXT).map(([fg]) => fg);
      for (const name of used) expect(mapped[name], `--astro-code-${name}`).toBeTruthy();
      for (const [name, token] of Object.entries(mapped)) if (name !== 'background') expect(text, `--astro-code-${name}`).toContain(token);
    });

    it('has a colour ready for every kind of token the highlighter knows', () => {
      for (const name of ['foreground', 'token-constant', 'token-string', 'token-comment', 'token-keyword', 'token-parameter', 'token-function', 'token-string-expression', 'token-punctuation', 'token-link']) {
        expect(mapped[name], `--astro-code-${name}`).toBeTruthy();
      }
    });
  });
});
