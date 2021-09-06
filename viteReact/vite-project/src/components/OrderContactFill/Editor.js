import { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Row, Col, Select, Input, DatePicker, message } from 'antd';
import ExtFormItem from '@/components/ExtFormItem';
import MarginBar from '@/components/MarginBar';
import AFRManageModal from '@/components/Modal/AFRManageModal';
import { isIDNumber, getMomentByIdNumber, formItemLayoutFull, CDN_STATIC_HOST } from '@/utils/utils';
import { CommonFileLinkTypes } from '@/utils/upload';
import styles from './index.less';

@connect(({ contact, pubuser, extfield, loading }) => ({
  contact,
  pubuser,
  extfield,
  contactSaving: loading.effects['contact/newOrEdit'],
}))
@Form.create()
class FillEditor extends Component {
  static contextTypes = {
    validFace: PropTypes.bool,
  };

  state = {
    defaultContactRulesMapping: {},
    afrManageVisible: false,
    // 新增人员时先拍照得到的fileKey
    fileForEdit: null,
  };

  componentDidMount() {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'contact/createDefaultContactRulesMapping',
      payload: {
        form,
      },
    }).then(mapping => {
      if (this.isUnmounted) {
        return;
      }
      this.setState({
        defaultContactRulesMapping: mapping,
      });
    });
  }

  //  eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      editInfo: nextEditinfo,
      fieldsConfig,
      extfield: { ExtDataTypes },
      contact: { ContactOrderFields },
    } = nextProps;
    const { editInfo, form } = this.props;
    if (nextEditinfo !== editInfo) {
      const formSet = {};
      const { contactValidCfgs, extFields } = fieldsConfig || {};
      const editInfoCover = nextEditinfo || {};
      [
        ...contactValidCfgs.map(({ fieldName }) => {
          const value = editInfoCover[fieldName];
          return {
            [fieldName]: value == null || ContactOrderFields.Birthday.key !== fieldName ? value : moment(value),
          };
        }),
        ...this.filterExtFields(extFields || []).map(({ extName, extDataType }) => {
          let value = editInfoCover[extName];
          if (
            value != null &&
            (extDataType === ExtDataTypes.Date.key ||
              extDataType === ExtDataTypes.HourAndMinute.key ||
              extDataType === ExtDataTypes.DateTime.key)
          ) {
            value = moment(value);
          }
          return {
            [extName]: value,
          };
        }),
      ].forEach(item => {
        Object.assign(formSet, item);
      });
      form.setFieldsValue(formSet);
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  submitEdit = () => {
    const { validFace } = this.context;
    const { form, dispatch, fieldsConfig, pubAccountId, editInfo, afterEdit, filesCache } = this.props;
    const editInfoCover = editInfo || {};
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { fileForEdit } = this.state;
      const faceFile = editInfoCover.id ? filesCache.find(f => f.linkId === editInfoCover.id) : fileForEdit;
      if (validFace && faceFile == null) {
        message.error('需要补充录入人脸信息, 请点击拍照按钮上传人脸');
        return;
      }
      const formValues = {
        pubAccountId,
        ...formData,
        extFieldList: [],
      };
      if (editInfoCover.id) {
        formValues.id = editInfoCover.id;
      } else {
        formValues.fileKey = fileForEdit?.fileKey;
      }
      Object.keys(formValues).forEach(key => {
        const value = formValues[key];
        if (moment.isMoment(value)) {
          formValues[key] = value.valueOf();
        }
      });
      const { extFields } = fieldsConfig || {};
      this.filterExtFields(extFields || []).forEach(({ id, dataId, extName, extDataType }) => {
        formValues.extFieldList.push({
          id,
          dataId,
          extDataType,
          extName,
          dataValue: formValues[extName],
        });
        delete formValues[extName];
      });
      const result = await dispatch({
        type: 'contact/newOrEdit',
        payload: formValues,
      });
      if (result) {
        this.clear();
        afterEdit();
      }
    });
  };

  filterExtFields = list => {
    if (Array.isArray(list)) {
      const {
        extfield: { ExtDataTypes },
      } = this.props;
      return list.filter(item => item.extDataType !== ExtDataTypes.Contact.key);
    }
    return list;
  };

  handleCardTypeChange = val => {
    const {
      form,
      pubuser: { IDCardTypes },
      contact: { ContactOrderFields },
      fieldsConfig,
    } = this.props;
    const list = fieldsConfig?.contactValidCfgs;
    // 如果没有证件号码和出生日期，不处理
    if (
      list == null ||
      !list.some(item => item.fieldName === ContactOrderFields.CardNum.key) ||
      !list.some(item => item.fieldName === ContactOrderFields.Birthday.key)
    ) {
      return;
    }
    // 如果不是身份证，不处理
    if (val !== IDCardTypes.IDCard.key) {
      return;
    }
    const cardNum = form.getFieldValue(ContactOrderFields.CardNum.key);
    // 如果不是有效的身份证，不处理
    if (!isIDNumber(cardNum)) {
      return;
    }
    form.setFieldsValue({
      [ContactOrderFields.Birthday.key]: getMomentByIdNumber(cardNum),
    });
  };

  handleCardNumChange = e => {
    const {
      form,
      pubuser: { IDCardTypes },
      contact: { ContactOrderFields },
      fieldsConfig,
    } = this.props;
    const list = fieldsConfig?.contactValidCfgs;
    // 如果没有证件类型和出生日期，不处理
    if (
      list == null ||
      !list.some(item => item.fieldName === ContactOrderFields.CardType.key) ||
      !list.some(item => item.fieldName === ContactOrderFields.Birthday.key)
    ) {
      return;
    }
    const val = e.target.value;
    // 如果不是有效的身份证，不处理
    if (!isIDNumber(val)) {
      return;
    }
    const cardType = form.getFieldValue(ContactOrderFields.CardType.key);
    // 如果不是身份证，不处理
    if (cardType !== IDCardTypes.IDCard.key) {
      return;
    }
    form.setFieldsValue({
      [ContactOrderFields.Birthday.key]: getMomentByIdNumber(val),
    });
  };

  handleAfrManageVisibleChange = visible => {
    this.setState({
      afrManageVisible: visible,
    });
  };

  toShoot = () => {
    this.setState({
      afrManageVisible: true,
    });
  };

  afterShoot = file => {
    this.setState({
      afrManageVisible: false,
    });
    const { editInfo, updateFile } = this.props;
    if (editInfo?.id) {
      updateFile(editInfo?.id, file);
    }
    this.setState({
      fileForEdit: file,
    });
  };

  clear = () => {
    const { clear } = this.props;
    this.setState({
      fileForEdit: null,
    });
    clear();
  };

  render() {
    const {
      form,
      pubuser: { Genders },
      contact: { ContactOrderFields, CertificateTypes },
      fieldsConfig,
      editInfo,
      contactSaving,
      filesCache,
    } = this.props;
    const { validFace } = this.context;
    const { defaultContactRulesMapping, afrManageVisible, fileForEdit } = this.state;
    const editInfoCover = editInfo || {};
    const { contactValidCfgs, extFields } = fieldsConfig || {};
    // 在中国(目前仅考虑中国)曾经的夏令时时段的生日，iOS和macOS平台的Safari不显示夏令时，通过正常显示夏令时的环境下产生的时间戳格式化日期会提前1小时，如果遇到跨天，则出现问题
    // TODO 需要补充：当输入完善证件类型是身份证并且证件号码有效，则自动根据号码填充出生日期值（需要留意Safari夏令时回填显示和校验问题，https://code.aliyun.com/ydmap-code/ydmap-ssr-portal-pages/commit/428f160e328e3c537d66406f147a7afe15b1025e）

    const faceFile = editInfoCover.id ? filesCache.find(f => f.linkId === editInfoCover.id) : fileForEdit;
    return (
      <div className={styles.editorPanel}>
        <Form {...formItemLayoutFull}>
          {validFace && (
            <Row>
              <FieldWrapper required label="点击拍照">
                <img
                  className={styles.faceImg}
                  src={faceFile?.url || `${CDN_STATIC_HOST}/images/camera-capture-bg.png`}
                  alt="face img"
                />
                <MarginBar inline left={16}>
                  <Button onClick={this.toShoot}>点击拍照</Button>
                </MarginBar>
              </FieldWrapper>
            </Row>
          )}
          <Row gutter={8}>
            {/* 人员选择只显示必填项，联系人维护显示所有并使用默认必填规则 */}
            {(contactValidCfgs || []).map(({ fieldName, optionList, placeholder }) => {
              // 选人的编辑模式下只显示必填字段，故此都是必填的，只有在纯联系人管理中使用该是否必填校验的配置
              // 所以去掉第一个
              // https://code.aliyun.com/ydmap-code/ydmap-ssr-portal-pages/blob/master/-vue-features/components/contact/mixins/contact-field.js#L36
              const [, ...otherRules] = defaultContactRulesMapping[fieldName] || [];
              switch (fieldName) {
                case ContactOrderFields.RealName.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.RealName.value}>
                      {form.getFieldDecorator(fieldName, {
                        initialValue: editInfoCover[fieldName],
                        rules: [
                          {
                            required: true,
                            message: '请填写姓名',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Gender.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Gender.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                          ...otherRules,
                        ],
                      })(
                        <Select placeholder={placeholder || '请选择'}>
                          {Object.values(Genders).map(item => (
                            <Select.Option key={item.key} value={item.key}>
                              {item.value}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Mobile.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Mobile.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写手机号',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Birthday.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Birthday.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写生日',
                          },
                          ...otherRules,
                        ],
                      })(<DatePicker placeholder={placeholder || '请选择'} className="full-width" />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.CardType.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.CardType.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证件类型',
                          },
                          ...otherRules,
                        ],
                      })(
                        <Select placeholder={placeholder || '请选择'} onChange={this.handleCardTypeChange}>
                          {Object.values(CertificateTypes)
                            // optionList 目前只实现控制了证件类型
                            .filter(
                              item =>
                                optionList == null ||
                                optionList.length === 0 ||
                                optionList.includes(item.key.toString())
                            )
                            .map(item => (
                              <Select.Option key={item.key} value={item.key}>
                                {item.value}
                              </Select.Option>
                            ))}
                        </Select>
                      )}
                    </FieldWrapper>
                  );
                case ContactOrderFields.CardNum.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.CardNum.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写证件号码',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} onChange={this.handleCardNumChange} />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Telephone.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Telephone.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写固定电话',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Height.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Height.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写身高',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} />)}
                    </FieldWrapper>
                  );
                case ContactOrderFields.Weight.key:
                  return (
                    <FieldWrapper key={fieldName} label={ContactOrderFields.Weight.value}>
                      {form.getFieldDecorator(fieldName, {
                        rules: [
                          {
                            required: true,
                            message: '请填写体重',
                          },
                          ...otherRules,
                        ],
                      })(<Input placeholder={placeholder || '请填写'} />)}
                    </FieldWrapper>
                  );
                default:
                  return null;
              }
            })}
            {/* <ExtFormItemArea fields={this.filterExtFields(extFields || [])} form={form} canEdit /> */}
            {this.filterExtFields(extFields || []).map(field => (
              <FieldWrapper key={field.extName} noFormItem>
                <ExtFormItem key={field.extName} field={field} form={form} canEdit />
              </FieldWrapper>
            ))}
          </Row>
          <Row>
            <Col className="text-right">
              <MarginBar inline left top>
                <Button type="primary" loading={contactSaving} onClick={this.submitEdit}>
                  {editInfo == null || editInfo.id == null ? '添加' : '提交修改'}
                </Button>
              </MarginBar>
              <MarginBar inline left top>
                <Button type="danger" disabled={contactSaving} onClick={this.clear}>
                  清空
                </Button>
              </MarginBar>
            </Col>
          </Row>
        </Form>
        <AFRManageModal
          visible={afrManageVisible}
          type={CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key}
          id={editInfoCover.id}
          onVisibleChange={this.handleAfrManageVisibleChange}
          onOk={this.afterShoot}
        />
      </div>
    );
  }
}

function FieldWrapper({ noFormItem, children, ...restProps }) {
  return (
    <Col sm={24} md={12} lg={8} xl={6}>
      {noFormItem ? children : <Form.Item {...restProps}>{children}</Form.Item>}
    </Col>
  );
}

export default FillEditor;
