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
    if (!window.ENV.checkToken) {
      setLoading(false);
      return;
    }

    const reLogin = () => {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    };

    // 系统登录判断 -- 优先判断sso登录 --- 正常账号密码登录判断 --- 未登录
    setLoading(true);
    //  存在单点登录
    const query = QueryString.parse(location.search.replace('?', ''));
    if (query.token) {
      // 执行 sso登录
      api.user.ssoLogin(query).then((success) => {
        if (success) {
          setLoading(false);
        } else {
          reLogin();
        }
      });
      return;
    }
    // 非单点登录 --- 账号密码登录
    api.user.isLogin().then((success) => {
      if (success) {
        setLoading(false);
      } else {
        reLogin();
      }
    });
  }, []);

  if (loading) {
    return (
      <Spin
        spinning
        tip="登录中..."
        size="large"
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      />
    );
  }
  return <Outlet />;
}
