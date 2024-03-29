import request from '../request';

// 存储 key 值
const StorageKey = 'storage_userinfo';

/**
 * 登录接口
 * @param params
 * @returns
 */
export function login(params: { [key: string]: any }): Promise<boolean> {
  localStorage.setItem(StorageKey, JSON.stringify(params));
  return Promise.resolve(true);
}

/**
 * 判断是否登录
 * @returns
 */
export function isLogin(): Promise<boolean> {
  return Promise.resolve(localStorage.getItem(StorageKey) ? true : false);
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
  return Promise.resolve(true);
}
