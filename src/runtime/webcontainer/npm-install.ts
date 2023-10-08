import { initWebContainer } from './webcontainer.js';
import { npmInstallPkgs, verifyNpmInstalledState } from '@@/pkgs';

export const npmInstall = async () => {
  const webContainer = await initWebContainer();

  const npmInstall = await webContainer.spawn('npm', [
    'install',
    ...npmInstallPkgs.map((pkg) => `${pkg.name}@${pkg.version}`),
  ]);
  const exitCode = await npmInstall.exit;
  if (exitCode !== 0) throw new Error('exit code was ' + exitCode);
  await verifyNpmInstalledState(webContainer.fs);
};
