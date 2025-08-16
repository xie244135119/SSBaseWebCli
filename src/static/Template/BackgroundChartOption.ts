import dayjs from 'dayjs';
import * as echarts from 'echarts';
import _ from 'lodash';

const textColor = '#666';
const tooltipBackgroundColor = '#fff'; // tooltip背景色
const YaxisLineColor = '#999999'; // Y轴轴线的颜色
const YaxisTickColor = '#194a87'; // Y轴刻度的颜色
const YaxisLabelColor = '#404040'; // Y轴文字的颜色

const XaxisLineColor = '#999999'; // X轴轴线的颜色
const XaxisTickColor = '#194a87'; // X轴刻度的颜色
const XaxisLabelColor = '#404040'; // X轴文字的颜色

const splitLineColor = '#e5e5e5'; // 分格线的颜色

/**
 * 带背景的柱状图 <单条>
 * @returns
 */
export function getBaseBarChartOption(chartOption?: echarts.EChartsOption): echarts.EChartsOption {
  const list = [];
  for (let index = 0; index < 12; index++) {
    list.push({
      type: `${index + 1}月`,
      value: 200 * Math.random()
    });
  }
  const dataset = {
    dimensions: ['type', 'value'],
    source: list
  };
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
      // ...title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      }
    },
    legend: {
      // data: ['直接访问', '背景'],
      show: false
      // ...legend
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0px',
      top: '50px',
      containLabel: true,
      z: 22
      // ...grid
    },
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        color: XaxisLabelColor,
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
        // // rotate: 90,
        // formatter(value) {
        //   return value.split('').join('\n');
        // }
      }
      // ...xAxis
    },
    yAxis: {
      name: '单位：%',
      nameTextStyle: {
        color: XaxisLabelColor
      },
      splitLine: { show: false },
      axisLine: {
        show: true,
        // 坐标轴轴线的颜色
        lineStyle: {
          color: YaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: YaxisTickColor
        }
      },
      axisLabel: {
        textStyle: {
          color: YaxisLabelColor
        },
        // 默认y轴字体大小
        fontSize: 14,
        // margin:文字到y轴的距离
        margin: 10
      }
      // ...yAxis
    },
    series: {
      name: '数值',
      type: 'bar',
      barWidth: '30%',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          barBorderRadius: [20, 20, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              // 浅色
              offset: 0,
              color: '#67c8ff'
            },
            {
              // 深色
              offset: 1,
              color: '#1158b9'
            }
          ])
        }
      },
      showBackground: true,
      backgroundStyle: {
        borderRadius: [20, 20, 0, 0],
        show: true,
        color: '#e9ebf7'
      }
    },
    dataset
  };
  _.merge(option, chartOption);
  return option;
}

/**
 * 多条带背景的柱状图 <多条>
 * @returns
 */
export function getMultiBarChartOption(categorys = ['demo'], chartOption?: echarts.EChartsOption) {
  const list = [];
  for (let index = 0; index < 12; index++) {
    list.push({
      type: `${index + 1}月`,
      ...categorys.reduce((prev, cur, index) => {
        prev[cur] = (200 * Math.random() * (index % 2 === 1 ? 1 : -1)).toFixed(2);
        return prev;
      }, {})
    });
  }
  const dataset = {
    dimensions: ['type', ...categorys],
    source: list
  };
  const option = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
      // ...title
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      }
    },
    legend: {
      // data: ['直接访问', '背景'],
      show: false
      // ...legend
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0px',
      top: '50px',
      containLabel: true,
      z: 22
      // ...grid
    },
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        textStyle: {
          color: XaxisLabelColor
        },
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
        // rotate: 90,
        // formatter(value) {
        //   return value.split('').join('\n');
        // }
      }
      // ...xAxis
    },
    yAxis: {
      name: '单位：元',
      nameTextStyle: {
        color: XaxisLabelColor
      },
      splitLine: { show: false },
      axisLine: {
        show: true,
        // 坐标轴轴线的颜色
        lineStyle: {
          color: YaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: YaxisTickColor
        }
      },
      axisLabel: {
        textStyle: {
          color: YaxisLabelColor
        },
        // 默认y轴字体大小
        fontSize: 14,
        // margin:文字到y轴的距离
        margin: 10
      }
      // ...yAxis
    },
    series: [],
    dataset
  };
  const series = categorys.map((item) => ({
    name: item,
    type: 'bar',
    // barWidth: '30%',
    xAxisIndex: 0,
    yAxisIndex: 0,
    // itemStyle: {
    //   normal: {
    //     barBorderRadius: [20, 20, 0, 0],
    //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
    //       {
    //         // 浅色
    //         offset: 0,
    //         color: '#67c8ff'
    //       },
    //       {
    //         // 深色
    //         offset: 1,
    //         color: '#1158b9'
    //       }
    //     ])
    //   }
    // },
    showBackground: true,
    backgroundStyle: {
      borderRadius: [20, 20, 0, 0],
      show: true,
      color: '#e9ebf7'
    }
  }));
  option.series = series;
  _.merge(option, chartOption);
  return option;
}

/**
 * 带背景的柱状图 <单条> < x y轴反转>
 * @param {string[]} chartOption
 * @returns
 */
export function getBaseBarRollbackChartOption(
  chartOption?: echarts.EChartsOption
): echarts.EChartsOption {
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: 40,
      right: 20,
      bottom: '0px',
      top: 0,
      // top: '50px',
      containLabel: true,
      z: 22
    },
    xAxis: {
      name: '单位：%',
      nameTextStyle: {
        color: XaxisLabelColor
      },
      splitLine: { show: true },
      axisLine: {
        show: true,
        // 坐标轴轴线的颜色
        lineStyle: {
          color: YaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: YaxisTickColor
        }
      },
      axisLabel: {
        color: YaxisLabelColor,

        // 默认y轴字体大小
        fontSize: 14,
        // margin:文字到y轴的距离
        margin: 10
      }
      // ...yAxis
    },
    yAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        color: XaxisLabelColor,
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
        // rotate: 90,
        // formatter(value) {
        //   return value.split('').join('\n');
        // }
      }
    },
    series: {
      name: '',
      type: 'bar',
      barWidth: '30%',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        borderRadius: [0, 20, 20, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          {
            // 浅色
            offset: 0,
            color: '#67c8ff'
          },
          {
            // 深色
            offset: 1,
            color: '#1158b9'
          }
        ])
      },
      showBackground: true,
      backgroundStyle: {
        borderRadius: [0, 20, 20, 0],
        color: '#e9ebf7'
      }
    }
  };
  _.merge(option, chartOption);
  if (!option.dataset) {
    let list = [];
    const categorys = ['a', 'b', 'c', 'd', 'e'];
    categorys?.forEach((e) => {
      list.push({
        type: e,
        value: (Math.random() * 100).toFixed(2)
      });
    });
    if (list.length === 0) {
      list = [
        {
          type: '克州',
          value: 20
        },
        {
          type: '乌鲁木齐',
          value: 30
        },
        {
          type: '超高压',
          value: 80
        },
        {
          type: '昌吉',
          value: 22
        },
        {
          type: '吐鲁番',
          value: 20
        },
        {
          type: '奎屯',
          value: 30
        },
        {
          type: '博尔塔拉',
          value: 26
        },
        {
          type: '哈密',
          value: 28
        }
      ];
    }
    option.dataset = {
      dimensions: ['type', 'value'],
      source: list
    };
  }
  return option;
}

/**
 * 折线图图表配置
 * @param {string[]} dimensionsConfig
 * @param {string[]} categorys 分类类型
 * @returns
 */
export const getLineChartOption = (
  categorys: string[],
  chartOption?: echarts.EChartsOption
): echarts.EChartsOption => {
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      }
    },
    legend: {
      show: true
    },
    grid: {
      left: 10,
      right: 0,
      bottom: 0,
      top: 30,
      containLabel: true
    },
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        color: XaxisLabelColor,
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
      }
    },
    yAxis: {
      name: '单位：元',
      nameTextStyle: {
        color: XaxisLabelColor
      },
      splitLine: { show: true },
      axisLine: {
        show: true,
        // 坐标轴轴线的颜色
        lineStyle: {
          color: YaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: YaxisTickColor
        }
      },
      axisLabel: {
        color: YaxisLabelColor,
        // },
        // 默认y轴字体大小
        fontSize: 14,
        // margin:文字到y轴的距离
        margin: 10
      }
    },
    series: [],
    animation: true
  };
  const series = [];
  categorys.forEach((e) => {
    series.push({
      name: e,
      type: 'line',
      showAllSymbol: true,
      symbol: 'circle',
      symbolSize: 10,
      label: {
        show: false,
        position: 'top',
        textStyle: {
          color: '#148c90'
        }
      }
    });
  });
  option.series = series;
  _.merge(option, chartOption);

  // 基础数据配置
  if (!option.dataset) {
    const list = [];
    for (let index = 0; index < 10; index++) {
      const item = {
        time: dayjs().subtract(index, 'd').format('YYYY-MM-DD')
      };
      categorys.forEach((e) => {
        item[e] = Math.random() * 100;
      });
      list.push(item);
    }
    option.dataset = {
      dimensions: ['time', ...categorys],
      source: list
    };
  }
  return option;
};

/**
 * 自定义散点图配置 获取算法预测误差指标数据对比
 */
export function getScatterChartOption(
  categorys: [string, string] = ['预测误差', '预测波动'],
  chartOption: echarts.EChartsOption = {}
): echarts.EChartsOption {
  const normalColors = [
    '#ffba00',
    '#2759a4',
    '#ff7e00',
    '#6fbd6b',
    '#50abdf',
    '#7181d0',
    '#ac77ce'
  ];
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      },
      alwaysShowContent: true,
      formatter: (params) => {
        const [{ data = {}, dimensionNames = [] }] = params;
        return `${data.name}<br /><span>${categorys[0]}：${data[dimensionNames[0]]}<br />${
          categorys[1]
        }：${data[dimensionNames[1]]}`;
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: 50,
      right: 80,
      bottom: 30,
      top: 30,
      containLabel: true
    },
    xAxis: {
      name: categorys[0],
      splitLine: { show: false },
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        },
        symbol: ['none', 'arrow']
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    yAxis: {
      name: categorys[1],
      nameTextStyle: {
        color: XaxisLabelColor
      },
      splitLine: { show: false },
      axisLine: {
        show: true,
        lineStyle: {
          color: YaxisLineColor
        },
        symbol: ['none', 'arrow']
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      }
    },
    series: {
      name: '',
      type: 'scatter',
      // : true,
      symbol: 'circle',
      symbolSize: 20,
      label: {
        show: true,
        position: 'top'
        // color: '#148c90'
      },
      itemStyle: {
        color(params) {
          let a = params.dataIndex;
          if (a >= 6) {
            a -= 6;
          }
          return normalColors[a];
        }
      }
      // data: [
      //   [2.333, 2.349],
      //   [2.333, 3.333],
      //   [5.333, 4.333]
      // ]
    }
  };
  _.merge(option, chartOption);
  if (!option.dataset) {
    option.dataset = {
      dimensions: ['均方误差', '平均绝对误差'],
      source: [
        {
          name: '专家修正',
          平均绝对误差: 2.349,
          均方误差: 2.333
        },
        {
          name: '智能AI算法',
          平均绝对误差: 3.333,
          均方误差: 2.333
        },
        {
          name: '自回归移动平均模型',
          平均绝对误差: 4.333,
          均方误差: 5.333
        }
      ]
    };
  }
  return option;
}

/**
 * 基础 2D 饼状图配置
 */
export function getPieChartOption(chartOption?: echarts.EChartsOption): echarts.EChartsOption {
  // const color = ['#2d8fa8', '#4bc9e4', 'rgb(55, 224, 184)', '#e6ed16', '#86D560'];
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      left: 'center',
      top: '53%',
      padding: [24, 0]
    },
    series: {
      name: '',
      type: 'pie',
      radius: ['40%', '60%'],
      hoverAnimation: false,
      // color,
      label: {
        // normal: {
        formatter: (params, ticket, callback) => {
          const { percent } = params; // 占比
          return `{black|${params.name}} {yellow|${params.value}} {blue|${percent}%}`;
        },
        padding: [0, -60],
        height: 50,
        rich: {
          black: {
            color: '#333',
            align: 'right',
            fontSize: 14,
            padding: [4, 0],
            borderColor: 'red',
            marginBottom: '-10px'
          },
          yellow: {
            color: '#ffc72b',
            fontSize: 16,
            padding: [5, 4],
            align: 'center'
          },

          blue: {
            color: '#28c9db',
            fontSize: 14,
            align: 'center',
            marginRight: '-100px'
          }
        }
        // }
      },
      labelLine: {
        showAbove: true,
        length: 60,
        length2: 60,
        // align: 'right',
        // smooth: true,
        maxSurfaceAngle: 0,
        lineStyle: {
          color: '#0b5263'
        }
      }
      // data: defalutEchartData
    }
  };
  _.merge(option, chartOption);
  if (!option.series.data) {
    option.series.data = [
      {
        value: 260,
        name: '测试1'
      },
      {
        value: 103,
        name: '测试2'
      }
    ];
  }
  return option;
}

/**
 * @param {string[]} dimensionsConfig
 * @param {string[]} categorys 分类类型
 * @returns
 */
export function getBarAndLineOption(
  barCategorys: string[] = ['容量', '同期', '上一周期'],
  lineCategorys: string[] = ['同比', '环比', '占总比重'],
  chartOption: echarts.EChartsOption = {}
) {
  const option: echarts.EChartsOption = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
      // axisPointer: {
      //   type: 'line',
      //   lineStyle: {
      //     opacity: 0
      //   }
      // }
    },
    legend: {
      show: true
    },
    grid: {
      left: 10,
      right: 0,
      bottom: 0,
      top: 50,
      containLabel: true
    },
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        // textStyle: {
        color: XaxisLabelColor,
        // },
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
      }
    },
    yAxis: [
      {
        name: '单位：万户',
        nameTextStyle: {
          color: XaxisLabelColor
        },
        splitLine: { show: false },
        axisLine: {
          show: true,
          // 坐标轴轴线的颜色
          lineStyle: {
            color: YaxisLineColor
          }
        },
        axisTick: {
          show: true,
          length: 4,
          // 刻度线的颜色
          lineStyle: {
            width: 4,
            color: YaxisTickColor
          }
        },
        axisLabel: {
          // textStyle: {
          color: YaxisLabelColor,
          // },
          // 默认y轴字体大小
          fontSize: 14,
          // margin:文字到y轴的距离
          margin: 10
        }
      },
      {
        name: '单位：%',
        nameTextStyle: {
          color: XaxisLabelColor
        },
        min: -10,
        max: 100,
        splitLine: { show: false },
        axisLine: {
          show: true,
          // 坐标轴轴线的颜色
          lineStyle: {
            color: YaxisLineColor
          }
        },
        axisTick: {
          show: true,
          length: 4,
          // 刻度线的颜色
          lineStyle: {
            width: 4,
            color: YaxisTickColor
          }
        },
        axisLabel: {
          // textStyle: {
          color: YaxisLabelColor,
          // },
          // 默认y轴字体大小
          fontSize: 14,
          // margin:文字到y轴的距离
          margin: 10
        }
      }
    ],
    animation: true,
    series: []
  };
  // 线条
  const series = [];
  barCategorys.forEach((e) => {
    series.push({
      name: e,
      type: 'bar',
      // barWidth: '30%',
      yAxisIndex: 0,
      // itemStyle: {
      //   normal: {
      //     barBorderRadius: [20, 20, 0, 0],
      //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //       {
      //         // 浅色
      //         offset: 0,
      //         color: '#67c8ff'
      //       },
      //       {
      //         // 深色
      //         offset: 1,
      //         color: '#1158b9'
      //       }
      //     ])
      //   }
      // },
      showBackground: true,
      backgroundStyle: {
        borderRadius: [20, 20, 0, 0],
        show: true,
        color: '#e9ebf7'
      }
    });
  });
  lineCategorys.forEach((e) => {
    series.push({
      name: e,
      yAxisIndex: 1,
      type: 'line',
      showAllSymbol: false,
      // showSymbol: false,
      symbol: 'circle',
      symbolSize: 10,
      label: {
        show: false,
        position: 'top',
        textStyle: {
          color: '#148c90'
        }
      }
    });
  });
  option.series = series;
  _.merge(option, chartOption);
  if (!option.dataset) {
    const list = [];
    for (let index = 0; index < 10; index++) {
      const item = {
        time: dayjs().subtract(index, 'M').format('YYYY/MM')
      };
      barCategorys.forEach((e) => {
        item[e] = (Math.random() * 500).toFixed(2);
      });
      lineCategorys.forEach((e) => {
        item[e] = (Math.random() * 100).toFixed(2);
      });
      list.push(item);
    }
    option.dataset = {
      dimensions: ['time', ...barCategorys, ...lineCategorys],
      source: list
    };
  }
  return option;
}

/**
 * @param {string[]} dimensionsConfig
 * @param {string[]} categorys 分类类型
 * @returns
 */
export function getBarStackAndLineOption(
  barCategorys = ['10kV以下', '10kV及以上'],
  lineCategorys = ['10kV及以上所占比重'],
  chartOption?: echarts.EChartsOption
) {
  // const lineCategorys = ['10kV及以上所占比重'];
  const list = [];
  for (let index = 0; index < 10; index++) {
    const item = {
      time: dayjs().subtract(index, 'M').format('YYYY/MM')
    };
    barCategorys.forEach((e) => {
      item[e] = (Math.random() * 500).toFixed(2);
    });
    lineCategorys.forEach((e) => {
      item[e] = (Math.random() * 100).toFixed(2);
    });
    list.push(item);
  }

  const modelDataset = {
    dimensions: ['time', ...barCategorys, ...lineCategorys],
    source: list
  };

  const option = {
    title: {
      text: '',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: true
    },
    grid: {
      left: 10,
      right: 0,
      bottom: 0,
      top: 50,
      containLabel: true
    },
    xAxis: {
      splitLine: { show: false },
      type: 'category',
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        textStyle: {
          color: XaxisLabelColor
        },
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
      }
    },
    yAxis: [
      {
        name: '单位：万户',
        nameTextStyle: {
          color: YaxisLabelColor
        },
        splitLine: { show: false },
        axisLine: {
          show: true,
          // 坐标轴轴线的颜色
          lineStyle: {
            color: YaxisLineColor
          }
        },
        axisTick: {
          show: true,
          length: 4,
          // 刻度线的颜色
          lineStyle: {
            width: 4,
            color: YaxisTickColor
          }
        },
        axisLabel: {
          textStyle: {
            color: YaxisLabelColor
          },
          fontSize: 14,
          margin: 10
        }
      },
      {
        name: '单位：%',
        nameTextStyle: {
          color: YaxisLabelColor
        },
        min: -10,
        max: 100,
        splitLine: { show: false },
        axisLine: {
          show: true,
          // 坐标轴轴线的颜色
          lineStyle: {
            color: YaxisLineColor
          }
        },
        axisTick: {
          show: true,
          length: 4,
          // 刻度线的颜色
          lineStyle: {
            width: 4,
            color: YaxisTickColor
          }
        },
        axisLabel: {
          textStyle: {
            color: YaxisLabelColor
          },
          // 默认y轴字体大小
          fontSize: 14,
          // margin:文字到y轴的距离
          margin: 10
        }
      }
    ],
    animation: true,
    series: [],
    dataset: modelDataset
  };
  // 线条
  const series = [];
  barCategorys.forEach((e) => {
    series.push({
      name: e,
      type: 'bar',
      barWidth: '30%',
      yAxisIndex: 0,
      stack: true
      // itemStyle: {
      //   normal: {
      //     barBorderRadius: [20, 20, 0, 0],
      //     color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      //       {
      //         // 浅色
      //         offset: 0,
      //         color: '#67c8ff'
      //       },
      //       {
      //         // 深色
      //         offset: 1,
      //         color: '#1158b9'
      //       }
      //     ])
      //   }
      // },
      // showBackground: true,
      // backgroundStyle: {
      //   borderRadius: [20, 20, 0, 0],
      //   show: true,
      //   color: '#e9ebf7'
      // }
    });
  });
  lineCategorys.forEach((e) => {
    series.push({
      name: e,
      yAxisIndex: 1,
      type: 'line',
      showAllSymbol: true,
      symbol: 'circle',
      symbolSize: 10,
      label: {
        show: false,
        position: 'top',
        textStyle: {
          color: '#148c90'
        }
      }
    });
  });
  option.series = series;
  _.merge(option, chartOption);
  return option;
}

/**
 * 各算法明细对比
 * 散点图
 */
export function getScatterPlotOption(seriesData, chartOption?: echarts.EChartsOption) {
  const defaultData = [
    {
      name: '智能AI算法',
      value: [1.45, 1.96]
    },
    {
      name: '专家修正',
      value: [2.39, 3.81]
    },
    {
      name: 'XGBoost',
      value: [3.84, 4.26]
    }
  ];

  const computeXAxisAvgLine = function () {
    let sum = 0;
    seriesData.forEach((item) => {
      sum += item.value[0];
    });
    return (sum / seriesData.length).toFixed(2);
  };

  const computeYAxisAvgLine = function () {
    let sum = 0;
    seriesData.forEach((item) => {
      sum += item.value[1];
    });
    return (sum / seriesData.length).toFixed(2);
  };

  const option = {
    title: {
      text: ''
    },
    grid: {
      left: '10px',
      right: '100px',
      bottom: 0,
      top: '30px',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        show: true,
        type: 'cross',
        lineStyle: {
          type: 'dashed',
          width: 1
        }
      },
      formatter(obj) {
        if (obj.componentType == 'series') {
          return (
            `<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">${obj.name}</div>` +
            '<span>' +
            '预测误差' +
            '</span>' +
            ` : ${obj.data.value[0]}<br/>` +
            '<span>' +
            '预测波动' +
            '</span>' +
            ` : ${obj.data.value[1]}`
          );
        }
      }
    },
    xAxis: {
      name: '预测误差',
      type: 'value',
      scale: true,
      // axisLabel: {
      //   formatter: '{value} 元'
      // },
      splitLine: {
        show: false
      },
      axisLine: {
        // 坐标轴轴线的颜色
        lineStyle: {
          color: XaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: XaxisTickColor
        },
        alignWithLabel: true
      },
      axisLabel: {
        textStyle: {
          color: XaxisLabelColor
        },
        // 默认x轴字体大小
        fontSize: 14,
        // margin:文字到x轴的距离
        margin: 10
      }
    },
    yAxis: {
      name: '预测波动',
      nameTextStyle: {
        color: YaxisLabelColor
      },
      type: 'value',
      scale: true,
      // axisLabel: {
      //   formatter: "{value} %",
      // },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        // 坐标轴轴线的颜色
        lineStyle: {
          color: YaxisLineColor
        }
      },
      axisTick: {
        show: true,
        length: 4,
        // 刻度线的颜色
        lineStyle: {
          width: 4,
          color: YaxisTickColor
        }
      },
      axisLabel: {
        textStyle: {
          color: YaxisLabelColor
        },
        fontSize: 14,
        margin: 10
      }
    },
    series: [
      {
        type: 'scatter',
        data: seriesData || defaultData,
        symbolSize: 20,
        markLine: {
          label: {
            normal: {
              formatter(params) {
                return params.name;
              }
            }
          },
          lineStyle: {
            normal: {
              color: '#626c91',
              type: 'solid',
              width: 1
            },
            emphasis: {
              color: '#d9def7'
            }
          },
          data: [
            {
              xAxis: computeXAxisAvgLine(),
              name: '预测误差平均水平',
              label: {
                color: 'red'
              }
            },
            {
              yAxis: computeYAxisAvgLine(),
              name: '预测波动平均水平',
              label: {
                color: 'red'
              }
            }
          ]
        }
      }
    ]
  };
  _.merge(option, chartOption);
  return option;
}
