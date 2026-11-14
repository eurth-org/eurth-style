// @ts-check
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import eurth from '../src/astro/integration.js';
import { site } from './eurth.config.mjs';

// The docs site uses the package from the folder above, the way a tool uses it from node_modules.
export default defineConfig({
  integrations: [svelte(), eurth(site)],
});
