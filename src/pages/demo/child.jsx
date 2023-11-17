import SSCache from '@/js/SSCache';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function ChildIndex(props) {
  useEffect(() => {
    console.log(' 初始化 ');
  }, []);

  return (
    <div>
      <span>二级页面</span>
      <Outlet />
    </div>
  );
}
