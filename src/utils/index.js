import moment from 'dayjs';

/**
 * 防抖函数
 * @param {*} fn
 * @param {*} wait
 * @param {*} immediate 是否立刻执行
 * @returns
 */
function debounce(fn, wait = 50, immediate = false) {
  let timer;
  return function block() {
    if (immediate) {
      fn.apply(this);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this);
    }, wait);
  };
}

/**
 * 节流
 * @param {*} fn
 * @param {*} wait
 * @returns
 */
function throttle(fn, wait = 300) {
  let prev = new Date();
  return function block() {
    // const args = arguments;
    const now = new Date();
    if (now - prev > wait) {
      fn.apply(this);
      prev = new Date();
    }
  };
}

// 每个时间内截取若干条数据
// sourceDataArr:   原数组, 默认[]
// space:       按天或按小时, day | hour , 默认 day
// timeKey:     时间的key值
// num:         每个时间取几条数据 默认10
function dataByTimeCutOut(sourceDataArr = [], space = 'day', timeKey = 'collectedTime', num = 10) {
  const sourceData = [...sourceDataArr];
  for (let i = 0; i < sourceData.length; i += 1) {
    if (space === 'hour') {
      sourceData[i] = {
        ...sourceData[i],
        [timeKey]: moment(sourceData[i][timeKey]).format('MM/DD hh')
      };
    }
    if (space === 'day') {
      sourceData[i] = {
        ...sourceData[i],
        [timeKey]: moment(sourceData[i][timeKey]).format('MM/DD')
      };
    }
    //
    if (space === 'month') {
      sourceData[i] = {
        ...sourceData[i],
        [timeKey]: moment(sourceData[i][timeKey]).format('YYYY/MM')
      };
    }
    if (space === 'year') {
      sourceData[i] = {
        ...sourceData[i],
        [timeKey]: moment(sourceData[i][timeKey]).format('YYYY')
      };
    }
    if (space === 'min') {
      sourceData[i] = {
        ...sourceData[i],
        [timeKey]: moment(sourceData[i][timeKey]).format('hh:mm')
      };
    }
  }
  const s = new Set();
  sourceData.forEach((item) => {
    s.add(item[timeKey]);
  });
  // 时间数组,每一个时间，不重复的数组
  const TimeArr = [...s];
  // 每个时间在数组中首次出现的索引位置数组
  const timeItemIndex = TimeArr.map((timeItem) => ({
    firstindex: sourceData.map((item) => item[timeKey]).indexOf(timeItem),
    lastIndex: sourceData.map((item) => item[timeKey]).lastIndexOf(timeItem)
  }));
  const listByTime = [];

  for (let t = 0; t < timeItemIndex.length; t += 1) {
    const dataAmount = timeItemIndex[t].lastIndex - timeItemIndex[t].firstindex + 1;
    // 需要判断一下，这个时间有10条就截取10条。没有10条就取全部
    if (dataAmount >= num) {
      listByTime.push(
        ...sourceData.slice(timeItemIndex[t].firstindex, timeItemIndex[t].firstindex + num)
      );
    } else {
      listByTime.push(
        ...sourceData.slice(timeItemIndex[t].firstindex, timeItemIndex[t].lastIndex + 1)
      );
    }
  }
  return listByTime;
}

/**
 * color 二进制转化
 * @param {*} hex
 * @param {*} opacity
 * @returns
 */
function hexToRgba(hex, opacity = 1) {
  return `rgba(${parseInt(`0x${hex.slice(1, 3)}`, 10)},${parseInt(
    `0x${hex.slice(3, 5)}`,
    10
  )},${parseInt(`0x${hex.slice(5, 7)}`, 10)},${opacity})`;
}

export default {
  debounce,
  throttle,
  dataByTimeCutOut,
  hexToRgba
};
