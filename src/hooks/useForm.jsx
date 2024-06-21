/*
 * Author  Murphy.xie
 * Date  2024-03-01 18:18:52
 * LastEditors  Murphy.xie
 * LastEditTime  2024-03-21 15:13:19
 * Description 自定义Form
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Form } from 'antd';

export default function useFormHook(initialState) {
  const { options, submit, reset } = initialState;
  const form = Form.useForm();

  //
  const formRef = useRef();

  const newState = {
    ...initialState
  };
  delete newState.columns;
  delete newState.dataSource;
  delete newState.loadData;
}
