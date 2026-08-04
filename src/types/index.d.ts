import type { ReactNode } from 'react';

/**
 * 全局类型声明：由于本文件含 import，被视作模块，
 * 需通过 declare global 暴露全局类型，否则 config/*.ts 无法识别 RouteConfigItem 等。
 */
declare global {
  /**
   * 版本号（vite define 注入）
   */
  const __APP_VERSION__: string;

  interface Window {
    /**
     * 运行时环境变量（由 public/env.config.js 注入）
     */
    ENV: {
      /**
       * @description 是否登录验证 false:跳过 默认true
       */
      checkToken: boolean;
      /**
       * @description 网络请求统一前缀，nginx配置下使用
       */
      requestBaseUrl: string;
      /**
       * @description 是否启用 mock 数据
       */
      useMock?: boolean;
      //
      [key: string]: any;
    };
    [propName: string]: any;
  }

  /**
   * 项目配置
   */
  interface ProjectItem {
    /**
     * @description 标题
     */
    title: string;
    /**
     * @description 部署的目录地址 <用于二级部署目录下>
     */
    directory?: string;
    /**
     * @description 可视化大屏 配置
     */
    screenWeb?: {
      width: number;
      height: number;
    };
    /**
     * @description 后台管理系统 配置基准分辨率
     */
    backgroundWeb?: {
      width: number;
      height: number;
    };
    /**
     * @description 请求体系
     */
    request: {
      ignoreContentTypes: string[];
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
     * 菜单图标
     */
    icon?: ReactNode;
    /**
     * 选中的菜单样式
     */
    selectIcon?: ReactNode;
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
     * 组件名称（src 下相对路径）
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
    /**
     * 路由项透传给组件的额外参数
     */
    routes?: RouteConfigItem[];
    [key: string]: any;
  }
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.json' {
  const classes: any;
  export default classes;
}

declare module '*.png' {
  const classes: string;
  export default classes;
}

declare module '*.png?url' {
  const classes: string;
  export default classes;
}

declare module '*.jpeg' {
  const classes: string;
  export default classes;
}

declare module '*.jpg' {
  const classes: string;
  export default classes;
}

declare module '*.tiff' {
  const classes: string;
  export default classes;
}

declare module '*.bmp' {
  const classes: string;
  export default classes;
}

declare module '*.gif' {
  const classes: string;
  export default classes;
}

declare module '*.svg' {
  const classes: string;
  export default classes;
}
