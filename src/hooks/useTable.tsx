import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableProps,
  Form,
  InputNumber,
  Input,
  Select,
  SelectProps,
  InputProps,
  InputNumberProps,
  TableColumnProps,
  FormProps,
  DatePicker,
  DatePickerProps,
  FormItemProps
} from 'antd';
import dayjs from 'dayjs';
import styles from './styles.module.less';

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 基础数据
   */
  record?: any;
  /**
   * 索引
   */
  index?: number;
  /**
   * 是否正在编辑
   */
  isEditing?: boolean;
  // record?: any;
  /**
   * 编辑模式是否生效
   */
  editable?: boolean | ((record: number, index: number) => boolean);
  /**
   * 输入框类型
   */
  editType?: 'number' | 'text' | 'select' | 'datepicker' | 'custom';
  /**
   * 修改的formItem props
   */
  editFormItemProps?: FormItemProps;
  /**
   * 自定义渲染
   */
  editRender?: (e?: any, obj?: any) => React.JSX.Element;
  /**
   * 组件特定样式
   */
  editSelectProps?: SelectProps;
  editInputProps?: InputProps;
  editInputNumberProps?: InputNumberProps;
  editDatePickerProps?: DatePickerProps;
}

/**
 * 编辑 Cell模式
 * @param param0
 * @returns
 */
export function EditableCell(props: TableColumnProps<any> & EditableCellProps) {
  const {
    dataIndex,
    // title,
    style,
    record,
    index,
    className,
    colSpan,
    rowSpan,
    children,
    editable,
    isEditing,
    editType = 'text',
    editRender,
    editSelectProps,
    editInputNumberProps,
    editInputProps,
    editDatePickerProps,
    editFormItemProps = {}
  } = props;
  const [editing, setEditing] = useState(isEditing);
  const form = Form.useFormInstance();
  const cellFormKey = Array.isArray(dataIndex)
    ? dataIndex.concat(index).join('.')
    : `${dataIndex}.${index}`;
  // console.log(' EditableCell props ', props, children, form.getFieldValue(cellFormKey));

  /**
   * 编辑保存的时候
   */
  const onEditSave = () => {
    // console.log(' 当前form提交的时候 ', form.getFieldsValue(true), dataIndex);
    setEditing(false);
  };

  /**
   * 触发编辑的时候
   */
  const onTriggerEdit = () => {
    // console.log(' 触发编辑的时候 ', cellFormKey, record, form.getFieldsValue());
    setEditing(true);
    if (form.getFieldValue(cellFormKey) === undefined) {
      form.setFieldValue(`${dataIndex}.${index}`, record[dataIndex]);
    }
  };

  let inputNode: React.JSX.Element = null;
  switch (editType) {
    case 'number':
      inputNode = <InputNumber {...editInputNumberProps} />;
      break;
    case 'text':
      inputNode = (
        <Input
          autoFocus
          {...editInputProps}
          onBlur={() => {
            if (!isEditing) {
              onEditSave();
            }
          }}
          onPressEnter={() => {
            if (!isEditing) {
              onEditSave();
            }
          }}
        />
      );
      break;
    case 'select':
      inputNode = <Select {...editSelectProps} />;
      break;
    case 'datepicker':
      inputNode = <DatePicker {...editDatePickerProps} />;
      break;
    case 'custom':
      inputNode = editRender?.(record[dataIndex], record);
      break;
    default:
      break;
  }

  useEffect(() => {
    setEditing(isEditing);
  }, [isEditing]);

  // console.log(' form props ', cellFormKey, record, props, inputNode);
  return (
    <td className={className} colSpan={colSpan} rowSpan={rowSpan} style={style}>
      {editing && (
        <Form.Item name={cellFormKey} style={{ margin: 0 }} {...editFormItemProps}>
          {inputNode}
        </Form.Item>
      )}
      {!editing && editable && (
        <div
          className={styles.editrow}
          onClick={() => {
            onTriggerEdit();
          }}
        >
          {/* {children} */}
          {form.getFieldValue(cellFormKey) !== undefined
            ? form.getFieldValue(cellFormKey)
            : children}
        </div>
      )}
      {!editing && !editable && children}
    </td>
  );
}

interface Props extends TableProps {
  /**
   * 数据模拟
   */
  mock?: boolean;
  /**
   * 当前时间
   */
  currentTime?: string;
  /**
   * 编辑模式 默认false
   */
  editable?: boolean;
  /**
   * 编辑模式下 form事件
   */
  editFormProps?: FormProps;
  /**
   * 列样式 普通 或 编辑模式
   */
  columns: (TableColumnProps<any> & EditableCellProps)[];
  /**
   * 异步加载数据处理
   * @returns
   */
  loadData?: (
    pageIndex: number,
    pageSize: number
  ) => Promise<{
    data: any[];
    total: number;
  }>;
  /**
   * 异步加载数据延迟更新
   */
  lazyLoadData?: boolean;
}

export default function useTableHook(props: Props) {
  const {
    columns,
    dataSource: defaultDataSource,
    loadData,
    lazyLoadData = false,
    currentTime,
    mock,
    editable,
    editFormProps
  } = props;
  // 数据列表
  const [dataSource, setDataSource] = useState<{
    list: any[];
    total: number;
  }>({
    list: defaultDataSource as any[],
    total: defaultDataSource?.length
  });
  // 加载进度条
  const [loading, setLoading] = useState<boolean>(false);
  // 分页配置项
  const paginationRef = useRef({
    current: 1,
    pageSize: 10
  });
  // 编辑模式下
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<{}>();
  //
  // 判断编辑模式
  const isEditingCell = (record) => record === editingItem;

  /**
   * 处理模拟数据
   * @param count
   * @returns
   */
  const getMockData = (count = 50) => {
    // mock数据
    const list = [];

    const getColumnsKeys = (l = []) => {
      const list = [];
      l.forEach((e) => {
        // console.log(' e.dataIndex ', e.dataIndex, typeof e.dataIndex, Array.isArray(e.dataIndex));
        if (e.children) {
          const resault = getColumnsKeys(e.children);
          list.push(...resault);
        } else {
          list.push(e.dataIndex);
        }
      });
      return list;
    };
    const keys = getColumnsKeys(columns);
    // console.log(' xxxx list ', keys, columns);
    for (let index = 0; index < count; index++) {
      const obj: {
        [key: string]: any;
      } = {};
      keys.forEach((e) => {
        if (typeof e === 'string') {
          obj[e] = (Math.random() * 100).toFixed(2);
        } else if (Array.isArray(e)) {
          const reducive = (l = [], index = 0, target = {}) => {
            if (index === e.length - 1) {
              target[l[index]] = (Math.random() * 100).toFixed(2);
            } else {
              const t = target[l[index]] || {};
              target[l[index]] = t;
              reducive(l, index + 1, t);
            }
          };
          reducive(e, 0, obj);
        }
      });
      obj.time = currentTime || dayjs().subtract(index, 'd').format('YYYY-MM-DD');
      obj.timeMonth = currentTime || dayjs().subtract(index, 'd').format('YYYY-MM');
      list.push(obj);
    }
    return list;
  };

  /**
   * 重新加载
   * @param reset 重置
   */
  const reload = (reset: boolean = false) => {
    if (loadData) {
      setLoading(true);
      if (reset) {
        paginationRef.current.current = 1;
      }
      loadData(paginationRef.current.current, paginationRef.current.pageSize)
        .then((res) => {
          setLoading(false);
          setDataSource({
            list: res.data,
            total: res.total
          });
        })
        .catch(() => {
          setLoading(false);
        });
    } else if (mock) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const mock = getMockData(paginationRef.current.pageSize);
        setDataSource({
          list: mock,
          total: mock.length
        });
      }, 500);
    }
  };

  useEffect(() => {
    if ((loadData && !lazyLoadData) || mock) {
      reload();
    }
  }, [currentTime]);

  delete props.dataSource;
  delete props.loadData;

  if (editable) {
    /**
     * 进入编辑模式
     * @param record
     */
    const startEdit = (record: {}) => {
      form.setFieldsValue({ ...record });
      setEditingItem(record);
    };

    /**
     * 结束编辑模式
     */
    const endEdit = () => {
      setEditingItem(null);
    };

    /**
     * 重置
     */
    const resetEdit = () => {
      form.resetFields();
    };

    /**
     * 提交编辑
     */
    const submitEdit = () => form.getFieldsValue();

    const editColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record, index) => ({
          ...col.onCell?.(record, index),
          record,
          dataIndex: col.dataIndex,
          index,
          editable: typeof col.editable === 'function' ? col.editable(record, index) : col.editable,
          isEditing: col.isEditing !== undefined ? col.isEditing : isEditingCell(record),
          editType: col.editType || 'text',
          editFormItemProps: col.editFormItemProps,
          editRender: col.editRender,
          editDatePickerProps: col.editDatePickerProps,
          editSelectProps: col.editSelectProps,
          editInputNumberProps: col.editInputNumberProps,
          editInputProps: col.editInputProps
        })
      };
    });
    delete props.columns;

    const element = (
      <Form form={form} component={false} {...editFormProps}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={defaultDataSource || dataSource?.list}
          columns={editColumns as any}
          scroll={{ x: 'max-content' }}
          pagination={{
            showTotal: (total) => `共${total}条`,
            showSizeChanger: true,
            current: paginationRef.current.current,
            pageSize: paginationRef.current.pageSize,
            onShowSizeChange: (current, size) => {
              // console.log(' 事件变化 ', current, size);
              paginationRef.current = {
                current,
                pageSize: size
              };
              reload();
            },
            onChange: endEdit
          }}
          {...props}
        />
      </Form>
    );

    return {
      element,
      reload,
      startEdit,
      endEdit,
      submitEdit,
      resetEdit
    };
  }

  const element = (
    <Table
      dataSource={defaultDataSource || dataSource?.list}
      scroll={{ x: 'max-content' }}
      bordered
      loading={loading}
      pagination={{
        showTotal: (total) => `共${total}条`,
        total: dataSource?.total,
        showSizeChanger: true,
        defaultCurrent: paginationRef.current.current,
        defaultPageSize: paginationRef.current.pageSize,
        onChange: (page, pageSize) => {
          paginationRef.current = {
            current: page,
            pageSize
          };
          reload();
        }
      }}
      {...props}
    />
  );
  return {
    element,
    reload
  };
}
