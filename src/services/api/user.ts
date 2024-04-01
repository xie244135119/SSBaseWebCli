import request from '../request';

// 存储 key 值
const StorageKey = 'storage_userinfo';
// api请求拼接
//
request.defaults.headers.Authorization = 'token';

/**
 * 登录接口
 * @param params
 * @returns
 */
export function login(params: { [key: string]: any }): Promise<boolean> {
  // api 登录的时候 修改此处请求即可
  return Promise.resolve({
    code: 200,
    data: 'token'
  }).then((res) => {
    if (res.code === 200) {
      localStorage.setItem(StorageKey, JSON.stringify(params));
      // 后续拼接全部请求方式
      request.defaults.headers.Authorization = res.data;
    }
    return res.code === 200;
  });
}

/**
 * 判断是否登录
 * @returns
 */
export function isLogin(): Promise<boolean> {
  return Promise.resolve(localStorage.getItem(StorageKey) !== null);
}

/**
 * 获取验证码
 */
export function getCaptcha(): Promise<string> {
  return Promise.resolve('/logo.png');
}

/**
 * 获取用户信息
 * @returns
 */
export function getInfo(): Promise<{ [key: string]: any }> {
  try {
    const json = JSON.parse(localStorage.getItem(StorageKey));
    return Promise.resolve(json);
  } catch (error) {
    return Promise.resolve({});
  }
}

/**
 * 退出登录
 * @returns
 */
export function logout(): Promise<boolean> {
  localStorage.removeItem(StorageKey);
  delete request.defaults.headers.Authorization;
  return Promise.resolve(true);
}
