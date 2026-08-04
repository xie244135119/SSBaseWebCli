declare const TEMPLATE: {
  /**
   * 后台系统通用的图表配置
   */
  BackgroundChart: {
    [key: string]: (...args: any[]) => import('echarts').EChartsOption;
  };
  /**
   * 大屏端通用的图表配置
   */
  ScreenChart: {
    [key: string]: (...args: any[]) => import('echarts').EChartsOption;
  };
};
export default TEMPLATE;
