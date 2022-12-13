import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ParentIndex(props) {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  return (
    <div>
      <span>父类页面</span>
      <Outlet />
    </div>
  );
}
