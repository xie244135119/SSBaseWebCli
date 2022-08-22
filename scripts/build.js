process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const webpack = require("webpack");
const targeConfig = require("../webpack/webpack.config");
const chalk = require("chalk");
const ora = require("ora");
const dayjs = require("dayjs");
const spinner = ora();

spinner.start(chalk.blue("【webpack4】构建中..."));
const toJsonOptionsObject = {
  // all log
  all: false,
  assets: true,
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
  errorDetails: true,
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
const getPackageSize = (assets) => {
  const totalsize = assets.reduce((prev, cur) => {
    return prev + cur.size;
  }, 0);
  const convertM = (totalsize / (1024 * 1024)).toFixed(2);
  return convertM;
};
const combileHandler = (_, stats) => {
  const statJsonObj = stats.toJson(toJsonOptionsObject);
  if (stats.hasErrors()) {
    statJsonObj.errors?.forEach((e) => {
      console.log(e);
    });
    spinner.fail(
      chalk.redBright(
        `【webpack4】构建失败【${dayjs(statJsonObj.builtAt).format()}】，${statJsonObj.errors?.length}个错误`
      )
    );
    exit();
    return;
  }
  //
  const warning = stats.compilation.warnings || [];
  warning.forEach((e) => {
    console.log(e);
  });

  spinner.succeed(
    chalk.greenBright(
      `【webpack4】构建成功 ${dayjs(statJsonObj.builtAt).format()}，${getPackageSize(statJsonObj.assets)}M，耗费${
        statJsonObj.time / 1000
      }s，${warning.length}个警告`
    )
  );
  spinner.info(chalk.blueBright(`【webpack4】输出目录 ${stats.compilation.outputOptions.path}`));
  exit();
};
const compile = webpack(targeConfig);
compile.run(combileHandler);

const exit = () => {
  spinner?.stop();
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
