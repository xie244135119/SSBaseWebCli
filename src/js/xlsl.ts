import * as XLSX from 'xlsx';
import request from 'axios';

interface ExportTableColumns {
  title: string;
  dataIndex?: string | string[];
  children?: ExportTableColumns[];
  [key: string]: any;
}

/**
 * 获取excel数据信息
 * @returns
 */
const importExcelData = (
  data: ArrayBuffer,
  aWorkSheets: string[] = []
): Promise<{ [key: string]: any[] }> =>
  new Promise((reslove) => {
    const webbook = XLSX.read(data, {
      type: 'array',
      sheets: aWorkSheets.length === 0 ? null : aWorkSheets
    });
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
    reslove(dict);
  });

/**
 * 获取excel数据信息 <无权限校验>
 * @param aFilePath 一个网络文件地址
 * @param aWorkSheets 一组表名
 * @returns
 */
const importExcel = (
  aFilePath: string,
  aWorkSheets: string[] = []
): Promise<{ [key: string]: any[] }> => {
  const filePath = aFilePath;
  return request
    .get(filePath, { responseType: 'arraybuffer' })
    .then((res) => importExcelData(res.data, aWorkSheets));
};

/**
 * 下载文件
 * @param url 下载的地址
 * @param savename 保存的文件名
 */
function download(url: string | Blob | ArrayBuffer, fileName?: string) {
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
function exportExcel(sheets: { [key: string]: any[] }, fileName: string) {
  const sheetKeys = Object.keys(sheets);
  const Sheets = {};
  sheetKeys.forEach((key) => {
    const sheet = XLSX.utils.json_to_sheet(sheets[key]);
    Sheets[key] = sheet;
  });
  XLSX.writeFileXLSX(
    {
      SheetNames: sheetKeys,
      Sheets
    },
    fileName
  );
}

/**
 * 将数据导出为excel文件
 * @param sheets 数据
 * @param aFileName 文件名称
 */
function exportExcelFromTable(tablee: HTMLTableElement, fileName?: string) {
  const workbook = XLSX.utils.table_to_book(tablee);
  // Process Data (add a new row)
  // var ws = workbook.Sheets['Sheet1'];
  // XLSX.utils.sheet_add_aoa(ws, [['Created ' + new Date().toISOString()]], { origin: -1 });
  XLSX.writeFileXLSX(workbook, fileName);
}

/**
 * 根据表格
 * @param columns 表格列
 * @param dataList 表格数据
 * @param fileName 文件名称
 */
function exportExcelFromColumns(columns: ExportTableColumns[], dataList: any[], fileName: string) {
  // 将头部标题数据 拉平
  const mergeOptions = [];
  let maxHeaderLevel = 1;
  const flatteHeaders = (
    columns: ExportTableColumns[],
    prevHeaders: ExportTableColumns[] = [],
    level = 1
  ) => {
    const list = [];
    for (let index = 0; index < columns.length; index++) {
      const element = columns[index];

      if (element.children?.length > 0) {
        const resault = flatteHeaders(element.children, [...prevHeaders, element], level + 1);
        list.push(...resault);
        // 只处理横向合并问题
        mergeOptions.push({
          s: {
            r: level - 1,
            c: list.length - resault.length
          },
          e: {
            r: level - 1,
            c: list.length - 1
          }
        });
      } else {
        list.push({
          ...element,
          prevHeaders: [...prevHeaders, element]
        });
      }
    }
    maxHeaderLevel = Math.max(maxHeaderLevel, level);
    return list;
  };

  const flatteColumns = flatteHeaders(columns, []);
  const headerDatas: string[][] = [];
  const dataIndexKeys = [];
  for (let index = 0; index < flatteColumns.length; index++) {
    const element = flatteColumns[index];
    dataIndexKeys.push(element.dataIndex);

    for (let j = 0; j < maxHeaderLevel; j++) {
      if (!headerDatas[j]) {
        headerDatas[j] = [];
      }
      const headerData = headerDatas[j];
      const targetElement = element.prevHeaders[j] || {};
      headerData.push(targetElement.title || '');

      if (j === element.prevHeaders.length - 1) {
        mergeOptions.push({
          s: {
            r: j,
            c: index
          },
          e: {
            r: maxHeaderLevel - 1,
            c: index
          }
        });
      }
    }
  }

  // 从对象中获取值
  const getValueFromProps = (keys: string[], obj: { [key: string]: any }) => {
    if (keys.length <= 1) {
      return obj?.[keys[0]];
    }
    const target = obj?.[keys[0]];
    keys.shift();
    return getValueFromProps(keys, target);
  };

  const contentDatas = [];
  for (let index = 0; index < dataList.length; index++) {
    const element = dataList[index];
    const values = [];
    for (let j = 0; j < dataIndexKeys.length; j++) {
      const dataIndex = dataIndexKeys[j];
      let value = null;

      // 添加 data数据
      if (dataIndex instanceof Array) {
        value = getValueFromProps([...dataIndex], element);
      } else {
        value = getValueFromProps([dataIndex], element);
      }
      values.push(value);
    }
    contentDatas.push(values);
  }

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  // 转换数据为工作表
  const contentws = XLSX.utils.aoa_to_sheet([...headerDatas, ...contentDatas]);
  // 设置单元格合并
  contentws['!merges'] = mergeOptions;
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, contentws);
  XLSX.writeFile(wb, fileName);
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

/**
 * 导出json 文件
 * @param {*} aJsonObject json结构数据
 * @param {*} aFileName 文件名称
 */
const exportJson = (aJsonObject: any, aFileName: string) => {
  try {
    const jsonData = JSON.stringify(aJsonObject);
    const blob = new Blob([jsonData], { type: 'text/json' });
    download(blob, aFileName);
  } catch (error) {
    //   console.log(' 文件导出数据 ', error);
  }
};

export default {
  /**
   * 导入excel文件 解析
   */
  importExcel,
  /**
   * 导入 excel数据解析
   */
  importExcelData,
  /**
   * 导出excel文件
   */
  exportExcel,
  /**
   * 根据表格元素导出excel文件
   */
  exportExcelFromTable,
  /**
   * @description 根据表格列配置表格数据
   */
  exportExcelFromColumns,
  /**
   * 导出json
   */
  exportJson,
  /**
   * 根据数据本地数据创建映射关系
   */
  createMultiMap,
  /**
   * 下载文件流
   */
  download
};
