export default [
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
    component: './pages/parent',
    children: [
      {
        name: '二级主页',
        path: '/child2',
        component: './pages/child',
        children: [
          {
            name: '三级主页',
            path: './child3',
            component: './pages/grandson'
          }
        ]
      }
    ]
  },
  {
    component: './pages/404'
  }
];
