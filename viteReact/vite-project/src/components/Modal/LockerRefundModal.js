import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Row, Col } from 'antd';
import Table from '@/components/Datatable/BaseTable';
import MarginBar from '@/components/MarginBar';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import { formatMoneyLen2, formatMoney, formatDateTime } from '@/utils/format';
import { CDN_STATIC_HOST } from '@/utils/utils';
import { add } from '@/commons/lib/math';
import styles from './locker-refund.less';
import Modal from '.';

export default function (props) {
  const { dealId, visible, onOk, onVisibleChange, ...restProps } = props;
  const dispatch = useDispatch();
  const [dealInfo, setDealInfo] = useState();
  const [dcModalVisible, setDcModalVisible] = useState();
  const { PayWayTypes, PayStatus } = useSelector(state => state.deal);
  const fetching = useSelector(state => state.loading.effects['deal/fetch']);
  const cancelIng = useSelector(state => state.loading.effects['deal/delete']);

  useEffect(() => {
    if (dealId && visible) {
      dispatch({
        type: 'deal/fetch',
        payload: dealId,
      }).then(setDealInfo);
    }
  }, [dealId, visible]);

  const columns = useMemo(
    () => [
      {
        title: '订单号',
        dataIndex: 'dealId',
        width: 100,
      },
      {
        title: '租赁名称',
        dataIndex: 'projectName',
        render: (value, { groupName }) => `${groupName}-${value}`,
        width: 150,
      },
      {
        title: '卡号',
        dataIndex: 'projectNumber',
        width: 150,
      },
      {
        title: '租金单价',
        dataIndex: 'rentalAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '租金总价',
        dataIndex: 'rentalTotalAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '押金单价',
        dataIndex: 'depositAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '押金总价',
        dataIndex: 'depositTotalAmount',
        render: formatMoneyLen2,
        width: 100,
      },
    ],
    []
  );

  const { deal, payInfo, dealLeaseList } = dealInfo || {};

  const { pubAccountId, pubRealName, pubMobile, dealPayState } = deal || {};

  const hasNoPay = dealPayState === PayStatus.UNPAID.key;

  const payWayItem = [PayWayTypes.WECHAT, PayWayTypes.ZFB, PayWayTypes.CASH, PayWayTypes.ACCOUNT].find(
    item => item.key === payInfo?.payList?.[0].tradeWay
  );

  return (
    <Modal
      title={hasNoPay ? '详情' : '归还'}
      footer={[
        <Button key="cancel" link="cancel" disabled={fetching}>
          关闭
        </Button>,
        [
          hasNoPay && (
            <Button key="ok1" link="ok" type={undefined} disabled={fetching} loading={cancelIng}>
              取消
            </Button>
          ),
          hasNoPay ? (
            <Button
              key="ok2"
              type="danger"
              disabled={fetching}
              onClick={() => {
                dispatch(
                  push({
                    pathname: '/basic/rent/locker/summary',
                    search: `id=${dealId}`,
                  })
                );
              }}
            >
              去支付
            </Button>
          ) : (
            <Button key="ok" link="ok" type="danger" disabled={fetching} loading={cancelIng}>
              确认全部归还
            </Button>
          ),
        ].filter(Boolean),
      ]}
      loading={fetching}
      visible={visible}
      onVisibleChange={onVisibleChange}
      {...restProps}
      onOk={() => {
        setDcModalVisible(true);
        return false;
      }}
    >
      {!hasNoPay && (
        <div className="text-center">
          <div className={styles.title}>
            储物柜{dealLeaseList?.length || 0}个，退款金额
            {formatMoney(
              (dealLeaseList || []).reduce(
                (prev, { rentalTotalAmount, depositTotalAmount }) =>
                  add(prev, add(rentalTotalAmount || 0, depositTotalAmount || 0)),
                0
              )
            )}
            元
          </div>
          {(payWayItem === PayWayTypes.WECHAT || payWayItem === PayWayTypes.ZFB) && (
            <div className={styles.subTitle}>{payWayItem.value}原路退回</div>
          )}
          <div className={styles.modeTip}>
            <PayMode PayWayTypes={PayWayTypes} type={payWayItem?.key} />
            {payWayItem && payWayItem.value}
          </div>
        </div>
      )}
      <MarginBar top={!hasNoPay}>
        <Table bordered pagination={false} rowKey="id" countColsWidth columns={columns} dataSource={dealLeaseList} />
      </MarginBar>
      <MarginBar top={20}>
        <Row>
          <Col xs={24} sm={10}>
            <Link to={`/basic/pub/info/${pubAccountId}`}>
              {pubRealName}/{pubMobile}
            </Link>
          </Col>
          <Col xs={24} sm={14} className="text-right">
            开始使用时间：{formatDateTime(dealLeaseList?.[0]?.startDate)}
          </Col>
        </Row>
      </MarginBar>
      <DealCancelModal
        cancelMessageList={['归还', '下错单了', '不想要了']}
        initialSelectedMsg="归还"
        alertMessage="归还后将自动退款"
        confirmMessage="确定要归还/退款吗？"
        dealId={dealId}
        visible={dcModalVisible}
        onVisibleChange={setDcModalVisible}
        onOk={onOk}
      />
    </Modal>
  );
}

function PayMode({ PayWayTypes, type }) {
  switch (type) {
    case PayWayTypes.WECHAT.key:
      return (
        <img className="img-max" alt="微信支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-wechat.png`} />
      );
    case PayWayTypes.ZFB.key:
      return (
        <img className="img-max" alt="支付宝支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-alipay.png`} />
      );
    case PayWayTypes.CASH.key:
      return <img className="img-max" alt="微信支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-cash.png`} />;
    case PayWayTypes.ACCOUNT.key:
      return (
        <img className="img-max" alt="会员账户支付" src={`${CDN_STATIC_HOST}/images/cloud/pay-model/pay-balance.png`} />
      );
    default:
      return '退款方式异常';
  }
}
