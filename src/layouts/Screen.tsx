import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import styles from './Screen.module.less';
import ProjectConfig from '../../config/project.config';
import api from '@/services/api';

export default function ScreenLayout() {
  // target background element
  const backgroundElementRef = useRef<HTMLDivElement>();
  //
  const navigate = useNavigate();
  //
  const location = useLocation();

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const { parentElement } = backgroundElementRef.current;
      const widthScale = parentElement.offsetWidth / ProjectConfig.screenWeb.width;
      const heightScale = parentElement.offsetHeight / ProjectConfig.screenWeb.height;
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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className={styles.background} ref={backgroundElementRef}>
        <div className={styles.layoutheaderview}>
          <img alt="headertitle" src="" className={styles.headerbg} />
          <Button
            type="primary"
            onClick={() => {
              navigate('/background');
            }}
          >
            返回管理系统
          </Button>
        </div>
        <div className={styles.layoutcontentview}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
