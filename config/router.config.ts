import path from 'path-browserify';

const RouterConfig: RouteConfigItem[] = [
  {
    path: '/directory',
    component: './pages/directory/index'
  },
  {
    path: '/',
    redirect: '/directory'
  },
  {
    name: '登录',
    path: '/login',
    hideInMenu: true,
    component: './pages/Login/index'
  },
  {
    name: '可视化大屏',
    path: '/screen',
    component: './layouts/Screen',
    children: [
      {
        path: '/',
        redirect: '/index'
      },
      {
        name: '大屏首页',
        path: '/index',
        hideInMenu: true,
        component: './pages/demo/child'
      },
      {
        name: '大屏详情',
        path: '/child',
        hideInMenu: true,
        component: './pages/demo/child'
      }
    ]
  },
  {
    name: '后台管理系统',
    path: '/background',
    component: './layouts/Background',
    children: [
      {
        path: '/',
        redirect: '/parent1'
      },
      {
        name: '页面1',
        path: '/parent1',
        component: './pages/demo/parent',
        authorization: ['admin', 'web'],
        children: [
          {
            name: '二级页面',
            path: './child',
            component: './pages/demo/child'
          }
        ]
      },
      {
        name: '页面2',
        path: '/parent2',
        component: './pages/demo/parent'
      }
    ]
  },
  {
    component: './pages/404'
  }
];

const recursion = (routes: RouteConfigItem[], targetResault: RouteConfigItem[] = []) => {
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];
    if (route.path) {
      route.fullPath = path.join(...[...targetResault, route].map((item) => item.path));
    }
    if (route.children) {
      recursion(route.children, [...targetResault, route]);
    }
  }
};
recursion(RouterConfig);

/**
 * 根据 url地址 获取路由项目列表
 * @param urlPath url地址
 */
export const getRouteByPathName = (
  urlPath: string
): { urlPath: string; routes: RouteConfigItem[] } => {
  const recursion = (routes: RouteConfigItem[], targetResault = []) => {
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      if (route.fullPath === urlPath) {
        return [...targetResault, route];
      }
      if (route.children) {
        const childresault = recursion(route.children, [...targetResault, route]);
        if (childresault.length > 0) {
          return childresault;
        }
      }
    }
    return [];
  };
  const resault = recursion(RouterConfig);
  return {
    urlPath,
    routes: resault
  };
};
export default RouterConfig;
