import { measureFsPerformance } from '../measure-fs-performance.js';

import { initNodebox } from './nodebox.js';

export const fsPerfDirect = async () => {
  const nodebox = await initNodebox();

  const elapsedTime = await measureFsPerformance(nodebox.fs);
  return { elapsedTime };
};
