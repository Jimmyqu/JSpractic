import { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Form, Button, Divider, message } from 'antd';
import ExtFormItem from '@/components/ExtFormItem';
import { staticFields, getSortedFields, needConfirm, getActiveStep } from '@/components/ActivityDeclare';
import ActivityDeclareExtFormItem from '@/components/ActivityDeclare/ExtFormItem';
import { modal } from '@/utils/feedback';
import { formFileMapper } from '@/utils/upload';

import BasicView from './BasicView';
import styles from './index.less';

@connect(({ activity, user, extfield, global }) => ({
  activity,
  user,
  extfield,
  RelTypes: global.RelTypes,
}))
@Form.create()
class ActivityBasic extends Component {
  state = {
    declareFillListCopy: undefined,
  };

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };

  static childContextTypes = {
    declareFillList: PropTypes.array,
  };

  getChildContext() {
    const { declareFillList = [] } = this.props;
    return {
      declareFillList,
    };
  }

  componentDidMount() {
    const { onInit } = this.props;
    if (typeof onInit === 'function') {
      onInit({
        onDataSave: () => {
          this.handleFormSubmit();
        },
      });
    }
  }

  componentDidUpdate() {
    const { declareFillList, fixedStaticFields, form, activity, data } = this.props;
    const { declareFillListCopy } = this.state;
    if (declareFillList !== declareFillListCopy) {
      // 当心无限循环渲染
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        () => ({
          declareFillListCopy: declareFillList,
        }),
        () => {
          if (declareFillList && declareFillList.length > 0) {
            const { dynamicDeclareFieldsMapping } = activity;
            const { declareDetail } = data;
            const { configId } = declareDetail || {};
            const declareFields = dynamicDeclareFieldsMapping[configId] || [];
            const obj = {};
            declareFillList.forEach(({ name, value }) => {
              if (
                value &&
                (fixedStaticFields.some(item => item.extName === name) ||
                  declareFields.some(item => item.extName === name))
              ) {
                obj[name] = value;
              }
            });
            form.setFieldsValue(obj);
          }
        }
      );
    }
  }

  handleFormSubmit = () => {
    const {
      form,
      dispatch,
      data,
      activity,
      onBasicInfoEdit,
      extfield: { ExtDataTypes },
    } = this.props;
    const { dynamicDeclareFieldsMapping } = activity;
    const { declareDetail } = data;
    const { industry, projectConfigId, id: exerciseId } = declareDetail || {};
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const assignData = {
        ...formData,
        industry,
        exerciseId,
        projectConfigId,
      };
      const { province, startDate, configId } = formData;
      if (Array.isArray(province)) {
        const [pv, city, district] = province;
        assignData.province = pv;
        assignData.city = city;
        assignData.district = district;
      }
      if (Array.isArray(startDate)) {
        const [st, endDate] = startDate;
        assignData.startDate = st ? st.valueOf() : null;
        assignData.endDate = endDate ? endDate.valueOf() : null;
      }
      // 处理扩展字段中的文件字段
      const declareFields = dynamicDeclareFieldsMapping[configId] || [];
      declareFields
        .filter(({ extDataType }) => extDataType === ExtDataTypes.DocFile.key)
        .forEach(({ extName }) => {
          assignData[extName] = formFileMapper(assignData[extName]);
        });
      const confirm = needConfirm(activity, data);
      const fn = async () => {
        const id = await dispatch({
          type: 'activity/save',
          payload: assignData,
          activeStep: getActiveStep(data), // 好像用不到这个参数了
        });
        if (id) {
          message.success('提交成功');
          if (confirm) {
            dispatch(push('./list'));
            return;
          }
          dispatch(
            push({
              pathname: './info',
              search: `id=${id}&step=2`, // 新建的如果非 confirm, 固定到第二步
            })
          );
          if (typeof onBasicInfoEdit === 'function') {
            onBasicInfoEdit(assignData);
          }
        }
      };
      if (confirm) {
        modal.confirm('确认提交审核吗？', {
          onOk() {
            fn();
          },
        });
        return;
      }
      fn();
    });
  };

  render() {
    const {
      fixedStaticFields,
      form,
      data,
      activity: { categoryDataListMapping, dynamicDeclareFieldsMapping },
      onConfigChange,
      editMode,
      user: { currentUser },
      RelTypes,
      onProjectConfigClick,
    } = this.props;
    const { declareCurrentNode, declareDetail: basicDetail } = data || {};
    const declareDetail = basicDetail || {};
    const { canEdit, fromServer } = declareCurrentNode || {};
    const {
      industry,
      // category: defCategory,
      // configId: defConfigId,
      category: defaultCategory,
      categoryValue,
      configId: defaultConfigId,
      configName,
      companyId,
      companyName,
      province,
      city,
      district,
      startDate,
      endDate,
      newsId,
      projectConfigId,
    } = declareDetail;
    const categoryDataList = [...(categoryDataListMapping[industry] || [])];
    // 数据值 state查出来却没有
    if (defaultCategory && !categoryDataList.some(item => item.category === defaultCategory)) {
      categoryDataList.push({
        category: defaultCategory,
        categoryName: categoryValue,
        configList: [],
      });
    }
    // // 不可修改的字段Disabled
    // const specDisabled = fromServer || !canEdit;

    let categoryId = form.getFieldValue('category');
    let configId = form.getFieldValue('configId');
    if (categoryId == null) {
      categoryId = defaultCategory;
    }
    if (configId == null) {
      configId = defaultConfigId;
    }
    const currentCategory = categoryDataList.find(item => item.category === categoryId);

    let currentConfig = ((currentCategory || {}).configList || []).find(item => item.configId === configId);
    if (defaultConfigId && currentCategory && currentConfig == null) {
      currentCategory.configList = currentCategory.configList || [];
      currentCategory.configList.push({
        configId: defaultConfigId,
        typeName: configName,
        newsId,
      });
      currentConfig = currentCategory.configList.find(item => item.configId === configId);
    }

    const declareFields = (dynamicDeclareFieldsMapping[configId] || []).map(field => {
      return {
        ...field,
        dataValue: declareDetail[field.extName], // 放默认值
      };
    });

    const sortedFields = getSortedFields(declareFields, fixedStaticFields);
    const mustUseProjectGroup = currentConfig && currentConfig.relType === RelTypes.EXERCISE_PROJECT_CONFIG.key;
    // 必须选择修饰的配置而未选择
    const incomplete = currentConfig && mustUseProjectGroup && !projectConfigId;
    // formItemCanEdit 表示组件的可写，不是node信息的编辑权限
    const formItemCanEdit = !fromServer || editMode;
    return !fromServer || editMode ? (
      <Form>
        {sortedFields.map(field => {
          let { dataValue } = field;
          const { extName } = field;
          if (dataValue == null) {
            dataValue = declareDetail[extName];
          }
          if (staticFields.includes(extName)) {
            if (dataValue == null && canEdit && extName === 'companyId') {
              const { companyId: cid } = (currentUser || {}).sysUser || {};
              dataValue = cid;
            }
            if (extName === 'province') {
              dataValue = province == null || city == null || district == null ? undefined : [province, city, district];
            } else if (extName === 'startDate') {
              dataValue = startDate == null || endDate == null ? undefined : [moment(startDate), moment(endDate)];
            }
            return (
              <ActivityDeclareExtFormItem
                key={extName}
                companyId={companyId}
                companyName={companyName}
                industry={industry}
                field={{ ...field, dataValue, required: true }}
                form={form}
                canEdit={formItemCanEdit}
                fromServer={fromServer}
                incomplete={incomplete}
                onChange={extName === 'configId' ? onConfigChange : undefined}
                dropdownRender={
                  extName === 'configId'
                    ? //
                      menu => (
                        <div className={styles.dropdownConfig}>
                          {menu}
                          {currentConfig && currentConfig.relType === RelTypes.EXERCISE_PROJECT_CONFIG.key && (
                            <>
                              <Divider />
                              <div
                                className="text-right"
                                onMouseDown={e => {
                                  e.preventDefault();
                                }}
                              >
                                <Button
                                  type="primary"
                                  onClick={() => {
                                    if (onProjectConfigClick) {
                                      onProjectConfigClick();
                                    }
                                    document.dispatchEvent(new Event('click'));
                                  }}
                                >
                                  选择配置
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )
                    : undefined
                }
                {...this.formItemLayout}
              />
            );
          }
          if (declareFields.some(item => item.extName === extName)) {
            return (
              <ExtFormItem
                key={extName}
                field={{ ...field, dataValue }}
                form={form}
                canEdit={formItemCanEdit}
                {...this.formItemLayout}
              />
            );
          }
          return null;
        })}
      </Form>
    ) : (
      <BasicView data={data} declareFields={declareFields} fixedStaticFields={fixedStaticFields} />
    );
  }
}

export default ActivityBasic;
