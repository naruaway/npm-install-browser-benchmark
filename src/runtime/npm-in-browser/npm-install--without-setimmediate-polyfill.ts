export const npmInstall = async () => {
  const worker = new Worker(
    new URL(
      './worker/npm-install--without-setimmediate-polyfill.ts',
      import.meta.url,
    ),
    { type: 'module' },
  );

  await new Promise<void>((resolve, reject) => {
    worker.addEventListener(
      'message',
      (ev) => {
        if (ev.data === 'FINISHED') {
          worker.terminate();
          resolve();
        } else {
          reject(new Error('worker error'));
        }
      },
      { once: true },
    );
  });
};
