module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // modules: false,
        // "targets": {  }
        // useBuiltIns: 'entry'
        // targets:{ node: 'current' }
        // exclude: ['three.interaction']
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    ['@babel/plugin-proposal-class-properties'],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib', // libraryDirectory 默认为 lib
        style: 'css'
      }
    ]
  ]
};
