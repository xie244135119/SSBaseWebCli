/**
 * 全部数据
 */
const allData = {};

/**
 * 导出mock 数据
 */
export function getMockData(url, params = {}) {
  if (allData[url]) {
    return allData[url](params);
  }
  return {
    status: 'SUCCESS'
  };
}

export default class MockJs {
  static setup = (config?: { timeout: number }) => {};

  static mock = (url, responseFunc) => {
    allData[url] = responseFunc;
  };
}

/**
 * 初始化配置
 */
MockJs.setup({
  // 超时时间
  timeout: 1 * 1000
});

/**
 * 模拟数据
 */
MockJs.mock('/api/test', () => {
  const res = {
    code: 200,
    msg: 'success',
    data: '测试数据'
  };
  return res;
});
