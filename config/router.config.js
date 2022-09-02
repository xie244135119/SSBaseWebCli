export default [
  {
    name: '主页',
    path: '/app',
    component: './pages/app'
  },
  {
    name: '异步主页',
    path: '/ansycindex',
    component: './pages/ansycindex'
  },
  {
    name: '异步主页2',
    path: '/ansycindex2',
    component: './pages/ansycindex2'
  },
  {
    path: '/directory',
    component: './pages/directory/index'
  },
  {
    path: '/',
    redirect: '/directory'
  },
  {
    component: './pages/404'
  }
];
