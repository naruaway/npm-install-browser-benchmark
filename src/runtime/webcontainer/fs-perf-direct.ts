import { measureFsPerformance } from '../measure-fs-performance.js';

import { initWebContainer } from './webcontainer.js';

export const fsPerfDirect = async () => {
  const webContainer = await initWebContainer();
  const elapsedTime = await measureFsPerformance(webContainer.fs);
  return { elapsedTime };
};
