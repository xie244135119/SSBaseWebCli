module.exports = {
  mode: 'development',
  //
  devtool: 'cheap-module-source-map',
  // webpackDevServer config
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    //
    hot: false,
    index: 'index.html',
    // publicPath: '/',
    // 启动之前
    // after: (app) => {
    //   console.log(' dev server 启动之后 ', app);
    // },
    // // 启动之后
    // before: (app) => {
    //   console.log(' dev server 启动之前 ', app);
    // },
    clientLogLevel: 'none',
    //
    noInfo: true,
    // iframe模式  false 为ifame模式, true 为内联模式
    inline: true,
    lazy: false,
    open: true,
    overlay: {
      errors: true,
      warnings: false
    },
    port: 8000,
    // 代理
    proxy: {},
    stats: false,
    historyApiFallback: true
  }
};
