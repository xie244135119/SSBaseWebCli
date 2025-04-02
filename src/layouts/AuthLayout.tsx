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
  // 是否有进入系统权限
  const [systemAuthorization, setSystemAuthorization] = useState(false);

  useEffect(() => {
    if (!window.ENV.checkToken) {
      setLoading(false);
      return;
    }

    const reLogin = () => {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    };

    // 判断登录 -- 优先判断sso登录 --- 如果不是单点登录情况 --- 未登录
    setLoading(true);
    //  存在单点登录
    const query = QueryString.parse(location.search.replace('?', ''));
    if (query.user) {
      // 执行 sso登录
      api.user.ssoLogin(query.token as string).then((success) => {
        if (success) {
          setLoading(false);
          setSystemAuthorization(true);
        } else {
          setLoading(false);
          setSystemAuthorization(false);
          // reLogin();
        }
      });
      return;
    }
    // 非单点登录 --- 普通处理
    api.user.isLogin().then((loginres) => {
      if (loginres.login) {
        setLoading(false);
        setSystemAuthorization(loginres.permission);
      } else {
        setLoading(false);
        reLogin();
      }
    });
  }, []);

  // 登录成功
  useEffect(() => {
    if (!systemAuthorization) {
      return;
    }
    api.user.getInfo().then((res) => {
      if (res.status === 'SUCCESS') {
        if (res.data.menu) {
          res.data.menuArray = JSON.parse(res.data.menu);
        } else {
          res.data.menuArray = [];
        }
        // setUserInfo(res.data);
      }
    });
  }, [systemAuthorization]);

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
