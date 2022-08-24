process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebDevServer = require('webpack-dev-server');
const loadsh = require('lodash');
const chalk = require('chalk');
const ora = require('ora');
const spawn = require('cross-spawn');
const dayjs = require('dayjs');
const paths = require('../webpack/paths');
const baseConfig = require('../webpack/webpack.config');
const devConfig = require('../webpack/webpack.config.dev');
const devServerUtil = require('../webpack/devServerUtil');
//
const targeConfig = loadsh.merge(baseConfig, devConfig);
const LOG_PREFIX = require(paths.packageJsonPath).cliType;
const spinner = ora();
spinner.spinner = 'runner';

let fswatcher1 = null;
let fswatcher2 = null;
process.on('SIGINT', () => {
  console.log(' exit ');
  fswatcher1?.close();
  fswatcher2?.close();
  process.exit();
});

const toJsonOptionsObject = {
  // all log
  all: false,
  assets: false,
  /** Sort assets by a field */
  assetsSort: 'size',
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
  // warningsFilter: null;
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
        const lines = log.split('\n');
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
    spinner.fail(chalk.blue(`${LOG_PREFIX}`));
    console.log(
      chalk.hex('#0A3438')(`  Compiled failed at ${dayjs(statJsonObj.builtAt).format()}`)
    );
    console.log();
    console.log(
      chalk.bgRed(' ERROR ') +
        chalk.red(
          ` failed to compile with ${statJsonObj.errors?.length} errors (${statJsonObj.warnings?.length} types of warnings)`
        )
    );
    return;
  }

  spinner.succeed(chalk.blue(`${LOG_PREFIX}`));
  console.log(
    chalk.hex('#0A3438')(`  Compiled successfully at ${dayjs(statJsonObj.builtAt).format()}`)
  );
  console.log();
  console.log(
    chalk.bgGreen(' DONE ') +
      chalk.green(
        ` Compiled successfully in ${statJsonObj.time / 1000}s (${
          statJsonObj.warnings?.length
        } types of warnings)`
      )
  );
};

const compile = webpack(targeConfig);
// watching.compiler
const server = new WebDevServer(compile, targeConfig.devServer);
//
devServerUtil.getActivePort(targeConfig.devServer.host, targeConfig.devServer.port).then((port) => {
  let reStart = false;
  if (spinner.isSpinning) {
    reStart = true;
  }
  console.log(
    chalk.blue(
      `Project is running at http://${targeConfig.devServer.host}:${targeConfig.devServer.port}/`
    )
  );
  console.log();
  server.listen(port, targeConfig.devServer.host);
  if (reStart) {
    spinner.start(chalk.blue(`${LOG_PREFIX} compilating...`));
    console.log();
  }
});

const exit = () => {
  spinner?.stop();
  server?.close();
};

compile.hooks.compile.tap('beforeCompile', () => {
  if (!spinner.isSpinning) {
    spinner.start(chalk.blue(`${LOG_PREFIX} compilating...`));
    console.log();
  }
});

compile.hooks.done.tap('done', (e) => {
  spinner.stop();
  combileHandler(null, e);
});

const configfileWatchHandler = (event, filename) => {
  console.log(chalk.yellow(`${filename} exist ${event}`));
  if (event === 'change') {
    exit();
    fswatcher1.close();
    fswatcher2.close();
    spawn.sync('node', [path.join(paths.scriptPath, 'start.js')], {
      stdio: 'inherit'
    });
  }
};
fswatcher1 = fs.watch(paths.scriptPath, { recursive: true }, configfileWatchHandler);
fswatcher2 = fs.watch(paths.webpackPath, { recursive: true }, configfileWatchHandler);

// uncaughtExceptionMonitor
process.on('uncaughtException', (e) => {
  console.error('uncaughtExceptionMonitor:', e);
  fswatcher1?.close();
  fswatcher2?.close();
  process.exit();
});
process.on('unhandledRejection', (e) => {
  console.error(' unhandledRejection:', e);
  fswatcher1?.close();
  fswatcher2?.close();
  process.exit();
});
