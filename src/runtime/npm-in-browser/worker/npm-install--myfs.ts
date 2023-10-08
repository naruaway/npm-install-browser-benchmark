import { runNpmCli } from 'npm-in-browser';

import { npmInstallPkgs, verifyNpmInstalledState } from '@@/pkgs';

const cwd = '/home/web/app';

import { fs } from './myfs/fs.js';

await runNpmCli(
  ['install', ...npmInstallPkgs.map((pkg) => `${pkg.name}@${pkg.version}`)],
  {
    fs,
    cwd,
    stdout: (chunk) => {
      console.log('stdout', chunk);
    },
    stderr: (chunk) => {
      console.log('stderr', chunk);
    },
    timings: {
      start(name) {
        console.log('START: ' + name);
      },
      end(name) {
        console.log('END: ' + name);
      },
    },
  },
);

await verifyNpmInstalledState(fs.promises, cwd);
self.postMessage('FINISHED');
