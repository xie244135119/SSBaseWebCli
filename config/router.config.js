export default [
  {
    path: '/test',
    component: './pages/test',
    name: '测试网页',
    children: [
      {
        path: './child',
        name: '嵌套路由',
        component: './pages/child',
        children: [
          {
            path: './second',
            name: '嵌套子路由',
            component: './pages/secondchild'
          }
        ]
      }
    ]
  },
  {
    path: '/directory',
    component: './pages/Help/directory'
  },
  {
    path: '/',
    redirect: '/directory'
  },
  {
    component: './pages/404'
  }
];
