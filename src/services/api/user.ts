import request from '../request';

// 登录方式 密码登录(password) or 单点登录(sso)
const STORAGE_LOGIN_TYPE = 'login_type';
// 存储 key 值
const STORAGE_TOKEN_KEY = 'storage_usertoken';

/**
 *  储存用户Token
 * @param type 登录类型
 * @param token 字符串
 */
const setToken = (type: 'password' | 'sso', token: string) => {
  localStorage.setItem(STORAGE_LOGIN_TYPE, type);
  if (type === 'sso') {
    sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
  } else if (type === 'password') {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }
  request.defaults.headers.Authorization = token;
};

/**
 *
 * @returns
 */
const getToken = () => {
  const type = localStorage.getItem(STORAGE_LOGIN_TYPE);
  switch (type) {
    case 'password':
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    case 'sso':
      return sessionStorage.getItem(STORAGE_TOKEN_KEY);
    default:
      return '';
  }
};

/**
 * 登录接口
 * @param params
 * @returns
 */
export function login(params: { [key: string]: any }): Promise<boolean> {
  // api 登录的时候 修改此处请求即可
  // return request.post('/api/login', params).then((res) => {
  //   if (res.status === 'SUCCESS') {
  //     // ### 勿删，需调用
  //     setToken('password', res.data);
  //     return true;
  //   }
  //   return false;
  // });
  return Promise.resolve({
    code: 200,
    status: 'SUCCESS',
    data: 'a345ahklt45cc'
  }).then((res) => {
    if (res.code === 200) {
      // ### 勿删，需调用
      setToken('password', res.data);
    }
    return res.code === 200;
  });
}

/**
 * 单点登录 <需要重写>
 * @param ssoParams 单点登录信息
 * @param callBack
 * @returns
 */
export function ssoLogin(ssoParams: { [key: string]: any }): Promise<boolean> {
  // # 重写sso参数
  // return request.get('/api/ssologin', { params: ssoParams });
  // 默认处理
  return Promise.resolve({
    code: 200,
    status: 'SUCCESS',
    data: 'ssoToken'
  }).then((res) => {
    if (res.data) {
      setToken('sso', res.data);
      return true;
    }
    return false;
  });
}

/**
 * 获取身份认证信息
 */
export function getAuthorization() {
  return getToken();
}

/**
 * 判断是否登录 <检测Token是否过期>
 * @returns
 */
export function isLogin(): Promise<boolean> {
  // return request.get('/api/checkToken').then((res) => res.status === 'SUCCESS');
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
