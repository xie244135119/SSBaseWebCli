const path = require('path-browserify');

const directorypath = process.cwd();

const reslovePath = (relativePath) => path.join(directorypath, relativePath);

module.exports = {
  // project directory path
  directoryPath: reslovePath('.'),
  // package.json path
  packageJsonPath: reslovePath('package.json'),
  // webapack config path
  webpackPath: reslovePath('/webpack'),
  // script path
  scriptPath: reslovePath('/scripts'),
  // src path
  srcPath: reslovePath('/src')
};
