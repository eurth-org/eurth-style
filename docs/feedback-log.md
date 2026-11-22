# Feedback log

Every numbered point from the reviews, and the release that did it. The releases themselves are in [roadmap.md](../roadmap.md).

| # | Asked for | Done |
| --- | --- | --- |
| 1 | The theme choice carried in `window.name`, for the visit only | 1.0.0 |
| 2 | Door order from the hub's board, with Cities fourth | 1.0.0 (`tools.json`) |
| 3 | Seasonal yurts as SVG, shown on the docs site for approval first; the Discord files left alone | 1.0.0 (only Pride is switched on) |
| 6 | The four other seasonal yurts switched on | 1.0.1 |
| 7 | Carry on with the roadmap: the smoke test in CI, the profile's schema at its address | 1.1.0 |
| 8 | Flagwright and Governmint onto the shared shell | Under way, on a `shared-shell` branch in each; what it turned up in this package went into 1.1.1 and 1.2.0 |
| 9 | A WebP download that Safari answers with a PNG is named `.png`, for every tool | 1.3.0 (`pictureFilename()`; each tool still has to call it) |
| 10 | Header: the big Join Eurth pill is too obvious; it belongs in the footer | 1.4.0 (in the blue bar at the foot of every page) |
| 11 | Footer: its text hugs the left edge on big screens, not the centred column | 1.4.0 (`eu-column`) |
| 12 | Icons: line-md was asked for, and hardly any were in use | 1.4.0 (`@eurth/style/line`, `Line`, used across the shell; each tool still has its own toolbar to do) |
| 13 | Random on every tool, red when pointed at, warning the first time only | 1.4.0 (`RandomButton.svelte`) |
| 14 | Subpages look basic; add pictures where relevant | 1.4.0 (`PageHead`, `Figure`, `Note`, `Toc`, the page classes, the starter's pages; each tool still has its own pages to do) |
| 15 | White labels on eurth-blue, as on the forum, on pages and on sharing cards | 1.4.0 (at 19px bold: AA for large text, the one exception to AAA) |
| 16 | A blue header with white buttons and blue labels, as on Governmint, Flagwright and eurth.org | 1.4.0 |
| 17 | Export and save: Markdown is often missing | 1.4.0 (`markdown` on `ShareButtons`, `markdownTable()`, a handbook rule; each tool still has its own exports to do) |
| 18 | Footer: "Orioni" links to the profile on eurth.org, not to iiwiki | 1.4.0 (`EURTH.orioni`) |
| 19 | A progress bar while scrolling, as Governmint has | 1.5.0 (the scroll line, on every page) |
| 20 | Settings grouped into sections: a shared ground, a bigger title with an icon, a number where it helps | 1.5.0 (`eu-card-title`, `eu-step`, `eu-count`, a handbook rule, the starter; each tool still has its own maker to do) |
| 21 | In-line links missing a space here and there, in Flagwright's footer and other tools | 1.5.0 (`compressHTML: true` in the integration, and a check in the Pages suite) |
| 22 | Footer bar icons differ between tools | 1.5.0 (they are set once in the shell since 1.4.0; the sites were on different versions) |
| 23 | The reworked Governmint is unacceptable: its perfected design, sticky navigation included, must never be replaced by a lesser one | 1.6.0 gives a live tool the means to keep its design (`scrollLine: false`, `eurth.axe`) and the handbook the rule; the restoring itself is on Governmint's branch |
| 24 | Header: the active pill white with a white outline and eurth-blue text; the others eurth-blue with a white outline and white text | 1.6.0 |
| 25 | The Markdown button uses the correct Markdown icon | 1.6.0 (`faMarkdown`) |
| 26 | Split the buttons for copying and for saving | 1.6.0 (a handbook rule and the starter; each tool has its own to do) |
| 27 | Active buttons are eurth-blue, everywhere | 1.6.0 (`--selected`, `--on-selected`) |
| 28 | Footer icons: Map always a globe, News a newspaper, Status a heart with a sparkline through it, as on Governmint | 1.6.1 |
| 29 | Flagwright too stays as it is live ("Keep it like it is in the first image") | 1.6.3 names it in the handbook; the restoring itself is on Flagwright's branch |
| 30 | Governmint's header: the gold coin in front of the name, still animated when pointed at; no Preview badge, no counter | 1.7.0 (the `mark` slot of `Page`); the rest is in Governmint |
| 31 | Governmint's two sections, "Save & share" and "Export", for all tools where it makes sense | 1.8.0 (`ExportPanel.svelte`, children on `ShareButtons`, a handbook rule, the starter; each tool has its own to do) |
| 32 | The share window with "More" is the gold standard | 1.8.0 (More is always there; the handbook names the suite's window as the only one) |
| 33 | Governmint and Flagwright have marks of their own that reuse the yurt; every tool should have a similar nod and wink | 1.8.0 (a handbook rule, `assets/eurth-yurt.svg`, `sharingImage({ mark })`, the starter's own mark; each tool has its own to draw) |
| 34 | The footer should open with "With thanks", as the original Governmint did, not with a row of links to the tools | 1.9.0 |
| 35 | "You've effectively ruined the Governmint header": the logo on one line and the buttons on the next is wasted space; they belong on the same line | 1.10.0 (`Page`'s `actions` slot, `--eu-gutter`); the rest is in Governmint |
| 36 | "How do we make sure all the other tools automatically apply the same updates?" Answer agreed: checks that fail until a tool has done its part, and an issue in each tool's repository | 1.11.0 (`adoptionSuite`, skipped on launch and nightly); issues opened on 22 November 2026 |
| 4 | style.eurth.org deployed through CI, showing only tools that have launched | 1.0.0 |
| 5 | Node 26 for building and in every CI workflow | 1.0.0 |
