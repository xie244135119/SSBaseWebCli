import request from '../request';

// 登录方式 密码登录(password) or 单点登录(sso)
const STORAGE_LOGIN_TYPE = 'login_type';
// 存储 key 值
const STORAGE_TOKEN_KEY = 'storage_usertoken';

/**
 * 登录接口
 * @param params
 * @returns
 */
export function login(params: { [key: string]: any }): Promise<boolean> {
  // api 登录的时候 修改此处请求即可
  return Promise.resolve({
    code: 200,
    status: 'SUCCESS',
    data: 'a345ahklt45cc'
  }).then((res) => {
    if (res.code === 200) {
      localStorage.setItem(STORAGE_TOKEN_KEY, JSON.stringify(params));
      localStorage.setItem(STORAGE_LOGIN_TYPE, 'password');
      // 后续拼接全部请求方式
      request.defaults.headers.Authorization = res.data;
    }
    return res.code === 200;
  });
}

/**
 * 单点登录
 * @param ssoLoginToken 登录的token
 * @returns
 */
export function ssoLogin(ssoLoginToken: string) {
  return Promise.resolve({
    code: 200,
    status: 'SUCCESS',
    data: 'b4555xsd6jkbd'
  }).then((res) => {
    if (res.data) {
      localStorage.setItem(STORAGE_LOGIN_TYPE, 'sso');
      // 后续拼接全部请求方式
      request.defaults.headers.Authorization = res.data;
      return true;
    }
    return false;
  });
}

/**
 * 获取身份认证信息
 */
export function getAuthorization() {
  if (localStorage.getItem(STORAGE_LOGIN_TYPE) === 'password') {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  }
  return '';
}

/**
 * 判断是否登录 <检测Token是否过期>
 * @returns
 */
export function isLogin(): Promise<boolean> {
  return Promise.resolve(localStorage.getItem(STORAGE_TOKEN_KEY) !== null);
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
    const json = JSON.parse(localStorage.getItem(STORAGE_TOKEN_KEY));
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
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  delete request.defaults.headers.Authorization;
  return Promise.resolve(true);
}
