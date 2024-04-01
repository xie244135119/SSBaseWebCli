import React from 'react';
import path from 'path-browserify';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import RouteConfig from '../../../config/router.config';
import ProjectConfig from '../../../config/project.config';

function Index() {
  const navigate = useNavigate();
  const getPath = (items = []) =>
    items.reduce((prev, cur) => {
      const text = path.join(prev, cur.path || '');
      return text;
    }, '');
  //
  const recursive = (items: RouteConfigItem[], index = 0, parentItems = []) =>
    items.map((item, key) => {
      if (item.redirect) {
        return null;
      }
      if (!(item.name || item.path)) {
        return null;
      }
      const itemPath = getPath([...parentItems, item]);
      return (item.children)?.length > 0 ? (
        <div
          key={`${item.path + key}`}
          style={{ display: 'flex', flexDirection: 'column', marginLeft: index * 15 }}
        >
          <div className={styles.row}>
            <span
              className={styles.pagetitle}
              onClick={() => {
                navigate(itemPath);
              }}
            >
              {item.name ? `${item.name}(${itemPath})` : itemPath}
            </span>
            <span className={styles.filetitle}>{path.join('src', item.component || '')}</span>
          </div>
          {recursive(item.children, index + 1, [...parentItems, item])}
        </div>
      ) : (
        <div key={item.path} className={styles.row}>
          <span
            key={`${item.path + key}`}
            className={styles.pagetitle}
            style={{ marginLeft: index * 15 }}
            onClick={() => {
              navigate(itemPath);
            }}
          >
            {item.name ? `${item.name}(${itemPath})` : itemPath}
          </span>
          <span className={styles.filetitle}>{path.join('src', item.component || '')}</span>
        </div>
      );
    });

  return (
    <div className={styles.background}>
      {/* <h2>测试目录</h2> */}
      <h2 style={{ margin: 0 }}>
        {ProjectConfig.title}
        {' '}
        - 前端目录
      </h2>
      <h4 style={{ margin: '15px 0px 0px' }}>
        版本号：
        {__APP_VERSION__}
      </h4>
      {/* <h6 style={{ margin: '10px 0px 0px' }}>注：下面的文件仅为示例，开发时可直接删除</h6> */}
      {recursive(RouteConfig)}
    </div>
  );
}

export default Index;
