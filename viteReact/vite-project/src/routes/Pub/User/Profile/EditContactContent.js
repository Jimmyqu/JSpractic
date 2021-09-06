import { useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Input, Select, DatePicker, Radio, Spin } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { useDelayDispatch } from '@/utils/hooks';

function EditContactContent({ form, cancel, sure, isEdit, selectedRows, pubAccountId, add, ...restProps }) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const dispatch = useDispatch();
  const delayDispatch = useDelayDispatch(800);
  const { ContactOrderFields, CertificateTypes } = useSelector(state => state.contact);
  const { Genders } = useSelector(state => state.pubuser);
  const { Weight, Height, CardNum, CardType, Telephone, Birthday, Gender, Mobile, RealName } = ContactOrderFields || {};
  const saving = useSelector(state => state.loading.effects['contact/newOrEdit']);
  const fetchLoading = useSelector(state => state.loading.effects['pubuser/fetchUserByKey']);
  const [defaultContactRulesMapping, setDefaultContactRulesMapping] = useState({});
  const [accountList, setAccountList] = useState([]);
  const editObj = isEdit ? (selectedRows || [])[0] || {} : {};

  const fetch = (dataType, value) => {
    if (value == null || value.trim().length === 0) {
      return;
    }
    const params = {};
    if (dataType === 0) {
      params.realName = value;
    } else if (dataType === 1) {
      params.mobile = value;
    }
    delayDispatch({
      type: 'pubuser/fetchUserByKey',
      payload: params,
    }).then(list => {
      setAccountList(list);
    });
  };

  useEffect(() => {
    dispatch({
      type: 'contact/createDefaultContactRulesMapping',
      payload: {
        form,
      },
    }).then(setDefaultContactRulesMapping);
  }, []);

  return (
    <Content
      title={`${isEdit ? '编辑' : '添加'}人员`}
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          loading: saving,
          action: () => {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const formValues = {
                ...formData,
                id: editObj.id,
                pubAccountId: pubAccountId || formData.pubAccountId,
                [ContactOrderFields.Birthday.key]: formData[ContactOrderFields.Birthday.key]
                  ? formData[ContactOrderFields.Birthday.key].valueOf()
                  : undefined,
              };

              const result = await dispatch({
                type: 'contact/newOrEdit',
                payload: formValues,
              });
              if (result) {
                sure(result);
              }
            });
          },
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Row>
              {add && (
                <>
                  <Col md={12}>
                    <Form.Item label="会员姓名">
                      {getFieldDecorator('pubAccountId', {
                        initialValue: pubAccountId,
                        rules: [
                          {
                            required: true,
                            message: '请选择会员手机或会员姓名',
                          },
                        ],
                      })(
                        <Select
                          placeholder="请输入"
                          showSearch
                          onSearch={value => fetch(0, value)}
                          defaultActiveFirstOption={false}
                          filterOption={false}
                          optionLabelProp="realname"
                          notFoundContent={fetchLoading ? <Spin /> : undefined}
                        >
                          {accountList.map(item => (
                            <Select.Option key={item.id} value={item.id} realname={item.realName}>
                              {item.realName}/{item.mobile}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item label="会员手机号">
                      {getFieldDecorator('pubAccountId', {
                        initialValue: pubAccountId,
                        rules: [
                          {
                            required: true,
                            message: '请选择会员手机号',
                          },
                        ],
                      })(
                        <Select
                          placeholder="请输入"
                          showSearch
                          onSearch={value => fetch(1, value)}
                          defaultActiveFirstOption={false}
                          filterOption={false}
                          optionLabelProp="mobile"
                          notFoundContent={fetchLoading ? <Spin /> : undefined}
                        >
                          {accountList.map(item => (
                            <Select.Option key={item.id} value={item.id} mobile={item.mobile}>
                              {item.realName}/{item.mobile}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col md={12}>
                <Form.Item label={RealName.value}>
                  {getFieldDecorator(RealName.key, {
                    initialValue: editObj[RealName.key],
                    rules: defaultContactRulesMapping[RealName.key],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Mobile.value}>
                  {getFieldDecorator(Mobile.key, {
                    initialValue: editObj[Mobile.key],
                    rules: defaultContactRulesMapping[Mobile.key],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Gender.value}>
                  {getFieldDecorator(Gender.key, {
                    initialValue: editObj[Gender.key],
                    rules: defaultContactRulesMapping[Gender.key],
                  })(
                    <Radio.Group>
                      {Object.values(Genders).map(item => (
                        <Radio value={item.key} key={item.key}>
                          {item.value}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Birthday.value}>
                  {getFieldDecorator(Birthday.key, {
                    initialValue: editObj[Birthday.key] == null ? undefined : moment(editObj[Birthday.key]),
                    rules: defaultContactRulesMapping[Birthday.key],
                  })(<DatePicker className="full-width" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Telephone.value}>
                  {getFieldDecorator(Telephone.key, {
                    initialValue: editObj[Telephone.key],
                    rules: defaultContactRulesMapping[Telephone.key],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={CardType.value}>
                  {getFieldDecorator(CardType.key, {
                    initialValue: editObj[CardType.key],
                    rules: defaultContactRulesMapping[CardType.key],
                  })(
                    <Select placeholder="请选择">
                      {Object.values(CertificateTypes).map(item => (
                        <Select.Option key={item.key} value={item.key}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={CardNum.value}>
                  {getFieldDecorator(CardNum.key, {
                    initialValue: editObj[CardNum.key],
                    rules: defaultContactRulesMapping[CardNum.key],
                  })(<Input placeholder="请填写" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Height.value}>
                  {getFieldDecorator(Height.key, {
                    initialValue: editObj[Height.key],
                    rules: defaultContactRulesMapping[Height.key],
                  })(<Input placeholder="身高cm" />)}
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item label={Weight.value}>
                  {getFieldDecorator(Weight.key, {
                    initialValue: editObj[Weight.key],
                    rules: defaultContactRulesMapping[Weight.key],
                  })(<Input placeholder="单位kg" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(EditContactContent);
