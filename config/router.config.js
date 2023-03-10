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
    component: './pages/demo/parent',
    children: [
      // {
      //   path: '/',
      //   redirect: '/child2'
      // },
      {
        name: '二级主页',
        path: '/child2',
        component: './pages/demo/child',
        children: [
          {
            name: '三级主页',
            path: './child3',
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
