import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col, Select, Spin, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { checkIDCardNumber, checkNumber } from '@/commons/lib/validator';
import { useDelayDispatch } from '@/utils/hooks';

function BindingContent({ form, cancel, sure, ...restProps }) {
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFieldsAndScroll, validateFields } = form;

  const dispatch = useDispatch();
  const delayDispatch = useDelayDispatch(500);

  const { MagneticCardTypes, MagneticCardUserTypeList } = useSelector(state => state.pubticket);
  const fetchLoading = useSelector(
    state => state.loading.effects['user/fetchUserByKey'] || state.loading.effects['pubuser/fetchUserByKey']
  );
  const fetchStudyLoading = useSelector(state => state.loading.effects['contact/fetchByUser']);
  const fetchPubServiceLoading = useSelector(state => state.loading.effects['pubservice/fetchPubServiceByUser']);
  const saving = useSelector(state => state.loading.effects['global/addICCardBinding']);

  const { RelTypes } = useSelector(state => state.global);
  const [userList, setUserList] = useState();
  const [selectUser, setSelectUser] = useState();
  const [studyList, setStudyList] = useState();
  const [pubServiceList, setPubServiceList] = useState();

  const relType = getFieldValue('relType');

  const icType = getFieldValue('icType');
  const useIDCard = icType === MagneticCardTypes.IDCard.key;

  const isSysUserType = relType === RelTypes.SYS_USER.key;
  const isStudyUserType = relType === RelTypes.PUBSTUDY_USER.key;
  const isPubServiceType = relType === RelTypes.PUBSERVICE_ACCOUNT.key;

  function setCurrentUser(user) {
    setSelectUser(user);
    const { id } = user || {};
    setFieldsValue({
      mobile: id,
      realName: id,
    });
  }

  useEffect(() => {
    setCurrentUser();
    setUserList([]);
  }, [isSysUserType]);

  useEffect(() => {
    if (isStudyUserType && selectUser) {
      dispatch({
        type: 'contact/fetchByUser',
        payload: selectUser.id,
      }).then(setStudyList);
      return;
    }
    setStudyList();
  }, [isStudyUserType, selectUser]);

  useEffect(() => {
    if (isPubServiceType && selectUser) {
      dispatch({
        type: 'pubservice/fetchPubServiceByUser',
        payload: selectUser.id,
      }).then(setPubServiceList);
      return;
    }
    setPubServiceList();
  }, [isPubServiceType, selectUser]);

  useEffect(() => {
    if (useIDCard) {
      validateFields(['icNo']);
    }
  }, [useIDCard]);

  const fetch = useCallback(
    async (dataType, value) => {
      if (value == null || value.trim().length === 0) {
        return;
      }
      const params = {};
      if (dataType === 0) {
        params.realName = value;
      } else if (dataType === 1) {
        params.mobile = value;
      }
      const list = await delayDispatch(
        Object.assign(
          isSysUserType
            ? {
                type: 'user/fetchUserByKey',
              }
            : {
                type: 'pubuser/fetchUserByKey',
              },
          {
            payload: params,
          }
        )
      );
      setCurrentUser();
      setUserList(list);
    },
    [isSysUserType]
  );

  const handleSelectChange = useCallback(
    value => {
      const user = (userList || []).find(item => item.id === value);
      setCurrentUser(user);
    },
    [userList]
  );

  return (
    <Content
      title="绑定卡号"
      {...restProps}
      buttons={[
        {
          text: '取消',
          disabled: fetchLoading || fetchStudyLoading || fetchPubServiceLoading || saving,
          action: cancel,
        },
        {
          text: '确定',
          type: 'primary',
          disabled: fetchLoading || fetchStudyLoading || fetchPubServiceLoading,
          loading: saving,
          action: () => {
            validateFieldsAndScroll(async (err, formData) => {
              if (err) {
                return;
              }
              const { id } = selectUser || {};
              const formValues = {
                ...formData,
                userId: id,
              };
              delete formValues.mobile;
              delete formValues.realName;
              await dispatch({
                type: 'global/addICCardBinding',
                payload: formValues,
              });
              sure();
            });
          },
        },
      ]}
    >
      <Row>
        <Col md={12}>
          <Form {...formItemLayoutNormal}>
            <Form.Item label="数据类型">
              {getFieldDecorator('relType', {
                rules: [
                  {
                    required: true,
                    message: '请选择数据类型',
                  },
                ],
              })(
                <Select placeholder="请选择">
                  {MagneticCardUserTypeList.map(({ key, value }) => (
                    <Select.Option value={key} key={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {relType && (
              <>
                <Form.Item label={`${isSysUserType ? '用户' : '会员'}手机号`}>
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        message: '请填写手机号',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请输入关键词"
                      showSearch
                      onSearch={value => fetch(1, value)}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      optionLabelProp="mobile"
                      notFoundContent={fetchLoading ? <Spin /> : undefined}
                      onChange={handleSelectChange}
                    >
                      {(userList || []).map(item => (
                        <Select.Option key={item.id} value={item.id} mobile={item.mobile}>
                          {item.realName}/{item.mobile}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label={`${isSysUserType ? '用户' : '会员'}姓名`}>
                  {getFieldDecorator('realName', {
                    rules: [
                      {
                        required: true,
                        message: '请填写姓名',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请输入关键词"
                      showSearch
                      onSearch={value => fetch(0, value)}
                      defaultActiveFirstOption={false}
                      filterOption={false}
                      optionLabelProp="realname"
                      notFoundContent={fetchLoading ? <Spin /> : undefined}
                      onChange={handleSelectChange}
                    >
                      {(userList || []).map(item => (
                        <Select.Option key={item.id} value={item.id} realname={item.realName}>
                          {item.realName}/{item.mobile}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </>
            )}
            {isPubServiceType && (
              <Form.Item label="会员服务">
                {getFieldDecorator('dataId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择会员服务',
                    },
                  ],
                })(
                  <Select placeholder="会员服务" loading={fetchPubServiceLoading}>
                    {(pubServiceList || []).map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.serviceName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
            {isStudyUserType && (
              <Form.Item label="人员/学员">
                {getFieldDecorator('dataId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择人员/学员',
                    },
                  ],
                })(
                  <Select placeholder="人员/学员" loading={fetchStudyLoading}>
                    {(studyList || []).map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.realName}/{item.mobile}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
            <Form.Item label="绑定卡号">
              {getFieldDecorator('icNo', {
                rules: [
                  {
                    required: true,
                    message: useIDCard ? '请填写正确的身份证号' : '请填写正确的卡号',
                    validator: useIDCard ? checkIDCardNumber : checkNumber,
                  },
                ].filter(Boolean),
              })(<Input placeholder="卡号" />)}
            </Form.Item>
            <Form.Item label="绑定物理卡号">
              {getFieldDecorator('icPhysicsNo', {
                rules: [
                  getFieldValue('icPhysicsNo') && {
                    message: '请填写正确的物理卡号',
                    validator: checkNumber,
                  },
                ].filter(Boolean),
              })(<Input placeholder="卡号" />)}
            </Form.Item>
            <Form.Item label="卡类型">
              {getFieldDecorator('icType', {
                rules: [
                  {
                    required: true,
                    message: '请选择卡类型',
                  },
                ],
                initialValue: MagneticCardTypes.ICCard.key,
              })(
                <Select placeholder="卡类型">
                  {Object.values(MagneticCardTypes).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="备注">
              {getFieldDecorator('descr')(<Input.TextArea placeholder="备注" rows={3} />)}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Content>
  );
}

export default Form.create()(BindingContent);
