import React from 'react';
import PropTypes from 'prop-types';
// import RouteIndex from '../../routeIndex';
import { withRouter } from 'react-router-dom';
import styles from './index.less';
import DefautSetting from '@/defaultSetting';
import RouteConfig from '../../../config/router.config';

function Index(props) {
  //

  const recursive = (items = [{}], index = 0) =>
    items.map((item) =>
      item.children?.length > 0 ? (
        <div
          key={item.path}
          style={{ display: 'flex', flexDirection: 'column', marginLeft: index * 15 }}
        >
          <span
            className={styles.pagetitle}
            onClick={() => {
              const { history } = props;
              history.push(item.path);
            }}
          >
            {item.name}
          </span>
          {recursive(item.children, index + 1)}
        </div>
      ) : (
        <span
          key={item.path}
          className={styles.pagetitle}
          style={{ marginLeft: index * 15 }}
          onClick={() => {
            const { history } = props;
            history.push(item.path);
          }}
        >
          {item.name}
        </span>
      ));

  return (
    <div className={styles.background}>
      <h2>文件目录</h2>
      <h4>
        版本号：
        {DefautSetting.WEB_DEV_VERSION}
      </h4>
      {recursive(RouteConfig)}
    </div>
  );
}

export default withRouter(Index);

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