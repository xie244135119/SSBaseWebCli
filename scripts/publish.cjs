/**
 * description 一键部署脚本
 * v1.4版本
 * 执行命令：npm run publish
 * 沙盒命令：npm run publishs
 */
const shelljs = require('shelljs');
const path = require('path');
const { NodeSSH } = require('node-ssh');
const serverConfig = require('../config/server.config.json');

class DynamicOutput {
  constructor() {
    this.lastMessage = '';
    this.progressEnabled = process.stdout.isTTY;
  }

  update(message) {
    if (this.progressEnabled) {
      process.stdout.write('\r' + ' '.repeat(this.lastMessage.length));
      process.stdout.write('\r' + message);
      this.lastMessage = message;
    } else {
      shelljs.echo(message);
    }
  }

  final(message) {
    if (this.progressEnabled) {
      process.stdout.write('\r' + message + '\n');
    } else {
      shelljs.echo(message);
    }
    this.lastMessage = '';
  }
}

const output = new DynamicOutput();
const SSH_STATUS = {
  CONNECTING: '正在连接服务器...',
  UPLOADING: '正在上传文件...',
  DEPLOYING: '正在部署...'
};

// 初始化配置
const findEnvIndex = process.argv.indexOf('--env');
let enviromentConfig = serverConfig.deploy;
if (findEnvIndex !== -1) {
  const configKey = process.argv[findEnvIndex + 1];
  enviromentConfig = serverConfig[configKey] || serverConfig.deploy;
}

const ssh = new NodeSSH();
const startTime = Date.now();

const exec = (command = '') =>
  new Promise((resolve, reject) => {
    shelljs.exec(command, { silent: true }, (code, stdout, stderr) => {
      code === 0 ? resolve(stdout) : reject(new Error(stderr || `Command failed: ${command}`));
    });
  });

async function main() {
  try {
    output.update('🚀 正在打包项目...');
    await exec('npm run build');

    output.update('🗜️ 正在压缩构建文件...');
    const { splitIncludes, splitUpload, serverWebDist } = enviromentConfig;
    if (serverWebDist !== 'dist') {
      await exec(`mv dist/ ${serverWebDist}/`);
    }
    const splitUploadFileNames = [];

    if (splitIncludes?.length) {
      await Promise.all(
        splitIncludes.map(async (e) => {
          if (splitUpload) {
            const targetTar = `${serverWebDist}.${e}.tar.gz`;
            await exec(`tar zcvf ${targetTar} ${serverConfig.serverWebDist}/${e}`);
            splitUploadFileNames.push(targetTar);
          }
          await exec(`rm -rf ${serverWebDist}/${e}`);
        })
      );
    }

    const targetTar = `${serverWebDist}.tar.gz`;
    await exec(`tar zcvf ${targetTar} ${serverWebDist}/`);
    splitUploadFileNames.unshift(targetTar);

    output.update(SSH_STATUS.CONNECTING);
    await ssh.connect({
      host: enviromentConfig.host,
      port: enviromentConfig.port,
      username: enviromentConfig.username,
      password: enviromentConfig.password,
      readyTimeout: 120_000
    });

    output.update(SSH_STATUS.UPLOADING);
    await ssh.mkdir(enviromentConfig.serverWebPath);

    const sftp = await ssh.requestSFTP();
    const totalFiles = splitUploadFileNames.length;

    await Promise.all(
      splitUploadFileNames.map(async (file, index) => {
        const localPath = path.join(shelljs.pwd().toString(), file);
        const remotePath = `${enviromentConfig.serverWebPath}/${file}`;

        await ssh.putFile(localPath, remotePath, sftp, {
          concurrency: 10,
          step: (transferred, _, total) => {
            const progress = ((transferred / total) * 100).toFixed(1);
            output.update(
              `${SSH_STATUS.UPLOADING} (${index + 1}/${totalFiles}) ${progress}% ${file}`
            );
          }
        });
      })
    );

    output.update(SSH_STATUS.DEPLOYING);
    const commands = [
      `rm -rf ${serverWebDist}_last_bak.tar.gz`,
      `tar zcvf ${serverWebDist}_last_bak.tar.gz ${serverWebDist}_bak/`,
      `rm -rf ${serverWebDist}_bak/`,
      `mv ${serverWebDist}/ ${serverWebDist}_bak/`,
      ...splitUploadFileNames.map((e) => `tar zxvf ${e} && rm -rf ${e}`),
      ...(!splitUpload
        ? splitIncludes.map((e) => `cp -r ${serverWebDist}_bak/${e} ${serverWebDist}`)
        : [])
    ];

    for (const cmd of commands) {
      await ssh.execCommand(cmd, { cwd: enviromentConfig.serverWebPath });
    }

    splitUploadFileNames.forEach((f) => shelljs.rm(f));
    if (serverWebDist !== 'dist') {
      await exec(`mv ${serverWebDist}/ dist/`);
    }
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    output.final(`✅ 部署成功！用时 ${duration}s\n访问地址：${enviromentConfig.preview}`);
  } catch (error) {
    output.final(`❌ 部署失败: ${error.message}`);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
}

main();
