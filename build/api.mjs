// The public surface of @eurth/style, as one list: what tools may rely on through version 1.
//   node build/api.mjs            prints it
//   node build/api.mjs --accept   writes it to tests/api.snapshot.json
// tests/api.test.js compares the two. Something gone from the list is a breaking change, and
// that is version 2; something new is fine, and is accepted on purpose with --accept.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

export async function surface() {
  const css = read('dist/eurth.css');
  const pkg = JSON.parse(read('package.json'));
  const modules = {};
  for (const entry of ['index', 'build', 'astro/integration', 'testing/index', 'images']) {
    modules[entry] = Object.keys(await import(new URL(`src/${entry}.js`, root).href)).sort();
  }
  const components = {};
  for (const file of readdirSync(new URL('src/components', root)).sort()) {
    const source = read(`src/components/${file}`);
    const block = file.endsWith('.astro') ? /interface Props \{([\s\S]*?)\n\}/.exec(source)?.[1] : /let \{([\s\S]*?)\}\s*(?::\s*\{[\s\S]*?\})?\s*=\s*\$props\(\)/.exec(source)?.[1];
    const names = file.endsWith('.astro')
      ? [...(block ?? '').matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1])
      : [...(block ?? '').matchAll(/(?:^|,)\s*(\w+)(?=\s*(?:=|,|$))/g)].map((m) => m[1]);
    components[file] = [...new Set(names)].sort();
  }
  return {
    exports: Object.keys(pkg.exports).sort(),
    bin: Object.keys(pkg.bin).sort(),
    modules,
    components,
    classes: [...new Set([...css.matchAll(/\.(eu-[a-z0-9-]+)/g)].map((m) => m[1]))].sort(),
    properties: [...new Set([...css.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]))].sort(),
    attributes: [...new Set([...css.matchAll(/\[(data-[a-z-]+)/g)].map((m) => m[1]))].sort(),
    tools: JSON.parse(read('tools.json')).tools.map((tool) => tool.id).sort(),
  };
}

if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  const text = `${JSON.stringify(await surface(), null, 2)}\n`;
  if (process.argv.includes('--accept')) {
    writeFileSync(new URL('tests/api.snapshot.json', root), text);
    console.log('api: tests/api.snapshot.json written');
  } else console.log(text);
}
