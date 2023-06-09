const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
// const AnalyzerWebpackPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    compress: true,
    open: true,
    hot: true,
    client: {
      logging: 'none',
      overlay: {
        errors: true,
        warnings: false
      },
      progress: false,
      reconnect: true
    },
    proxy: {
      // '/api': {
      //   target: 'http://192.168.1.220:8080/',
      //   pathRewrite: { '/api': '' }
      // }
    },
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
