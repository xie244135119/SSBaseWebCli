window.ENV = (() => ({
  // runtime console
  console: true,
  // 是否需要登录 <false：忽略登录>
  checkToken: false,
  // 网络请求前缀 <两种业务场景 1，统一网关场景统一前缀  2，前端项目部署二级目录>
  requestBaseUrl: ''
  //
}))();

if (window.ENV.console === false) {
  console.log = function (oriLogFunc) {
    return function () {
      // eslint-disable-next-line prefer-rest-params
      oriLogFunc.apply(this, arguments);
    };
  };
}
