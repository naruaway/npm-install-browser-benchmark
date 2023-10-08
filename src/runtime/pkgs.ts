export const npmInstallPkgs = [
  { name: 'react-dom', version: '18.2.0' },
  { name: 'react', version: '18.2.0' },
  { name: 'zod', version: '3.22.2' },
  { name: 'framer-motion', version: '10.16.4' },
];

export const verifyNpmInstalledState = async (
  fs: { readFile: (filePath: string, encoding: 'utf-8') => Promise<unknown> },
  cwd?: string,
) => {
  const pkgJsonPath = 'node_modules/react/package.json';
  const pkgJson = JSON.parse(
    (await fs.readFile(
      cwd ? `${cwd}/${pkgJsonPath}` : pkgJsonPath,
      'utf-8',
    )) as string,
  );
  if (pkgJson.name !== 'react') {
    throw new Error('pkgJson is broken');
  }
};
