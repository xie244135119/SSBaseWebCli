/*
 * Author  Murphy.xie
 * Date  2024-03-01 18:18:52
 * LastEditors  Murphy.xie
 * LastEditTime  2024-03-06 14:15:14
 * Description 获取组件下全部 ant design组件的相关数据值
 */

import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function useAntdData(initialState) {
  const { ref } = initialState;

  /**
   * 数据提交
   */
  const submit = () => {
    //
  };

  /**
   * 重置
   */
  const reset = () => {
    //
  };

  console.log(' xxx ', ref);
  return {
    submit,
    reset
  };
}
