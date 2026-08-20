/**
 * description 一键回退脚本 (安全加固版)
 * v1.2
 * 执行命令：node rollback.js --env deploy
 * v1.2: 支持秘钥登录（privateKeyPath / passphrase）
 */
const shelljs = require('shelljs');
const fs = require('fs');
const os = require('os');
const { NodeSSH } = require('node-ssh');
const serverConfig = require('./server.config.cjs');

class DynamicOutput {
  constructor() {
    this.lastMessage = '';
    this.progressEnabled = process.stdout.isTTY;
  }

  update(message) {
    if (this.progressEnabled) {
      process.stdout.write(`\r${' '.repeat(this.lastMessage.length)}`);
      process.stdout.write(`\r${message}`);
      this.lastMessage = message;
    } else {
      shelljs.echo(message);
    }
  }

  final(message) {
    if (this.progressEnabled) {
      process.stdout.write(`\r${message}\n`);
    } else {
      shelljs.echo(message);
    }
    this.lastMessage = '';
  }
}

const output = new DynamicOutput();
const ssh = new NodeSSH();

/**
 * 路径白名单校验：只允许字母/数字/下划线/连字符/点/斜杠，防止 shell 注入。
 */
function assertSafePath(value, field = 'path') {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`配置项 ${field} 为空，请在 server.config.cjs 中配置`);
  }
  if (!/^[\w./-]+$/.test(value)) {
    throw new Error(
      `配置项 ${field} 含非法字符（仅允许字母、数字、_、-、.、/）：${value}，疑似命令注入风险`
    );
  }
  return value;
}

// 构造 SSH 连接配置：按 authMode 决定认证方式，秘钥优先级仍可被命令行 --key 临时覆盖
function buildSSHConfig(config) {
  const baseConfig = {
    host: config.host,
    port: config.port,
    username: config.username
  };

  // 命令行参数 --key 临时指定秘钥路径，优先级最高，无论 authMode 如何都走秘钥登录
  const keyIndex = process.argv.indexOf('--key');
  const usePrivateKey = keyIndex !== -1 || config.authMode === 'privateKey';
  if (!usePrivateKey) {
    if (!config.password) {
      throw new Error('未配置登录凭证：请在 server.config.cjs 中配置 authMode=password + password，或 authMode=privateKey + privateKey');
    }
    return { ...baseConfig, password: config.password };
  }

  // 秘钥登录：优先取命令行 --key，否则取配置 privateKey.privateKeyPath
  const privateKeyPath =
    keyIndex !== -1 ? process.argv[keyIndex + 1] : config.privateKey?.privateKeyPath;

  if (!privateKeyPath) {
    throw new Error('秘钥登录缺少 privateKeyPath：请在 server.config.cjs 的 privateKey.privateKeyPath 中配置，或通过命令行 --key 传入');
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

// 初始化环境配置
const findEnvIndex = process.argv.indexOf('--env');
let enviromentConfig = serverConfig.deploy;
if (findEnvIndex !== -1) {
  const configKey = process.argv[findEnvIndex + 1];
  enviromentConfig = serverConfig[configKey] || serverConfig.deploy;
}

async function main() {
  const startTime = Date.now();
  try {
    assertSafePath(enviromentConfig.serverWebPath, 'serverWebPath');
    output.update('🚀 正在建立安全连接...');
    await ssh.connect(buildSSHConfig(enviromentConfig));

    const remotePath = enviromentConfig.serverWebPath;
    output.update('🔍 正在检索历史备份版本...');

    // 检查是否存在一级备份目录和二级备份压缩包
    const [checkBakDir, checkLastBakFile] = await Promise.all([
      ssh.execCommand('ls -d dist_bak', { cwd: remotePath }),
      ssh.execCommand('ls dist_last_bak.tar.gz', { cwd: remotePath })
    ]);

    const hasBakDir = checkBakDir.code === 0;
    const hasLastBakFile = checkLastBakFile.code === 0;

    let rollbackCmds = [];
    let successMsg = '';

    if (hasBakDir) {
      // 场景 A: 正常回退至上一版本
      output.update('🔄 发现可用历史版本，正在执行回退并重组备份链...');
      rollbackCmds = [
        'rm -rf dist_rollback_bak', // 清理旧的回退现场记录
        'mv dist dist_rollback_bak', // 保护当前出故障的版本
        'mv dist_bak dist' // 核心回退操作
      ];

      // 关键补充逻辑：如果二级备份存在，则将其解压填补到一级备份的空位
      if (hasLastBakFile) {
        rollbackCmds.push(
          'tar zxvf dist_last_bak.tar.gz', // 这会解压出 dist_bak 文件夹
          'rm -rf dist_last_bak.tar.gz' // 可选：删除已使用的旧压缩包，或保留
        );
      }
      successMsg = '已成功回退至上一个稳定版本，并自动同步备份链';
    } else if (hasLastBakFile) {
      // 场景 B: 一级备份丢失，直接从二级压缩包恢复
      output.update('📦 发现存档版本，正在紧急恢复...');
      rollbackCmds = [
        'rm -rf dist_rollback_bak',
        'mv dist dist_rollback_bak',
        'tar zxvf dist_last_bak.tar.gz',
        'mv dist_bak dist'
      ];
      successMsg = '已成功从存档文件恢复至较早的历史版本';
    } else {
      throw new Error('未发现任何可回退的历史记录。');
    }

    // 按顺序执行指令
    for (const cmd of rollbackCmds) {
      const res = await ssh.execCommand(cmd, { cwd: remotePath });
      if (res.code !== 0) {
        throw new Error(`执行步骤失败: ${res.stderr}`);
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    output.final(
      `✅ ${successMsg}！\n⏱️  总耗时：${duration}s\n🌐 访问地址：${enviromentConfig.preview}`
    );
  } catch (error) {
    output.final(`❌ 回退失败: ${error.message}`);
    process.exit(1);
  } finally {
    ssh.dispose();
  }
}

main();
