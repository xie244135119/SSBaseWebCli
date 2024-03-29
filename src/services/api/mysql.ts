import XlsxTool from '@/js/xlsl';

/**
 * 加载本地配置的 sql数据
 * @returns {Promise<any[]>}
 */
const getData = () => {
  const filePath = '/file/mysql.xlsx';
  return XlsxTool.importExcel(filePath, []).then((res) => {
    return res;
  });
};
