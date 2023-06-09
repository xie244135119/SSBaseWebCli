process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const chalk = require('chalk');
const dayjs = require('dayjs');
const loadsh = require('lodash');
const webpackbar = require('webpackbar');
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
