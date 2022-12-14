


const path = require('path');
const directorypath = process.cwd();

const reslovePath = (relativePath) => path.join(directorypath, relativePath);


module.exports = {
    // project directory path
    directoryPath: reslovePath('.'),
    // package.json path
    packagePath: reslovePath('package.json'),
    // webapack config path
    webpackPath: reslovePath('/webpack'),
    // script path
    scriptPath: reslovePath('/scripts'),
}
