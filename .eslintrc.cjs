module.exports = {
  root: true,
  env: {
    // window
    browser: true,
    es6: true,
    // node
    node: true,
    // require define
    amd: true,
    //
    es2020: true
  },
  extends: ['airbnb', 'airbnb/hooks'],
  plugins: ['react', '@typescript-eslint'],
  settings: { react: { version: '18.2' } },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
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
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
};
