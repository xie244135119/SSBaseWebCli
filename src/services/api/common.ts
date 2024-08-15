import { AxiosResponse } from 'axios';

/**
 * 时间模板
 */
export const getTimeFormatter = (type: Number) => {
  let formatter = 'YYYYMM';
  switch (type) {
    case 1: // 年
      formatter = 'YYYYMMDD';
      break;
    case 2: // 月
      formatter = 'YYYYMM';
      break;
    case 3: // 年
      formatter = 'YYYY';
      break;
    default:
      break;
  }
  return formatter;
};

/**
 * 数据格式化
 */
export function formatNumber(num: number, fractionDigits = 2) {
  // 判断是否为整数
  if (Number.isInteger(num)) {
    return num.toString();
  }
  return num.toFixed(fractionDigits);
}

/**
 * 城市排序
 * @returns
 */
export const sort = (
  a: { sort: number; [key: string]: any },
  b: { sort: number; [key: string]: any }
) => {
  // 优先 sort属性
  let asort = a.id ? 1 / a.id : 0;
  let bsort = b.id ? 1 / b.id : 0;
  // 倒数后面
  if (a.sort < 0) {
    asort += -1000 - a.sort;
  } else if (a.sort > 0) {
    asort += 20 * 1000 * (a.sort ? 1 / a.sort : 1);
  }
  if (b.sort < 0) {
    bsort += -1000 - b.sort;
  } else if (b.sort > 0) {
    bsort += 20 * 1000 * (b.sort ? 1 / b.sort : 1);
  }
  return bsort - asort;
};

/**
 * 提取返回数据流
 * @param res
 * @returns
 */
export const exportFile = (res: AxiosResponse) => {
  if (res.data instanceof Blob) {
    const dispos = res.headers['content-disposition'];
    const components = dispos?.split(';');
    const findFileName = components.find((item) => item.trim().startsWith('filename='));
    const fileName = findFileName.trim().replace('filename=', '');
    return {
      data: res.data,
      fileName: decodeURIComponent(fileName)
    };
  }
  return {};
};
