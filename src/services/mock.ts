/**
 * 全部数据
 */
const allData: { [url: string]: (params: any) => any } = {};

/**
 * 导出mock 数据
 */
export function getMockData(url: string, params: any = {}): any {
  if (allData[url]) {
    return allData[url](params);
  }
  return {
    status: 'SUCCESS'
  };
}

export default class MockJs {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static setup = (config?: { timeout: number }) => {};

  static mock = (url: string, responseFunc: (params: any) => any) => {
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
