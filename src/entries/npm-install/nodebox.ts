import { npmInstall } from '../../runtime/nodebox/npm-install.js';
import { finishNpmInstall } from '../../util.js';

await npmInstall();
finishNpmInstall();
