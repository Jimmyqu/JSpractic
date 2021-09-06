import { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Divider, Input, Select, Alert } from 'antd';
import AmountInput from '@/components/Amount/Input';
import DataContent from '@/components/PubServiceCard/DataContent';
import { formatMoney, encodeMoney, formatModel, decodeMoney } from '@/utils/format';
import { isNumerical } from '@/utils/utils';
import ConfirmField from './ConfirmField';
import WithdrawContentAbs from './WithdrawContentAbs';

const {
  isCalcPriceKey,
  //  getCalcPriceKeyById
} = DataContent;

@connect(({ pubservice, venue, pubuser, deal, loading }) => ({
  pubservice,
  venue,
  pubuser,
  deal,
  submiting: loading.effects['pubservice/withdrawToAccount'],
}))
@Form.create()
class WithdrawToAccountContent extends Component {
  withdrawSure = (arg, formValues) => {
    const { dispatch, sure = result => result, selectedRows } = this.props;
    const formData = {
      ...formValues,
    };
    const serviceValueList = [];
    Object.keys(formValues).forEach(key => {
      if (isNumerical(key)) {
        serviceValueList.push({
          serviceValueId: +key,
          // serviceValue: formData[getCalcPriceKeyById(key)],
          serviceValue: encodeMoney(formData[key]),
        });
        delete formData[key];
        return;
      }
      if (isCalcPriceKey(key)) {
        delete formData[key];
      }
    });
    return dispatch({
      type: 'pubservice/withdrawToAccount',
      payload: {
        ...formData,
        withdrawAmount: encodeMoney(formData.withdrawAmount),
        publicServiceAccountId: selectedRows[0].id,
        serviceValueList,
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
      pubservice: { PubServiceTypes },
      venue,
      pubuser,
      selectedRows,
      chargeAmount,
      ...restProps
    } = this.props;

    const { getFieldDecorator } = form;

    const { userInfoCache = {} } = pubuser;
    const {
      pubAccountId,
      surplusAmount,
      surplusValue,
      analysisCalcPrice,
      serviceUseMode,
      pubServiceDataList,
      serviceType,
      serviceName,
    } = selectedRows[0];
    const { publicAccount = {} } = userInfoCache[pubAccountId] || {};

    const { withdrawMode, withdrawAmount, withdrawRealName, withdrawMobile, salesId, descr, ...formValueRest } =
      form.getFieldsValue();

    // 次数类型的服务卡
    const isNumberType = serviceType === PubServiceTypes.NUMBER.key;
    const maxIfIsNotNumberType = decodeMoney(surplusAmount);
    return (
      <WithdrawContentAbs
        {...restProps}
        title="转结至账户"
        form={form}
        alertInfomation={{
          label: null,
          value: <Alert message="请注意：您本次转结的金额，将自动以【现金】方式充值至此会员账户！" type="error" />,
        }}
        selectedRows={selectedRows}
        sure={this.withdrawSure}
        beforeFormItems={
          <>
            <Divider orientation="left">本次转结值</Divider>
            <DataContent
              pubServiceDataList={pubServiceDataList}
              editable
              form={form}
              withdraw
              serviceUseMode={serviceUseMode}
              withdrawTotalPriceChange={price => {
                form.setFieldsValue({
                  withdrawAmount: price,
                });
              }}
            />
          </>
        }
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
            <Form.Item label="转结金额">
              {/* 转结时，非次数卡不可编辑上方的数量，但可以编辑下方的总额，限制为余额值最大，并且默认 */}
              {getFieldDecorator('withdrawAmount', {
                initialValue: isNumberType ? chargeAmount(surplusValue, analysisCalcPrice) : maxIfIsNotNumberType,
                rules: [
                  {
                    required: true,
                    message: '请填写金额',
                  },
                  {
                    message: '转结金额最小为0',
                    validator(rule, value, fn) {
                      if (value < 0) {
                        fn([new Error('invalid')]);
                        return;
                      }
                      fn();
                    },
                  },
                ],
              })(
                <AmountInput
                  min={0}
                  max={isNumberType ? undefined : maxIfIsNotNumberType}
                  precision={2}
                  fullWidth
                  disabled={isNumberType}
                />
              )}
            </Form.Item>
            <Form.Item label="收款方" required>
              {getFieldDecorator('withdrawRealName', {
                initialValue: publicAccount.realName,
              })(<Input placeholder="收款方" disabled />)}
            </Form.Item>
            <Form.Item label="收款方手机号" required>
              {getFieldDecorator('withdrawMobile', {
                initialValue: publicAccount.mobile,
              })(<Input placeholder="收款方手机号" disabled />)}
            </Form.Item>
            <Form.Item label="转结支付方式" required>
              {getFieldDecorator('withdrawMode', {
                initialValue: PayWayTypes.CASH.key,
              })(
                <Select placeholder="转结支付方式" disabled>
                  <Select.Option key={PayWayTypes.CASH.key} value={PayWayTypes.CASH.key}>
                    {PayWayTypes.CASH.value}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="转结原因">
              {getFieldDecorator('descr', {
                initialValue: '部分服务转结至账户',
                rules: [
                  {
                    required: true,
                    message: '请填写转结原因',
                  },
                ],
              })(<Input.TextArea rows={4} placeholder="转结原因" />)}
            </Form.Item>
          </>
        }
        confirmModalChildren={
          <>
            {[
              {
                label: '服务名称',
                value: serviceName,
              },
              {
                label: '服务值',
                value: (
                  <DataContent
                    pubServiceDataList={pubServiceDataList?.map(item => {
                      const obj = {
                        ...item,
                      };
                      // 和其他地方一样，兼容字段
                      let subItemListkey;
                      if ('pubServiceValueList' in item) {
                        subItemListkey = 'pubServiceValueList';
                      } else if ('dealServicePubValueList' in item) {
                        subItemListkey = 'dealServicePubValueList';
                      }
                      if (subItemListkey) {
                        obj[subItemListkey] = item[subItemListkey]?.map(subItem => {
                          const serviceValue = formValueRest[subItem.id.toString()];
                          return {
                            ...subItem,
                            serviceValue: Number.isFinite(serviceValue)
                              ? encodeMoney(serviceValue)
                              : subItem.serviceValue,
                          };
                        });
                      }
                      return obj;
                    })}
                    serviceUseMode={serviceUseMode}
                  />
                ),
              },
              {
                label: '服务储值金额',
                value: formatMoney(surplusAmount),
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
                label: '转结金额',
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
                label: '转结支付方式',
                value: formatModel(PayWayTypes, withdrawMode),
              },
              {
                label: '转结原因',
                value: descr,
              },
            ].map(({ label, value }) => (
              <ConfirmField key={label} label={label} value={value} />
            ))}
          </>
        }
      />
    );
  }
}

export default WithdrawToAccountContent;
