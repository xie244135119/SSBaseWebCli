/**
 * 本文件为请求示例
 */
import { AxiosRequestConfig } from 'axios';
import request from '../request';

/**
 * post方法示例
 * @param params
 * @returns
 */
export function add(params: { [key: string]: any }): Promise<ResponseItem> {
  return request.post('/api/add', params);
}

/**
 * get方法示例
 * @param params
 * @returns
 */
export function getList(params: { [key: string]: any }): Promise<ResponseItem> {
  return request.get('/api/getList', { params });
}

/**
 * put方法修改示例
 * @param params
 * @returns
 */
export function update(params: { [key: string]: any }): Promise<ResponseItem> {
  return request.put('/api/edit', params);
}

/**
 * delete方法示例
 * @param params
 * @returns
 */
export function deleteById(params: { [key: string]: any }): Promise<ResponseItem> {
  return request.delete('/api/deleteById', { params });
}

/**
 * 导入文件数据
 * @returns
 */
export function upload(file: File, config?: AxiosRequestConfig): Promise<ResponseItem> {
  const formdata = new FormData();
  formdata.append('file', file);
  return request.post('/api/v1/import', formdata, config);
}
