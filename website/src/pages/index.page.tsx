import resultsRaw from '../../../results/npm-install.json';
import resultsHeavyPkgsRaw from '../../../results/npm-install--heavy.json';
import { npmInstallPkgs } from '../../../src/runtime/pkgs.js';
import { npmInstallPkgs as npmInstallPkgsHeavy } from '../../../src/runtime/pkgs-heavy.js';
import * as constants from '../constants.js';

const npmInstallCmd = `npm install ${npmInstallPkgs
  .map((pkg) => `${pkg.name}@${pkg.version}`)
  .join(' ')}`;

const npmInstallCmdHeavy = `npm install ${npmInstallPkgsHeavy
  .map((pkg) => `${pkg.name}@${pkg.version}`)
  .join(' ')}`;

import * as d3 from 'd3-array';
import type { ReactNode } from 'react';

import * as v from 'valibot';

const nf = new Intl.NumberFormat('en-US');

const formatNumber = (n: number): string => nf.format(n);

const Results = v.array(
  v.object({
    name: v.string(),
    durations: v.array(v.number()),
    time: v.number(),
  }),
);

const processNpmInstallResults = (raw: unknown) => {
  const results = v.parse(Results, raw);
  const coldStart: Record<string, number[]> = Object.fromEntries(
    results.map((r) => [r.name, []]),
  );
  const warmStart: Record<string, number[]> = Object.fromEntries(
    results.map((r) => [r.name, []]),
  );

  for (const r of results) {
    coldStart[r.name].push(r.durations[0]);
  }
  for (const r of results) {
    warmStart[r.name].push(...r.durations.slice(1));
  }
  return {
    coldStart,
    warmStart,
  };
};

const Durations = (props: { maxDuration: number; durations: number[] }) => {
  const widthInPercentage = (value: number) =>
    `${((value * 0.95 * 100) / props.maxDuration).toFixed(2)}%`;
  const median = d3.median(props.durations)!;
  const mean = d3.mean(props.durations)!;
  const stddev = d3.deviation(props.durations)!;
  const num = (n: number) => formatNumber(Math.round(n));
  return (
    <div>
      <div className="text-slate-600">
        <span className="text-emerald-600">median: {num(median)} ms</span>,
        mean: {num(mean)} ms, stddev: {num(stddev)} ms
      </div>
      <div className="relative m-3 h-[20px]">
        {props.durations.map((d, i) => (
          <div
            key={i}
            className="absolute w-[4px] h-[4px] bg-[black]/10"
            style={{ top: 8, left: widthInPercentage(d) }}
          />
        ))}
        <div
          className="absolute w-[2px] h-[16px] bg-emerald-500/90"
          style={{ top: 2, left: widthInPercentage(median) }}
        />
      </div>
    </div>
  );
};

const npmInstallResults = {
  smallFrontendPackages: processNpmInstallResults(resultsRaw),
  heavyBuildPackages: processNpmInstallResults(resultsHeavyPkgsRaw),
};

const H1 = ({ children }: { children: ReactNode }) => (
  <h1 className="mb-3 font-bold text-2xl">{children}</h1>
);
const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-3 font-bold text-xl border-b pb-1">{children}</h2>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-3">{children}</p>
);

const convertStrategyName = (name: string): string => {
  if (name === 'nodebox') {
    return 'Nodebox';
  } else if (name === 'webcontainer') {
    return 'WebContainer';
  } else if (name === 'npm-in-browser') {
    return 'npm-in-browser with memfs';
  } else if (name === 'npm-in-browser--myfs') {
    return 'npm-in-browser with custom-fs';
  }
  throw new Error('unknown name: ' + name);
};

const NpmInstallBenchmark = ({
  result,
}: {
  result: (typeof npmInstallResults)[keyof typeof npmInstallResults];
}) => {
  const maxDuration = Math.max(
    ...[result.coldStart, result.warmStart].flatMap((r) =>
      Object.values(r).flat(),
    ),
  );
  return (
    <div className="space-y-3">
      <div>
        <h4 className="mb-3 font-bold">Cold startup time</h4>
        <p className="mb-3">
          Time to finish "npm install" since visiting the page, without browser
          cache. This should approximates the experience for first-time
          visitors.
        </p>
        <div className="border p-2 rounded-md">
          {Object.entries(result.coldStart).map(([name, durations]) => (
            <div key={name}>
              <div className="font-bold text-slate-800">
                {convertStrategyName(name)}
              </div>
              <Durations durations={durations} maxDuration={maxDuration} />
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-bold">Warm startup time</h4>
        <p className="mb-3">
          Time to finish "npm install" since reloading the page. For the most of
          files, browser cache should be used. This should approximates the
          experience for revisitors.
        </p>
        <div className="border p-2 rounded-md">
          {Object.entries(result.warmStart).map(([name, durations]) => (
            <div key={name}>
              <div className="font-bold text-slate-800">
                {convertStrategyName(name)}
              </div>
              <Durations durations={durations} maxDuration={maxDuration} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InlineCode = ({ children }: { children: ReactNode }) => (
  <code className="bg-slate-100 py-[2px] px-2 rounded">{children}</code>
);

const ExternalLink = (props: { href: string; children: ReactNode }) => (
  <a
    href={props.href}
    target="_blank"
    className="text-cyan-600 hover:underline"
  >
    {props.children}
  </a>
);

export const Page = () => {
  return (
    <div className="my-6 space-y-5 max-w-[900px] mx-auto px-3">
      <div className="">
        <H1>{constants.title}</H1>
        <P>
          Creating an in-browser tool to deal with a node_modules file tree such
          as "running Webpack in browser" often requires essentially running
          "npm install" in browser. This benchmark is to compare that
          performance across alternatives, which is{' '}
          <ExternalLink href="https://webcontainers.io">
            WebContainer
          </ExternalLink>{' '}
          (by StackBlitz),{' '}
          <ExternalLink href="https://sandpack.codesandbox.io/docs/advanced-usage/nodebox">
            Nodebox
          </ExternalLink>{' '}
          (by CodeSandBox), and{' '}
          <ExternalLink href="https://github.com/naruaway/npm-in-browser">
            npm-in-browser
          </ExternalLink>
          .
        </P>
        <P>
          I (<ExternalLink href="https://naruaway.com">Naru</ExternalLink>)
          built npm-in-browser as an open-source alternative way to run "npm
          install" in browser without relying on black-box runtime / CDN and
          wanted to see whether it's practical to be used for creating tools
          such as{' '}
          <ExternalLink href="https://js-bundle-lab.nry.app">
            JS Bundle Lab
          </ExternalLink>
          .
        </P>
        <P>
          In summary, the benchmark has shown that npm-in-browser is performant
          enough to be used to do "npm install" typical frontend packages such
          as <InlineCode>react-dom</InlineCode>.{' '}
          <strong>
            Interestingly, it was faster than WebContainer in this case.{' '}
          </strong>
          For heavy packages such as installing{' '}
          <InlineCode>typescript</InlineCode>, WebContainer was faster but
          npm-in-browser was not extremely slow. Note that Nodebox was always
          extremely faster than the others in all the settings. I believe this
          is because Nodebox is using highly optimized format to deliver npm
          packages via their own CDN and they also use their own algorithm of
          "npm install", which does not seem to be using the actual "npm" CLI.
        </P>
        <P>
          Note that as of 2023-10-18, both WebContainer and Nodebox have some
          restrictions on its usage such as commercial usage and their
          frontend/backend source code is not public. npm-in-browser is just a
          small open-source library without commercial usage restrictions.
        </P>
        <H2>Benchmark setting</H2>
        <P>
          I ran the benchmark on <time dateTime="2023-10-04">2023-10-04</time>{' '}
          using my MacBook Air (M2, 2022) under a high-speed internet
          connection, which should represent a typical environment at home in
          Japan.
        </P>
        <p className="mb-3">The rules are the following:</p>
        <ul className="list-inside list-disc space-y-1 ml-3 mb-3">
          <li>exact versions for each package</li>
          <li>no lockfiles (transitive deps versions are not deterministic)</li>
          <li>
            WebContainer and npm-in-browser run "npm install" explicitly while{' '}
            <ExternalLink href="https://github.com/Sandpack/nodebox-runtime/blob/ec5e54b562ed1a81cd1ec18c73e281613a1fc87f/README.md#initialize-file-system">
              Nodebox runs the installation implicitly
            </ExternalLink>
          </li>
        </ul>
        <p className="mb-3">
          I used <ExternalLink href="https://pptr.dev">Puppeteer</ExternalLink>{' '}
          to measure "cold startup time" and "warm startup time". For each way,
          the same browser instance loaded the same page 6 times in succession
          and the first one is considered as "cold startup time" and the
          remaining 5 are considered as "warm startup time". I repeated this 100
          times to plot 100 points in "cold startup time" and 500 points in
          "warm startup time" for each way.
        </p>
        <P>
          Note that I did not use network throttling / CPU throttling since I
          was not confident that it is working correctly for everything
          including Web Workers, WASM, and Service Workers.
        </P>

        <h3 className="mb-3 font-bold text-lg">
          npm-in-browser and in-memory file systems
        </h3>
        <P>
          npm-in-browser requires us to supply Node.js fs compatible instance
          and it turned out that the performance of this fs matters. In this
          benchmark, I used{' '}
          <ExternalLink href="https://github.com/streamich/memfs">
            memfs
          </ExternalLink>{' '}
          and "custom-fs", which is a custom in-memory filesystem I built just
          to make npm-in-browser work. Note that this "custom-fs" is not
          battle-tested and it has many edge case bugs since I only implemented
          absolutely necessary parts. Also note that memfs is order of magnitude
          slower without{' '}
          <ExternalLink href="https://github.com/YuzuJS/setImmediate">
            a setImmediate polyfill
          </ExternalLink>
          . All the benchmarks using memfs here are using the polyfill.
        </P>
        <P></P>
        <H2>Benchmark results</H2>
        <section className="mb-3">
          <h3 className="mb-3 font-bold text-lg">
            Installing lightweight frontend packages
          </h3>
          <P>
            In this case, it installs lightweight frontend packages essentially
            by running <InlineCode>{npmInstallCmd}</InlineCode>. This should
            represent a situation where we want to create tools like "frontend
            bundle size checker" such as{' '}
            <ExternalLink href="https://js-bundle-lab.nry.app">
              JS Bundle Lab
            </ExternalLink>
            .
          </P>
          <P>
            We see that for this case npm-in-browser performs better than
            WebContainer although its variance is higher.
          </P>
          <NpmInstallBenchmark
            result={npmInstallResults.smallFrontendPackages}
          />
        </section>
        <section className="mb-3">
          <h3 className="mb-3 font-bold text-lg">
            Installing heavyweight build packages
          </h3>
          <P>
            In this case, it installs heavyweight build packages essentially by
            running <InlineCode>{npmInstallCmdHeavy}</InlineCode>. We might want
            to install this type of packages when we want to replicate Node.js
            build environment in a browser.
          </P>
          <P>
            We see that Nodebox is extremely fast and npm-in-browser is slower
            than WebContainer. We also see that for npm-in-browser, replacing
            memfs with a custom simpler in-memory fs ("custom-fs") improved the
            performance.
          </P>
          <NpmInstallBenchmark result={npmInstallResults.heavyBuildPackages} />
        </section>
      </div>
    </div>
  );
};
