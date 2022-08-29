const path = require('path');
//
const isEnvProduction = process.env.NODE_ENV === 'production';
//
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const AnalyzerWebpackPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * 处理通用的解析
 */
const getStyleLoaders = (extraLoaders = []) => {
  //
  let loaders = [
    // 开发环境
    !isEnvProduction && 'style-loader',
    // 生产环境
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: 'css-loader',
      options: {
        import: true,
        sourceMap: !isEnvProduction,
        modules: {
          compileType: 'module',
          mode: 'local',
          localIdentName: isEnvProduction ? '[hash:base64]' : '[path][name]__[local]',
          localIdentContext: path.resolve(__dirname, '../src/'),
          localIdentHashPrefix: 'hash',
          namedExport: false
        }
      }
    }
  ].filter(Boolean);
  if (typeof extraLoaders === 'object' && extraLoaders.length > 0) {
    loaders = loaders.concat(extraLoaders);
  }
  return loaders;
};

module.exports = {
  mode: 'production',
  entry: {
    indexentiy: './src/index.js'
  },
  stats: 'verbose',
  devtool: 'none',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[id].chunk.js',
    //
    publicPath: '/',
    sourcePrefix: ''
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 2 * 1024 * 1024,
    maxEntrypointSize: 1 * 1024 * 1024
  },
  watch: true,
  watchOptions: {
    //
    aggregateTimeout: 300,
    //
    ignored: '/node_modules/',
    //
    poll: 1000
  },
  optimization: {
    // gzip
    minimize: isEnvProduction,
    chunkIds: 'named',
    runtimeChunk: 'single',
    // minimize: true,
    splitChunks: {
      // async initial all
      chunks: 'all',
      // maxSize: 0,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // split chunk minist
      minChunks: 1,
      // 30 kb
      // minSize: 30 * 1024,
      minSize: 30000,
      //
      name: true,
      //
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },

  target: 'web',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|public)/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: 'static/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(mp4)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10 * 1024,
              name: 'static/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: getStyleLoaders()
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /(node_modules)/,
        use: getStyleLoaders([
          {
            loader: 'sass-loader',
            options: {
              sourceMap: !isEnvProduction
            }
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: ['./src/styles/vars.scss']
            }
          }
        ])
      },
      {
        test: /\.less$/,
        exclude: /(node_modules)/,
        use: getStyleLoaders([
          {
            loader: 'less-loader',
            options: {
              sourceMap: !isEnvProduction
            }
          },
          {
            loader: 'style-resources-loader',
            options: {
              patterns: ['./src/index.less', './src/styles/vars.less']
            }
          }
        ])
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src/')
    },
    mainFields: ['es2015', 'browser', 'module', 'main'],
    mainFiles: ['index'],
    modules: ['node_modules']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' },
        { from: 'config/env.config.js', to: 'config/env.config.js' }
      ]
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: require('html-webpack-template'),
      inject: false,

      appMountId: 'root',
      title: '项目Web 标准化模板',
      scripts: ['config/env.config.js'],
      minify: !isEnvProduction
        ? false
        : {
            // remove comment
            removeComments: true,
            // remove empty attribute
            removeEmptyAttributes: true,
            //
            removeRedundantAttributes: true,
            //
            collapseWhitespace: false,
            //
            removeStyleLinkTypeAttributes: true,
            //
            minifyCSS: true,
            //
            minifyJS: true
          }
    }),
    isEnvProduction && new MiniCssExtractPlugin(),
    !isEnvProduction &&
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'tsx'],
        exclude: 'node_modules',
        fix: true,
        emitWarning: true,
        failOnError: true
      })
    // !isEnvProduction &&
    //   new AnalyzerWebpackPlugin({
    //     analyzerHost: '0.0.0.0',
    //     analyzerPort: 28888
    //   })
  ].filter(Boolean)
};
