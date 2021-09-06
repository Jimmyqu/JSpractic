import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Button, message, Form, Input, InputNumber } from 'antd';
import VenueSwitcher from '@/components/VenueSwitcher';
import Block from '@/components/Block';
import ScanCode from '@/components/ScanCode';
import Field from '@/components/Field';
import WeixinSubscribeQrCodeTip from '@/components/ScanCode/WeixinSubscribeQrCodeTip';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { formatMoney, formatModel, encodeMoney, decodeMoney, fixedMoney } from '@/utils/format';
import { formItemLayoutFull } from '@/utils/utils';
import styles from './index.less';

function Verifier({ form, onSuccess, onShowQueryResult }, { playVerifyAudio }) {
  const dispatch = useDispatch();
  const { getFieldDecorator } = form;
  const { currentVenue } = useSelector(state => state.venue);
  const { CouponStatus, IssueModeTypes } = useSelector(state => state.coupon);
  const fetching = useSelector(state => state.loading.effects['coupon/fetchCode']);
  const verifying = useSelector(state => state.loading.effects['coupon/verify']);
  const [showQrCode, setShowQrCode] = useState(false);
  const [queryData, setQueryData] = useState();

  const reset = useCallback(() => {
    setQueryData(null);
    setShowQrCode(false);
  }, []);

  const queryInfo = useCallback(async val => {
    reset();
    let result;
    try {
      result = await dispatch({
        type: 'coupon/fetchCode',
        payload: val,
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    setQueryData(result || {});
  }, []);

  const { couponCode, couponPrice, pubRealName, pubMobile, issueMode, couponState } = queryData || {};

  const enable = couponState === CouponStatus.Enable.key;

  const min = decodeMoney(couponPrice || 0);

  useEffect(() => {
    if (currentVenue == null) {
      message.error('营销中心无效，核验功能将不可用！');
    }
  }, []);

  useEffect(() => {
    onShowQueryResult(queryData != null);
  }, [queryData]);

  return (
    <>
      <Row>
        <Col md={6} />
        <Col md={12}>
          <Card>
            <Row>
              <Col md={3} />
              <Col md={18}>
                <Block
                  title={
                    <Row className={styles.verifierTitle}>
                      <Col md={20}>
                        <Row>
                          <Col span={6}>营销中心：</Col>
                          <Col span={18}>
                            <VenueSwitcher />
                          </Col>
                        </Row>
                      </Col>
                      <Col md={4} className={styles.verifierSubTitle}>
                        核验优惠码
                      </Col>
                    </Row>
                  }
                >
                  <ScanCode checkFn={queryInfo} onShowTipChange={setShowQrCode} />
                </Block>
                {showQrCode && <WeixinSubscribeQrCodeTip />}
                {queryData && (
                  <Card bordered={false}>
                    <Block title="核验信息">
                      {enable && (
                        <Form {...formItemLayoutFull} labelAlign="left">
                          <Form.Item label="订单号">
                            {getFieldDecorator('consumeDealId', {
                              rules: [
                                {
                                  required: true,
                                  message: '请填写订单号',
                                },
                              ],
                            })(<Input placeholder="请填写消费订单号" />)}
                          </Form.Item>
                          <Form.Item label="订单金额">
                            {getFieldDecorator('consumeTotalPrice', {
                              rules: [
                                {
                                  required: true,
                                  message: `请填写订单金额, 不小于${fixedMoney(min)}`,
                                  validator(rule, value, fn) {
                                    if (value >= min) {
                                      fn();
                                      return;
                                    }
                                    fn([new Error('invalid')]);
                                  },
                                },
                              ],
                            })(
                              <InputNumber
                                className="full-width"
                                precision={2}
                                min={Math.max(0, min)}
                                placeholder="请填写"
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="消费备注">
                            {getFieldDecorator('consumeContent')(<Input.TextArea autoSize placeholder="请填写" />)}
                          </Form.Item>
                        </Form>
                      )}
                      <Field label="优惠码">{couponCode}</Field>
                      <Field label="优惠码金额">{formatMoney(couponPrice)}</Field>
                      {pubRealName && <Field label="会员名">{pubRealName}</Field>}
                      {pubMobile && <Field label="手机号">{pubMobile}</Field>}
                      <Field label="发行方式">{formatModel(IssueModeTypes, issueMode)}</Field>
                    </Block>
                  </Card>
                )}
              </Col>
              <Col md={3} />
            </Row>
          </Card>
        </Col>
        <Col md={6} />
      </Row>
      {queryData && (
        <FooterToolbar>
          <MarginBar top inline>
            <Button disabled={fetching || verifying} onClick={reset}>
              取消
            </Button>
          </MarginBar>
          {enable && (
            <MarginBar left top inline>
              <Button
                type="primary"
                disabled={fetching || currentVenue == null}
                loading={verifying}
                onClick={() => {
                  if (couponCode == null) {
                    return;
                  }
                  form.validateFieldsAndScroll(async (err, formData) => {
                    if (err) {
                      return;
                    }
                    try {
                      await dispatch({
                        type: 'coupon/verify',
                        payload: {
                          ...formData,
                          consumeTotalPrice: encodeMoney(formData.consumeTotalPrice),
                          checkSalesId: currentVenue.id,
                          couponCode,
                        },
                      });
                    } catch {
                      playVerifyAudio(false);
                      return;
                    }
                    playVerifyAudio(true);
                    message.success('核验成功');
                    reset();
                    onSuccess();
                  });
                }}
              >
                确认核验
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      )}
    </>
  );
}

Verifier.contextTypes = {
  playVerifyAudio: PropTypes.func,
};

export default Form.create()(Verifier);
