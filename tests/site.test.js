// The docs site is held to the same checks as a tool (it isn't one, so it has no launch date).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { site } from '../site/eurth.config.mjs';
import { everyTool, unlaunchedTools } from '../src/build.js';
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
});
