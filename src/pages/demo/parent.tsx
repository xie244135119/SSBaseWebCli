import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import api from '@/services/api';

export default function ParentIndex() {


  return (
    <div>
      <span>父类页面</span>
      <Outlet />
    </div>
  );
}
