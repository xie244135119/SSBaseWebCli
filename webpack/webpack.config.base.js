const path = require('path-browserify');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDev = process.env.BABEL_ENV === 'development';

/**
 * style loader
 */
const getStyleLoaders = (extraLoaders = [], sourceMap = false) => {
  //
  let loaders = [
    sourceMap
      ? 'style-loader'
      : {
          loader: MiniCssExtractPlugin.loader
        },
    {
      loader: 'css-loader',
      options: {
        import: true,
        sourceMap,
        modules: {
          compileType: 'module',
          mode: 'local',
          localIdentName: '[path][name]__[local]',
          localIdentContext: path.resolve(__dirname, '../src/'),
          localIdentHashPrefix: 'hash',
          namedExport: false
        }
      }
    }
  ];
  if (typeof extraLoaders === 'object' && extraLoaders.length > 0) {
    loaders = loaders.concat(extraLoaders);
  }
  return loaders;
};

/**
 * less loader
 */
const getLessRule = (sourceMap = false) => ({
  test: /\.less$/,
  exclude: /(node_modules)/,
  use: getStyleLoaders(
    [
      {
        loader: 'less-loader',
        options: {
          sourceMap: sourceMap
        }
      },
      {
        loader: 'style-resources-loader',
        options: {
          patterns: ['./src/styles/vars.less']
        }
      }
    ],
    sourceMap
  )
});

/**
 * scss loader
 */
const getScssRule = (sourceMap = false) => ({
  test: /\.(sass|scss)$/,
  exclude: /(node_modules)/,
  use: getStyleLoaders(
    [
      {
        loader: 'sass-loader',
        options: {
          sourceMap
        }
      },
      {
        loader: 'style-resources-loader',
        options: {
          patterns: ['./src/styles/vars.scss']
        }
      }
    ],
    sourceMap
  )
});
module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  stats: 'none',
  devtool: 'none',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[fullhash].bundle.js',
    chunkFilename: 'js/[name].[fullhash].chunk.js',
    //
    publicPath: '/',
    sourcePrefix: '',
    clean: true
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
  //  optimization: {
  //   // gzip
  //   minimize: isEnvProduction,
  //   chunkIds: 'named',
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     // async initial all
  //     chunks: 'all',
  //     // maxSize: 0,
  //     // maxAsyncRequests: 5,
  //     // maxInitialRequests: 3,
  //     // split chunk minist
  //     minChunks: 3,
  //     // 30 kb
  //     // minSize: 30 * 1024,
  //     minSize: 30 * 1024,
  //     //
  //     name: false,
  //     cacheGroups: {
  //       vendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         chunks: 'all'
  //       },
  //       css: {
  //         name: 'css',
  //         test: /\.css$/,
  //         minChunks: 1,
  //         enforce: true,
  //         priority: -5
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true
  //       }
  //     }
  //   }
  // },

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
        include: /(node_modules)/,
        use: [
          isDev
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader
              },
          'css-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /(node_modules)/,
        use: getStyleLoaders([], isDev)
      },
      getLessRule(isDev),
      getScssRule(isDev)
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
        { from: 'config/env.config.js', to: 'config/env.config.js' },
        { from: 'favicon.ico', to: 'favicon.ico' }
      ]
    }),
    // new CleanWebpackPlugin(),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css'
      }),
    new HtmlWebpackPlugin({
      title: '项目Web标准化模板',
      meta: {
        referrer: 'same-origin',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      tags: {
        // headTags: ['/config/env.config.js'],
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: '/config/env.config.js'
            }
          }
        ]
      },
      assets: {
        js: ['/config/env.config.js']
      },
      showErrors: true,
      scriptLoading: 'blocking',
      // scripts: ['/config/env.config.js'],
      favicon: path.resolve('favicon.ico'),
      minify: isDev
        ? false
        : {
            // remove comment
            removeComments: true,
            // remove empty attribute
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            collapseWhitespace: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true
          }
    }),
    new HtmlWebpackTagsPlugin({
      append: false,
      scripts: ['config/env.config.js']
    })
    // new HtmlWebpackPlugin({
    //   template: require('html-webpack-template'),
    //   inject: false,
    //   meta: [
    //     {
    //       name: 'referrer',
    //       content: 'same-origin'
    //     },
    //     {
    //       name: 'viewport',
    //       content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
    //     }
    //   ],
    //   appMountId: 'root',
    //   title: '项目Web标准化模板',
    //   favicon: path.resolve('favicon.ico'),
    //   scripts: ['/config/env.config.js'],
    //   minify: isDev
    //     ? false
    //     : {
    //         // remove comment
    //         removeComments: true,
    //         // remove empty attribute
    //         removeEmptyAttributes: true,
    //         removeRedundantAttributes: true,
    //         collapseWhitespace: false,
    //         removeStyleLinkTypeAttributes: true,
    //         minifyCSS: true,
    //         minifyJS: true
    //       }
    // })
  ].filter((item) => item)
};
