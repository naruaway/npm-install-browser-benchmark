import { WebContainer } from '@webcontainer/api';
//import type { Runtime } from './types.js'

//import { measureFsPerformance, getMeasureFsPerformanceCode } from './measure-fs-performance.js'

export const initWebContainer = async (): Promise<WebContainer> => {
  return await WebContainer.boot();
};

//export const runWebContainer = async (): Promise<Runtime> => {
//  const webContainer = await WebContainer.boot();
//
//  return {
//    async npmInstall(pkgs, verifyFs) {
//      const npmInstall = await webContainer.spawn("npm", ["install", ...pkgs.map(pkg => `${pkg.name}@${pkg.version}`)]);
//      const exitCode = await npmInstall.exit
//      if (exitCode !== 0) throw new Error('exit code was ' + exitCode)
//      await verifyFs(webContainer.fs)
//    },
//    measureFsPerformance: {
//      async direct() {
//        const elapsedTime = await measureFsPerformance(webContainer.fs)
//        return { elapsedTime }
//      },
//      async nodejs() {
//        const jsFilePath = "measure-fs-perf.mjs"
//        const { code, resultFilePath } = getMeasureFsPerformanceCode()
//        await webContainer.fs.writeFile(jsFilePath, code)
//
//        const cmd = await webContainer.spawn("node", [jsFilePath]);
//        //const reader = cmd.output.getReader()
//        //while (true) {
//        //  const a = await reader.read()
//        //  if (a.done) break
//        //  console.log(a.value)
//        //}
//        const exitCode = await cmd.exit
//        if (exitCode !== 0) throw new Error('exit code was ' + exitCode)
//        const { elapsedTime } = JSON.parse(await webContainer.fs.readFile(resultFilePath, 'utf-8'))
//        return {
//          elapsedTime
//        }
//      }
//    }
//  }
//}
