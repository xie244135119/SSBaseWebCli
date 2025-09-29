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
  const {
    onLoad,
    chartOption,
    className,
    style,
    onEvents,
    chartOptionDeps,
    loading,
    onInit
  } = props;
  // 图表组件元素引用
  const chartElementRef = useRef<HTMLElement>();

  // 图表图例引用
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
    // const onFinished = () => {
    //   const option = chartInstance.getOption();
    //   let isExistData = false;
    //   if (option.dataset) {
    //     if (option.dataset[0].source.length > 0) {
    //       isExistData = true;
    //     }
    //   } else if ((option.series as any).some((item) => item.data?.length > 0)) {
    //     isExistData = true;
    //   }
    //   console.log(' isExistData ', isExistData);
    //   if (!isExistData) {
    //     chartInstanceRef.current.showLoading({
    //       text: '加载中...',
    //       showSpinner: false,
    //       textColor: '#9d9d9d',
    //       maskColor: 'transparent',
    //       fontSize: '25px',
    //       fontWeight: 'bold',
    //       fontFamily: 'Microsoft YaHei'
    //     });
    //   }
    // };
    // chartInstance.on('finished', onFinished);
    const observer = new ResizeObserver(() => {
      chartInstance.resize();
    });
    observer.observe(chartElementRef.current);
    // 加载完成处理
    onLoad?.();
    return () => {
      // chartInstance.off('finished', onFinished);
      observer.disconnect();
      chartInstance.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstanceRef.current) return;

    // 清除之前的事件监听
    chartInstanceRef.current.off();

    // 重新绑定事件
    if (onEvents) {
      onEvents.forEach((e) => {
        chartInstanceRef.current.on(e.eventName, (params) => {
          e.eventCallback?.(params, chartInstanceRef.current);
        });
      });
    }
  }, [onEvents]); // 当 onEvents 变化时重新绑定

  useEffect(() => {
    if (loading) {
      chartInstanceRef.current.showLoading(DefaultLoadingOptions);
    } else {
      chartInstanceRef.current.hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    if (!chartOption) {
      return () => {};
    }
    // 防御处理
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
    // console.log('【BaseChart】图表更新', chartOption);
    return () => {
      chartInstanceRef.current.clear();
    };
  }, chartOptionDeps);

  // if (chartInstance) {
  //   const dom = chartInstance.getDom();
  //   chartElementRef.current = dom;
  //   dom.className = className;
  //   dom.style.height = '100%';
  //   dom.style.width = '100%';
  //   if (style) {
  //     Object.keys(style).forEach((e) => {
  //       dom.style[e] = style[e];
  //     });
  //   }
  //   // console.log(' chartInstance xxxx ', chartInstance);
  //   return React.createElement('div', {
  //     // style: { height: '100%', width: '100%', ...style },
  //     // className,
  //     ref: chartElementRef,
  //     dangerouslySetInnerHTML: {
  //       __html: dom.outerHTML
  //     }
  //   });
  //   // return dom;
  // }

  return (
    <div
      className={className}
      style={{ height: '100%', width: '100%', ...style }}
      ref={chartElementRef as any}
    />
  );
}

export function RandomHexColor() {
  // // 随机生成十六进制颜色
  // let hex = Math.floor(Math.random() * 16777216).toString(16); // 生成ffffff以内16进制数
  // while (hex.length < 6) {
  //   // while循环判断hex位数，少于6位前面加0凑够6位
  //   hex = `0${hex}`;
  // }
  // return `#${hex}`; // 返回‘#'开头16进制颜色
  const r = Math.floor(Math.random() * 256); // 随机生成256以内r值
  const g = Math.floor(Math.random() * 256); // 随机生成256以内g值
  const b = Math.floor(Math.random() * 256); // 随机生成256以内b值
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  // return `rgb(${r},${g},${b})`; // 返回rgb(r,g,b)格式颜色
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function MixHexColor(hexcolor: string, amount = 0.2) {
  // 将颜色从十六进制转换为 RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // 将 RGB 转换为十六进制
  const rgbToHex = (r, g, b) => {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // 混合颜色
  const mixColors = (color1, color2, amount) => {
    const r = color1.r + (color2.r - color1.r) * amount;
    const g = color1.g + (color2.g - color1.g) * amount;
    const b = color1.b + (color2.b - color1.b) * amount;
    return { r, g, b };
  };

  // 将原始颜色转换为 RGB
  const originalColor = hexToRgb(hexcolor);
  const whiteColor = { r: 255, g: 255, b: 255 }; // 白色

  // 混合颜色
  const mixedColor = mixColors(originalColor, whiteColor, amount);

  // 转换回十六进制
  return rgbToHex(mixedColor.r, mixedColor.g, mixedColor.b);
}

export function HighlightHexColor(hexcolor, lightenPercent = 0.2) {
  lightenPercent = 0.4;
  // 1. 十六进制转RGB
  const hex = hexcolor.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // 2. 转换RGB到HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // 灰色
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

  // 3. 调整亮度
  l = Math.min(1, l + lightenPercent); // 确保不超过1

  // 4. HSL转回RGB
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

  // 5. 转回十六进制
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
