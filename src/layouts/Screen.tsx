import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import styles from './Screen.module.less';
import ProjectConfig from '../../config/project.config';

export default function ScreenLayout() {
  // target background element
  const backgroundElementRef = useRef<HTMLDivElement | null>(null);
  //
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (!backgroundElementRef.current) {
        return;
      }
      const { parentElement } = backgroundElementRef.current;
      if (!parentElement || !ProjectConfig.screenWeb) {
        return;
      }
      const widthScale = parentElement.offsetWidth / ProjectConfig.screenWeb.width;
      const heightScale = parentElement.offsetHeight / ProjectConfig.screenWeb.height;
      backgroundElementRef.current.style.transform = `scale(${widthScale}, ${heightScale})`;
    });
    if (backgroundElementRef.current && backgroundElementRef.current.parentElement) {
      observer.observe(backgroundElementRef.current.parentElement);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div
        className={styles.background}
        style={{
          width: ProjectConfig.screenWeb?.width ?? 0,
          height: ProjectConfig.screenWeb?.height ?? 0
        }}
        ref={backgroundElementRef}
      >
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
