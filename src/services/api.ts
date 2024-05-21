import request, { webrequest } from './request';
import * as mysql from './api/mysql';
import * as user from './api/user';

request.defaults.headers.Authorization = user.getAuthorization();
webrequest.defaults.headers.Authorization = user.getAuthorization();
request.defaults.baseURL = window.ENV.requestBaseUrl;
request.defaults.validateStatus = (status) => {
  if (status === 401) {
    message.info('登录失效，请重新登录');
    window.location.href = `${ProjectConfig.directory}/login?redirect=${encodeURIComponent(
      window.location.pathname.replace(ProjectConfig.directory, '') + window.location.search
    )}`;
  }
  return status >= 200 && status < 300;
};
request.interceptors.response.use(
  (res: { [key: string]: any }) => {
    if (res.status) {
      if (res.status !== 'SUCCESS') {
        message.error(res.message || res.msg || '请求失败，请重试');
      }
    }
    return res;
  },
  (e) => {
    message.error(`${e?.message}(${decodeURIComponent(e.request?.responseURL)})`, 5000);
  }
);

export default {
  // Api 文档文件
  mysql,
  //
  user
};
