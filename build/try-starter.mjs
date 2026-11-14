// Proves the starter the way a tool would use it: copies starter/ somewhere else, installs
// @eurth/style (and @eurth/profile) as packed tarballs, exactly what a tool gets from GitHub,
// then checks, builds, tests, and runs the accessibility checks and the real-browser smoke test.
//   node build/try-starter.mjs [folder] [--no-axe] [--keep]
// @eurth/profile comes from ../eurth-profile when that checkout exists, else from GitHub.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);
const target = resolve(args.find((a) => !a.startsWith('--')) ?? mkdtempSync(join(tmpdir(), 'eurth-starter-')));
const run = (cmd, argv, cwd) => execFileSync(cmd, argv, { cwd, stdio: 'inherit', env: { ...process.env, npm_config_fund: 'false', npm_config_audit: 'false' } });
const pack = (dir) => {
  const out = execFileSync('npm', ['pack', '--pack-destination', target, '--silent'], { cwd: dir, encoding: 'utf8' }).trim().split('\n').pop();
  return `file:${join(target, out)}`;
};

mkdirSync(target, { recursive: true });
for (const stale of ['src', 'tests', 'tools', 'public', 'dist', '.astro']) rmSync(join(target, stale), { recursive: true, force: true });
cpSync(join(root, 'starter'), target, { recursive: true, filter: (from) => !/(^|\/)(node_modules|dist|\.astro|\.wrangler)(\/|$)/.test(from.slice(root.length)) });

const pkg = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
pkg.dependencies['@eurth/style'] = pack(root);
const profile = resolve(root, '../eurth-profile');
if (existsSync(join(profile, 'src/index.js'))) pkg.dependencies['@eurth/profile'] = pack(profile);
writeFileSync(join(target, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);
rmSync(join(target, 'package-lock.json'), { force: true });
rmSync(join(target, 'node_modules/@eurth'), { recursive: true, force: true });

console.log(`\ntry-starter: in ${target}\n`);
run('npm', ['install'], target);
run('npm', ['run', 'check'], target);
run('npm', ['run', 'build'], target);
run('npm', ['test'], target);
if (!args.includes('--no-axe')) {
  run('npx', ['--no-install', 'eurth-axe', 'dist'], target);
  run('npx', ['--no-install', 'eurth-smoke'], target);
}
console.log(`\ntry-starter: the starter passes${args.includes('--no-axe') ? ' (axe not run)' : ''}.`);
if (!args.includes('--keep') && !args.find((a) => !a.startsWith('--'))) rmSync(target, { recursive: true, force: true });
