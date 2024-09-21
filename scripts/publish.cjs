/**
 * description 一键部署脚本
 * v1.2版本
 * 执行命令：npm run publish
 * 沙盒命令：npm run publishs
 */
const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const serverConfig = require('../config/server.config.json');

const findEnvIndex = process.argv.indexOf('--env');
let enviromentConfig = serverConfig.deploy;
if (findEnvIndex !== -1) {
  const configKey = process.argv[findEnvIndex + 1];
  enviromentConfig = serverConfig[configKey] || serverConfig.deploy;
}

const ssh = new NodeSSH();
const exec = (command = '') =>
  new Promise((reslove, reject) => {
    shelljs.exec(
      command,
      {
        silent: false
      },
      (code, _, stderr) => {
        if (code === 0) {
          reslove();
          return;
        }
        reject(new Error(stderr));
      }
    );
  });
const startTime = Date.now();
let distGzSize = 0;
shelljs.echo('【一键部署】开始打包...');
exec('npm run build')
  .then(() => {
    shelljs.echo('【一键部署】打包完成，压缩文件中...');
    const splitUploadFileNames = [];
    const { splitIncludes, splitUpload } = enviromentConfig;
    if (splitIncludes && Array.isArray(splitIncludes)) {
      splitIncludes.forEach((e) => {
        if (splitUpload) {
          const targetTar = `dist.${e}.tar.gz`;
          shelljs.exec(`tar zcvf ${targetTar} dist/${e}`);
          splitUploadFileNames.push(targetTar);
        }
        shelljs.exec(`rm -rf dist/${e}`);
      });
    }
    //
    const targetTar = 'dist.tar.gz';
    shelljs.exec(`tar zcvf ${targetTar} dist/`);
    splitUploadFileNames.unshift(targetTar);
    shelljs.echo('【一键部署】文件压缩完成');
    shelljs.echo('【一键部署】连接服务器中...');
    distGzSize = fs.statSync(path.join(`${shelljs.pwd()}`, './dist.tar.gz')).size / (1024 * 1024);
    return ssh
      .connect({
        host: enviromentConfig.host,
        port: enviromentConfig.port,
        username: enviromentConfig.username,
        password: enviromentConfig.password,
        readyTimeout: 120 * 1000
      })
      .then(() => {
        shelljs.echo('【一键部署】服务器准备已就绪');
        shelljs.echo('【一键部署】校验部署目录');
        return ssh.mkdir(enviromentConfig.serverWebPath).then(() => {
          shelljs.echo('【一键部署】部署目录已就绪');
          return ssh.requestSFTP().then((res) => {
            shelljs.echo(`【一键部署】共${splitUploadFileNames.length}个文件准备上送`);
            const uploadFile = (file, index) =>
              new Promise((reslove, reject) => {
                const localPath = path.join(`${shelljs.pwd()}`, file);
                const remotePath = `${enviromentConfig.serverWebPath}/${file}`;
                let _uploadPress = 0;
                res.fastPut(
                  localPath,
                  remotePath,
                  {
                    concurrency: 10,
                    step: (total, _, fsize) => {
                      const currentProgress = ((total / fsize) * 100).toFixed(0);
                      if (_uploadPress != currentProgress) {
                        _uploadPress = currentProgress;
                        shelljs.echo(
                          `【一键部署】(共${splitUploadFileNames.length}个文件)第${
                            index + 1
                          }个上传 ${currentProgress}%`
                        );
                      }
                    }
                  },
                  (err) => {
                    if (err) {
                      shelljs.echo(
                        `【一键部署】(共${splitUploadFileNames.length}个文件)第${
                          index + 1
                        }个上传失败：`,
                        err.message
                      );
                      reject(err);
                    }
                    shelljs.echo(
                      `【一键部署】(共${splitUploadFileNames.length}个文件)第${index + 1}个上传完成`
                    );
                    reslove();
                  }
                );
              });
            const uploadFilePs = splitUploadFileNames.map((e, index) => uploadFile(e, index));
            return Promise.all(uploadFilePs);
          });
        });
      })
      .then(() => {
        shelljs.echo('【一键部署】文件部署操作中...');
        const commands = [
          'rm -rf dist_last_bak.tar.gz',
          'tar zcvf dist_last_bak.tar.gz dist_bak/',
          'rm -rf dist_bak/',
          'mv dist/ dist_bak/'
        ];
        splitUploadFileNames.forEach((e) => {
          commands.push(`tar zxvf ${e}`);
          commands.push(`rm -rf ${e}`);
        });
        if (!splitUpload) {
          splitIncludes.forEach((e) => {
            commands.push(`cp -r dist_bak/${e} dist`);
          });
        }

        let p = Promise.resolve();
        commands.forEach((command) => {
          p = p.then(() =>
            ssh.execCommand(command, {
              cwd: enviromentConfig.serverWebPath,
              stream: 'stdout'
            })
          );
        });
        return p;
      })

      .then(() => {
        splitUploadFileNames.forEach((e) => {
          shelljs.exec(`rm -rf  ${e}`);
        });
        const endTime = Date.now();
        shelljs.echo(
          `【一键部署】${new Date().toLocaleString()}部署完成，压缩包${distGzSize.toFixed(
            2
          )}M，用时${(endTime - startTime) / 1000}s`
        );
        shelljs.echo(`【一键部署】预览地址：${enviromentConfig.preview}`);
        shelljs.exit();
      });
  })
  .catch((e) => {
    shelljs.echo('【一键部署】失败', e.message || e.name);
    shelljs.exit();
  });
