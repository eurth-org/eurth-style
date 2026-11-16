# The Eurth tools handbook

The rules every Eurth worldbuilding tool follows, written for whoever builds one. Eurth (eurth.org) is a worldbuilding and roleplay community since 2004; its tools are free, and made for fiction and fun.

**On anything the tools share, this handbook wins.** A tool's own brief decides what the tool does; this decides how it looks, behaves, is built, tested and launched. If a brief and the handbook disagree on a shared matter, follow the handbook and tell Stijn. If the handbook is silent or wrong, don't work around it in one tool: ask for it to be fixed in `@eurth/style`, so every tool gets the fix.

This is the handbook of `@eurth/style` version 1. The same text is at style.eurth.org/handbook/ and in `node_modules/@eurth/style/HANDBOOK.md`.

## Start here

1. Copy the `starter/` folder of `eurth-org/eurth-style` into your new repository, `eurth-org/eurth-<tool>`. It is the smallest tool that passes every check here.
2. Rename it: `eurth.config.mjs` (id, name, address, title, description, pages), `package.json`, `wrangler.jsonc` (the Worker's name and its custom domain), `LAUNCH_AT`, and the cron line in `.github/workflows/launch.yml`.
3. `npm install`, and commit the `package-lock.json` it writes.
4. Replace `src/tool/` and the four pages with your tool. Keep the habits the starter shows.
5. `npm run images` after you have a logo and a sharing image; commit what it writes to `public/`.
6. `npm run check && npm run build && npm test && npm run axe && npm run smoke` until all five pass. `npm run preview` serves the built site with its real headers.

Commands every tool has: `dev`, `build`, `preview`, `check`, `test`, `axe`, `smoke`, `images`, `deploy`.

## Stack and hosting

- **Astro**, static output, real HTML for every page. **Svelte 5** for the interactive tool. **TypeScript**. **Vitest**. Node 22 or later (CI runs on Node 26). The same setup as Flagwright.
- Each tool is its own repository, `eurth-org/eurth-<tool>`, deployed as a **Cloudflare Worker serving static assets** on its custom domain (`wrangler.jsonc`, on the account that holds the eurth.org zone). A Worker script only where a tool truly needs one, and its brief says so.
- `@eurth/style` and `@eurth/profile` are installed straight from GitHub and built into the tool:
  ```json
  "@eurth/style": "github:eurth-org/eurth-style#semver:^1",
  "@eurth/profile": "github:eurth-org/eurth-profile#semver:^1"
  ```
  Nothing is loaded at run time from another address: not these packages, not fonts, not icons.
- `astro.config.mjs` has two integrations, `svelte()` and `eurth(site)` from `@eurth/style/astro`. The second sets static output, addresses ending in a slash, the stylesheet inside each page and scripts as separate files, adds the sitemap, and after the build writes `_headers`, `sw.js`, `manifest.webmanifest`, `robots.txt` and `llms.txt`. Don't write those by hand.
- **GitHub Actions**: check, build and test on every push and pull request (plus axe, the smoke test and Lighthouse on `main`); deploy `main`. All three workflows are thin callers of the reusable ones in `eurth-org/eurth-style` (`tool-ci.yml`, `tool-nightly.yml`, `tool-launch.yml`, at `@v1`); copy them from the starter and don't add steps of your own without asking.
- Deploying uses `CLOUDFLARE_API_TOKEN`, an organisation secret set once for all eurth-org repositories. Without it, the deploy step is skipped with a warning. **That is the only secret anywhere.** No tokens pass between repositories.
- Everything must run on the **Cloudflare Workers Free plan** and never cost money. Ask Stijn before adding anything that could bill.
- Each repository has `README.md`, `CLAUDE.md`, `roadmap.md`, `docs/feedback-log.md` and `LICENSE` (Apache 2.0).
  - `roadmap.md` has three parts: "Next", one dated section per release (newest first) and "Not planned" (what is ruled out, and why). A feature goes into it in the same commit that adds the feature.
  - `docs/feedback-log.md` is a table of every point from a review and the release that did it.

## Look

- **Use only `@eurth/style` tokens: no local colours, fonts or spacing.** Every value is a custom property (`var(--ink)`, `var(--space-4)`, `font: var(--type-title)`); the list, with what each is for, is at style.eurth.org/tokens/ and in `tokens.json`. In your own CSS, write tokens; in markup, use the `eu-` classes.
- A picture a tool exports (SVG, PNG) can't use custom properties. Take its colours from the same tokens as plain values: `resolveColors(tokens, 'dark')` with `tokens` from `@eurth/style/tokens.json`. A tool whose subject is colour (a palette the visitor picks from) may carry those colours as data.
- **Two themes**: Night (dark, the forum's Solarized dark) and light.
- **eurth-blue `#2698d4` is the brand colour and never changes**: the logo disc, the blue bars at the top and foot of every page, primary buttons, the Join Eurth pill. **Labels on it are white, as on eurth.org.** A pill in the blue bars is eurth-blue with a white outline and a white label; the page you're on is the white pill with the eurth-blue label. In the bars and on primary buttons the label is 19px bold (`font: var(--type-pill)`), which makes it large text.
- **What is chosen is eurth-blue too, everywhere**: a chosen option, a pressed switch, the number of a step, the filled part of a slider (`--selected` with `--on-selected`: eurth-blue and white, in both themes). The label stays bold and always carries a tick or a word as well.
- **Text meets WCAG AAA**, with one exception, and it is the brand's: white with eurth-blue is 3.2:1. At 19px bold that meets AA for large text; on a chosen option, where the label is smaller, it falls short of AA and is kept on purpose. Pair the two nowhere else.
  - Night: body parchment `#fcf6e1` on night `#002b36` (13.9:1), cards night-raised `#0d353f`, muted `#bac1b5` (8.1:1), links `#80c8e5` (8.1:1).
  - Light: body charcoal `#222222` on white, muted `#545454` (7.6:1), links `#12577b` (7.9:1).
  - Control borders `#798c88` at Night and `#646464` in light (`--line-strong`). `--line` is for hairlines only, never the only edge of a control.
  - Errors, successes and cautions as text use `--danger-text`, `--success-text` and `--caution-text`, always with a word or an icon.
  - Text on a hovered control is `--ink`.
- **Type**: the device's own fonts, nothing downloaded. `system-ui, Arial, sans-serif` for everything; `ui-monospace, Menlo, monospace` for code, data and exports. No serif. Headlines are bold. Nothing smaller than 13px.
- **Flat**: no gradients, no glows, no shadows. Radius 12px (`--radius-md`) for pills, buttons, inputs and cards; 2px (`--radius-sm`) for small swatches.
- **Every tool has a mark of its own, and the Eurth yurt is in it.** Governmint's is a gold coin struck with the yurt; Flagwright's is a flag flying it. Draw yours the same way: one original object that says what the tool makes, flat, in a few colours, with the yurt placed on it as it is (`@eurth/style/assets/eurth-yurt.svg` is the yurt alone; never redraw, stretch or retype it). A nod and a wink, not a second logo for Eurth. The mark stands in front of the tool's name in the header (`<Fragment slot="mark" set:html={mark} />` inside `Page`, or a component of your own there if it should move, as Governmint's coin flips), and it is the favicon, the home-screen icon and the mark on the sharing image (`makeImages({ logo: mark })`, `sharingImage({ mark })`). The plain yurt on its blue disc belongs to Eurth itself and to pages that are no tool's (the hub, these docs).
- **Icons**: Font Awesome Free (solid and brands), imported per icon as SVG (`Icon.svelte`, `Fa.astro`), for still icons. **line-md for animated icons, and use them**: every line-md icon is in `@eurth/style/line` (`import { lineConfirm } from '@eurth/style/line'`), drawn by `Line.astro` or `Line.svelte`. They draw themselves when the page opens, when they scroll into view and when their button or link is pointed at. Reach for one wherever something happens or changes: a confirmation (`lineConfirm` in place of the icon just clicked), a download, a state switching on or off, the icon beside a heading the eye should find first. The shell uses them in the blue bars, the share row, the footer's hearts, the switches and the notes; a tool's own toolbar and results should feel the same. Icons named `…Loop` never stop, so keep those for something that is truly going on. With reduced motion each shows its finished drawing. No icon fonts, no emoji as icons.

### The classes

`eu-btn` (`--primary`, `--quiet`, `--icon`, `--selected`, `--risky`, `--danger`, or `aria-pressed="true"`), `eu-join`, `eu-pill` with `eu-check`, `eu-chip`, `eu-swatch`, `eu-field`, `eu-label`, `eu-input` (`--data`), `eu-select`, `eu-textarea`, `eu-help`, `eu-error`, `eu-range`, `eu-card` (`--outline`) with `eu-card-title`, `eu-step` and `eu-count`, `eu-dialog` with `eu-dialog-top`, `eu-toast`, `eu-offline`, `eu-kicker`, `eu-lead`, `eu-muted`, `eu-data`, `eu-prose`, `eu-stack`, `eu-row`, `eu-scroll`, `eu-icon`, `eu-line`, `eu-visually-hidden`; for written pages `eu-pagehead`, `eu-crumbs`, `eu-article`, `eu-toc`, `eu-figure`, `eu-figures`, `eu-verdict`, `eu-note`, `eu-terms` with `eu-term`, `eu-gallery` with `eu-tile`, and `eu-next`; `eu-column` and `eu-bar` for the page's centred column, `eu-barlink` for a pill in a blue bar. Tooltips: `data-tip` (with `data-tip-align="start"`, `data-tip-side="top"`). Click answers: `data-click`. Each is shown in both themes at style.eurth.org.

## Shell

The shell comes from `@eurth/style` and is **never rebuilt per tool**. A page is `<Page site={site} …>` around your content (`@eurth/style/components/Page.astro`); the header, the footer, the head tags, the offline note and the page's shared behaviour come with it.

- **Header**, as on eurth.org: the "Skip to the content" link; a **blue bar of pills**: the tool's own pages (for example Maker, Guide, Glossary, Templates), from `site.pages`, then a Tools menu from `tools.json` and the Deluminator; under it, on the page's own ground, the yurt, the tool's name, "by Eurth" and the tagline, linking to the tool's start. The page you're on is the white pill; the others are eurth-blue with a white outline. The usual pages have an icon already; give any other page one (`pages: [{ href, label, icon }]`, a line-md or Font Awesome icon), and on a phone the pages you're not on show their icons only. A tool's actions (Random, Simple/Advanced) live in the tool's own toolbar, not in the header. **Join Eurth is not in the header.**
- **Footer**, in the page's centred column: links to the tools from `tools.json`; "Made by Orioni for Eurth, a worldbuilding and roleplay community since 2004", plus the tool's own inspirations (the `inspirations` slot of `Page`); "Free forever: no ads, no analytics, trackers, cookies or accounts. Made for fiction and fun."; icon attribution (Font Awesome CC BY 4.0, line-md MIT); "© 2026 Eurth", Apache 2.0, and from 25 December 2026 the GitHub link. **Before then, no page links to GitHub.** No donation links. The footer's hearts beat a few times when it comes into view. The footer also carries this visit's switches: Install app, Sound (if `site.sound`) and motion. Under it, a **blue bar like the one at the top** holds the rest of Eurth: Forums, Map, News, Status and Join Eurth. Its icons are fixed, the same on every tool: speech bubbles for Forums, **a globe for Map, always**, a newspaper for News, a heart with a pulse through it for Status. Pointed at, each draws itself.
- **The scroll line**: a thin eurth-blue line along the top of the screen grows as the reader scrolls, on every page, as Governmint's does. It comes with `Page`; a tool doesn't draw its own.
- **Everything lines up with the page's centred column** (`--size-page`, 1200px): the bars' contents, the name, the content and the footer's text. Nothing of the shell hugs the left edge of a wide screen.
- The Tools menu, the footer and the hub show **only tools whose launch date has passed when the site is built**, so no site mentions a tool before it launches. Never list tools by hand.
- **Sections of a tool**: settings that belong together share a card with its own ground (`<section class="eu-card" aria-labelledby=…>`), under a heading with an icon (`<h2 class="eu-card-title">`), then a line of help where it's needed (`eu-help`), as Flagwright and Governmint do in their own styles. Where the sections are steps to take in order, a number comes first (`<span class="eu-step">1</span>`); a count of what's inside may follow the title (`eu-count`). The results side is built the same way: one card per thing shown, each with its heading and icon. A tool is never one long undivided form.
- **A tool that was live before the suite keeps its own design.** Governmint and Flagwright were perfected before `@eurth/style`: everything between the header and the footer stays exactly as it is on the live site, with the tool's own styles kept inside a wrapper of its own, so that neither stylesheet reaches into the other's part of the page. Governmint keeps its section bar and its own progress line (`scrollLine: false` in its `defineSite()` leaves out the suite's). Governmint also keeps the About pill it had in its top bar (`Page`'s `bar` slot). Both are held to WCAG AA and 24px targets (`"eurth": { "axe": { "level": "aa", "targets": 24 } }` in `package.json`). Both are exceptions on Stijn's word, not a choice a tool makes for itself: never restyle a live tool to these rules, and never claim the exception for a new one, without asking him.
- **Deluminator**: Auto, Light, Dark, cycling as in Governmint. The theme is set by the head script before the first paint (no white flash); the circular reveal from the switch is drawn by CSS from the first frame (no flash while switching); line-md icons draw themselves; still icons and an instant switch for reduced motion; without script, CSS follows the device.

### What a tool provides

`eurth.config.mjs`, with `defineSite()` from `@eurth/style/build`: `id` (the subdomain), `name`, `url`, `title`, `description`, `tagline`, `pages`, `repo`, `ogAlt`, and optionally `category`, `sound` and `llms`.

**`eurth.config.mjs` and `@eurth/style/build` are for build time only**: `astro.config.mjs`, the frontmatter of `.astro` files, tests and scripts. Never import them from a Svelte component or a `<script>`: they carry the list of every tool, launched or not, and anything browser code imports ends up in the files visitors download. Hand a component what it needs as props.

## Privacy: nothing stored

- **No cookies, localStorage, sessionStorage or IndexedDB; no analytics; no accounts; no third-party requests of any kind.**
- The theme, sound and motion switches last **for the visit only**. Every visit starts on Auto, sound off, motion as the device asks. (They ride in `window.name`, which belongs to the tab and is never written to disk; `getPrefs`, `setPrefs` and `onPrefs` from `@eurth/style` are the only way to them.) A tool's own passing choices live in memory.
- **A design lives in its link**: the whole state, encoded compactly and with a version, in the URL's **query string** (not the `#` part), so a Worker could read it one day. `encodeState`, `decodeState`, `stateLink`, `stateFromLocation` and `stateToLocation` do this (`?d=1.…`); a tool may use a shorter readable form of its own, still in the query string and still versioned. When the shape of the state changes, raise the version and keep reading the old ones: a link made today must open next year.
- **A link is someone else's input.** Check and clamp every value before using it; never put text from a link or a file into the page as markup.
- Big designs also save and load as the nation's **profile file** (below). **"Save" never means browser storage.**
- The service worker's cache of the app's own files is the only thing kept on a device.
- **Security headers** as Flagwright's: a strict Content-Security-Policy with script hashes, `frame-ancestors` allowing eurth.org. `eurth(site)` writes them and the tests check them. No inline event handlers, no `eval`, no scripts or styles from elsewhere.
- Outbound links carry `?ref=<this tool's host>` (`ref()`, from `@eurth/style/build` at build time and from `@eurth/style` in browser code) and open in a new tab; the shell marks them for screen readers. Links between Eurth tools stay in the same tab (`data-same-tab`).

## Accessibility: WCAG 2.2 AAA wherever it can be met

- **Contrast** as above, tested in CI for both themes. The brand pair (white with eurth-blue) is held to 3:1; `eurth-axe` lets that pair through its contrast rules and no other. If a tool pairs tokens in a new way, add the pair: `standardSuites({ site, pairs: [['ink', 'hover', 7]] })`.
- **Keyboard for everything**, a visible 2px focus ring, targets at least **44 by 44px** (links inside a sentence are exempt). An input kept out of sight (`eu-visually-hidden`: a file picker behind a button, a switch drawn by its label) is measured by its `<label>`, so give it one.
- **Never colour alone**: always a word or an icon as well. Several users are red-green colour blind; colours that must be told apart differ in lightness.
- **A written description of every result** ("Copy description"), for screen readers and for sharing. A picture's `alt` is that description.
- One `h1` per page; headings in order; real `<button>`, `<a href>`, `<label>` and `<input>`; `lang` on text in another language.
- Reduced motion is honoured twice: the device's setting, and the footer's switch. Use `calm()` before anything that moves from script; the stylesheet stills CSS animations by itself.
- **Automated accessibility checks (axe) on every page in CI**: `npx eurth-axe` runs the WCAG 2.2 A, AA and AAA rules and the 44px target check, in both themes. No findings are waived without asking.

## SEO, to be the reference

- **Pages per tool**: the maker; a guide (the subject explained well, with sources and a last-updated date); a glossary; and templates or examples. They link to each other, to the hub once it is live, and to eurth.org.
- **Written pages are built from the shared parts, and show what they explain.** A page opens with `PageHead.astro` (the trail back, the headline, a lead, the last-updated date, and a picture of the subject on the right). A guide's text is `eu-prose` inside `eu-article`, with `Toc.astro` beside it; it shows its points with `Figure.astro` (two in `eu-figures` for "does" and "doesn't"), sets asides in `Note.astro`, and ends with `eu-next`: the way back to the maker. A glossary is `eu-terms`, each term a card with a small picture where one helps. Templates and examples are an `eu-gallery` of `eu-tile`s, picture first. **Every tool can draw its own pictures, so every guide, glossary and templates page has them**: made at build time by the tool's own code, each with an `alt` that describes it, and each opening in the maker where that makes sense. A page of bare text is not done. The starter's three pages show all of it.
- **Title pattern** for the start page: "<Name>: free online <thing> maker for worldbuilders". Other pages: "<Page> · <Name>". A unique description (50 to 200 characters) and a canonical link on every page; `Page` writes them from its props.
- **JSON-LD**, from the builders in `@eurth/style/build`: `webApplication()` on the maker (free, runs in the browser), `breadcrumbs()` on guides (pass `crumbs` to `Page`), `definedTermSet()` on glossaries, `article()` for a guide's date, `faqPage()` for questions shown on the page. `Page` adds Organization (Eurth) and WebSite to every page.
- `sitemap.xml`, `robots.txt`, `llms.txt`: written by the build. Add lines to `llms.txt` with `site.llms`.
- **Lighthouse 100 in all four categories** (its own contrast audit is left out, since it knows nothing of the brand's pair; `eurth-axe` checks the contrast of everything else). Core Web Vitals "good": LCP under 2.5 s, INP under 200 ms, CLS under 0.1. CI holds accessibility, best practices and SEO at 100 and performance at 95 or better with the three vitals in range (CI machines are noisy); on an ordinary run it should read 100.

## Sharing

- An **Open Graph image**, 1200 x 630 PNG with alt text, for every page, plus `twitter:card` `summary_large_image`. `/og.png` and `site.ogAlt` are the default; a page may pass its own `ogImage` and `ogAlt`. `sharingImage()` from `@eurth/style/images` gives the suite's layout.
- **Image downloads** where a tool makes a picture (`PICTURE_SIZES`): link preview 1200 x 630, square 1080 x 1080, portrait 1080 x 1350, story 1080 x 1920, pin 1000 x 1500, wide 1600 x 900; SVG, PNG and WebP where it fits. `svgToPicture()` and `download()` do the work.
  - **Name a picture for what the browser made, not for what you asked for**: `pictureFilename(name, picture, asked)`. A browser that can't make WebP (Safari) hands back a PNG without saying so, and a PNG called `.webp` opens in some programs and not in others. The helper gives the `filename` with the right ending and, when that isn't what was asked for, a `note` to show with `toast()`:
    ```
    const picture = await svgToPicture(svg, { width, height, type: 'image/webp' });
    const file = pictureFilename(`${fileSlug(nation)}-flag`, picture, 'image/webp');
    download(picture, file.filename);
    if (file.note) toast(file.note);
    ```
- **Markdown wherever a result has words.** The forum and most wikis take Markdown, so a result that is more than a picture (a summary, a list of names, a table of figures, a description) can be taken away as Markdown as well: **Copy Markdown** in the share row (`markdown` on `ShareButtons`) and a **Markdown download** beside the other downloads (`download(text, name + '.md', 'text/markdown')`). Write it with headings, lists and `markdownTable(head, rows)`, end it with the link that brings the result back, and pass anything a visitor typed through `markdownText()` so it can't turn into markup. Wherever a tool offers an export or a save, check that Markdown is among the choices.
- **A result leaves in two cards, as in Governmint: "Save & share" and "Export".**
  - **Save & share** (`ShareButtons.svelte`, in a card with that heading and the share icon): Copy link, Share, then Copy picture, Copy description and Copy Markdown where the tool has them, then the profile's Load and Save (`ProfileButtons` as its children). Under the row, one line that says where the result lives: in its link and in the profile file, and nowhere in the browser.
  - **Export** (`ExportPanel.svelte`, in a card with that heading): the result as text, wherever it has words. A row of formats, Markdown first, then what suits the tool (wikitext for IIWiki, JSON, CSV); a line saying what the chosen format is for; the text itself, to read and select; and Copy text and Download.
  - **A picture's own downloads** sit with the picture, in a row that begins "Download as": SVG, PNG, WebP.
  - Use the pair wherever it makes sense; a tool whose result is only a picture may have no Export card. Never one heap of a dozen buttons.
- **Markdown wears Markdown's own mark**: `faMarkdown` from Font Awesome's brands, on Copy Markdown and on the Markdown download.
- **The share window is the suite's, the same in every tool** (`ShareDialog.svelte`, opened by Share in the share row; `oncopy` and `onshare` tell the tool when either happens): the words, the link with Copy, then Eurth forum (new topic, pre-filled), Reddit, Bluesky, X, Facebook, LinkedIn, Tumblr, WhatsApp, Telegram, Email, and **More**, which is always there: it opens the device's own share sheet, and where a browser has none it copies the words with the link. No tool builds a share window of its own. **Plain links only**: no share scripts, no embeds.

## Offline and install

- **Service worker** as Flagwright's: content-hashed files cache-first, pages network-first with the cached copy as fallback, old versions cleared. The build writes it; the shell registers it. Large galleries can be left out of the first download with `eurth(site, { offlineSkip: [/^flags\//] })`; such a file is kept once it has been shown.
- **Web manifest**: name, 192 and 512px icons (one maskable), the theme and background colours, display standalone; each page carries the light and Night theme colours. `npm run images` makes the icons.
- **Install button** where the browser offers it, and a short how-to for iPhone (Add to Home Screen): `InstallButton.svelte`, already in the footer.
- **Offline note**: "No signal: <Tool> keeps working from the copy on this device." and "Back online." Already in `Page`.

## Delight

- **One signature touch per tool**, like Governmint's coin clink and paper plane; buttons answer clicks (`data-click`: bounce, spin, tumble, swing-left, swing-right, and pop by default); toasts in the tool's own voice (`toast()`).
- **Random, in every tool's toolbar** (`RandomButton.svelte`): the quickest way in for a newcomer. It also throws away what the visitor has made, so pointing at it turns it red and says so, and **the first click asks; after one yes it never asks again**. Pass `guard` as whether there is anything to lose, so an untouched design rolls straight away. Any other action that throws work away (Start again, Clear) wears `eu-btn--risky` and a `data-tip` that says what goes.
- **At least one easter egg per tool.** Suite-wide, already in `@eurth/style`: the Konami code sends an emu across the footer; "Nice." when a number settles on 69 (`niceWatcher()`: wire it to your sliders); the seasonal yurt on the design kit's dates.
- A click's answer takes **under half a second**. Nothing ever blocks input. **Sound is off until switched on** (`playTones()` is silent otherwise; set `site.sound` so the footer offers the switch). **Nothing moves for reduced motion.** An easter egg may run a few seconds, since nobody is waiting on it.

## The nation profile

One file, `<nation>.eurth.json`, carries a nation from tool to tool. `@eurth/profile` reads, checks, merges, saves and loads it; its README has the format and the full list of sections.

- **Each tool owns one section and leaves every other section untouched, including ones it doesn't know.** Write yours with `setSection(profile, '<section>', { …getSection(profile, '<section>'), link, summary, … })`.
- A section is small: `link` (your share link, which brings the whole design back), `summary` (a paragraph), `updated`, and the few typed fields another tool would want. Not your whole state.
- **`identity`** (names, capital, demonym, motto, languages) is written only by the tools its owners list names (`SECTION_OWNERS`). Every other tool reads it and never writes it. A tool that creates a new file sets only the nation's name: `createProfile(nation)`.
- Show the two buttons every tool has, "Load profile" and "Save profile" (`ProfileButtons.svelte`); dropping a file on the window loads it too.
- **SVG from a profile only ever goes in an `<img>`** (`svgDataUrl()`), never into the page as markup. Text is shown as text.
- New fields are proposed to `@eurth/profile`, so the schema stays the one description of the file. Unknown keys are kept, so adding is always safe; changing or removing within version 1 is not.

## Launch

Tools launch through Eurth's advent calendar: 10 to 24 December 2026, one door a day at 00:00 Europe/Brussels.

- Repositories are public from the start: the code isn't secret, **the sites are**. Until its door opens, a tool's site doesn't exist: no custom domain, no workers.dev deploy (`"workers_dev": false, "preview_urls": false`), and no other site mentions it. Develop and preview locally (`npm run preview`, which is `wrangler dev`).
- Each README opens with a friendly note: this tool is part of Eurth's advent calendar, so please don't spoil the surprise before its door opens.
- The door's time is in the **`LAUNCH_AT`** file: one line, an ISO time with its offset (`2026-12-10T00:00:00+01:00`). It must equal the tool's `launch` in `tools.json`; a test checks.
- **The launch workflow** (`.github/workflows/launch.yml`) runs on a schedule on the evening before the door (22:30 UTC, 23:30 in Brussels): it builds the site as it will be at the door's time, checks and tests it, waits until `LAUNCH_AT` and deploys to production, which creates the custom domain. It also runs by hand (`workflow_dispatch`) as a fallback, because GitHub can start scheduled runs late: if it hasn't started by 22:45 UTC, start it yourself. Run more than three hours early, it refuses. After the launch, delete it.
- Before the door, pushes to `main` are checked and tested but **not deployed**; after it, every green push deploys.
- **The nightly run** (`nightly.yml`, 23:10 UTC) rebuilds the site just after midnight in Brussels and deploys if the build differs from what is live. That is how a tool's menus gain each newly opened door, and how a new `@eurth/style` release reaches every tool. The hub's nightly rebuild works the same way, with `ahead: true`: it builds for the coming midnight, waits, and deploys at 00:00.
- **Nothing anywhere relies on the visitor's clock to hide anything.** What a site shows is decided when it is built (`launchedTools()`, `githubLinksAllowed()`); the `EURTH_BUILD_TIME` variable lets the launch workflow build for the door's time ahead of it.
- A tool is added to `tools.json` in `@eurth/style` (name, address, one-line pitch, launch date) by a change to that repository.
- GitHub pauses scheduled workflows in a repository with no activity for 60 days. The nightly run's own commits count as activity only when something changed, so look in on a quiet repository now and then.

## Writing

- **British English.** Sentence case for headings, Title Case for names. The staff voice: plain, warm, a dry joke allowed; never a joke in an error or in safety text.
- **No emoji in the interface.**
- **Mind the space beside a link.** A line break in a page's source counts as a space, as in any HTML, and the build keeps it; a test fails when a word runs straight into a link ("made by`<a>`Orioni").
- Say what happened and what to do next. "That file isn't a nation profile. Pick one that ends in .eurth.json." beats "Invalid input".
- Dates as "14 November 2026" in prose; ISO dates only as data.
- The name is "Eurth"; the address is lower case, eurth.org.

## Free limits

- **GitHub**: every repository is public, so standard Actions minutes are free. Still keep CI lean (npm caching; Lighthouse and axe on `main` only), and keep the organisation's Actions spending limit at $0.
- **Cloudflare Workers Free**: 100 Workers, 5 Cron Triggers, 100,000 Worker requests a day and 10 ms of CPU per request, for the whole account; static assets are free and unlimited. So **every tool is static assets only** unless its brief says otherwise. Scheduled work belongs in GitHub Actions, not in Cron Triggers.

## The checks

`tests/shell.test.js` in every tool is three lines: `standardSuites({ site })` from `@eurth/style/testing`. Most suites read the built site, so CI builds first and tests after.

| Suite | What fails it |
| --- | --- |
| Contrast | A text pair under 7:1 (large text 4.5:1; borders, marks and the brand pair 3:1) in either theme. |
| Security headers | An inline script that isn't in the Content-Security-Policy by its hash; `unsafe-inline` or `unsafe-eval` for scripts. |
| Privacy | Any mention of cookies, localStorage, sessionStorage or IndexedDB in the built files; anything loaded from another address. |
| No spoilers | The address of a tool that hasn't launched, anywhere in the built files; a link to GitHub before 25 December 2026. |
| Pages | A page without exactly one `h1`, its own title and description, a canonical link, a 1200 x 630 sharing image with alt text, or structured data; a word that runs into a link with no space between; a missing icon, manifest, sitemap, `robots.txt`, `llms.txt` or service worker. |
| Launch | `LAUNCH_AT` missing, malformed, or different from `tools.json`. |

Besides these: `npm run check` (types: `astro check` for pages and `svelte-check` for components), your own tests of the tool's logic (links read back safely, the description, the picture), `npm run axe`, `npm run smoke`, and Lighthouse in CI.

`npm run smoke` (`npx eurth-smoke`) serves the built site with `wrangler dev` and opens it in real Chrome: nothing blocked by the Content-Security-Policy, the theme set before the first paint and carried from page to page, nothing stored, the service worker installed, every page open again without signal, and real HTML without script.

## Versions

- `@eurth/style` and `@eurth/profile` follow semantic versioning. **Version 1 releases stay compatible**: nothing a tool may rely on (an export, a prop, a class, a custom property, a tool's id) is removed or renamed, and a test in `@eurth/style` enforces it. Anything that would break a layout is version 2.
- Tools take new 1.x releases by themselves, on the nightly run. So never copy code out of the packages into a tool, and never reach into files the packages don't export.
- Found a bug or a gap in the shell? Fix it in `@eurth/style`, release, and every tool has it by morning.

## Done, for every tool

- Every handbook rule met.
- CI green.
- Deployed to its address (by the launch workflow, at its door).
- Lighthouse and axe checks passing.
- The README explains use, development and deployment.
- `roadmap.md` lists what's next.
- The tool is in `tools.json`.
