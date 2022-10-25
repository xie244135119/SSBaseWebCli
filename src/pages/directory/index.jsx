import React from 'react';
import path from 'path';
import { useHistory } from 'react-router-dom';
import styles from './index.less';
import RouteConfig from '../../../config/router.config';

function Index() {
  const history = useHistory();
  const getPath = (items = []) =>
    items.reduce((prev, cur) => {
      const text = path.join(prev, cur.path || '');
      return text;
    }, '');
  const recursive = (items = [{}], index = 0, parentItems = []) =>
    items.map((item, key) => {
      if (item.redirect) {
        return null;
      }
      const itemPath = getPath([...parentItems, item]);
      return (item.children || item.routes)?.length > 0 ? (
        <div
          key={`${item.path + key}`}
          style={{ display: 'flex', flexDirection: 'column', marginLeft: index * 15 }}
        >
          <span
            className={styles.pagetitle}
            onClick={() => {
              history.push(itemPath);
            }}
          >
            {item.name ? `${item.name}(${itemPath})` : itemPath}
          </span>
          {recursive(item.children || item.routes, index + 1, [...parentItems, item])}
        </div>
      ) : (
        <span
          key={`${item.path + key}`}
          className={styles.pagetitle}
          style={{ marginLeft: index * 15 }}
          onClick={() => {
            history.push(itemPath);
          }}
        >
          {item.name ? `${item.name}(${itemPath})` : itemPath}
        </span>
      );
    });

  return (
    <div className={styles.background}>
      <h2 style={{ margin: 0 }}>文件目录</h2>
      <h4 style={{ margin: '15px 0px 0px' }}>
        版本号：
        {window.ENV.WEB_VERSION}
      </h4>
      {recursive(RouteConfig)}
    </div>
  );
}

export default Index;
