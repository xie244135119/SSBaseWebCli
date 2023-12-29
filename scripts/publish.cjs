//
const shelljs = require('shelljs');
const path = require('path');
const { NodeSSH } = require('node-ssh');

const ssh = new NodeSSH();
const serverConfig = require('../config/server.config.json');

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
shelljs.echo('【一键部署】编译开始...');
exec('npm run build')
  .then(() => {
    shelljs.echo('【一键部署】编译完成，压缩文件中...');
    return exec('tar zcvf dist.tar.gz dist/');
  })
  .then(() => {
    shelljs.echo('【一键部署】文件压缩完成');
    shelljs.echo('【一键部署】连接服务器中...');

    return ssh.connect({
      host: serverConfig.deploy.host,
      port: serverConfig.deploy.port,
      username: serverConfig.deploy.username,
      password: serverConfig.deploy.password
    });
  })
  .then(() => {
    shelljs.echo('【一键部署】服务器连接成功');

    return ssh.execCommand(`cd ${serverConfig.deploy.serverWebPath}`).then((res) => {
      if (res.code === 1) {
        return ssh.mkdir(serverConfig.deploy.serverWebPath, 'exec');
      }
      return Promise.resolve();
    });
  })
  .then(() =>
    ssh
      .requestSFTP()
      .then((res) => {
        shelljs.echo('【一键部署】文件准备上送');
        return new Promise((reslove, reject) => {
          const localPath = path.join(`${shelljs.pwd()}`, './dist.tar.gz');
          const remotePath = `${serverConfig.deploy.serverWebPath}/dist.tar.gz`;
          res.fastPut(
            localPath,
            remotePath,
            {
              step: (total, _, fsize) => {
                shelljs.echo(`【一键部署】文件上传中>>>${((total / fsize) * 100).toFixed(4)}%`);
              }
            },
            (err) => {
              // progress.stop();
              if (err) {
                shelljs.echo('【一键部署】文件上传失败', err.code);
                reject();
              }
              shelljs.echo('【一键部署】文件上传完成');
              reslove();
            }
          );
        });
      })
      .then(() => {
        shelljs.echo('【一键部署】文件部署操作中...');
        const commands = [
          'rm -rf dist_last_bak.tar.gz',
          'tar zcvf dist_last_bak.tar.gz dist_bak/',
          'rm -rf dist_bak/',
          'mv dist/ dist_bak/',
          'tar zxvf dist.tar.gz',
          'rm -rf dist.tar.gz'
        ];
        let p = Promise.resolve();
        commands.forEach((command) => {
          p = p.then(() =>
            ssh.execCommand(command, {
              cwd: serverConfig.deploy.serverWebPath
            })
          );
        });
        return p;
      })
  )
  .then(() => {
    const endTime = Date.now();
    shelljs.echo(`【一键部署】部署完成，用时${(endTime - startTime) / 1000}s`);
    return exec('rm -rf dist.tar.gz');
  })
  .then(() => {
    shelljs.exit();
  })
  .catch(() => {
    shelljs.echo('【一键部署】失败');
    exec('rm -rf dist.tar.gz').then(() => {
      shelljs.exit();
    });
  });
