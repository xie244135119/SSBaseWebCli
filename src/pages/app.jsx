import React from 'react';
// import AnsycIndex from './ansycindex';

const AnsycIndex = React.lazy(() => import('./ansycindex'));
const AnsycIndex2 = React.lazy(() => import('./ansycindex2'));
//
export default function AppIndex() {
  return (
    <div>
      <span>默认首页，App主页</span>
      <React.Suspense fallback={<div>加载中...</div>}>
        <AnsycIndex />
        <AnsycIndex2 />
      </React.Suspense>
    </div>
  );
}
