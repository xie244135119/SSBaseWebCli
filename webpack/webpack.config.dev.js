// const path = require('path');
const baseConfig = require('./webpack.config');
//
module.exports = {
  // ...baseConfig,
  mode: 'development',
  //
  devtool: 'cheap-module-source-map',
  // webpackDevServer配置
  devServer: {
    // 启动目录
    // contentBase: path.resolve(__dirname, 'dist'),
    // contentBase: path.resolve(__dirname, 'src'),
    // 是否压缩
    compress: true,
    //
    hot: false,
    // 入口文件
    index: 'index.html',
    // 此路径下的文件可以直接访问
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
    host: '0.0.0.0',
    port: 8000,
    // 代理
    proxy: {
      // '/api/v1/cruise/device/list': 'http://192.168.1.202:8933/',
    },
    stats: false,
    historyApiFallback: true
  }
};
