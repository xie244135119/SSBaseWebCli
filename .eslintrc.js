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
  extends: ['airbnb', 'airbnb/hooks'],
  plugins: ['react'],
  // 指定解析器
  parser: '@babel/eslint-parser',
  // 解析器选项
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/webpack.config.js'
      }
    }
  },
  // // 特定规则
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-continue': 'warn',
    'object-curly-newline': 'off',
    'import/no-dynamic-require': 'off',
    'operator-linebreak': 'off',
    'global-require': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { props: false }],
    'class-methods-use-this': 'off',
    'no-confusing-arrow': 'off',
    'react/jsx-key': 'error',
    'function-paren-newline': 'off'
  }
};
