import React from 'react';
import PropTypes from 'prop-types';
import RouteIndex from '../../routeIndex';
import styles from './directory.less';
import DefautSetting from '@/defaultSetting';

export default function Index(props) {
  return (
    <div className={styles.background}>
      <h2>文件目录</h2>
      <h4>
        版本号：
        {DefautSetting.WEB_DEV_VERSION}
      </h4>
      {RouteIndex.getCacheRoutes()
        .filter((item) => item.name !== '' && item.name !== undefined)
        .map((item) => (
          <div
            key={item.path}
            className={styles.pagetitle}
            onClick={() => {
              const { history } = props;
              history.push(item.path);
            }}
          >
            <span style={{ marginTop: 15 }}>{item.name}</span>
          </div>
        ))}
    </div>
  );
}

Index.propTypes = {
  // 路由
  history: PropTypes.objectOf(
    PropTypes.shape({
      push: () => {}
    })
  )
};

Index.defaultProps = {
  history: {
    push: () => {},
    length: 0
  }
};
