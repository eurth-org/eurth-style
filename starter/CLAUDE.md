# Building this tool

Replace this file with the tool's own brief. Until then, the standing instructions:

- Read `node_modules/@eurth/style/HANDBOOK.md` first. On anything the tools share (stack, look, shell, privacy, accessibility, search, sharing, offline, delight, launch, writing), the handbook wins over this brief; say so if they disagree.
- The shell comes from `@eurth/style` and is never rebuilt here. Use only its tokens and `eu-` classes: no local colours, fonts or spacing.
- Use the shared parts where they exist: `RandomButton` for Random, `ShareButtons` (with `markdown` wherever the result has words) and a Markdown download, line-md icons from `@eurth/style/line` for anything that happens or changes, and `PageHead`, `Figure`, `Note` and `Toc` for the guide, glossary and templates pages. Those pages show what they explain, with pictures this tool draws itself.
- Nothing is stored: no cookies, localStorage, sessionStorage or IndexedDB. A design lives in its link (query string, versioned) and in the nation's profile file.
- This tool owns one section of the profile file and leaves every other section untouched.
- `eurth.config.mjs` and `@eurth/style/build` are for build time only; never import them from browser code.
- Until the door in `LAUNCH_AT` opens, the site is not deployed anywhere and no other site mentions it. Preview locally with `npm run preview`.
- Done means: every handbook rule met, CI green, Lighthouse and axe passing, README and roadmap up to date, the tool in `tools.json`.
- Ask Stijn before spending money, adding a Worker script or any Cloudflare product beyond static assets, or changing another repository.
