import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Card, Form, InputNumber } from 'antd';
import Field from '@/components/Field';
import { formatDateTime, formatMoney, formatGender, formatAge } from '@/utils/format';
import { formItemLayoutFull } from '@/utils/utils';
import styles from './index.less';

function TicketCheckResult(props) {
  const { form, data, success, message, isVerify } = props;
  // const { CalendarTypes, DealStatus } = useSelector(state => state.pubticket);
  // const { DealStatus } = useSelector(state => state.deal);
  const fetching = useSelector(state => state.loading.effects['global/queryByCode']);

  const {
    authTime,
    authUser,
    dealId,
    descr,
    memberUser,
    totalNum,
    checkedNum,
    salesName,
    pubServiceName,
    dealState,
    // price,
    payFeeTotal,
    // transactionTotalPrice,
    checkInputNum,
    publicStudyList,
  } = data || {};

  let title;
  if (success) {
    title = isVerify ? '验票成功' : null;
  } else {
    title = message;
  }
  return (
    <Card className={styles.ticketCheckResult} loading={fetching} bordered={false}>
      {title && (
        <div
          className={classNames(styles.resultTitle, {
            [styles.resultSuccess]: success,
          })}
        >
          {title}
        </div>
      )}
      {form && !isVerify && (
        <Form {...formItemLayoutFull} labelAlign="left">
          <Form.Item label="入场人数">
            <div className="text-right">
              {form.getFieldDecorator('checkPersonNum', {
                initialValue: 2,
                rules: checkInputNum
                  ? [
                      {
                        required: true,
                        message: '请填写入场人数',
                      },
                    ]
                  : undefined,
              })(<InputNumber min={0} precision={0} placeholder="请填写" className={styles.entryNum} />)}
            </div>
          </Form.Item>
        </Form>
      )}
      <Field label="订单号">
        <Link to={`/basic/deal/${dealId}/detail`}>{dealId}</Link> 订单状态：{dealState}
      </Field>
      <Field label="订单信息">
        <div>
          {descr} <span className={styles.num}>{totalNum}</span> 张
        </div>
        {checkedNum > 0 && (
          <div className={styles.checkedNum}>已核验 {totalNum > 1 && <span>{checkedNum} 张</span>}</div>
        )}
      </Field>
      {publicStudyList && publicStudyList.length > 0 && (
        <Field label="人员信息">
          {publicStudyList.map(({ id, realName, mobile, sex, birthday, cardNum }) => (
            <div key={id}>
              {realName}/{mobile}/{formatGender(sex)}
              {typeof birthday === 'number' ? ' / ' : ''}
              {formatAge(birthday)}/{cardNum}
            </div>
          ))}
        </Field>
      )}
      {/* <Field label="单价">{formatMoney(price)}</Field> */}
      {/* <Field label="成交总价">{formatMoney(transactionTotalPrice)}</Field> */}
      <Field label="订单支付总价">{formatMoney(payFeeTotal)}</Field>
      {pubServiceName != null && <Field label="服务支付">{pubServiceName}</Field>}
      <Field label="地址">{salesName}</Field>
      <Field label="会员信息">{memberUser}</Field>
      <Field label="核验人">{authUser}</Field>
      {checkedNum > 0 && <Field label="核验时间">{formatDateTime(authTime)}</Field>}
    </Card>
  );
}

export default TicketCheckResult;
