

/**
 * 导出mock 数据
 */
export function getMockData(url, params = {}) {
  if (_allData[url]) {
    return _allData[url](params);
  }
  return {
    status: "SUCCESS",
  };
}

class MockJs {
  static setup = () => { };

  static mock = (url, responseFunc) => {
    _allData[url] = responseFunc;
  };
}

/**
 * 全部数据
 */
const _allData = {};

/**
 * 初始化配置
 */
MockJs.setup({
  // 超时时间
  timeout: 1 * 1000,
});

/**
 * 模拟数据
 */
MockJs.mock(
  `/api/test`,
  () => {
    const res = {
      code: 200,
      msg: "success",
      data: '测试数据',
    };
    return res;
  }
);
