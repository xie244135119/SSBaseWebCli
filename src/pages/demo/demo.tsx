import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BaseChart from '@/components/Chart/base';
import useTableHook from '@/hooks/useTable';
import TEMPLATE from '@/static/template';
import styles from './styles.module.less';
import EquipmentOverview from './components/EquipProgress';

export default function Demo(props) {
  const detailsCloumns = () => {
    const list = [
      {
        title: '时间',
        dataIndex: 'time'
      },
      {
        title: '数据1',
        dataIndex: 'value1'
      },
      {
        title: '数据2',
        dataIndex: 'value2'
      },
      {
        title: '数据3',
        dataIndex: 'value3'
      },
      {
        title: '数据4',
        dataIndex: 'value4'
      }
    ];
    return list;
  };

  const { element: table } = useTableHook({
    columns: detailsCloumns(),
    mock: true
  });

  return (
    <div>
      {/* 组件配置 */}
      <EquipmentOverview />
      {/*  */}
      <h3>折线图配置</h3>
      <BaseChart
        style={{ height: 200 }}
        chartOption={TEMPLATE.BackgroundChart.getLineChartOption(['农业', '工业', '商业', '渔业'])}
      />
      <h3>表格示例</h3>
      {table}
    </div>
  );
}
