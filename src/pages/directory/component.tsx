import React, { useEffect, useState } from 'react';
import styles from './component.module.less';
import ProjectConfig from '../../../config/project.config';

const ComponentModules = import.meta.glob(['../../components/*/*.*sx'], {
  eager: true
});

export default function Component() {
  // 组件列表
  const [componentList, setComponentList] = useState<
    {
      url: string;
      c: React.JSX.Element;
    }[]
  >();

  useEffect(() => {
    const list = [];
    Object.keys(ComponentModules).forEach((e) => {
      const C = ComponentModules[e].default;
      list.push({
        url: e,
        c: <C style={{ width: 350 }} />
      });
    });
    setComponentList(list);
  }, []);

  return (
    <div className={styles.background}>
      <h2 style={{ margin: 0 }}>{ProjectConfig.title} - 目录</h2>
      <h4 style={{ margin: '15px 0px 0px' }}>
        版本号：
        {__APP_VERSION__}
      </h4>
      {componentList?.map((item, index) => (
        <div key={item.url} className={styles.block}>
          <span className={styles.name}>
            【{index + 1}】 ，{item.url}
          </span>
          {item.c}
        </div>
      ))}
    </div>
  );
}
