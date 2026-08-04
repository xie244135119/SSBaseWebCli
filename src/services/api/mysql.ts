import XlsxTool from '@/js/xlsl';

/**
 * 加载本地配置的 sql数据
 * @returns {Promise<any[]>}
 */
export const getData = () => XlsxTool.importExcel('/file/mysql.xlsx', []);
