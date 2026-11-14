You're building the foundations for a suite of free worldbuilding tools by Eurth (eurth.org), a worldbuilding and roleplay community since 2004. This session starts in eurth-org/eurth-style; add eurth-org/eurth-profile to the session as well, and tell me if you can't. Every tool (tools.eurth.org, and arms, seats, names, stats, dynasty, cal, time, bank, passport, rank, cities, anthem, prompt, wiki and card on .eurth.org) will be built by other Claude Code chats on top of what you make, so what you write must be complete, unambiguous and stable.

First: save this brief as CLAUDE.md in eurth-style, study the two reference builds below, then write a plan and show it to me before you build.

Reference builds (read their code, keep their conventions): github.com/eurth-org/eurth-flag (Flagwright, the model: Astro, real HTML pages, service worker, CSP, tests) and github.com/eurth-org/eurth-government (Governmint: the Deluminator theme switch, the share dialog, the delights, the offline note).

Design references: the Eurth design kit (https://claude.ai/artifact/JdgowgHfVxUhBHSUftSxd4) for tokens, and the "eurth-style, the shared shell" board on the mock-ups canvas (https://claude.ai/artifact/32RKDdVTtCfHsL6Qc6LxV6). If you can't open them, the values below are complete.

## Part 1: eurth-style

A versioned package (@eurth/style), installed by every tool straight from GitHub ("github:eurth-org/eurth-style#semver:^1") and built into the tool. Nothing is loaded at runtime from another address.

It holds:
1. tokens.json, the single source, and a build that turns it into eurth.css: custom properties for both themes plus base styles for buttons, the Join Eurth pill, chips, inputs, cards, focus rings, tooltips and toasts.
2. Svelte 5 components and Astro wrappers for the shared shell: Header, Footer, Deluminator, ShareDialog with ShareButtons, Toast, OfflineNote, InstallButton, and the delight helpers.
3. The head script that sets the theme and the browser theme colour before the first paint.
4. tools.json: every tool (name, address, one-line pitch, launch date). The Tools menu, the footer and the hub read it and show only tools whose launch date has passed at build time, so a site never mentions a tool before its door opens.
5. HANDBOOK.md: the rules below, written for the chats that build each tool. Every tool brief says the handbook wins on shared matters, so make it complete.
6. A docs site at style.eurth.org: the components and the handbook, served as a Cloudflare Worker with static assets on its custom domain, like the tools. It's documentation only.
7. Release flow: semantic-versioned releases, and a reusable workflow every tool calls: a nightly scheduled run that updates @eurth/style within version 1, rebuilds, tests and deploys if anything changed. No tokens between repos. Version 1 releases must stay compatible; anything that would break a layout is version 2.

## Part 2: eurth-profile

The Eurth nation profile: one versioned JSON file (<nation>.eurth.json) that passes through every tool. Make the JSON Schema, TypeScript types, and a small library to read, validate, merge, download and load it (file picker and drag and drop), with tests and three example profiles.

Rules: each tool owns one section and leaves every other section untouched, including ones it doesn't know. Sections: meta (schema version, nation name, updated), identity (common name, official name, capital, demonym, motto, languages), flag (Flagwright link and SVG), arms, government (Governmint link and its summary), seats, names, stats, dynasty, calendar, timeline, bank, passport, rank, cities, anthem, wiki. Keep each section small and documented; a profile with only meta and one section is valid.

## The handbook (put all of this in HANDBOOK.md)

Stack and hosting
- Astro, static output, real HTML for every page; Svelte 5 for the interactive tool; TypeScript; Vitest; Node 22 or later. Same setup as Flagwright.
- Each tool is its own repo, eurth-org/eurth-<tool>, deployed as a Cloudflare Worker serving static assets on its custom domain (wrangler.jsonc, account that holds the eurth.org zone). A Worker script only where a tool truly needs one.
- GitHub Actions: check, build and test on every push and pull request; deploy main with CLOUDFLARE_API_TOKEN, an organisation secret set once for all eurth-org repos, skipping with a warning if it's missing. That's the only secret anywhere.
- Must run on the Cloudflare Workers Free plan and never cost money. Ask Stijn before adding anything that could bill.
- Each repo has README.md, CLAUDE.md, roadmap.md, docs/feedback-log.md and LICENSE (Apache 2.0).

Look
- Use only @eurth/style tokens: no local colours, fonts or spacing.
- Two themes: Night (dark, the forum's Solarized dark) and light.
- eurth-blue #2698d4 is the brand colour and never changes: logo disc, Join Eurth pill, top bar, brand fills. Labels on it are night #002b36, 19px bold or larger.
- Text, WCAG AAA. Dark: body parchment #fcf6e1 on night #002b36 (13.9:1), cards night-raised #0d353f, muted #bac1b5 (8.1:1), links #80c8e5 (8.1:1). Light: body charcoal #222222 on white, muted #545454 (7.6:1), links #12577b (7.9:1). Control borders #798c88 dark and #646464 light.
- Type: the device's own fonts, nothing downloaded. system-ui, Arial, sans-serif for everything; ui-monospace, Menlo, monospace for code, data and exports. No serif. Headlines are bold.
- Flat: no gradients or glows. Radius 12px for pills and cards, 2px for small swatches. The yurt mark is the only brand pictogram; never redraw the logo.
- Icons: Font Awesome Free (solid and brands), imported per icon as SVG; line-md for animated icons (the Deluminator's sun and moon).

Shell (from @eurth/style; never rebuilt per tool)
- Header: "Skip to the content" link; the yurt, the tool's name and "by Eurth", linking to the tool's start; the tool's own pages (for example Maker, Guide, Glossary, Templates); a Tools menu from tools.json; the Deluminator; the Join Eurth pill. Tool actions (Random, Simple/Advanced) live in the tool's own toolbar.
- Footer: links from tools.json plus Forums, Map, News and Status; "Made by Orioni for Eurth, a worldbuilding and roleplay community since 2004" plus the tool's own inspirations; "Free forever: no ads, no analytics, trackers, cookies or accounts. Made for fiction and fun."; icon attribution (Font Awesome CC BY 4.0, line-md MIT); "© 2026 Eurth", Apache 2.0, and from 25 December the GitHub link (before then, no page links to GitHub). No donation links. The footer's hearts beat a few times when it comes into view.
- Deluminator: Auto, Light, Dark, cycling as in Governmint. Theme set by the head script before first paint (no white flash); the circular reveal from the switch drawn by CSS from the first frame (no flash while switching); line-md icons drawing themselves; still icons and an instant switch for reduced motion; without script, CSS follows the device.

Privacy: nothing stored
- No cookies, localStorage, sessionStorage or IndexedDB; no analytics; no accounts; no third-party requests of any kind.
- The theme, sound and motion switches last for the visit only. Every visit starts on Auto, sound off, motion as the device asks.
- A design lives in its link: the whole state encoded compactly and versioned in the URL, in the query string so a Worker could read it. Big designs also save and load as the profile file. "Save" never means browser storage.
- The service worker's cache of the app's own files is the only thing kept on a device.
- Security headers as Flagwright's public/_headers (strict Content-Security-Policy with script hashes, frame-ancestors allowing eurth.org), tested.

Accessibility: WCAG 2.2 AAA wherever it can be met
- Contrast as above, tested in CI for both themes (move Flagwright's contrast test into @eurth/style).
- Keyboard for everything, visible 2px focus ring, targets at least 44 by 44px.
- Never colour alone: always a word or an icon. Several users are red-green colour blind; colours that must be told apart differ in lightness.
- A written description of every result ("Copy description"), for screen readers and sharing.
- Automated accessibility checks (axe) on every page in CI.

SEO, to be the reference
- Pages per tool: the maker, a guide (the subject explained well, with sources and a last-updated date), a glossary and templates or examples, linked to each other, the hub and eurth.org.
- Title pattern "<Name>: free online <thing> maker for worldbuilders"; unique description and canonical link on every page.
- JSON-LD: WebApplication on the maker (free, runs in the browser), BreadcrumbList on guides, DefinedTermSet on glossaries, Organization for Eurth.
- sitemap.xml, robots.txt, llms.txt.
- Lighthouse 100 in all four categories; Core Web Vitals "good": LCP under 2.5 s, INP under 200 ms, CLS under 0.1.

Sharing
- Open Graph image 1200 x 630 PNG with alt text for every page, plus twitter:card summary_large_image.
- Image downloads where a tool makes a picture: link preview 1200 x 630, square 1080 x 1080, portrait 1080 x 1350, story 1080 x 1920, pin 1000 x 1500, wide 1600 x 900; SVG, PNG and WebP where it fits.
- Copy link (with the paper plane), Copy picture, Copy description, and the Share dialog: Eurth forum (new topic, pre-filled), Reddit, Bluesky, X, Facebook, LinkedIn, Tumblr, WhatsApp, Telegram, Email, and the device's share sheet. Plain links only.

Offline and install
- Service worker as Flagwright's: content-hashed files cache-first, pages network-first with the cached copy as fallback, old versions cleared.
- Web manifest: name, 192 and 512px icons (one maskable), both theme colours, display standalone.
- Install button where the browser offers it; a short how-to for iPhone (Add to Home Screen).
- Offline note: "No signal: <Tool> keeps working from the copy on this device." and "Back online."

Delight
- One signature touch per tool, like Governmint's coin clink and paper plane; buttons answer clicks (bounce, spin, swing, pop); toasts in the tool's voice.
- At least one easter egg per tool. Suite-wide, in @eurth/style: the Konami code sends an emu across the footer; "Nice." when a number settles on 69; the seasonal yurt on the design kit's dates.
- Under half a second, never blocking input, sound off until switched on, nothing for reduced motion.

Launch: the advent calendar (10 to 24 December, one door a day at 00:00 Europe/Brussels)
- Repos are public from the start; the code isn't secret, the sites are. Until its door opens, a tool's site doesn't exist: no custom domain, no workers.dev deploy, and no other site mentions it. Develop and preview locally (wrangler dev).
- Each README opens with a friendly note: this tool is part of Eurth's advent calendar, so please don't spoil the surprise before its door opens.
- Each tool has a launch workflow on a schedule: on the evening before its door (22:30 UTC, 23:30 in Brussels) it builds, waits until the door's time (the LAUNCH_AT value in the repo, an ISO time in Europe/Brussels) and deploys to production, which creates the custom domain. It also runs by hand (workflow_dispatch) as a fallback, because GitHub can start scheduled runs late. The hub's nightly rebuild works the same way.
- Nothing anywhere relies on the visitor's clock to hide anything.

Writing
- British English. Sentence case for headings, Title Case for names, the staff voice: plain, warm, a dry joke allowed (never in errors or safety text). No emoji in the interface.

Free limits
- GitHub: every repo is public, so standard Actions minutes are free. Still keep CI lean (npm caching, Lighthouse and axe on main), and keep the organisation's Actions spending limit at $0.
- Cloudflare Workers Free: 100 Workers, 5 Cron Triggers, 100,000 Worker requests a day and 10 ms of CPU per request for the whole account; static assets are free and unlimited. So every tool is static assets only unless its brief says otherwise.

Done, for every tool
- Every handbook rule met; CI green; deployed to its address; Lighthouse and axe checks passing; README explains use, development and deployment; roadmap.md lists what's next; the tool is in tools.json.

## Done for this chat
- @eurth/style v1.0.0 released with tokens, CSS, components, head script, tools.json, HANDBOOK.md and the release and dispatch workflows.
- @eurth/profile v1.0.0 released with schema, types, library, tests and examples.
- style.eurth.org live with the components in both themes and the handbook.
- A starter template (a minimal tool using both packages, passing every check) that the other chats copy.

Ask me before you: spend money, change DNS beyond a custom domain, or change anything in eurth-flag or eurth-government.
