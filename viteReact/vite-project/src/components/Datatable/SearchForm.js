import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isPlainObject from 'lodash/isPlainObject';
import { Form, Row, Col, Button, Icon } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import IconFont from '@/components/Icon';
import { clearHMS, triggerEvent, isNumber } from '@/utils/utils';
import Item, { ItemTypes, genClassComposeStateChangeHandler } from './Item';
import style from './search-form.less';
import MarginBar from '../MarginBar';

export { ItemTypes };

@connect()
@Form.create({
  // field 包含除了值以外的一些其他状态，它们变化了也会触发
  // onFieldsChange({ config, dispatch }, changedFields, allFields) {
  //   const { onValuesChange } = config;
  //   const changedValues = {};
  //   Object.keys(changedFields).forEach(key => {
  //     changedValues[key] = changedFields[key].value;
  //   });
  //   const allValues = {};
  //   Object.keys(allFields).forEach(key => {
  //     allValues[key] = allFields[key].value;
  //   });
  //   if (typeof onValuesChange === 'function') {
  //     onValuesChange(changedValues, allValues);
  //   }
  //   dispatch({
  //     type: 'datatable/formValuesChange',
  //     payload: {
  //       changedValues,
  //       allValues,
  //     },
  //   });
  // },
  // // form reset 不触发
  // onValuesChange: ({ config, dispatch }, changedValues, allValues) => {
  //   const { onValuesChange } = config;
  //   if (typeof onValuesChange === 'function') {
  //     onValuesChange(changedValues, allValues);
  //   }
  //   dispatch({
  //     type: 'datatable/formValuesChange',
  //     payload: {
  //       changedValues,
  //       allValues,
  //     },
  //   });
  // },
})
class SearchForm extends Component {
  handleComposeStateChange = genClassComposeStateChangeHandler.call(this);

  delaySearchOnMount = false;

  static childContextTypes = {
    getComposeFieldByType: PropTypes.func,
  };

  state = {
    showDefHidden: false,
    composeStateMapping: {},
  };

  getChildContext() {
    return {
      getComposeFieldByType: (type, compose) => {
        if (compose == null) {
          return null;
        }
        const {
          config: { fields },
        } = this.props;

        return (fields || []).find(item => item.compose === compose && item.type === type);
      },
    };
  }

  componentDidMount() {
    const {
      form,
      config: { loading },
      onFormInit,
    } = this.props;
    if (onFormInit) {
      onFormInit(form, this.toSearch);
    }
    if (loading) {
      this.delaySearchOnMount = true;
      return;
    }
    this.toSearch();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      config: { loading: nextLoading },
      onFormInit,
      form,
    } = nextProps;
    if (onFormInit) {
      onFormInit(form, this.toSearch);
    }
    if (!this.delaySearchOnMount) {
      return;
    }
    const {
      config: { loading },
    } = this.props;
    if (loading && !nextLoading) {
      this.delaySearchOnMount = false;
      setTimeout(this.toSearch, 0);
    }
  }

  toggleForm = () => {
    const { showDefHidden } = this.state;
    this.setState(
      () => ({
        showDefHidden: !showDefHidden,
      }),
      () => {
        triggerEvent(window, 'resize');
      }
    );
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      composeStateMapping: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.toSearch();
  };

  flatValueConvert = (obj, val, key, fields, originEndDate, keyPrefix) => {
    const newPrefix = `${keyPrefix}${keyPrefix ? '.' : ''}${key}`;
    if (moment.isMoment(val)) {
      const field = fields.find(f => f.name === newPrefix);
      switch (field.type) {
        case ItemTypes.DatePicker:
        case ItemTypes.DatePickerRangeStart:
          // eslint-disable-next-line no-param-reassign
          obj[key] = clearHMS(val).valueOf();
          break;
        case ItemTypes.DatePickerRangeEnd:
          // eslint-disable-next-line no-param-reassign
          obj[key] = originEndDate ? clearHMS(val).valueOf() : clearHMS(val).add(1, 'days').valueOf();
          break;
        default:
          // eslint-disable-next-line no-param-reassign
          obj[key] = val.valueOf();
      }
      return;
    }
    // 值有可能是对象（嵌套字段）
    if (isPlainObject(val)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = this.flatValuesConvert(val, fields, originEndDate, newPrefix);
      return;
    }
    // 值有可能是数组（嵌套字段）
    if (Array.isArray(val)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = [];
      val.forEach((v, idx) => {
        this.flatValueConvert(obj[key], v, idx, fields, originEndDate, newPrefix);
      });
      return;
    }
    // eslint-disable-next-line no-param-reassign
    obj[key] = val;
  };

  flatValuesConvert = (fieldsValue, fields, originEndDate, keyPrefix = '') => {
    const values = {
      ...fieldsValue,
    };
    Object.keys(values).forEach(key => {
      const val = values[key];
      this.flatValueConvert(values, val, key, fields, originEndDate, keyPrefix);
    });
    return values;
  };

  toSearch = () => {
    const {
      form,
      config: { onSearch, fields, originEndDate },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const values = this.flatValuesConvert(fieldsValue, fields, originEndDate);

      if (typeof onSearch === 'function') {
        onSearch(values);
      }
    });
  };

  render() {
    const { config, form, tableLoading } = this.props;
    const { fields, col, loading } = config || {};
    if (!Array.isArray(fields) || fields.length === 0) {
      return null;
    }
    const { showDefHidden, composeStateMapping } = this.state;
    const hasDefHidden = fields.some(field => {
      if (Array.isArray(field)) {
        return field.every(f => !!f.defHidden);
      }
      return !!field.defHidden;
    });
    const colProps = {};
    if (col) {
      if (isNumber(col)) {
        Object.assign(colProps, {
          span: col,
        });
      } else {
        Object.assign(colProps, col);
      }
    } else {
      Object.assign(colProps, {
        sm: 24,
        md: 12,
        lg: 8,
        xl: 6,
      });
    }
    const inline = !fields.some(({ rules }) => rules && rules.length > 0);
    return (
      <Form onSubmit={this.handleSearch} layout={inline ? 'inline' : undefined} className="form-search">
        <Row gutter={8}>
          {fields.map(field => {
            const { key, name, label, rules, initialValue, defHidden, hidden, type } = field;
            const className = classNames({
              hidden: hidden || (!showDefHidden && defHidden),
            });
            const isPreset = type === ItemTypes.DatePickerRangePreset;
            return (
              <Col key={key || name} {...colProps} className={className}>
                <Form.Item
                  className={classNames(style.formItem, {
                    [style.formItemPreset]: isPreset,
                  })}
                  label={isPreset ? null : label}
                  colon={false}
                >
                  {form.getFieldDecorator(name, {
                    rules,
                    initialValue,
                  })(
                    <Item
                      {...field}
                      form={form}
                      composeStateMapping={composeStateMapping}
                      handleComposeStateChange={this.handleComposeStateChange}
                    />
                  )}
                </Form.Item>
              </Col>
            );
          })}
          <Col {...colProps} className={style.searchOperation}>
            <MarginBar inline left>
              <Button icon="search" type="primary" htmlType="submit" disabled={loading} loading={tableLoading}>
                查询
              </Button>
            </MarginBar>
            <MarginBar inline left>
              <Button onClick={this.handleFormReset} disabled={loading || tableLoading}>
                <IconFont type="refresh" />
                重置
              </Button>
            </MarginBar>
            {hasDefHidden && (
              <MarginBar inline left>
                {showDefHidden ? (
                  <Button type="link" onClick={this.toggleForm}>
                    收起 <Icon type="up" />
                  </Button>
                ) : (
                  <Button type="link" onClick={this.toggleForm}>
                    展开 <Icon type="down" />
                  </Button>
                )}
              </MarginBar>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}

export default function ({ config, children, ...restProps }) {
  // 如果datatable提供表单，外置表单就不产生，反之一样，只保有一个表单
  const configCp = config || {};
  const { fields, externalUsed } = configCp;
  if (!externalUsed) {
    // 相当于可用
    return null;
  }
  const formFields = [];
  if (fields) {
    fields.forEach(field => {
      if (Array.isArray(field)) {
        // 自动添加 compose
        // 如果两个关联字段不相邻，则不用数组，单独配置并设置 compose
        const compose = `${field.map(f => f.name).join('_')}`;
        formFields.push(
          ...field.map(f => ({
            compose,
            ...f,
          }))
        );
        return;
      }
      formFields.push(field);
    });
  }
  const formSearchCp = {
    ...configCp,
    fields: formFields,
  };
  return (
    <div className="datatable no-print">
      <SearchForm config={formSearchCp} {...restProps}>
        {children}
      </SearchForm>
    </div>
  );
}
