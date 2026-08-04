import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ParentIndex() {
  return (
    <div>
      <span>父类页面</span>
      <Outlet />
    </div>
  );
}
