import React, { useState, useEffect } from 'react';
import QueryString from 'qs';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import api from '@/services/api';

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  // 加载中
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reLogin = () => {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    };

    // 判断登录 -- 未登录 -- sso登录
    setLoading(true);
    api.user.isLogin().then((success) => {
      if (success) {
        setLoading(false);
        return;
      }
      const query = QueryString.parse(location.search.replace('?', ''));
      if (!query.user) {
        reLogin();
        return;
      }
      // 执行 sso登录
      api.user.ssoLogin(query.user as string).then((success) => {
        console.log(' sso 登录 ', success);
        if (success) {
          setLoading(false);
        } else {
          reLogin();
        }
      });
    });
  }, []);

  if (loading) {
    return <Spin spinning style={{ width: '100vw', height: '100vh' }} />;
  }
  return <Outlet />;
}
