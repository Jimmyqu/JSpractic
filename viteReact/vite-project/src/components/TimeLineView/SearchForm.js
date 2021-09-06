import { useEffect, useState } from 'react';
import { Form, Col, Select } from 'antd';
import { useDispatch } from 'react-redux';
import Item from '../Datatable/Item';
import styles from './index.less';

const Cols = {
  xs: 24,
  sm: 12,
  lg: 8,
  xl: 4,
};

const { Option } = Select;

const SearchForm = props => {
  const {
    form: { getFieldDecorator },
    form,
    setSearchCondition,
    fields,
    disabled,
  } = props;

  const [sysUserList, setSysUserList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'pubcourse/fetchCourseSysUser' }).then(res => setSysUserList(res));
  }, []);

  return (
    <Form className={styles.formContainer}>
      {fields.map(field => {
        const { key, name, rules, initialValue } = field;
        return (
          <Col key={key || name} {...Cols}>
            <Form.Item>
              {getFieldDecorator(name, { rules, initialValue })(
                <Item
                  disabled={disabled}
                  {...field}
                  form={form}
                  // 这个composeStateMapping 是一个功能，直接给空对象是有问题的，但是你这里使用的 fields 字段只有
                  // type: ItemTypes.CascaderVenue,
                  // 和
                  // type: ItemTypes.Select,
                  // 等不要composeStateMapping的功能才没受影响
                  composeStateMapping={{}}
                  onChange={val => setSearchCondition({ ...form.getFieldsValue(), [name]: val })}
                />
              )}
            </Form.Item>
          </Col>
        );
      })}
      <Col {...Cols}>
        <Form.Item>
          {getFieldDecorator('sysUserId')(
            <Select
              placeholder="全部教职人员"
              disabled={disabled}
              allowClear
              onChange={val => setSearchCondition({ ...form.getFieldsValue(), sysUserId: val })}
            >
              {sysUserList.map(item => (
                <Option key={item.id} value={item.sysUserId}>
                  {item.realName}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Col>
    </Form>
  );
};

export default Form.create({ name: 'SearchForm' })(SearchForm);
