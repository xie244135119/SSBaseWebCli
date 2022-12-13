window.ENV = (() => ({
  // runtime config
  WEB_VERSION: 'v1.0.0'
  //
}))();

if (window.ENV.DEBUG === false) {
  console.log = function (oriLogFunc) {
    return function () {
      oriLogFunc.apply(this, arguments);
    };
  };
}
