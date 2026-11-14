# Roadmap

`@eurth/style` is the shared look and shell of Eurth's worldbuilding tools: one package that every tool installs, so they look and behave as one suite. The rules it carries out are in the [handbook](HANDBOOK.md).

Three parts: what comes next, what each release added (newest first), and what's not planned. Points from reviews are in the [feedback log](docs/feedback-log.md).

## Next

- **Seasonal yurts:** Valentine's Day, Earth Day, Halloween and December are drawn and shown on style.eurth.org, waiting for a yes. Each is switched on by adding it to `APPROVED` in `src/seasonal.js`.
- **Pitches in `tools.json`:** the one-liners for doors 5 to 15 come from the mock-up boards and may be reworded by each tool's own brief before its door opens.
- **Flagwright and Governmint on the shared shell:** both still carry their own header, footer and theme switch (and remember the theme in the browser). Moving them over needs Stijn's go-ahead.
- **The profile's schema at its address:** serve `eurth-profile-1.json` from style.eurth.org/schemas/ once the last door has opened.
- **A real-browser smoke test in CI:** `build/smoke.mjs` (theme from page to page, nothing stored, offline) runs by hand today against `wrangler dev`.
- **After 25 December:** check that every site's footer has gained its GitHub link on the nightly run.

## 14 November 2026: 1.0.0

The first release: everything a tool needs to look and behave like the rest of the suite.

- **Tokens:** `tokens.json`, in the Eurth design kit's shape, built into `dist/eurth.css`: custom properties for the light theme and Night, and base styles for buttons, the Join Eurth pill, options, chips, fields, sliders, cards, dialogs, focus rings, tooltips and toasts. Text colours for errors, successes and cautions that reach WCAG AAA.
- **The shell:** `Page.astro` (head tags, sharing tags, structured data, skip link), `Header.astro` (the yurt, the tool's pages, the Tools menu, the Deluminator, the Join Eurth pill) and `Footer.astro` (the rest of Eurth, the promises, the credits, this visit's switches).
- **Components:** `Deluminator`, `ShareButtons` with `ShareDialog`, `Toast`, `OfflineNote`, `InstallButton`, `VisitSwitches`, `Icon` and `Fa`.
- **Nothing stored:** the theme, sound and motion choices last for the visit, carried in `window.name`; the head script sets the theme and the browser's theme colour before the first paint.
- **A design in its link:** `encodeState`, `decodeState` and friends put a versioned state in the query string.
- **Delights:** click answers, the paper plane, `playTones`, "Nice." on 69, the Konami emu, beating hearts and the seasonal yurt (Pride switched on).
- **`tools.json`:** every tool with its address, pitch and launch date; menus and footers show only what has launched when a site is built, and GitHub links wait for 25 December 2026.
- **The Astro integration:** `eurth(site)` writes the security headers with script hashes, the service worker, the web manifest, `robots.txt` and `llms.txt`.
- **Checks for every tool:** `standardSuites()` (contrast, headers, privacy, no spoilers, pages, launch), `eurth-axe` (WCAG 2.2 AAA rules and 44px targets, both themes) and a Lighthouse configuration.
- **Workflows:** reusable CI, nightly update and launch workflows for the tools; a release workflow that moves the `v1` tag.
- **A guard on version 1:** a snapshot of the public surface, so nothing a tool relies on can disappear without a version 2.
- **The starter:** the smallest tool that passes every check, proved in CI on each change.
- **style.eurth.org:** the components in both themes, the tokens with their contrast, and the handbook.
- **`HANDBOOK.md`:** the rules, for whoever builds a tool.

## Not planned

- **Browser storage of any kind** (cookies, localStorage, sessionStorage, IndexedDB): the suite's promise is that nothing is stored. A choice lasts for the visit; a design lives in its link or in the profile file.
- **Fonts, icons or scripts from another address:** nothing is loaded at run time from anywhere but the tool itself.
- **A client-side router:** every page is real HTML and loads as one; the visit's choices travel without it.
- **Per-tool themes or colours:** a tool's character comes from what it does and how it speaks, not from a palette of its own.
- **Publishing to the npm registry:** tools install from GitHub by tag, which needs no account and no token.
- **Analytics, even privacy-friendly ones:** "no analytics" is in every footer.
- **Donation links.**
