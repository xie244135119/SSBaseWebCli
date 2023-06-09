const path = require('path-browserify');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
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
          mode: 'local',
          localIdentName: '[path][name]__[local]',
          localIdentContext: path.resolve(__dirname, '../src/'),
          localIdentHashSalt: 'hash',
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
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: 'js/[name].[chunkhash].chunk.js',
    assetModuleFilename: 'static/[hash][ext][query]',
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
    aggregateTimeout: 300,
    ignored: '/node_modules/',
    poll: 1000
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|public)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: isDev ? [require.resolve('react-refresh/babel')] : []
          }
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|mp4|svg|fbx|FBX|obj|gltf|glb)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
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
    isDev && new ReactRefreshPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: 'public' },
        { from: 'config/env.config.js', to: 'config/env.config.js' },
        { from: 'favicon.ico', to: 'favicon.ico' }
      ]
    }),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[chunkhash].css'
      }),
    new HtmlWebpackPlugin({
      title: '项目Web标准化模板',
      meta: {
        referrer: 'same-origin',
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      tags: {
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
      favicon: path.resolve('favicon.ico'),
      minify: isDev
        ? false
        : {
            removeComments: true,
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
  ].filter((item) => item)
};
