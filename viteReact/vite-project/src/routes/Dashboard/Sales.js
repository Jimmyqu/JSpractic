import { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Divider, Icon, Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { formatPercent, formatMoney } from '@/utils/format';
import styles from './index.less';

function Sales(props, context) {
  const { isAuthorized } = context;
  const { data } = props;
  const dispatch = useDispatch();
  const {
    totalSalesAmount,
    totalSalesNum,
    portalSalesAmount,
    portalSalesNum,
    cloudSalesAmount,
    cloudSalesNum,
    waitPayNum,
    totalRefundAmount,
    totalRefundNum,
    lastTotalSalesAmount,
    lastCloudSalesAmount,
    lastPortalSalesAmount,
    lastTotalRefundAmount,
    analysisStartDate,
    analysisEndDate,
    salesIds,
    isSameDay,
  } = data;
  const { PayWayTypes, DealStatus, SrvTypes } = useSelector(state => state.deal);
  const { ActionTypes } = useSelector(state => state.analysis);

  const payWay = [
    PayWayTypes.CASH.key,
    PayWayTypes.ZFB.key,
    PayWayTypes.WECHAT.key,
    PayWayTypes.BANKTRANSFER.key,
    PayWayTypes.BANKCARD.key,
  ].join(',');

  const toPercentage = useCallback((pre, cur) => {
    return pre !== cur ? (
      <>
        <b>
          <Icon type={pre > cur ? 'caret-down' : 'caret-up'} className={pre > cur ? styles.iconDown : styles.iconUp} />
        </b>
        {pre === 0 ? '100%' : formatPercent(pre > cur ? (pre - cur) / pre : (cur - pre) / pre)}
      </>
    ) : (
      ' 持平'
    );
  }, []);
  const state = useMemo(
    () => [
      {
        name: '累计销售额',
        isAuthorized: isAuthorized('totalSalesAmount'),
        srvType: '',
        tooltip:
          '累计销售额：是指当前时间段内，所选营销中心，所有现金流水支付方式的，收款金额减去退款金额，也就是实收总金额。',
        totalSalesAmount,
        totalSalesNum,
        toPercentage: toPercentage(lastTotalSalesAmount, totalSalesAmount),
      },
      {
        name: '无线端销售额',
        isAuthorized: isAuthorized('portalSalesAmount'),
        srvType: SrvTypes.PORTAL.key,
        tooltip:
          '无线端销售额：是指无线端，当前时间段内，所选营销中心，所有现金流水支付方式的，收款金额减去退款金额，也就是实收总金额。',
        totalSalesAmount: portalSalesAmount,
        totalSalesNum: portalSalesNum,
        toPercentage: toPercentage(lastPortalSalesAmount, portalSalesAmount),
      },
      {
        name: 'PC端销售额',
        isAuthorized: isAuthorized('cloudSalesAmount'),
        srvType: SrvTypes.PC.key,
        tooltip:
          'PC端销售额：是指PC端，当前时间段内，所选营销中心，所有现金流水支付方式的，收款金额减去退款金额，也就是实收总金额。',
        totalSalesAmount: cloudSalesAmount,
        totalSalesNum: cloudSalesNum,
        toPercentage: toPercentage(lastCloudSalesAmount, cloudSalesAmount),
      },
      {
        name: '待支付',
        isAuthorized: isAuthorized('waitPay'),
        tooltip: '待支付：是指当前时间段内，所选营销中心种已创建订单且未支付的订单',
        totalSalesAmount: '—',
        totalSalesNum: waitPayNum,
        toPercentage: '—',
      },
      {
        name: '退款',
        isAuthorized: isAuthorized('totalRefundAmount'),
        srvType: '',
        tooltip: '退款：是指当前时间段内，所选营销中心下，所有现金流水支付方式的，所有已支付订单的退款汇总。',
        totalSalesAmount: totalRefundAmount,
        totalSalesNum: totalRefundNum,
        toPercentage: toPercentage(lastTotalRefundAmount, totalRefundAmount),
      },
    ],
    [data]
  );

  const goToDetail = (item, index) => {
    if (item.totalSalesNum > 0) {
      let parameter = `srvType=${item.srvType}&payMode=${payWay}`;
      if (index === 3) {
        parameter += `&dealState=${DealStatus.NOT_PAY.key}`;
      }
      if (index === 4) {
        parameter += `&operationActions=${ActionTypes.DEAL_CANCEL.key}`;
      }
      dispatch(
        push({
          pathname: index === 3 ? '/basic/deal/deal' : '/analysis/finance/detail',
          search: `salesIds=${salesIds}&analysisStartDate=${analysisStartDate}&analysisEndDate=${analysisEndDate}&${parameter}`,
        })
      );
    }
  };

  const [columns, setColumns] = useState(state);

  useEffect(() => {
    setColumns(state);
  }, [data]);

  return (
    <div className={styles.salesContainer}>
      {columns.map(
        (item, index) =>
          item.isAuthorized && (
            <Card bordered={false} className={styles.card} key={item.name}>
              <span className={styles.salesColor}>{item.name}</span>
              <Tooltip placement="right" title={item.tooltip}>
                <Icon type="question" className={styles.question} />
              </Tooltip>
              <div className={styles.sales}>
                {index !== 3 && <span>￥</span>}
                {formatMoney(item.totalSalesAmount)}
              </div>
              <div className={styles.orderCount}>
                订单数
                <span className={styles.num} onClick={() => goToDetail(item, index)}>
                  {item.totalSalesNum}
                </span>
              </div>
              <Divider className={styles.divider} />
              <div className={styles.compare}>
                {index !== 3 && isSameDay && <span>较前一日</span>}
                {isSameDay ? item.toPercentage : '—'}
              </div>
            </Card>
          )
      )}
    </div>
  );
}

Sales.contextTypes = {
  isAuthorized: PropTypes.func,
};

export default Sales;
