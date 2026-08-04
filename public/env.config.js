window.ENV = (() => ({
  // 是否开启 console（false 时禁用所有 console.* 输出）
  console: true,
  // 是否需要登录 <false：忽略登录>
  checkToken: true,
  // 网络请求前缀 <两种业务场景 1，统一网关场景统一前缀  2，前端项目部署二级目录>
  requestBaseUrl: ''
}))();

// 关闭 console 输出（生产环境屏蔽调试日志）
if (window.ENV.console === false) {
  ['log', 'info', 'debug', 'warn', 'error', 'table'].forEach((method) => {
    // eslint-disable-next-line no-console
    console[method] = () => {};
  });
}
