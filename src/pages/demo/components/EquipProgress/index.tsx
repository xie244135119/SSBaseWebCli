import React from 'react';
import { Typography } from 'antd'; // 如果还需要 Ant Design 的 Typography 组件
import classNames from 'classnames';
import styles from './index.module.less';

const { Text } = Typography; // 保留 Text 组件，用于文本

interface LockProgressProps {
  className?: string;
  style?: React.CSSProperties;
  label: string;
  installed: number;
  uninstalled: number;
  installedColor: string; // 已安装状态点的颜色
  uninstalledColor: string; // 未安装状态点的颜色
}

// 封装一个子组件来渲染单个设备类型（门锁或雷达）的信息
function EquipProgress(props: LockProgressProps) {
  const { label, installed, uninstalled, installedColor, uninstalledColor, className, style } =
    props;
  return (
    <div className={classNames(styles.item, className)} style={style}>
      {/* 文字 */}
      <div className={styles.titleview}>
        <span className={styles.label}>{label}</span>
        <div className={styles.thumb} style={{ backgroundColor: installedColor }} />
        <span className={styles.notetext}>已安装</span>
        <div className={styles.thumb} style={{ backgroundColor: uninstalledColor }} />
        <span className={styles.notetext}>未安装</span>
      </div>
      {/* 进度 */}
      <div className={styles.barcontainer} style={{ backgroundColor: uninstalledColor }}>
        <div className={styles.progress} style={{ backgroundColor: installedColor }} />
        <span className={styles.installtext}>{installed}</span>
        <span className={styles.uninstalltext}>{uninstalled}</span>
      </div>
    </div>
  );
}

EquipProgress.defaultProps = {
  className: '',
  style: null
};

export default function EquipmentOverview() {
  return (
    <div className={styles.overview}>
      <EquipProgress
        label="变压器"
        installed={150} // 示例数据
        uninstalled={100} // 示例数据
        installedColor="#faad14" // 示例颜色 (黄色)
        uninstalledColor="#d9d9d9" // 示例颜色 (灰色)
      />
      <EquipProgress
        style={{ marginTop: 20 }}
        label="开关柜"
        installed={150} // 示例数据
        uninstalled={100} // 示例数据
        installedColor="#eb2f96" // 示例颜色 (粉色)
        uninstalledColor="#d9d9d9" // 示例颜色 (灰色)
      />
    </div>
  );
}
