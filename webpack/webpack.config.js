const path = require("path");

let isEnvProduction = process.env.NODE_ENV === "production";
//
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const AnalyzerWebpackPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/**
 * 处理通用的解析
 */
const getStyleLoaders = (extraLoaders = []) => {
  //
  let loaders = [
    // 开发环境
    !isEnvProduction && "style-loader",
    // 生产环境
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: "css-loader",
      options: {
        import: true,
        sourceMap: !isEnvProduction,
        modules: {
          compileType: "module",
          mode: "local",
          localIdentName: isEnvProduction ? "[hash:base64]" : "[path][name]__[local]",
          localIdentContext: path.resolve(__dirname, "../src/"),
          localIdentHashPrefix: "hash",
          // 直接命名导出
          namedExport: false
        }
      }
    }
  ].filter(Boolean);
  if (typeof extraLoaders === "object" && extraLoaders.length > 0) {
    loaders = loaders.concat(extraLoaders);
  }
  return loaders;
};

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js"
  },
  // 错误信息
  stats: "verbose",
  //
  devtool: "none",
  //
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[chunkhash].js",
    //
    // publicPath: '/',
    sourcePrefix: ""
  },
  performance: {
    hints: "warning",
    // 文件暂定 2M的大小 单位字节
    maxAssetSize: 2 * 1024 * 1024,
    // 入口大小，单位字节， 暂定1M
    maxEntrypointSize: 1 * 1024 * 1024
  },
  watch: true,
  watchOptions: {
    // 延迟指定时间后更新
    aggregateTimeout: 300,
    //
    ignored: "/node_modules/",
    // 定期轮询时间
    poll: 1000
  },
  // 优化
  optimization: {
    // 生产环境压缩，测试环境不压缩
    minimize: isEnvProduction,
    chunkIds: "named",
    // minimize: true,
    splitChunks: {
      chunks: "all",
      // maxSize: 0,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // 拆分前必须共享的最大模块数
      minChunks: 1,
      // 100 kb
      minSize: 30 * 1024,
      // 8M
      maxSize: 8 * 1024 * 1024,
      //
      // name: isEnvProduction,
      name: true,
      //
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
          // filename: '[name].bundle.js',
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
          // filename: '[name].bundle.js',
        }
      }
    },
    runtimeChunk: {
      // name: 'manifest',
    }
  },
  //
  target: "web",
  // 模块
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|public)/,
        use: { loader: "babel-loader" }
      },
      {
        test: /\.(js|jsx)$/,
        include: /three.interaction/,
        // include: [
        //   path.resolve(__dirname, '../node_modules/three.interaction'),
        // ],
        use: { loader: "babel-loader" }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
              name: "static/[hash].[ext]"
              // name: 'static/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(mp4)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024,
              name: "static/[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "static/[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        // exclude: /(node_modules)/,
        include: /(node_modules)/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /(node_modules)/,
        use: getStyleLoaders([
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isEnvProduction
            }
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: ["./src/index.less", "./src/styles/vars.less"]
            }
          }
        ])
      },
      {
        test: /\.less$/,
        exclude: /(node_modules)/,
        use: getStyleLoaders([
          {
            loader: "less-loader",
            options: {
              sourceMap: !isEnvProduction
            }
          },
          {
            loader: "style-resources-loader",
            options: {
              patterns: ["./src/index.less", "./src/styles/vars.less"]
            }
          }
        ])
      }
    ]
  },
  resolve: {
    // 自动解析扩展，方便引入文件时不需要写上扩展
    extensions: [".js", ".jsx", ".json"],
    // 别名解析
    alias: {
      "@": path.resolve(__dirname, "../src/")
    },
    // 从哪个字段解析模块
    mainFields: ["es2015", "browser", "module", "main"],
    // 解析目录使用的文件名
    mainFiles: ["index"],
    // modules 模块对应的目录
    modules: ["node_modules"]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "public", to: "public" },
        { from: "config/env.config.js", to: "config/env.config.js" }
      ]
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: "body",
      template: require("html-webpack-template"),
      //
      appMountId: "app",
      title: "项目Web 标准化模板"
    }),
    new HtmlWebpackTagsPlugin({
      append: false,
      scripts: ["config/env.config.js", "public/rem/rem.js"]
    }),
    isEnvProduction && new MiniCssExtractPlugin(),
    !isEnvProduction &&
      new ESLintPlugin({
        extensions: ["js", "jsx", "tsx"],
        exclude: "node_modules",
        fix: false,
        // 弹出警告
        emitWarning: true,
        // 出错报错
        failOnError: true
      })
    // !isEnvProduction && new AnalyzerWebpackPlugin({
    //   analyzerHost: '0.0.0.0',
    //   analyzerPort: 28888,
    // }),
  ].filter(Boolean)
};
