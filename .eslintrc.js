module.exports = {
  // 特定项目下，不再检索上级目录
  root: true,
  env: {
    // window
    browser: true,
    es6: true,
    // node
    node: true,
    // require define
    amd: true
  },
  extends: ['airbnb', 'airbnb/hooks'],
  plugins: ['react'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/webpack.config.base.js'
      }
    }
  },
  // 特定规则
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
    'function-paren-newline': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/forbid-prop-types': 'off',
    'no-unused-vars': 'warn',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'react/prop-types': [1],
    'react/no-array-index-key': [1],
    'react/require-default-props': 'warn',
    camelcase: 'warn',
    'default-param-last': 'warn'
  }
};
