import qs from 'qs';

/**
 * 根据href 得到拼接的参数信息
 * @param {*} href 当前地址栏的地址
 */
const getQueryByUrl = (href = window.location.href) => {
  if (typeof href !== 'string') {
    return {};
  }
  const urlQueryComponents = href.split('?');
  const urlQuery = urlQueryComponents[urlQueryComponents.length - 1];
  return qs.parse(urlQuery) || {};
};

export default {
  getQueryByUrl
};
