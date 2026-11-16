# Roadmap

`@eurth/style` is the shared look and shell of Eurth's worldbuilding tools: one package that every tool installs, so they look and behave as one suite. The rules it carries out are in the [handbook](HANDBOOK.md).

Three parts: what comes next, what each release added (newest first), and what's not planned. Points from reviews are in the [feedback log](docs/feedback-log.md).

## Next

- **Pitches in `tools.json`:** the one-liners for doors 5 to 15 come from the mock-up boards and may be reworded by each tool's own brief before its door opens.
- **Flagwright and Governmint on the shared shell:** each is moved in an open pull request (eurth-flag#1, eurth-government#12), waiting for Stijn's review before it goes live.
- **The nightly and launch workflows, run for real:** `tool-ci.yml` runs from the tools' own repositories; `tool-nightly.yml` and `tool-launch.yml` have not had their first run yet.
- **After 24 December:** check that style.eurth.org/schemas/eurth-profile-1.json has appeared on the nightly run.
- **What older versions left in the browser:** Flagwright and Governmint used to keep the theme and saved designs in localStorage. Those entries stay on returning visitors' devices, unread; removing them means touching localStorage once more, which is Stijn's call.
- **Flagwright and Passport onto `pictureFilename()`:** Flagwright's WebP button still saves a PNG called `.webp` in Safari (`savePicture` in its maker); Passport carries its own copy of the fix (`src/passport/files.ts`), to be replaced by the shared helper. Any other tool with a WebP button does the same.
- **After 25 December:** check that every site's footer has gained its GitHub link on the nightly run.
- **Every tool onto the 1.4.0 parts:** the blue bars, white labels and the centred footer arrive by themselves on the nightly run. Each tool still has to switch its own Random button to `RandomButton`, add Markdown to its share row and downloads, use line-md icons in its toolbar and results, and build its guide, glossary and templates pages from `PageHead`, `Figure` and the `eu-terms` and `eu-gallery` classes, with pictures. The starter shows each.
- **Two line-md icons without a still drawing:** `lineMoonRisingFilledAltLoop` and `lineMoonRisingTwotoneAltLoop` show nothing with reduced motion (their finished state can't be read from their animations). No part of the shell uses them; use `lineMoonRisingFilledLoop` instead until they are fixed.
- **Night's chosen options:** at Night a chosen option is light blue with a night label (`--selected`, 8.1:1). It isn't eurth-blue, so 1.4.0 left it; say if it should follow the brand pair too.

## 16 November 2026: 1.4.1

Found while bringing Flagwright and Governmint onto 1.4.0.

- **`RandomButton` can be pressed from elsewhere:** bind the component and call `press()` for a keyboard shortcut or a second control; it asks the first time, as a click does. One yes now answers for every Random on the page.
- **Random is red only while there is something to lose:** with `guard` false it is a plain button; with `guard` true it stays red when pointed at and keeps its tooltip, also after the one yes.
- **A disabled risky button stays quiet:** `eu-btn--risky` no longer turns red when it can't be pressed.
- **Tooltips are no longer covered** by something placed after their button: the button comes forward while pointed at.
- **A picture on its own in `eu-figures`** keeps the size of the paired ones; on a phone they stack.

## 16 November 2026: 1.4.0

Stijn's review of the shell, nine points (feedback log, 10 to 18). A new look for every site on the shell, with nothing a tool relies on removed.

- **The header is a blue bar with white pills, as on eurth.org:** the tool's pages, the Tools menu and the Deluminator sit in an eurth-blue bar; the yurt, the name, "by Eurth" and the tagline sit under it on the page's own ground. The page you're on is the pill filled with night. The usual pages get an icon by themselves, a page of a tool's own takes one (`pages[].icon`), and on a phone the other pages show their icons only.
- **Join Eurth has left the header:** it is in a blue bar at the foot of the page, with Forums, Map, News and Status.
- **"Orioni" in the footer goes to the forum:** the profile at eurth.org/u/orioni, no longer the wiki.
- **The footer lines up with the page:** its text sits in the same centred column as the content, on any width of screen. `eu-column` and `eu-bar` are that column, for anything else that should line up.
- **White on eurth-blue:** primary buttons, the Join Eurth pill and the pill on sharing images now carry white labels, as the forum does. White with eurth-blue is 3.2:1, so the pair is the suite's one exception to AAA: it is held to AA for large text and only ever set at 19px bold (`BRAND_TEXT` in the contrast pairs; `eurth-axe` lets it through the AAA rule at that size and nowhere else).
- **line-md, everywhere it fits:** every line-md icon is in `@eurth/style/line`, drawn by `Line.astro` and `Line.svelte`. They draw themselves when the page opens, when they scroll into view and when their button is pointed at; with reduced motion each shows its finished drawing. The shell now uses them in the blue bars, the share row (a tick draws itself once something is copied), the footer's hearts, the sound and motion switches, Install app, the offline note and the dialogs.
- **Random that warns once:** `RandomButton.svelte`. Pointing at it turns it red and says what will be replaced; the first click asks; after one yes it never asks again. `eu-btn--risky` and `eu-btn--danger` are there for any other action that throws work away.
- **Markdown:** `ShareButtons` takes `markdown` and shows Copy Markdown; `markdownTable()` writes a table. The handbook now asks for Markdown wherever a result has words, in the share row and among the downloads.
- **Written pages with pictures:** `PageHead.astro`, `Figure.astro`, `Note.astro` and `Toc.astro`, and classes for a contents column, figures side by side with "Does" and "Doesn't", glossary cards, a gallery of tiles and a closing panel. The starter's guide, glossary and templates are rebuilt from them, with pictures the tool draws itself, and the handbook says a page of bare text is not done.
- **The starter** has all of it: Random, Copy Markdown and a Markdown download, line-md icons, and the three illustrated pages.

Not changed: the theme tokens, the link format, the service worker, and every class, prop and export from 1.3.0.

## 16 November 2026: 1.3.0

Found while checking Passport in Safari.

- **A picture named for what the browser made:** `pictureFilename(name, picture, asked)` takes a file's ending from the picture itself, and gives a sentence for a toast when that isn't what was asked for. Safari 27 can't make WebP from a canvas: asked for `image/webp`, it hands back a PNG without saying so, so a WebP button saved a PNG called `.webp`. Firefox 159 and Chrome make real WebP. `svgToPicture()` and `download()` are as they were; a tool gets the fix by naming its pictures with the new helper (see Next).

## 15 November 2026: 1.2.1

- **The hub is live early:** tools.eurth.org opened on 15 November 2026 on Stijn's word, with every door still locked, so its launch in `tools.json` moves from 9 December to 15 November. Every site on the shared shell gains the "All tools" link in its header and footer the next time it is built: style.eurth.org has it, and Flagwright and Governmint get it when they move onto the shell (see Next). The handbook on style.eurth.org now shows its Launch section. The fifteen doors keep their dates, 10 to 24 December.

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
