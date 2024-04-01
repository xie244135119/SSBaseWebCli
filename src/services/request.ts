import Axios from 'axios';
import { getMockData } from './mock';

/**
 * 错误处理
 */
const errorHandle = () => {};

/**
 * 取消处理
 */
const { CancelToken } = Axios;
const source = CancelToken.source();

/**
 * 通过全局唯一实例 与默认请求做区分
 */
const axiosIntance = Axios.create({
  baseURL: '',
  timeout: 20 * 1000,
  // timeout: 2*1000,
  timeoutErrorMessage: '网络出点小差，请稍等重试',
  withCredentials: false,
  responseType: 'json',
  validateStatus: (httpCode) => httpCode >= 200 && httpCode < 300,
  cancelToken: source.token
});

/**
 * 请求处理
 */
axiosIntance.interceptors.request.use((config) => config);

/**
 * 响应处理
 */
axiosIntance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    // 如果开启mock数据
    if (window.ENV?.useMock) {
      let aUrl = error.config.url;
      let aParams = error.config.data;
      try {
        if (aParams) {
          aParams = JSON.parse(aParams);
        }
        const url = new URL(error.config.url);
        aUrl = url.pathname;
      } catch (e) {
        //
      }
      return Promise.resolve(getMockData(aUrl, aParams));
    }
    errorHandle();
    return Promise.reject(error);
  }
);

export default axiosIntance;

const webrequest = Axios.create({
  // timeout: 2*1000,
  timeoutErrorMessage: '网络出点小差，请稍等重试',
  withCredentials: false,
  responseType: 'json'
});
webrequest.interceptors.response.use((res) => res.data);

export { webrequest };
