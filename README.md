# In-browser "npm install" benchmark

There are several ways to run "npm install" in web browsers.
Here the definition of "npm install" is that we can inspect the contents of node_modules after running "npm install" via file system APIs.

This repo includes the benchmark code and source code for the website, which also hosts pages to be used in the benchmarks as well.

See https://npm-install-browser-benchmark.nry.app for more details.

## How to run the benchmark

To run the benchmark against the benchmark suite deployed at `https://npm-install-browser-benchmark.nry.app`, please run the following:

```
npm ci
npm run bench
```

## How to build the website including the benchmark suite

```
npm ci
npm run build
```

Then `npm run serve` can be used to preview the website in local.

## License

In-browser "npm install" benchmark is [MIT licensed](./LICENSE).
