import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ChildIndex() {
  return (
    <div>
      <span>二级页面</span>
      <Outlet />
    </div>
  );
}
