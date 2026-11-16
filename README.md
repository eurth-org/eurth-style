# Eurth style

> A friendly note: this is part of Eurth's advent calendar, and the doors open from 10 December. Please don't spoil the surprise before then.

`@eurth/style` is the shared look and shell of [Eurth](https://eurth.org)'s free worldbuilding tools: the tokens, the stylesheet, the header and footer, the Deluminator theme switch, sharing, offline, the delights, and the rules that hold it together. Every tool installs it and builds it in, so the suite looks and behaves as one.

- **The rules:** [HANDBOOK.md](HANDBOOK.md). On anything the tools share, the handbook wins.
- **The components and tokens, live:** [style.eurth.org](https://style.eurth.org).
- **What's next and what each release added:** [roadmap.md](roadmap.md).

## Use

A tool installs it straight from GitHub, with the nation profile beside it:

```json
"@eurth/style": "github:eurth-org/eurth-style#semver:^1",
"@eurth/profile": "github:eurth-org/eurth-profile#semver:^1"
```

Nothing is built on install (the built files are committed) and nothing is loaded at run time from another address. To begin a tool, copy [`starter/`](starter/): it is the smallest tool that passes every check, and the handbook's "Start here" walks through it.

| Import | What it is |
| --- | --- |
| `@eurth/style/components/Page.astro` | The layout of every page: head, header, footer, offline note. |
| `@eurth/style/components/*.svelte` | `ShareButtons`, `ShareDialog`, `Deluminator`, `InstallButton`, `OfflineNote`, `Toast`, `VisitSwitches`, `Icon`. `Fa.astro` for icons in Astro files. |
| `@eurth/style` | For browser code: `toast`, `niceWatcher`, `playTones`, the link state (`encodeState`, `stateLink`…), this visit's choices (`getPrefs`, `setPrefs`), `svgToPicture`, `pictureFilename`, `download`, `contrast`, `resolveColors`. |
| `@eurth/style/build` | Build time only: `defineSite`, `launchedTools`, `ref`, and the structured-data builders. |
| `@eurth/style/astro` | `eurth(site)`: the Astro integration. |
| `@eurth/style/testing` | `standardSuites({ site })`: the checks every tool runs. |
| `@eurth/style/images` | `makeImages`, `sharingImage`: icons and sharing images, made with Chrome. |
| `@eurth/style/eurth.css` | The stylesheet (`Page.astro` already includes it). |
| `@eurth/style/tokens.json`, `tools.json` | The tokens; every tool with its launch date. |
| `npx eurth-axe` | Accessibility checks on every built page, in both themes. |
| `npx eurth-smoke` | The built site in real Chrome under its real headers: theme, nothing stored, offline. |

A picture is drawn with `svgToPicture()`, named with `pictureFilename()` and saved with `download()`. The name comes from the picture itself, because a browser that can't make WebP (Safari) gives a PNG instead without saying so:

```js
const picture = await svgToPicture(svg, { width: 1200, height: 630, type: 'image/webp' });
const file = pictureFilename('orioni-flag', picture, 'image/webp'); // { filename, type, note }
download(picture, file.filename); // "orioni-flag.webp", or "orioni-flag.png" in Safari
if (file.note) toast(file.note); // "This browser can’t make WebP pictures, so this one is a PNG."
```

## What's where

- `tokens.json`: the single source for colour, type, spacing and corners, in the Eurth design kit's shape.
- `src/css/`: the base styles. `build/build.mjs` joins them to the tokens as `dist/eurth.css`.
- `src/components/`: the shell and its parts. `src/*.js`: everything else, as plain JavaScript with types in `dist/types/`.
- `tools.json`: every tool, its address, pitch and launch date.
- `site/`: the docs site, style.eurth.org. `starter/`: the template for a new tool.
- `.github/workflows/tool-*.yml`: the workflows every tool calls.

## Development

Node 22 or later (CI uses 26).

```sh
npm install
npm run build        # tokens.json and src/css -> dist/eurth.css, src/generated.js, dist/types
npm run check        # types, for the package and the docs site
npm run site:build   # the docs site, into site/dist
npm test             # the package, and the built docs site
npm run site:axe     # accessibility, the docs site
npm run site:smoke   # the docs site in real Chrome, served with its real headers
npm run starter      # the starter as a tool would use it: install, check, build, test, axe, smoke
npm run site:dev     # the docs site while you work
```

`dist/` and `src/generated.js` are committed, because tools install from GitHub with no build step: run `npm run build` and commit the result with any change to `tokens.json` or `src/css`. CI fails if they are stale.

`npm run api:accept` records a change to the public surface (a new export, prop, class or custom property). Something gone from that list is a breaking change, and that is version 2: version 1 releases stay compatible, because every tool updates to the newest 1.x by itself each night.

## Deployment

The docs site runs as the `eurth-style` Worker (static assets only) on the Cloudflare account that holds the eurth.org zone; the custom domain in `site/wrangler.jsonc` owns the `style.eurth.org` DNS record. GitHub Actions deploys every push to `main` that passes, and rebuilds the site each night so its Tools menu follows the launch dates. Deploying uses the organisation secret `CLOUDFLARE_API_TOKEN`; without it the step is skipped with a warning.

## Releasing

1. In the same commits as the work, update [roadmap.md](roadmap.md): move finished items out of Next, and add or extend the release's dated section.
2. `npm run build`, `npm run site:build`, `npm run check`, `npm test`, `npm run site:axe`, `npm run site:smoke`, `npm run starter`.
3. Bump the version in `package.json`, merge to `main`, and push a tag `vX.Y.Z`. The release workflow checks once more, publishes the GitHub release and moves the `v1` tag that the tools' workflows call. Tools pick the release up on their next nightly run.

## Credits

- The Deluminator follows [Deluminator](https://github.com/stijn/deluminator) as Governmint and Flagwright use it.
- Icons by [Font Awesome](https://fontawesome.com) Free (CC BY 4.0); sun and moon by [line-md](https://github.com/cyberalien/line-md) (MIT).
- Made by Orioni for Eurth, a worldbuilding and roleplay community since 2004.

## Licence

Apache 2.0, see [LICENSE](LICENSE).
