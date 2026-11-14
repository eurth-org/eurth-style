import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { surface } from '../build/api.mjs';

// Version 1 must stay compatible: every tool updates to the newest 1.x on its own each night.
const accepted = JSON.parse(readFileSync(new URL('./api.snapshot.json', import.meta.url), 'utf8'));
const flat = (value, path = '') =>
  Array.isArray(value) ? value.map((item) => `${path}: ${item}`) : Object.entries(value).flatMap(([key, inner]) => flat(inner, path ? `${path} › ${key}` : key));

describe('the public surface', async () => {
  const now = flat(await surface());
  const before = flat(accepted);

  it('has lost nothing (a removal or a rename is a breaking change: that is version 2)', () => {
    expect(before.filter((name) => !now.includes(name))).toEqual([]);
  });

  it('has gained nothing unannounced (accept additions with: node build/api.mjs --accept)', () => {
    expect(now.filter((name) => !before.includes(name))).toEqual([]);
  });
});
