// @ts-check
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import eurth from '../src/astro/integration.js';
import { site } from './eurth.config.mjs';

// The docs site uses the package from the folder above, the way a tool uses it from node_modules.
export default defineConfig({
  integrations: [svelte(), eurth(site)],
  // Highlighted code in the handbook is coloured by custom properties, not by a ready-made
  // theme, so the page can give it the suite's own text colours (see handbook.astro).
  markdown: { shikiConfig: { theme: 'css-variables' } },
});
