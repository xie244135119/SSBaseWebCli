import { message } from 'antd';
import ProjectConfig from '../../config/project.config';
import request, { webrequest } from './request';
import * as mysql from './api/mysql';
import * as user from './api/user';
import * as test from './api/test';

request.defaults.baseURL = window.ENV.requestBaseUrl;
request.defaults.validateStatus = (status) => {
  if (status === 401) {
    message.info('登录失效，请重新登录');
    if (window.location.pathname !== '/login') {
      window.location.href = `${ProjectConfig.directory ?? ''}/login?redirect=${encodeURIComponent(
        window.location.pathname.replace(ProjectConfig.directory ?? '', '') + window.location.search
      )}`;
    }
  }
  return status >= 200 && status < 300;
};
request.interceptors.response.use(
  (res: any) => {
    if (res.status) {
      if (res.status !== 'SUCCESS') {
        message.error(res.message || res.msg || '请求失败，请重试');
      }
    }
    return res;
  },
  (e) => {
    message.error(`${e?.message}(${decodeURIComponent(e.request?.responseURL)})`, 5);
  }
);

/**
 * @description 更新请求 Token
 */
export const updateRequestToken = (token: string | null) => {
  if (token) {
    request.defaults.headers.Authorization = token;
    webrequest.defaults.headers.Authorization = token;
  } else {
    delete request.defaults.headers.Authorization;
    delete webrequest.defaults.headers.Authorization;
  }
};

updateRequestToken(user.getAuthorization());

export default {
  // Api 文档文件
  mysql,
  // 用户系统
  user,
  //
  test
};
