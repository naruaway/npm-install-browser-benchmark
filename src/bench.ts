import puppeteer from 'puppeteer';
import * as z from 'zod';
import * as fs from 'node:fs';

const npmInstall = [
  {
    name: 'nodebox',
  },
  {
    name: 'npm-in-browser--myfs',
  },
  {
    name: 'npm-in-browser',
  },
  {
    name: 'webcontainer',
  },
];

const targetUrl = 'https://npm-install-browser-benchmark.nry.app';

const runNpmInstallBenchmark = async (
  target: (typeof npmInstall)[number],
  count: number,
  variant: 'light' | 'heavy',
) => {
  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();

  console.log(`Running npm-install benchmark for ${target.name}`);

  const run = async () => {
    const url = `${targetUrl}/entries/npm-install${
      variant === 'heavy' ? '--heavy' : ''
    }/${target.name}`;
    console.log(`Visiting ${url}`);
    await page.goto(url);

    const result = z
      .object({ performanceNow: z.number() })
      .strict()
      .parse(
        await page.evaluate(
          () =>
            new Promise((resolve) => {
              // @ts-expect-error
              globalThis.NPM_IN_BROWSER_BENCHMARK_ON_FINISH_NPM_INSTALL =
                resolve;
            }),
        ),
      );

    return result.performanceNow;
  };

  const performanceNowList: number[] = [];
  for (let i = 0; i < count; i++) {
    performanceNowList.push(await run());
  }
  await browser.close();
  return performanceNowList;
};

const runAllNpmInstallBenchmarks = async (
  variant: 'light' | 'heavy',
  onLog: (logItem: unknown) => void,
) => {
  for (let i = 0; i < 100; i++) {
    const items = [];
    for (const target of npmInstall) {
      const durations = await runNpmInstallBenchmark(target, 6, variant);
      console.log(variant, i, target.name, durations);
      items.push({
        name: target.name,
        durations,
        time: Date.now(),
      });
    }
    onLog({ items });
  }
};

const createJsonLinesLogger = (filePath: string) => {
  return (logData: unknown) => {
    fs.appendFileSync(filePath, JSON.stringify(logData) + '\n');
  };
};

await runAllNpmInstallBenchmarks(
  'light',
  createJsonLinesLogger('./results/npm-install.jsonl'),
);
await runAllNpmInstallBenchmarks(
  'heavy',
  createJsonLinesLogger('./results/npm-install-heavy.jsonl'),
);
