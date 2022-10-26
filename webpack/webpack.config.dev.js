const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const AnalyzerWebpackPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  // webpackDevServer config
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    //
    hot: true,
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
    // proxy: {},
    stats: false,
    historyApiFallback: true
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'tsx'],
      exclude: 'node_modules',
      fix: true,
      emitWarning: true,
      failOnError: true
    }),
    new webpack.HotModuleReplacementPlugin()
    //   new AnalyzerWebpackPlugin({
    //     analyzerHost: '0.0.0.0',
    //     analyzerPort: 28888
    //   })
  ]
};
