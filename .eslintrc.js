module.exports = {
  // 特定项目下，不再检索上级目录
  root: true,
  env: {
    // 浏览器中的全局变量 如window等
    browser: true,
    // 启用es6
    es6: true,
    // 启用node
    node: true,
    // 允许require和define为全局变量
    amd: true
  },
  extends: [
    // 默认推荐的规则
    "eslint:recommended",
    // react项目推荐的规则
    "plugin:react/recommended"
  ],
  plugins: ["react"],
  // 指定解析器
  parser: "babel-eslint",
  // 解析器选项
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  // 特定规则
  rules: {
    "no-unused-expressions": "warn",
    "no-unused-vars": "warn",
    "no-debugger": "error",
    "no-unreachable": "warn",
    "react/prop-types": [1]
  }
};
