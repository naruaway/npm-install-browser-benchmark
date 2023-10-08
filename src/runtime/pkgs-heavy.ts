export const npmInstallPkgs = [
  { name: 'typescript', version: '5.2.2' },
  { name: 'webpack', version: '5.88.2' },
  { name: '@babel/core', version: '7.23.0' },
  { name: 'next', version: '13.5.4' },
];

export const verifyNpmInstalledState = async (
  fs: { readFile: (filePath: string, encoding: 'utf-8') => Promise<unknown> },
  cwd?: string,
) => {
  const pkgJsonPath = 'node_modules/typescript/package.json';
  const pkgJson = JSON.parse(
    (await fs.readFile(
      cwd ? `${cwd}/${pkgJsonPath}` : pkgJsonPath,
      'utf-8',
    )) as string,
  );
  if (pkgJson.name !== 'typescript') {
    throw new Error('pkgJson is broken');
  }
};
