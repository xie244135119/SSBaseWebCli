process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const chalk = require('chalk');
const dayjs = require('dayjs');
const loadsh = require('lodash');
const webpackbar = require('webpackbar');
//
const paths = require('../webpack/paths');
const baseConfig = require('../webpack/webpack.config.base');
const devConfig = require('../webpack/webpack.config.prod');
//
const LOG_PREFIX = require(paths.packageJsonPath).cliType;

const targeConfig = loadsh.mergeWith(
  baseConfig,
  devConfig,
  (value, srcValue, key, object, source) => {
    const arrayKeys = ['plugins'];
    if (arrayKeys.indexOf(key) !== -1) {
      return (value || []).concat(srcValue || []);
    }
  }
);
targeConfig.plugins.push(
  new webpackbar({
    name: LOG_PREFIX,
    profile: false,
    fancy: true,
    basic: false
  })
);

const toJsonOptionsObject2 = {
  // all log
  all: false,
  assets: true,
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

const toJsonOptionsObject = {
  preset: 'verbose'
};

const closeprocess = () => {
  process.exit();
};

const getPackageSize = (assets) => {
  const totalsize = assets.reduce((prev, cur) => prev + cur.size, 0);
  const convertM = (totalsize / (1024 * 1024)).toFixed(2);
  return convertM;
};
const combileHandler = (_, stats) => {
  const statJsonObj = stats.toJson(toJsonOptionsObject);

  if (stats.hasErrors()) {
    console.log();
    statJsonObj.errors.forEach((aLog) => {
      console.log();
      const lines = aLog.message.split('\n').filter((item) => item);
      lines.forEach((line, index) => {
        const firstline = index === 0;
        console.log(firstline ? chalk.red.bold('ERROR in ') : '' + line);
      });
    });

    console.log();
    console.log(
      chalk.bgRedBright(' ERROR ') +
        chalk.redBright(
          ` ${LOG_PREFIX} failed to build with ${statJsonObj.errors?.length} errors at ${dayjs(
            statJsonObj.builtAt
          ).format('YYYY-MM-DD HH:mm:ss')}`
        ) +
        (statJsonObj.warnings?.length > 0
          ? chalk.redBright(`${statJsonObj.warnings?.length} types of warnings)`)
          : '')
    );
    console.log();
    closeprocess();
    return;
  }

  console.log(
    chalk.bgGreenBright(' DONE ') +
      chalk.greenBright(
        ` ${LOG_PREFIX} build successfully in ${statJsonObj.time / 1000}s at ${dayjs(
          statJsonObj.builtAt
        ).format('YYYY-MM-DD HH:mm:ss')} `
      ) +
      (statJsonObj.warnings?.length > 0
        ? chalk.redBright(`${statJsonObj.warnings?.length} types of warnings)`)
        : '')
  );

  console.log();
  console.log(
    chalk.bgBlueBright(' OUTPUT ') +
      chalk.blueBright(
        ` ${LOG_PREFIX} ${stats.compilation.outputOptions.path}【${getPackageSize(
          statJsonObj.assets
        )}】M`
      )
  );
  console.log();
  closeprocess();
};
webpack(targeConfig, (aError, aStas) => {
  combileHandler(aError, aStas);
});

process.on('uncaughtException', (e) => {
  closeprocess();
});
process.on('unhandledRejection', (e) => {
  closeprocess();
});
process.on('SIGINT', () => {
  closeprocess();
});
