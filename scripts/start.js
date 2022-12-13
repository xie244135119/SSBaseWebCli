process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const fs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);
const webpack = require('webpack');
const WebDevServer = require('webpack-dev-server');
const loadsh = require('lodash');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const dayjs = require('dayjs');
const webpackbar = require('webpackbar');
const paths = require('../webpack/paths');

const LOG_PREFIX = require(paths.packageJsonPath).cliType;

const toJsonOptionsObject2 = {
  // all log
  all: false,
  assets: false,
  /** Sort assets by a field */
  assetsSort: 'size',
  /** Add built at time information */
  builtAt: true,
  // module assets
  moduleAssets: false,
  // show how many assets
  assetsSpace: 6,
  // module how many space
  modulesSpace: 10,
  // how many chunk modules
  chunkModulesSpace: 10,
  // 在模块内部显示嵌套的其他模块
  nestedModules: true,

  /** Add information about cached (not built) modules */
  cached: false,
  // 是否缓存非内置模块的
  cachedModules: false,
  // 是否添加缓存的其他模块信息
  runtimeModules: false,
  // 是否显示该 chunk 依赖的其他模块
  dependentModules: false,

  // 按照 asset 与 chunk 的关系进行分组
  groupAssetsByChunk: true,
  //
  groupAssetsByEmitStatus: false,

  /** Show cached assets (setting this to `false` only shows emitted files) */
  cachedAssets: true,
  /** Add children information */
  children: true,

  /** Add chunk information (setting this to `false` allows for a less verbose output) */
  chunks: false,
  /** Add information about the `namedChunkGroups` */
  chunkGroups: false,
  /** Add built modules information to chunk information */
  chunkModules: false,
  /** Add the origins of chunks and chunk merging info */
  chunkOrigins: false,

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
  errorStack: true,
  errorsCount: true,
  /** Add details to errors (like resolving log) */
  errorDetails: 'auto',
  /** Add the hash of the compilation */
  hash: true,

  //
  logging: 'error',
  //
  loggingTrace: true,
  /** Add built modules information */
  modules: false,
  /** Sort the modules by a field */
  // modulesSort: string | undefined;
  /** Show dependencies and origin of warnings/errors */
  moduleTrace: true,

  //
  optimizationBailout: true,
  //
  outputPath: false,
  /** Show performance hint when file size exceeds `performance.maxAssetSize` */
  performance: true,
  // 统计人员信息行为分析
  preset: 'minimal',

  //
  /** Show the exports of the modules */
  providedExports: false,
  //
  warningsCount: true,
  // 模块被引用的原因
  reasons: true,

  // 源码
  source: true,
  // 时间
  timings: true,
  /** Add webpack version information */
  version: true,

  //
  ids: true,
  /** Show which exports of a module are used */
  usedExports: false,

  /** Add public path information */
  publicPath: false,
  /** Add information about the reasons why modules are included */
  reasons: true,

  /** Add warnings */
  warnings: true

  /** Filter warnings to be shown */
  // warningsFilter: null;
};

const toJsonOptionsObject = {
  preset: 'verbose'
};

const combileHandler = (_, stats) => {
  const statJsonObj = stats.toJson(toJsonOptionsObject);

  if (statJsonObj.warnings.length > 0) {
    console.log();
    statJsonObj.warnings.forEach((log) => {
      console.log(chalk.yellow('WARNING in ') + log.message);
    });
    console.log();
  }
  if (statJsonObj.errors.length > 0) {
    console.log();
    statJsonObj.errors.forEach((log) => {
      console.log(log.message);
    });
    console.log();
  }

  if (stats.hasErrors()) {
    console.log(
      chalk.bold.blue(`[${LOG_PREFIX}]`) +
        +chalk.hex('#0A3438')(
          `  Compiled failed at ${dayjs(statJsonObj.builtAt).format('YYYY-MM-DD HH:mm:ss')}`
        )
    );
    console.log();
    console.log(
      chalk.bgRed(' ERROR ') +
        chalk.bold.red(
          ` failed to compile with ${statJsonObj.errors?.length} errors (${statJsonObj.warnings?.length} types of warnings)`
        )
    );
    console.log();
    return;
  }

  console.log(
    chalk.bold.blue(`[${LOG_PREFIX}]`) +
      chalk.bold.hex('#0A3438')(
        `  Compiled successfully at ${dayjs(statJsonObj.builtAt).format('YYYY-MM-DD HH:mm:ss')}`
      )
  );
  console.log();
  console.log(
    chalk.bgGreen(' DONE ') +
      chalk.bold.green(
        ` Compiled successfully in ${statJsonObj.time / 1000}s (${
          statJsonObj.warnings?.length
        } types of warnings)`
      )
  );
  console.log();
};

let rootCompile = null;
let runingServer = null;

const runCombileAndServer = () => {
  const baseConfig = require('../webpack/webpack.config.base');
  const devConfig = require('../webpack/webpack.config.dev');
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
  const HOST = targeConfig.devServer.host || process.env.HOST || 'localhost';
  const createCompile = (aPort) => {
    const compile = webpack(targeConfig, (aError, aStats) => {
      combileHandler(null, aStats);
    });
    // compile.hooks.compile.tap('beforeCompile', () => {
    //   //
    // });

    // compile.hooks.done.tap('done', (e) => {
    // });
    targeConfig.devServer.port = aPort;
    const server = new WebDevServer(targeConfig.devServer, compile, targeConfig.devServer);
    return server.start().then(() => {
      return [compile, server];
    });
  };

  // const ipv4 = WebDevServer.internalIPSync('v4');
  // const ipv6 = WebDevServer.internalIPSync('v6');
  return WebDevServer.getFreePort(targeConfig.devServer.port, HOST).then((port) => {
    /*console.log(chalk.bold.green(`Project is running at:`));
    console.log(
      chalk.bold.green(`On Your Network (Local): `) +
        chalk.rgb(42, 184, 219)(`http://${HOST}:${port}/`)
    );
    console.log(
      chalk.bold.green('On Your Network (IPv4):  ') +
        chalk.rgb(42, 184, 219)(`http://${ipv4}:${port}/`)
    );
    console.log(
      chalk.bold.green('On Your Network (IPv6):  ') +
        chalk.rgb(42, 184, 219)(`http://${ipv6}:${port}/`)
    );
    console.log();*/
    return createCompile(port);
  });
};

const closeCombileAndServer = (callBack = () => {}) => {
  runingServer?.stop().then((res) => {
    rootCompile.close(() => {
      callBack?.();
    });
  });
};

runCombileAndServer().then((res) => {
  rootCompile = res[0];
  runingServer = res[1];
});

const configfileWatchHandler = (event, filename) => {
  // console.log(chalk.yellow(`${filename} exist ${event}`));
  if (event === 'change') {
    // spawn.sync('node', [paths.scriptPath + '/start.js'], {
    //   stdio: 'inherit'
    // });
    closeCombileAndServer(() => {
      runCombileAndServer().then((res) => {
        rootCompile = res[0];
        runingServer = res[1];
      });
    });
  }
};
// const fswatcher1 = fs.watch(paths.scriptPath, { recursive: true }, configfileWatchHandler);
const fswatcher2 = fs.watch(paths.webpackPath, { recursive: true }, (event, filename) => {
  delete require.cache[require.resolve('../webpack/webpack.config.dev')];
  delete require.cache[require.resolve('../webpack/webpack.config.base')];
  configfileWatchHandler(event, filename);
});

const closeprocess = () => {
  fswatcher2.close();
  process.exit();
};

process.on('SIGINT', closeprocess);
process.on('uncaughtException', closeprocess);
process.on('unhandledRejection', closeprocess);
