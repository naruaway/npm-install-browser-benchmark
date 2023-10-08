import { npmInstall } from '../../runtime/webcontainer/npm-install.js';
import { finishNpmInstall } from '../../util.js';

await npmInstall();
finishNpmInstall();
