process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const fs = require("fs");
const webpack = require("webpack");
const webDevServer = require("webpack-dev-server");
const loadsh = require("lodash");
const baseConfig = require("../webpack/webpack.config");
const devConfig = require("../webpack/webpack.config.dev");
const targeConfig = loadsh.merge(baseConfig, devConfig);
const chalk = require("chalk");
const ora = require("ora");
const spawn = require("cross-spawn");
const dayjs = require("dayjs");
const spinner = ora();
const paths = require("../webpack/paths");
// config
const LOG_PREFIX = "Webpack4";

const toJsonOptionsObject = {
  // all log
  all: false,
  assets: false,
  /** Sort assets by a field */
  assetsSort: "size",
  /** Add built at time information */
  builtAt: true,
  /** Add information about cached (not built) modules */
  cached: true,
  /** Show cached assets (setting this to `false` only shows emitted files) */
  cachedAssets: true,
  /** Add children information */
  children: true,
  /** Add information about the `namedChunkGroups` */
  chunkGroups: true,
  /** Add built modules information to chunk information */
  chunkModules: true,
  /** Add the origins of chunks and chunk merging info */
  chunkOrigins: true,
  /** Add chunk information (setting this to `false` allows for a less verbose output) */
  chunks: false,
  /** Sort the chunks by a field */
  // chunksSort: string | undefined;
  /** Context directory for request shortening */
  // context: string | undefined;
  /** Display the distance from the entry point for each module */
  depth: false,
  /** Display the entry points with the corresponding bundles */
  entrypoints: false,
  /** Add --env information */
  env: true,
  /** Add errors */
  errors: true,
  /** Add details to errors (like resolving log) */
  errorDetails: false,
  /** Exclude assets from being displayed in stats */
  // excludeAssets: (assetName) => {
  //     console.log(' assetName ', assetName)
  //     return false
  // },
  // /** Exclude modules from being displayed in stats */
  // excludeModules: (moduleName) => {
  //     console.log(' moduleName ', moduleName);
  //     return false
  // },
  /** See excludeModules */
  // exclude: (moduleName) => {
  //     console.log(' moduleName ', moduleName);
  //     return false
  // },
  /** Add the hash of the compilation */
  hash: true,
  /** Set the maximum number of modules to be shown */
  maxModules: 100,
  /** Add built modules information */
  modules: false,
  /** Sort the modules by a field */
  // modulesSort: string | undefined;
  /** Show dependencies and origin of warnings/errors */
  moduleTrace: true,
  /** Add public path information */
  publicPath: true,
  /** Add information about the reasons why modules are included */
  reasons: true,
  /** Add the source code of modules */
  source: true,
  /** Add timing information */
  timings: true,
  /** Add webpack version information */
  version: true,
  /** Add warnings */
  warnings: true,
  /** Show which exports of a module are used */
  usedExports: false,
  /** Filter warnings to be shown */
  // warningsFilter: string | RegExp | Array<string | RegExp> | ((warning: string) => boolean) | undefined;
  /** Show performance hint when file size exceeds `performance.maxAssetSize` */
  performance: true,
  /** Show the exports of the modules */
  providedExports: false
};
const combileHandler = (_, stats) => {
  const statJsonObj = stats.toJson(toJsonOptionsObject);

  if (stats.hasErrors() || stats.hasWarnings()) {
    const printlog = (logs, error = false) => {
      logs.forEach((log) => {
        const lines = log.split("\n");
        lines.forEach((line, index) => {
          if (index < 2) {
            if (error) {
              console.log(chalk.red(line));
            } else {
              console.log(chalk.yellow(line));
            }
          } else {
            console.log(line);
          }
        });
        console.log();
      });
    };
    printlog(statJsonObj.warnings);
    printlog(statJsonObj.errors, true);
  }

  if (stats.hasErrors()) {
    spinner.fail(
      chalk.bgRedBright(" ERROR ") +
        chalk.redBright(
          ` ${LOG_PREFIX} failed to compile with ${statJsonObj.errors?.length} errors at ${dayjs(
            statJsonObj.builtAt
          ).format()} (${statJsonObj.warnings?.length} types of warnings)`
        )
    );
    return;
  }
  spinner.succeed(
    chalk.bgGreenBright(" DONE ") +
      chalk.greenBright(
        ` ${LOG_PREFIX} compiled successfully in ${statJsonObj.time / 1000}s at ${dayjs(
          statJsonObj.builtAt
        ).format()} (${statJsonObj.warnings?.length} types of warnings)`
      )
  );
};
// console.log(' 基础配置信息 ', targeConfig);
const compile = webpack(targeConfig);
//
// watching.compiler
const server = new webDevServer(compile, targeConfig.devServer);
const devServerUtil = require("../webpack/devServerUtil");
devServerUtil.getActivePort(targeConfig.devServer.host, targeConfig.devServer.port).then((port) => {
  server.listen(port, targeConfig.devServer.host, () => {
    console.log(
      chalk.blue(`Project is running at http://${targeConfig.devServer.host}:${targeConfig.devServer.port}/`)
    );
  });
});

compile.hooks.compilation.tap("compilation", () => {
  spinner.start(chalk.blue(`${LOG_PREFIX} compilating...`));
});

compile.hooks.done.tap("done", (e) => {
  spinner.stop();
  combileHandler(null, e);
});

const configfileWatchHandler = (event, filename) => {
  console.log(chalk.yellow(`${filename} exist ${event}`));
  if (event === "change") {
    exit();
    spawn.sync("node", [paths.scriptPath + "/start.js"], {
      stdio: "inherit"
    });
  }
};
fs.watch(paths.scriptPath, { recursive: true }, configfileWatchHandler);
fs.watch(paths.webpackPath, { recursive: true }, configfileWatchHandler);

const exit = () => {
  // spinner stop
  spinner?.stop();
  // close server
  server?.close();
  process.exit();
};

// uncaughtExceptionMonitor
process.on("uncaughtException", (e) => {
  console.error("uncaughtExceptionMonitor:", e);
  exit();
});
process.on("unhandledRejection", (e) => {
  console.error(" unhandledRejection:", e);
  exit();
});
process.on("SIGINT", function () {
  console.error(" exit ");
  exit();
});
