import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import styles from './Screen.module.less';
import ProjectConfig from '../../config/project.config';

export default function ScreenLayout() {
  // target background element
  const backgroundElementRef = useRef<HTMLDivElement>();
  //
  const navigate = useNavigate();

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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div className={styles.background} ref={backgroundElementRef}>
        <div className={styles.layoutheaderview}>
          <img alt="headertitle" src="" className={styles.headerbg} />
        </div>
        <div className={styles.layoutcontentview}>
          <Outlet />
        </div>
        <Button
          size="large"
          style={{ position: 'absolute', bottom: 50, right: 50 }}
          type="primary"
          onClick={() => {
            navigate('/background');
          }}
        >
          返回管理系统
        </Button>
      </div>
    </div>
  );
}
