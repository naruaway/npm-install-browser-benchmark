import * as fs from 'node:fs';
import { globby } from 'globby';
import * as path from 'node:path';

const entriesDir = './src/entries';

const entries = (await globby([`${entriesDir}/**/*.ts`])).map((e) =>
  e.slice(entriesDir.length + 1),
);

const html = (scriptSrc: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <link rel="icon" href="data:image/x-icon;base64,AA">
  <script type="module" src="${scriptSrc}"></script>
</head>
<body>
</body>
</html>
`;

for (const entryFileName of entries) {
  const filePath = `./entries/${entryFileName.replace(/\.ts$/, '')}.html`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, html(`/src/entries/${entryFileName}`));
}

await fs.promises.cp(
  './entries/npm-install/',
  './entries/npm-install--heavy/',
  { recursive: true },
);
