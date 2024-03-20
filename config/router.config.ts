export type RouteConfigItem = {
  name?: string;
  path?: string;
  component?: string;
  redirect?: string;
  children?: RouteConfigItem[];
};

const configs: RouteConfigItem[] = [
  {
    path: '/directory',
    component: './pages/directory/index'
  },
  {
    path: '/',
    redirect: '/directory'
  },
  {
    name: '一级主页',
    path: '/parent',
    component: './pages/demo/parent',
    children: [
      {
        path: '/',
        redirect: '/child'
      },
      {
        name: '二级主页',
        path: '/child',
        component: './pages/demo/child',
        children: [
          {
            name: '三级主页',
            path: './grandson',
            component: './pages/demo/grandson'
          }
        ]
      }
    ]
  },
  {
    component: './pages/404'
  }
];

export default configs;