// 纯 ambient 声明文件（无 import/export），保证 declare module 作为全局环境声明生效。
declare module 'path-browserify' {
  const path: {
    join: (...paths: string[]) => string;
    resolve: (...paths: string[]) => string;
    normalize: (p: string) => string;
    sep: string;
    delimiter: string;
  };
  export default path;
}
