import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function ChildIndex(props) {


  return (
    <div>
      <span>二级页面</span>
      <Outlet />
    </div>
  );
}
