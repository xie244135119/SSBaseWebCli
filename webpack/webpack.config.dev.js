
// const path = require('path');
module.exports = {
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
    // client: {
    //   progress: true,
    //   reconnect: true,
    // },
    clientLogLevel: "none",
    //
    noInfo: true,
    // iframe模式  false 为ifame模式, true 为内联模式
    inline: true,
    // 懒性模式 << 未发现有用
    lazy: false,
    // 不再弹出信息 <替代使用stats 字段>
    // noInfo: true,
    // 自动打开浏览器
    open: true,
    // 出错弹窗显示
    overlay: {
      // errors: true,
      errors: false,
      warnings: false,
    },
    host: '0.0.0.0',
    port: 28890,
    // 代理
    proxy: {
      // '/api/v1/cruise/device/list': 'http://192.168.1.202:8933/',
      '/webapi/dataSupport': {
        target: 'http://10.2.2.246:11140',
        pathRewrite: { '/webapi/dataSupport': '' },
      },
      '/webapi/alertManager': {
        target: 'http://10.2.2.246:11180',
        pathRewrite: { '/webapi/alertManager': '' },
      },
      '/webapi/userManage': {
        target: 'http://10.2.2.246:11150',
        pathRewrite: { '/webapi/userManage': '' },
      },
    },
    // 仅错误信息提示
    // stats: 'errors-only',
    stats: false,
    // 开启history路由模式
    historyApiFallback: true,
  },
}

