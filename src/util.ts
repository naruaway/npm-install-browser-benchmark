export const finishNpmInstall = (): void => {
  const result = { performanceNow: performance.now() };
  globalThis.NPM_IN_BROWSER_BENCHMARK_ON_FINISH_NPM_INSTALL?.(result);
  const codeElm = document.createElement('code');
  codeElm.style.fontFamily = 'monospace';
  const preElm = document.createElement('pre');
  preElm.appendChild(codeElm);
  preElm.style.margin = '32px';
  codeElm.textContent = JSON.stringify(result, null, 2);
  document.body.appendChild(preElm);
};
