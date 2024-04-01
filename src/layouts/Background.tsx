import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Avatar, Breadcrumb, ConfigProvider, Dropdown } from 'antd';
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import zhCn from 'dayjs/locale/zh-cn';
import ZhCN from 'antd/locale/zh_CN';
import styles from './Background.module.less';
import RouterConfig, { getRouteByPathName } from '../../config/router.config';
import ProjectConfig from '../../config/project.config';
import api from '@/services/api';

dayjs.locale(zhCn);

/**
 * 面包屑
 * @param {*} route
 * @param {*} params
 * @returns
 */
function BreadcrumbRoute({ route }) {
  const { title = '', path = '' } = route;
  return (
    <a href={path} key={path} style={{ color: 'unset' }}>
      {title}
    </a>
  );
}

BreadcrumbRoute.propTypes = {
  route: PropTypes.object
};

BreadcrumbRoute.defaultProps = {
  route: null
};

export default function BackgroundLayout() {
  //
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundElementRef = useRef<HTMLDivElement>();
  // 加载的层级路由
  const [routes, setRoutes] = useState<RouteConfigItem[]>([]);

  // 滑块菜单配置
  const [sliderMenuConfig, setSliderMenuConfig] = useState({
    selectKeys: [],
    openKeys: []
  });

  /**
   * 面包屑
   */
  const BreadcrumbRenderItem = useCallback((route) => (
    <a key={route.path} href={route.path} style={{ color: 'unset', fontSize: 16 }}>
      {route.title}
    </a>
  ), []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const { parentElement } = backgroundElementRef.current;
      const widthScale = parentElement.offsetWidth / ProjectConfig.backgroundWeb.width;
      const heightScale = parentElement.offsetHeight / ProjectConfig.backgroundWeb.height;
      backgroundElementRef.current.style.transform = `scale(${widthScale}, ${heightScale})`;
    });
    observer.observe(backgroundElementRef.current.parentElement);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    api.user.isLogin().then((success) => {
      if (!success) {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      }
    });
  }, []);

  //
  useEffect(() => {
    const { routes } = getRouteByPathName(location.pathname);
    setRoutes(routes);
    const openRoutes = [...routes];
    openRoutes.pop();
    setSliderMenuConfig({
      openKeys: openRoutes.map((item) => item.fullPath),
      selectKeys: routes.map((item) => item.fullPath)
    });
  }, [location.pathname]);

  /**
   * 渲染菜单Items
   */
  const getMenuItems = (menus: RouteConfigItem[], target: RouteConfigItem[] = []) =>
    menus
      .filter((item) => item.name && !item.hideInMenu)
      .map((item) =>
        item.children?.filter((item) => item.name && !item.hideInMenu).length > 0
          ? {
            key: item.fullPath,
            label: item.name,
            children: getMenuItems(item.children, [...target, item])
          }
          : {
            key: item.fullPath,
            label: item.name
          }
      );

  const userDropdownItems = [
    {
      key: 'logout',
      label: '退出系统',
      icon: <LogoutOutlined />,
      onClick: () => {
        api.user.logout().then((res) => {
          if (res) {
            navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
          }
        });
      }
    }
  ];

  return (
    <ConfigProvider
      locale={ZhCN}
    >
      <div style={{ width: '100vw', height: '100vh' }}>
        <div className={styles.background} ref={backgroundElementRef}>
          {/* 顶部导航 */}
          <div className={styles.header}>
            <img className={styles.logo} alt="logo" src="/logo.png" />
            <span className={styles.logotext}>{ProjectConfig.title}</span>
            <div style={{ flex: 1 }} />
            <div className={styles.userview}>
              <Dropdown
                menu={{
                  items: userDropdownItems
                }}
              >
                <div className={styles.userInfo}>
                  <Avatar
                    style={{ backgroundColor: 'transparent', border: '2px solid #d1d1d1' }}
                    icon={<UserOutlined />}
                  />
                  <span style={{ margin: '0 10px' }}>admin</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            </div>
          </div>

          {/* 菜单视图 */}
          <div className={styles.bottom}>
            {/* 左侧菜单 */}
            <div className={styles.slider}>
              <Menu
                mode="inline"
                items={getMenuItems(RouterConfig)}
                onSelect={(item) => {
                  navigate(item.key);
                }}
                selectedKeys={sliderMenuConfig.selectKeys}
                openKeys={sliderMenuConfig.openKeys}
                onOpenChange={(keys) => {
                  setSliderMenuConfig({
                    ...sliderMenuConfig,
                    openKeys: keys
                  });
                }}
              />
            </div>
            <div className={styles.right}>
              <div className={styles.route}>
                <Breadcrumb
                  items={routes.map((item) => ({
                    key: item.name,
                    title: item.name,
                    path: item.fullPath
                  }))}
                  className={styles.breadcrumb}
                  itemRender={BreadcrumbRenderItem}
                />
              </div>
              <div className={styles.contentview}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
