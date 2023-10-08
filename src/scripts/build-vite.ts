import { globbySync } from 'globby';
import { $ } from 'zx';
import * as fs from 'node:fs';

const htmlEntries = globbySync(['./entries/**/*.html']);

fs.rmSync('./dist', { recursive: true, force: true });

// Running Vite multiple times rather than using mutiple entry points in one build to avoid interferences between entry points.
// For example, sharing chunks across entrypoints can surface bugs like https://github.com/naruaway-sandbox/rollup-side-effectful-imports-order-broken-demo?preview

for (const htmlEntry of htmlEntries) {
  process.env.VITE_HTML_ENTRY_FILEPATH = htmlEntry;

  if (htmlEntry.includes('npm-install--heavy')) {
    process.env.VITE_PKG_MOD_ALIAS = './src/runtime/pkgs-heavy.ts';
  } else {
    process.env.VITE_PKG_MOD_ALIAS = './src/runtime/pkgs.ts';
  }

  await $`./node_modules/.bin/vite build`;
}
