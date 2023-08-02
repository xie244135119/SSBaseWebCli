window.ENV = (() => ({
  // runtime config
  WEB_VERSION: 'v1.0.0',
  // runtime console
  console: true
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
