/*
 * Author  rhys.zhao
 * Date  2022-08-18 17:21:42
 * LastEditors  rhys.zhao
 * LastEditTime  2022-08-19 09:16:31
 * Description
 */
import Axios from "axios";
// import Prism from "./prism";
import { getMockData } from "./mock";

/**
 * 错误处理
 */
const errorHandle = () => {};

/**
 * 取消处理
 */
const CancelToken = Axios.CancelToken;
const source = CancelToken.source();

/**
 * 通过全局唯一实例 与默认请求做区分
 */
const axiosIntance = Axios.create({
  baseURL: "",
  timeout: 20 * 1000,
  // timeout: 2*1000,
  timeoutErrorMessage: "网络出点小差，请稍等重试",
  withCredentials: false,
  responseType: "json",
  validateStatus: (httpCode) => {
    if (httpCode == 401) {
      console.log(" 请求api httpCode 超时 ");
      // Prism.removeUserToken();
    }
    return httpCode >= 200 && httpCode < 300;
  },
  headers: {
    "Content-Type": "application/json",
    // Authorization: Prism.getUserToken(),
    "X-AppKey": "ISOPApp"
    // ...Prism.headers()
  },

  cancelToken: source.token
});

/**
 * 请求处理
 */
axiosIntance.interceptors.request.use((config) => {
  return config;
});

/**
 * 响应处理
 */
axiosIntance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (error) => {
    // 如果开启mock数据
    if (window.ENV?.useMock) {
      let aUrl = error.config.url;
      let aParams = error.config.data;
      try {
        if (aParams) {
          aParams = JSON.parse(aParams);
        }
        const _aUrl = new URL(error.config.url);
        aUrl = _aUrl.pathname;
      } catch (e) {
        //
      }
      console.log(" aUrl ", error.config, aUrl, aParams);
      return Promise.resolve(getMockData(aUrl, aParams));
    }
    errorHandle();
    return Promise.reject(error);
  }
);

export default axiosIntance;
