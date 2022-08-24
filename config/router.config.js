export default [
  {
    path: '/test',
    component: './pages/test',
    name: '测试网页'
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
