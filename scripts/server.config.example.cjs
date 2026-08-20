/**
 * 部署 / 回退脚本的服务器配置模板
 *
 * 使用方式：复制本文件为 scripts/server.config.cjs 并填入真实值。
 * （server.config.cjs 已被 .gitignore 忽略，不会入库，凭据安全）
 *
 * 因为是 .cjs，可直接写注释说明每个字段。
 */
module.exports = {
  // 正式环境（npm run publish，默认 --env deploy）
  deploy: {
    host: '0.0.0.0',
    port: 22,
    username: 'root',
    // 认证方式：'password' 或 'privateKey'；命令行 --key 可临时强制走秘钥登录
    authMode: 'password',
    password: 'your-password',
    privateKey: {
      privateKeyPath: '~/.ssh/id_rsa', // 支持 ~ 开头的家目录路径
      passphrase: '' // 无密码留空
    },
    serverWebPath: '/data/web/your-project',
    serverWebDist: 'dist', // 本地构建产物目录名；非 dist 时脚本会自动 mv
    preview: 'http://your-host',
    // 增量分包上传：需要单独打包/更新的子目录（相对 serverWebDist）
    splitIncludes: [],
    // true=每个 splitIncludes 子目录单独打 tar；false=整体打一个 tar
    splitUpload: true
  },

  // 沙盒环境（npm run publishes，--env sandbox）
  sandbox: {
    host: '0.0.0.0',
    port: 22,
    username: 'root',
    authMode: 'password',
    password: 'your-password',
    privateKey: {
      privateKeyPath: '~/.ssh/id_rsa',
      passphrase: ''
    },
    serverWebPath: '/data/web/your-project-sandbox',
    serverWebDist: 'dist',
    preview: 'http://your-sandbox-host',
    splitIncludes: [],
    splitUpload: true
  }
};
