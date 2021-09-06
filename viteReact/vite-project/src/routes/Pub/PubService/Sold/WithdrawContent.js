import { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Divider, Input, Select, Alert } from 'antd';
import AmountInput from '@/components/Amount/Input';
import DataContent from '@/components/PubServiceCard/DataContent';
import { formatMoney, encodeMoney, formatModel } from '@/utils/format';
import { checkMobile } from '@/commons/lib/validator';
import ConfirmField from './ConfirmField';
import WithdrawContentAbs from './WithdrawContentAbs';

@connect(({ pubservice, venue, pubuser, deal, loading }) => ({
  pubservice,
  venue,
  pubuser,
  deal,
  submiting: loading.effects['pubservice/withdraw'],
}))
@Form.create()
class WithdrawContent extends Component {
  withdrawSure = (arg, formValues) => {
    const { dispatch, sure = result => result, selectedRows } = this.props;
    return dispatch({
      type: 'pubservice/withdraw',
      payload: {
        ...formValues,
        withdrawAmount: encodeMoney(formValues.withdrawAmount),
        publicServiceAccountId: selectedRows[0].id,
      },
    }).then(result => {
      if (result) {
        sure();
        return;
      }
      throw new Error('error');
    });
  };

  render() {
    const {
      form,
      dispatch,
      sure,
      deal: { PayWayTypes },
      venue,
      pubuser,
      selectedRows,
      chargeAmount,
      ...restProps
    } = this.props;

    const { getFieldDecorator } = form;

    const { userInfoCache = {} } = pubuser;
    const { pubAccountId, surplusValue, analysisCalcPrice } = selectedRows[0];
    const { publicAccount = {} } = userInfoCache[pubAccountId] || {};

    const { withdrawMode, withdrawAmount, withdrawRealName, withdrawMobile, withdrawAccount, salesId, descr } =
      form.getFieldsValue();
    const accountDis = withdrawMode === PayWayTypes.CASH.key;
    return (
      <WithdrawContentAbs
        {...restProps}
        title="服务折现"
        form={form}
        alertInfomation={{
          label: null,
          value: <Alert message="请注意：您本次折现成功后，此会员服务数据值将清零！" type="error" />,
        }}
        selectedRows={selectedRows}
        sure={this.withdrawSure}
        formItems={
          <>
            <Form.Item label="营销中心">
              {getFieldDecorator('salesId', {
                initialValue: (venue.currentVenue || {}).id,
                rules: [
                  {
                    required: true,
                    message: '请选择营销中心',
                  },
                ],
              })(
                <Select>
                  {(venue.list || []).map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.salesName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="折算提现金额">
              {getFieldDecorator('withdrawAmount', {
                initialValue: chargeAmount(surplusValue, analysisCalcPrice),
                rules: [
                  {
                    required: true,
                    message: '请填写金额',
                  },
                  {
                    message: '折现额度最小为0',
                    validator(rule, value, fn) {
                      if (value < 0) {
                        fn([new Error('invalid')]);
                        return;
                      }
                      fn();
                    },
                  },
                ],
              })(<AmountInput min={0} precision={2} fullWidth />)}
            </Form.Item>
            <Form.Item label="收款方">
              {getFieldDecorator('withdrawRealName', {
                initialValue: publicAccount.realName,
                rules: [
                  {
                    required: true,
                    message: '请填写收款方',
                  },
                ],
              })(<Input placeholder="收款方" />)}
            </Form.Item>
            <Form.Item label="收款方手机号">
              {getFieldDecorator('withdrawMobile', {
                initialValue: publicAccount.mobile,
                rules: [
                  {
                    required: true,
                    message: '请填写收款方手机号',
                  },
                  {
                    min: 11,
                    max: 11,
                    message: '请输入合法的手机号码!',
                    validator: checkMobile,
                  },
                ],
              })(<Input placeholder="收款方手机号" />)}
            </Form.Item>
            <Form.Item label="折现支付方式">
              {getFieldDecorator('withdrawMode', {
                rules: [
                  {
                    required: true,
                    message: '请选择折现支付方式',
                  },
                ],
              })(
                <Select placeholder="折现支付方式">
                  {[PayWayTypes.CASH, PayWayTypes.BANKTRANSFER, PayWayTypes.WECHAT, PayWayTypes.ZFB].map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {!accountDis && (
              <Form.Item label="折现账户">
                {getFieldDecorator('withdrawAccount', {
                  rules: [
                    {
                      required: true,
                      message: '请填写折现账户',
                    },
                  ],
                })(<Input placeholder="折现账户" />)}
              </Form.Item>
            )}
            <Form.Item label="折现原因">
              {getFieldDecorator('descr', {
                initialValue: '部分结算并部分退款',
                rules: [
                  {
                    required: true,
                    message: '请填写折现原因',
                  },
                ],
              })(<Input.TextArea rows={4} placeholder="折现原因" />)}
            </Form.Item>
          </>
        }
        confirmModalChildren={
          <>
            {[
              {
                label: '服务名称',
                value: selectedRows[0].serviceName,
              },
              {
                label: '服务值',
                value: (
                  <DataContent
                    pubServiceDataList={selectedRows[0].pubServiceDataList}
                    serviceUseMode={selectedRows[0].serviceUseMode}
                  />
                ),
              },
              {
                label: '服务储值金额',
                value: formatMoney(selectedRows[0].serviceAmount),
              },
            ].map(({ label, value }) => (
              <ConfirmField key={label} label={label} value={value} />
            ))}
            <Divider />
            {[
              {
                label: '营销中心',
                value: ((venue.list || []).find(item => item.id === salesId) || {}).salesName,
              },
              {
                label: '折算提现金额',
                value: formatMoney(encodeMoney(withdrawAmount)),
              },
              {
                label: '收款方',
                value: withdrawRealName,
              },
              {
                label: '收款方手机号',
                value: withdrawMobile,
              },
              {
                label: '折现支付方式',
                value: formatModel(PayWayTypes, withdrawMode),
              },
              withdrawAccount && {
                label: '折现账户',
                value: withdrawAccount,
              },
              {
                label: '折现原因',
                value: descr,
              },
            ]
              .filter(Boolean)
              .map(({ label, value }) => (
                <ConfirmField key={label} label={label} value={value} />
              ))}
          </>
        }
      />
    );
  }
}

export default WithdrawContent;
