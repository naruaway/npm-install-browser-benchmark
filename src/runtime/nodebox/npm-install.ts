import { initNodebox } from './nodebox.js';
import { npmInstallPkgs, verifyNpmInstalledState } from '@@/pkgs';

export const npmInstall = async () => {
  const nodebox = await initNodebox();

  await nodebox.fs.init({
    'package.json': JSON.stringify({
      type: 'module',
      name: 'demo',
      private: true,
      dependencies: Object.fromEntries(
        npmInstallPkgs.map((pkg) => [pkg.name, pkg.version]),
      ),
    }),
  });

  const shell = nodebox.shell.create();

  // Somehow awaiting shell.runCommand makes sure that initial implicit "npm install" is complete...
  await shell.runCommand('non-existent-command-just-to-force-failure', []);
  await verifyNpmInstalledState(nodebox.fs);
};
