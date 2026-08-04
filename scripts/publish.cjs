/**
 * description 一键部署脚本
 * v1.6版本
 * 执行命令：npm run publish
 * 沙盒命令：npm run publishs
 * v1.5: 自动递增版本号 + 输出构建包大小
 * v1.6: 支持秘钥登录（privateKeyPath / passphrase）
 */
const shelljs = require('shelljs');
const fs = require('fs');
const path = require('path');
const os = require('os');
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

/**
 * 路径白名单校验：只允许字母/数字/下划线/连字符/点/斜杠，防止 shell 注入。
 * 含空格/分号/反引号等 shell 元字符的值一律拒绝。
 */
function assertSafePath(value, field = 'path') {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`配置项 ${field} 为空，请在 server.config.json 中配置`);
  }
  if (!/^[\w./-]+$/.test(value)) {
    throw new Error(
      `配置项 ${field} 含非法字符（仅允许字母、数字、_、-、.、/）：${value}，疑似命令注入风险`
    );
  }
  return value;
}

// 初始化配置
const findEnvIndex = process.argv.indexOf('--env');
let enviromentConfig = serverConfig.deploy;
if (findEnvIndex !== -1) {
  const configKey = process.argv[findEnvIndex + 1];
  enviromentConfig = serverConfig[configKey] || serverConfig.deploy;
}

const ssh = new NodeSSH();
const startTime = Date.now();

// 构造 SSH 连接配置：按 authMode 决定认证方式，秘钥优先级仍可被命令行 --key 临时覆盖
function buildSSHConfig(config) {
  const baseConfig = {
    host: config.host,
    port: config.port,
    username: config.username,
    readyTimeout: 120_000
  };

  // 命令行参数 --key 临时指定秘钥路径，优先级最高，无论 authMode 如何都走秘钥登录
  const keyIndex = process.argv.indexOf('--key');
  const usePrivateKey = keyIndex !== -1 || config.authMode === 'privateKey';
  if (!usePrivateKey) {
    if (!config.password) {
      throw new Error('未配置登录凭证：请在 server.config.json 中配置 authMode=password + password，或 authMode=privateKey + privateKey');
    }
    return { ...baseConfig, password: config.password };
  }

  // 秘钥登录：优先取命令行 --key，否则取配置 privateKey.privateKeyPath
  const privateKeyPath =
    keyIndex !== -1 ? process.argv[keyIndex + 1] : config.privateKey?.privateKeyPath;

  if (!privateKeyPath) {
    throw new Error('秘钥登录缺少 privateKeyPath：请在 server.config.json 的 privateKey.privateKeyPath 中配置，或通过命令行 --key 传入');
  }

  // 支持 ~ 开头的家目录路径
  const resolvedKeyPath = privateKeyPath.replace(/^~(?=$|\/|\\)/, os.homedir());
  if (!fs.existsSync(resolvedKeyPath)) {
    throw new Error(`秘钥文件不存在: ${resolvedKeyPath}`);
  }

  const sshConfig = {
    ...baseConfig,
    privateKey: fs.readFileSync(resolvedKeyPath)
  };
  if (config.privateKey?.passphrase) {
    sshConfig.passphrase = config.privateKey.passphrase;
  }
  return sshConfig;
}

const exec = (command = '') =>
  new Promise((resolve, reject) => {
    shelljs.exec(command, { silent: true }, (code, stdout, stderr) => {
      code === 0 ? resolve(stdout) : reject(new Error(stderr || `Command failed: ${command}`));
    });
  });

function bumpVersion() {
  const packageJsonPath = path.join(shelljs.pwd().toString(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const versionParts = packageJson.version.split('.');
  versionParts[versionParts.length - 1] = Number(versionParts[versionParts.length - 1]) + 1;
  packageJson.version = versionParts.join('.');
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  return packageJson.version;
}

function getDirSize(dirPath) {
  let totalSize = 0;
  const files = shelljs.find(dirPath).filter((f) => shelljs.test('-f', f));
  files.forEach((f) => {
    totalSize += fs.statSync(f).size;
  });
  return totalSize;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  try {
    // 安全校验：所有拼进 shell 命令的路径必须通过白名单校验
    assertSafePath(enviromentConfig.serverWebDist, 'serverWebDist');
    assertSafePath(enviromentConfig.serverWebPath, 'serverWebPath');
    (enviromentConfig.splitIncludes || []).forEach((e) =>
      assertSafePath(e, 'splitIncludes')
    );

    const newVersion = bumpVersion();
    output.final(`📌 版本号已更新: ${newVersion}`);

    output.update('🚀 正在打包项目...');
    await exec('npm run build');

    const distPath = path.join(shelljs.pwd().toString(), enviromentConfig.serverWebDist || 'dist');
    const distSize = getDirSize(distPath);
    output.final(`📦 构建产物大小: ${formatSize(distSize)}`);

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
            await exec(`tar zcvf ${targetTar} ${serverWebDist}/${e}`);
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
    await ssh.connect(buildSSHConfig(enviromentConfig));

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
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    output.final(
      `✅ 部署成功！ ${timeStr} 用时：${duration}s\n✅ 访问地址：${enviromentConfig.preview}`
    );
  } catch (error) {
    output.final(`❌ 部署失败: ${error.message}`);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
}

main();
