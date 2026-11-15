# Roadmap

`@eurth/style` is the shared look and shell of Eurth's worldbuilding tools: one package that every tool installs, so they look and behave as one suite. The rules it carries out are in the [handbook](HANDBOOK.md).

Three parts: what comes next, what each release added (newest first), and what's not planned. Points from reviews are in the [feedback log](docs/feedback-log.md).

## Next

- **Pitches in `tools.json`:** the one-liners for doors 5 to 15 come from the mock-up boards and may be reworded by each tool's own brief before its door opens.
- **Flagwright and Governmint on the shared shell:** both still carry their own header, footer and theme switch (and remember the theme in the browser). Moving them over needs Stijn's go-ahead.
- **The nightly and launch workflows, run for real:** `tool-ci.yml` runs from the tools' own repositories; `tool-nightly.yml` and `tool-launch.yml` have not had their first run yet.
- **After 24 December:** check that style.eurth.org/schemas/eurth-profile-1.json has appeared on the nightly run.
- **What older versions left in the browser:** Flagwright and Governmint used to keep the theme and saved designs in localStorage. Those entries stay on returning visitors' devices, unread; removing them means touching localStorage once more, which is Stijn's call.
- **After 25 December:** check that every site's footer has gained its GitHub link on the nightly run.

## 15 November 2026: 1.2.1

- **The hub is live early:** tools.eurth.org opened on 15 November 2026 on Stijn's word, with every door still locked, so its launch in `tools.json` moves from 9 December to 15 November. Every tool's header and footer gain the "All tools" link on their next nightly run, and the handbook on style.eurth.org now shows its Launch section. The fifteen doors keep their dates, 10 to 24 December.

## 15 November 2026: 1.2.0

Found while moving Governmint onto the shared shell.

- **Kept once fetched:** files left out of the first download with `offlineSkip` (a gallery of flags, say) are now kept from the moment they are first shown, so they are there offline afterwards.
- **`ShareButtons` tells you when Share is opened:** an `onshare` callback, beside `oncopy`.
- **`ref()` and `wikipedia()` for browser code:** exported from `@eurth/style` as well as `@eurth/style/build`.
- **`eurth-smoke` and one-page tools:** the start page is always opened offline, also when a tool has no pages of its own in the header.
- **`eurth-axe` and inputs that aren't drawn:** an input that is `display: none`, or whose label is itself kept out of sight, is no longer measured as a target.
- **The starter checks its Svelte components' types:** `npm run check` is `astro check && svelte-check`.

## 15 November 2026: 1.1.1

Found while moving Flagwright onto the shared shell.

- **Old caches are cleared:** the service worker now removes every cache on the site but its current one, so what an older, differently named service worker kept (Flagwright's and Governmint's own, before the shared shell) no longer stays on returning visitors' devices.
- **`eurth-smoke` waits longer for a cold start:** up to three minutes for `wrangler dev` on a busy machine.
- **The web manifest's description** is the site's description as written, no longer the tagline and the description run together.

## 14 November 2026: 1.1.0

- **`eurth-smoke`:** the built site in real Chrome, served by `wrangler dev` under its real headers. It checks what unit tests can't: nothing blocked by the Content-Security-Policy, the theme before the first paint and from page to page, nothing stored, the service worker, every page offline, and real HTML without script. Every tool has it as `npm run smoke`, and the tools' CI runs it on `main`.
- **The profile's schema at its address:** style.eurth.org/schemas/eurth-profile-1.json, in builds made after the last door has opened, so it arrives by itself on the nightly run.
- **`eurth-axe` and hidden inputs:** an input kept out of sight is measured by its label, the thing that is actually pressed, so a file picker behind a button no longer counts as a 1 by 1 pixel target. Both browser checks are also more patient on a busy machine.
- **The tools' CI only runs what the lock file installed:** `npx --no-install`, so a command is never fetched from the registry by name.
- **Proved:** a tool locked to 1.0.0 moves to the newest 1.x with the nightly run's update step, also on a machine with no SSH keys; and the shared CI workflow runs from the tools' own repositories.

## 14 November 2026: 1.0.1

- **Seasonal yurts switched on:** Valentine's Day (1 to 14 February), Earth Day (16 to 22 April), Halloween (October) and December join Pride, so the header's yurt dresses for all five of the design kit's events.

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
