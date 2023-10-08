// Generate "_headers" file for Cloudflare Pages

import { globbySync } from 'globby';
import * as fs from 'node:fs';

const targetPaths = globbySync(['./dist/entries/**/*.html'])
  .filter((p) => p.includes('webcontainer'))
  .map((p) => {
    return p.replace(/\.html$/, '').replace(/^\.\/dist/, '');
  });

const contents =
  targetPaths
    .flatMap((targetPath) => [
      targetPath,
      '  cross-origin-opener-policy: same-origin',
      '  cross-origin-embedder-policy: require-corp',
    ])
    .join('\n') + '\n';

fs.writeFileSync('./dist/_headers', contents);
