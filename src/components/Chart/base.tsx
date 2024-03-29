
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as echarts from 'echarts';
import styles from './base.module.less';

interface Props {
  chartOption?: {},
  style?: React.CSSProperties,
  className?: string,
  onLoad
};

export default function BaseChart({
  chartOption,
  style = {},
  className,
  onLoad
}) {
  // 图表组件元素引用
  const chartElementRef = useRef<HTMLDivElement>();
  // 图表图例引用
  const chartInstanceRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const chartInstance = echarts.init(chartElementRef.current);
    chartInstanceRef.current = chartInstance;
    chartInstance.setOption(chartOption, true);
    // chartInstance.on('click', (params) => {
    // });
    const observer = new ResizeObserver(() => {
      chartInstance.resize();
    });
    observer.observe(chartElementRef.current);
    // 加载完成处理
    onLoad?.();
    return () => {
      observer.disconnect();
      chartInstance.clear();
    };
  }, []);

  return (
    <div
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
      ref={chartElementRef}
    >
    </div>
  );
}

BaseChart.propTypes = {
  data: PropTypes.object,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  className: PropTypes.string,
  type: PropTypes.string,
  onClickChart: PropTypes.string
};

BaseChart.defaultProps = {
  data: [],
  style: {
    width: '100%',
    height: '100%'
  },
  className: '',
  type: '电压',
  onClickChart: ''
};
