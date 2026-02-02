import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

interface Props {
  /**
   * 图表配置
   */
  chartOption?: echarts.EChartsOption;
  style?: React.CSSProperties;
  /**
   * 加载中
   */
  loading?: boolean;
  /**
   * 类名
   */
  className?: string;
  /**
   * chart 实例
   */
  onInit?: (e: echarts.ECharts) => void;
  /**
   * 页面加载
   * @param e
   * @returns
   */
  onLoad?: (e?: any) => void;
  /**
   * 事件监测
   */
  onEvents?: {
    eventName: string;
    eventCallback: (params: any, e?: echarts.ECharts) => void;
  }[];
  /**
   * 图表配置依赖的数据源
   */
  chartOptionDeps?: React.DependencyList;
}

export const DefaultLoadingOptions = {
  text: '操作处理中...',
  showSpinner: false,
  textColor: '#9d9d9d',
  maskColor: 'transparent',
  fontSize: '25px',
  fontWeight: 'bold',
  fontFamily: 'Microsoft YaHei'
};

export default function BaseChart(props: Props) {
  const { onLoad, chartOption, className, style, onEvents, chartOptionDeps, loading, onInit } =
    props;

  const chartElementRef = useRef<HTMLElement>();

  const chartInstanceRef = useRef<echarts.ECharts>();

  useEffect(() => {
    const chartInstance = echarts.init(chartElementRef.current);
    chartInstanceRef.current = chartInstance;
    onInit?.(chartInstance);
    if (onEvents) {
      onEvents.forEach((e) => {
        chartInstance.on(e.eventName, (params) => {
          e.eventCallback?.(params, chartInstance);
        });
      });
    }

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
    if (!chartInstanceRef.current) return;

    chartInstanceRef.current.off();

    if (onEvents) {
      onEvents.forEach((e) => {
        chartInstanceRef.current.on(e.eventName, (params) => {
          e.eventCallback?.(params, chartInstanceRef.current);
        });
      });
    }
  }, [onEvents]);

  useEffect(() => {
    if (loading) {
      chartInstanceRef.current.showLoading(DefaultLoadingOptions);
    } else {
      chartInstanceRef.current.hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    if (!chartOption) {
      return () => { };
    }

    if (chartOption.dataset) {
      if (Array.isArray(chartOption.dataset)) {
        chartOption.dataset.forEach((e) => {
          if (!e.source) {
            e.source = [];
          }
        });
      } else if (!chartOption.dataset.source) {
        chartOption.dataset.source = [];
      }
    }
    chartInstanceRef.current.setOption(chartOption);

    return () => {
      chartInstanceRef.current.clear();
    };
  }, chartOptionDeps);

  return (
    <div
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
      ref={chartElementRef as any}
    />
  );
}

export function RandomHexColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function MixHexColor(hexcolor: string, amount = 0.2) {
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (r, g, b) => {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const mixColors = (color1, color2, amount) => {
    const r = color1.r + (color2.r - color1.r) * amount;
    const g = color1.g + (color2.g - color1.g) * amount;
    const b = color1.b + (color2.b - color1.b) * amount;
    return { r, g, b };
  };

  const originalColor = hexToRgb(hexcolor);
  const whiteColor = { r: 255, g: 255, b: 255 };

  const mixedColor = mixColors(originalColor, whiteColor, amount);

  return rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
}

export function HighlightHexColor(hexcolor, lightenPercent = 0.2) {
  lightenPercent = 0.4;

  const hex = hexcolor.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  l = Math.min(1, l + lightenPercent);

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const convert = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const newR = Math.round(convert(h + 1 / 3) * 255);
  const newG = Math.round(convert(h) * 255);
  const newB = Math.round(convert(h - 1 / 3) * 255);

  return `#${[
    newR.toString(16).padStart(2, '0'),
    newG.toString(16).padStart(2, '0'),
    newB.toString(16).padStart(2, '0')
  ].join('')}`;
}

BaseChart.defaultProps = {
  chartOption: null,
  style: null,
  className: null,
  onLoad: null,
  onEvents: null,
  chartOptionDeps: null,
  loading: false,
  onInit: null
};
