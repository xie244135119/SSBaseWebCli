import * as XLSX from 'xlsx';
import request from 'axios';

/**
 * 获取excel数据信息
 * @param aFilePath 本地地址
 * @param aWorkSheets 一组表名
 * @returns
 */
const importExcel = (
  aFilePath: string,
  aWorkSheets: string[] = []
): Promise<{ [key: string]: any[] }> => {
  const filePath = aFilePath;
  return request.get(filePath, { responseType: 'arraybuffer' }).then((res) => {
    const webbook = XLSX.read(res.data, { type: 'array' });
    let workSheets = aWorkSheets;
    if (workSheets.length === 0) {
      workSheets = webbook.SheetNames;
    }
    const dict = {};
    for (let index = 0; index < workSheets.length; index += 1) {
      const sheetName = workSheets[index];
      const workSheet = webbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(workSheet);
      dict[sheetName] = json;
    }
    return dict;
  });
};

/**
 * 将json数据 保存为 excel文件，默认格式为 { test: [{a: 112}] }
 * @param {{string: any[]}} obj 数据
 */
const sheetsToBlob = (obj: { [key: string]: any[] }): Blob => {
  // 生成数据
  const createData = (s) => {
    const buffer = new ArrayBuffer(s.length);
    const view = new Uint8Array(buffer);
    for (let index = 0; index < s.length; index += 1) {
      // eslint-disable-next-line no-bitwise
      view[index] = s.charCodeAt(index) & 0xff;
    }
    return buffer;
  };
  const sheetKeys = Object.keys(obj);
  const Sheets = {};
  sheetKeys.forEach((key) => {
    const sheet = XLSX.utils.json_to_sheet(obj[key]);
    Sheets[key] = sheet;
  });

  const workbook = {
    SheetNames: sheetKeys,
    Sheets
  };
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });
  const data = createData(wbout);
  const blob = new Blob([data], { type: 'application/octet-stream' });
  return blob;
};

/**
 * 下载文件
 * @param url 下载的地址
 * @param savename 保存的文件名
 */
function openDownXlsxDialog(url: string | Blob, fileName?: string) {
  let newUrl: string;
  if (typeof url === 'object' && url instanceof Blob) {
    newUrl = URL.createObjectURL(url);
  } else {
    newUrl = url;
  }

  const alink = document.createElement('a');
  alink.href = newUrl;
  alink.download = fileName;
  let event;
  if (window.MouseEvent) {
    event = new MouseEvent('click');
  }
  alink.dispatchEvent(event);
}

/**
 * 将数据导出为excel文件
 * @param sheets 数据
 * @param aFileName 文件名称
 */
function exportExcel(sheets: { [key: string]: any }, fileName: string) {
  try {
    const blob = sheetsToBlob(sheets);
    openDownXlsxDialog(blob, fileName);
  } catch (error) {
    console.error(' 文件导出数据 ', error);
  }
}

/**
 * 根据数据本地创建映射关系
 * @param aList 原始数据源
 * @param aUniqePropNames 一组唯一值 属性名称
 */
const createMultiMap = (aList = [], aUniqePropNames: string[]): { [key: string]: any } => {
  const resault = {};
  for (let index = 0; index < aList.length; index += 1) {
    const element = aList[index];
    for (let j = 0; j < aUniqePropNames.length; j += 1) {
      const aPropName = aUniqePropNames[j];
      const dict = resault[aPropName] || {};

      const key = element[aPropName];
      if (!key) {
        continue;
      }
      dict[key] = element;
      resault[aPropName] = dict;
    }
  }
  return resault;
};

export default {
  /**
   * 导入excel文件 解析
   */
  importExcel,
  /**
   * 导出excel文件
   */
  exportExcel,
  /**
   * 根据数据本地数据创建映射关系
   */
  createMultiMap
};
