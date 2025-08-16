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
