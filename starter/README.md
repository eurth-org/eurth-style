# Starter

> A friendly note: this tool is part of Eurth's advent calendar, so please don't spoil the surprise before its door opens.

Starter is the smallest [Eurth](https://eurth.org) tool that passes every check: a motto plate maker, with the four pages every tool has. It is never deployed. Copy this folder to begin a new tool, then rewrite this README for it: what the tool does, how to use it, how to develop and deploy it.

The rules are in the handbook, [`node_modules/@eurth/style/HANDBOOK.md`](https://style.eurth.org/handbook/). On anything the tools share, the handbook wins.

## Use

Open the maker, name your nation, give it a motto. Copy the link (it holds the whole design), the picture or the description, or save your nation's profile file to carry it to the next Eurth tool. Nothing is stored in the browser.

## Development

Node 22 or later.

```sh
npm install          # then commit package-lock.json
npm run dev          # the site while you work
npm run check        # types
npm run build        # the static site, into dist/
npm test             # the tool's own tests and the suite's checks (they read dist/)
npm run axe          # accessibility: every page, both themes
npm run smoke        # the built site in real Chrome: theme, nothing stored, offline
npm run preview      # the built site with its real headers (wrangler dev)
npm run images       # icons and the sharing image, after changing them
```

- `eurth.config.mjs`: the tool's name, address, title and pages. Build time only.
- `src/tool/model.ts`: the tool's logic, free of the page. `src/tool/Maker.svelte`: the tool itself.
- `src/pages/`: the maker, the guide, the glossary, the templates and the 404 page.
- `tests/shell.test.js`: the checks every tool runs. `tests/model.test.ts`: this tool's own.
- `LAUNCH_AT`: the moment the door opens.

## Deployment

The site runs as a Cloudflare Worker serving static assets on its custom domain (`wrangler.jsonc`). Until the door opens it isn't deployed anywhere. The launch workflow opens the door at the time in `LAUNCH_AT`; after that, GitHub Actions deploys every push to `main` that passes, and a nightly run keeps `@eurth/style` up to date. Deploying uses the organisation secret `CLOUDFLARE_API_TOKEN`.

What's planned and what each release added is in the [roadmap](roadmap.md).

## Licence

Apache 2.0, see [LICENSE](LICENSE).
