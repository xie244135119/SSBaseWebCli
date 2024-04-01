/**
 * 版本号
 */
declare let __APP_VERSION__: string;

interface Window {
  ENV: any;
  [propName: string]: any;
}

/**
 * 项目配置
 */
interface ProjectItem {
  /**
   * 标题
   */
  title: string;
  /**
   * 部署的目录地址 <用于二级部署目录下>
   */
  directory?: string;
  /**
   * 可视化大屏 配置
   */
  screenWeb?: {
    width: number;
    height: number;
  };
  /**
   * 后台管理系统 配置基准分辨率
   */
  backgroundWeb?: {
    width: number;
    height: number;
  };
  [key: string]: any;
}

/**
 * 路由配置
 */
interface RouteConfigItem {
  /**
   * 路由名称
   */
  name?: string;
  /**
   * 路径名称
   */
  path?: string;
  /**
   * 完整路径
   */
  fullPath?: string;
  /**
   * 隐藏在菜单中
   */
  hideInMenu?: boolean;
  /**
   * 权限
   */
  authorization?: string[];
  /**
   * 组件名称
   */
  component?: string;
  /**
   * 重定向地址
   */
  redirect?: string;
  /**
   * 子级
   */
  children?: RouteConfigItem[];
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const classes: string;
  export default classes;
}
