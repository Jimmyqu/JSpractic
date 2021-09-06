import { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Select, DatePicker, Cascader, Spin } from 'antd';
import { cascaderData } from '@/commons/lib/home-town';
import FormItem from './FormItem';

const { RangePicker } = DatePicker;
const placeholders = {
  exerciseName: '活动名称',
  exerciseContacts: '联系人',
  exerciseTel: '手机号',
  exerciseAddress: '活动地址',
};
/**
 * 动态表单项目
 */
@connect(({ user, activity, loading }) => ({
  user,
  activity,
  fetchCompanyIng: loading.effects['activity/fetchDeclareCompany'],
}))
class ExtFormItem extends Component {
  static contextTypes = {
    declareFillList: PropTypes.array,
  };

  state = {
    allCompanyList: undefined,
    companyList: undefined,
  };

  filterDeclareCompany = value => {
    const { allCompanyList } = this.state;
    if (allCompanyList) {
      this.setState({
        companyList: value
          ? allCompanyList.filter(({ companyName }) => (companyName || '').includes(value))
          : allCompanyList,
      });
    }
  };

  fetchDeclareCompany = async () => {
    const { allCompanyList } = this.state;
    const { dispatch, fetchCompanyIng } = this.props;
    if (fetchCompanyIng || allCompanyList) {
      return;
    }
    const result = await dispatch({
      type: 'activity/fetchDeclareCompany',
    });
    this.setState({
      allCompanyList: result,
      companyList: result,
    });
  };

  categoryChange = value => {
    const { form, onChange } = this.props;
    form.setFieldsValue({
      configId: undefined,
    });
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const {
      field,
      form,
      fromServer,
      canEdit,
      companyId,
      companyName,
      fetchCompanyIng,
      user: { currentUser },
      activity: { categoryDataListMapping },
      industry,
      dropdownRender,
      onChange,
      incomplete,
      dispatch,
      ...props
    } = this.props;
    if (form == null) {
      return null;
    }
    const { declareFillList } = this.context;

    let disabled = !canEdit;
    const { extName, dataValue, placeholder, descr } = field || {};

    let dataValueOverride = dataValue;
    let descrOverride = descr;
    let disabledOverride = disabled;

    const declareFill = declareFillList.find(item => item.name === extName);
    if (declareFill) {
      const { value, descr: ds, name } = declareFill;
      // 回填禁用时排除这些
      if (!(name === 'startDate')) {
        disabledOverride = true;
      }
      if (value) {
        dataValueOverride = value;
      }
      if (ds) {
        descrOverride = ds;
      }
    }

    const newField = {
      ...field,
      dataValue: dataValueOverride,
      descr: descrOverride,
    };

    const itemProps = {
      onChange,
    };
    if (placeholder != null) {
      itemProps.placeholder = placeholder;
    }
    const { companyList } = this.state;
    // 不可修改的字段Disabled
    const specDisabled = fromServer || !canEdit;
    let userCompanyList = specDisabled
      ? [
          {
            id: companyId,
            companyName,
          },
        ]
      : companyList || [];

    const isFixedStaticFields = !field.queryCompany;
    if (!disabled) {
      const { companyId: cid, companyName: cname } = (currentUser || {}).sysUser || {};
      if (!userCompanyList.some(item => item.id === cid)) {
        userCompanyList = [{ id: cid, companyName: cname }, ...userCompanyList];
      }
    }
    // 由于上面有逻辑使用disabled，故最后再覆盖
    disabled = disabledOverride;
    const categoryDataList = categoryDataListMapping[industry] || [];
    const nowCategoryVal = form.getFieldValue('category');
    const configList = (categoryDataList.find(item => item.category === nowCategoryVal) || {}).configList || [];
    switch (extName) {
      case 'category':
        return (
          <FormItem
            form={form}
            field={newField}
            {...props}
            className={classNames(props.className, {
              hidden: field.hidden && categoryDataList && categoryDataList.length === 1,
            })}
          >
            <Select placeholder="请选择活动类型" {...itemProps} disabled={specDisabled} onChange={this.categoryChange}>
              {categoryDataList.map(item => (
                <Select.Option key={item.category} value={item.category}>
                  {item.categoryName}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        );
      case 'configId':
        return (
          <FormItem
            form={form}
            field={newField}
            {...props}
            className={classNames(props.className, {
              hidden: field.hidden && configList && configList.length === 1,
            })}
            incomplete={incomplete}
          >
            <Select placeholder="请选择项目类型" {...itemProps} disabled={specDisabled} dropdownRender={dropdownRender}>
              {configList.map(item => (
                <Select.Option key={item.configId} value={item.configId}>
                  {item.typeName}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        );
      case 'companyId':
        return (
          <FormItem form={form} field={newField} {...props}>
            {isFixedStaticFields ? (
              <Select placeholder="输入关键字搜索并选择单位" {...itemProps} disabled={specDisabled}>
                {(userCompanyList || []).map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.companyName}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <Select
                placeholder="输入关键字搜索并选择单位"
                {...itemProps}
                disabled={specDisabled}
                showSearch
                onSearch={this.filterDeclareCompany}
                onMouseEnter={this.fetchDeclareCompany}
                defaultActiveFirstOption={false}
                filterOption={false}
                notFoundContent={fetchCompanyIng ? <Spin /> : undefined}
              >
                {(userCompanyList || []).map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.companyName}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        );
      case 'exerciseName':
      case 'exerciseContacts':
      case 'exerciseTel':
      case 'exerciseAddress':
        return (
          <FormItem form={form} field={newField} {...props}>
            <Input placeholder={placeholders[extName]} {...itemProps} disabled={disabled} />
          </FormItem>
        );
      case 'startDate':
        return (
          <FormItem form={form} field={newField} {...props}>
            <RangePicker
              // FIXME 默认0点的问题似乎需要修改antd
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              format="YYYY-MM-DD HH:mm"
              {...itemProps}
              placeholder={['请选择开始时间', '请选择结束时间']}
              disabled={disabled}
            />
          </FormItem>
        );
      case 'province':
        return (
          // TODO placeholder问题 https://codesandbox.io/s/0xyj88k4zv
          <FormItem form={form} field={newField} {...props}>
            <Cascader options={cascaderData} placeholder="请选择地区" {...itemProps} disabled={disabled} />
          </FormItem>
        );
      default:
        return null;
    }
  }
}

export default ExtFormItem;
