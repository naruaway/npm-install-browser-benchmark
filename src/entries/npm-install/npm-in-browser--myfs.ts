import { npmInstall } from '../../runtime/npm-in-browser/npm-install--myfs.js';
import { finishNpmInstall } from '../../util.js';

await npmInstall();
finishNpmInstall();
