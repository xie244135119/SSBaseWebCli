process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

import * as vite from 'vite';
import lodash from 'lodash';
import chalk from 'chalk';
import spawn from 'cross-spawn';
import dayjs from 'dayjs';
// import paths from '../vite/paths';
import viteConfig from '../vite.config';

// const fs = require('fs');
// const gracefulFs = require('graceful-fs');
// gracefulFs.gracefulify(fs);
// const loadsh = require('lodash');
// const chalk = require('chalk');
// const spawn = require('cross-spawn');
// const dayjs = require('dayjs');
// const paths = require('../vite/paths');
// const devServerUtil = require('../vite/devServerUtil');
// const viteConfig = require('../vite/vite.config');
// const { devServer } = require('../webpack/webpack.config.dev');

const LOG_PREFIX = require(paths.packageJsonPath).cliType;

// create dev server
vite
  .createServer(viteConfig)
  .then((aDevServer) => {
    console.log(' vite dev server ');

    // console.log(' vite 数据信息 import.meta ', import.meta);
    // listen
    // return devServerUtil.getActivePort().then((newPort) => {
    //   console.log(' 服务器启动 端口号 ', newPort);
    //   //
    // return aDevServer.listen(newPort, false);
    // });
  })
  .then((aDevServer) => {
    console.log(' 服务器启动 ');
  });

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
        chalk.hex('#0A3438')(
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
        ` Compiled successfully at ${dayjs(statJsonObj.builtAt).format('YYYY-MM-DD HH:mm:ss')}`
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
  //
  // targeConfig.devServer.port
  return WebDevServer.getFreePort(targeConfig.devServer.port || 'auto').then((port) => {
    /*console.log(chalk.bold.green(`Project is running at: ${port}`));
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

// const configfileWatchHandler = (event, filename) => {
//   // console.log(chalk.yellow(`${filename} exist ${event}`));
//   if (event === 'change') {
//     // spawn.sync('node', [paths.scriptPath + '/start.js'], {
//     //   stdio: 'inherit'
//     // });
//     closeCombileAndServer(() => {
//       runCombileAndServer().then((res) => {
//         rootCompile = res[0];
//         runingServer = res[1];
//       });
//     });
//   }
// };

// const fswatcher1 = fs.watch(paths.scriptPath, { recursive: true }, configfileWatchHandler);
// const fswatcher2 = fs.watch(paths.webpackPath, { recursive: true }, (event, filename) => {
//   delete require.cache[require.resolve('../webpack/webpack.config.dev')];
//   delete require.cache[require.resolve('../webpack/webpack.config.base')];
//   configfileWatchHandler(event, filename);
// });

// const closeprocess = () => {
//   fswatcher2.close();
//   process.exit();
// };

// process.on('SIGINT', closeprocess);
// process.on('uncaughtException', closeprocess);
// process.on('unhandledRejection', closeprocess);
