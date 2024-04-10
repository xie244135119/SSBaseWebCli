import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface Props {
  chartOption?: echarts.EChartOption;
  style?: React.CSSProperties;
  className?: string;
  onLoad?: (e?: any) => void;
}

export default function BaseChart(props: Props) {
  const { onLoad, chartOption, className, style } = props;
  // 图表组件元素引用
  const chartElementRef = useRef<HTMLDivElement>();
  // 图表图例引用
  const chartInstanceRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const chartInstance = echarts.init(chartElementRef.current);
    chartInstanceRef.current = chartInstance;
    const observer = new ResizeObserver(() => {
      chartInstance.resize();
    });
    observer.observe(chartElementRef.current);
    onLoad?.();
    return () => {
      observer.disconnect();
      chartInstance.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartOption) {
      return () => {};
    }
    chartInstanceRef.current.setOption(chartOption);

    return () => {
      chartInstanceRef.current.clear();
    };
  }, [chartOption]);

  return (
    <div
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
      ref={chartElementRef}
    />
  );
}

BaseChart.defaultProps = {
  chartOption: null,
  style: null,
  className: null,
  onLoad: null
};
