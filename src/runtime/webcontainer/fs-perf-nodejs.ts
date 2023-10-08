import { getMeasureFsPerformanceCode } from '../measure-fs-performance.js';

import { initWebContainer } from './webcontainer.js';

export const fsPerfNodejs = async () => {
  const webContainer = await initWebContainer();
  const jsFilePath = 'measure-fs-perf.mjs';
  const { code, resultFilePath } = getMeasureFsPerformanceCode();
  await webContainer.fs.writeFile(jsFilePath, code);

  const cmd = await webContainer.spawn('node', [jsFilePath]);

  // Uncomment the following for debugging
  /*
    const reader = cmd.output.getReader()
    while (true) {
      const a = await reader.read()
      if (a.done) break
      console.log(a.value)
    }
  */

  const exitCode = await cmd.exit;
  if (exitCode !== 0) throw new Error('exit code was ' + exitCode);
  const { elapsedTime } = JSON.parse(
    await webContainer.fs.readFile(resultFilePath, 'utf-8'),
  );
  return {
    elapsedTime,
  };
};
