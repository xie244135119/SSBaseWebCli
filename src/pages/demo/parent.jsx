import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import api from '@/services/api';

export default function ParentIndex() {
  useEffect(() => {
    api.test
      .testGet()
      .then((res) => {
        console.log('get data success ', res);
      })
      .catch((e) => {
        console.log(' e ', e);
      });
  }, []);

  return (
    <div>
      <span>父类页面</span>
      <Outlet />
    </div>
  );
}
