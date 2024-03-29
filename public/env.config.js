window.ENV = (() => ({
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
