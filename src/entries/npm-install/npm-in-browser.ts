import { npmInstall } from '../../runtime/npm-in-browser/npm-install.js';
import { finishNpmInstall } from '../../util.js';

await npmInstall();
finishNpmInstall();
