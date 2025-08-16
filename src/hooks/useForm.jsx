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
