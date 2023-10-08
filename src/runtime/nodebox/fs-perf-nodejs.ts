import { getMeasureFsPerformanceCode } from '../measure-fs-performance.js';

import { initNodebox } from './nodebox.js';

export const fsPerfNodejs = async (): Promise<{ elapsedTime: number }> => {
  const nodebox = await initNodebox();

  const shell = nodebox.shell.create();
  const jsFilePath = 'measure-fs-perf.mjs';
  const { code, resultFilePath } = getMeasureFsPerformanceCode();
  await nodebox.fs.writeFile(jsFilePath, code);
  await shell.runCommand('node', [jsFilePath]);
  return new Promise((resolve, reject) => {
    shell.on('exit', async (exitCode) => {
      if (exitCode === 0) {
        const { elapsedTime } = JSON.parse(
          await nodebox.fs.readFile(resultFilePath, 'utf-8'),
        );
        resolve({
          elapsedTime,
        });
      } else {
        reject(new Error('exit code ' + exitCode));
      }
    });
  });
};
