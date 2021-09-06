import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Descriptions, Button, Divider, message } from 'antd';
import Table from '@/components/Datatable/BaseTable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import DealInfoDetail from '@/components/DealInfoDetail';
import AmountColor from '@/components/Amount/Color';
import OrderComment from '@/components/DealInfoDetail/OrderComment';
import AuthComponent from '@/components/AuthComponent';
import OrderCommentModal from '@/components/Modal/OrderCommentModal';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import BanModal from '@/components/Modal/BanModal';
import TicketCheckResultModal from '@/components/Modal/TicketCheckResultModal';
import { drawQrCode } from '@/commons/lib/qrcode';
import {
  formatMoney,
  formatDateTime,
  formatPayWay,
  formatSrvId,
  formatMoneyLen2,
  formatModel,
  formatPayWayFromList,
} from '@/utils/format';
import { isNumber, isBeforeToday, isSameDay } from '@/utils/utils';
import SignPlatformModal from '../../../Platform/Booking/Booking/SignPlatformModal';

import styles from './index.less';

const pixel = 640;

const SaveTypes = {
  sellerMessage: 1,
  userMessage: 2,
  checkPersonNum: 3,
};

function DealDetail({ match: { params } }, { isAuthorized, playVerifyAudio, scanQRCode }) {
  const { dealSignIds = {} } = useSelector(state => state.booking);
  const { currentVenue } = useSelector(state => state.venue);
  const { PayStatus, DealStatus, DealShippingStatus, PayWayTypes, SubSeqTypes } = useSelector(state => state.deal);
  const { CheckStatus } = useSelector(state => state.pubticket);
  const { isCancelLoading } = useSelector(state => state.deal);
  const fetching = useSelector(state => state.loading.effects['deal/fetch']);
  const signLoading = useSelector(
    state => state.loading.effects['booking/dealSign'] || state.loading.effects['booking/dealSignWithoutCode']
  );

  const [dealInfo, setDealInfo] = useState();
  const [saveType, setSaveType] = useState();
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [buModalVisible, setBuModalVisible] = useState(false);
  const [dcModalVisible, setDcModalVisible] = useState(false);
  const [signPlatformVisible, setSignPlatformVisible] = useState(false);
  const [ticketCheckResultVisible, setTicketCheckResultVisible] = useState(false);
  const [ticketCheckResult, setTicketCheckResult] = useState();

  const dispatch = useDispatch();

  const fetchDealInfo = useCallback(() => {
    dispatch({
      type: 'deal/fetch',
      payload: params.id,
    }).then(setDealInfo);
  }, [params.id]);

  useEffect(() => {
    fetchDealInfo();
  }, []);

  const {
    deal,
    dealPlatformList,
    dealSportPlatformTicketList,
    dealItemList,
    dealServicePubList,
    dealTicketList,
    dealCourseList,
    payInfo,
  } = dealInfo || {};

  const {
    id,
    salesId,
    dealState,
    dealPayState,
    subDealType,
    dealSign,
    dealAddress,
    dealShippingState,
    pubAccountId,
    pubRealName,
    pubMobile,
    createRealName,
    updateRealName,
    userMessage,
    sellerMessage,
    srvId,
    srvName,
    salesName,
    updateTime,
    createTime,
    viewMode,
  } = deal || {};

  const validTicketDeal = useMemo(
    () =>
      [
        ...(dealTicketList || []),
        ...(dealSportPlatformTicketList || []),
        ...(dealPlatformList || []).map(item => ({
          ...item,
          salesNum: item.totalNum, // 统一字段
          // 不显示ticketName
          // ticketName: (platformParentId > 0 ? `${platformParentName}-` : '') + platformName,
        })),
        ...(dealCourseList || []).reduce(
          (prev, { dealCourseStudyList }) => [
            ...prev,
            ...dealCourseStudyList.map(({ pubStudyId, matrix, classHour, signedInNum, realName }) => ({
              id: pubStudyId,
              matrix,
              checkNum: signedInNum,
              salesNum: classHour,
              ticketName: realName,
            })),
          ],
          []
        ),
      ].filter(item => item.matrix && item.matrix.validCode != null),
    [dealInfo]
  );

  let expiredDataAuth = true;
  if (dealPlatformList && dealPlatformList.length > 0) {
    expiredDataAuth =
      // expired-data-operation 只对场地控制
      isAuthorized('expired-data-operation') ||
      isSameDay(dealPlatformList[0].orderDate, Date.now()) ||
      !isBeforeToday(dealPlatformList[0].orderDate);
  }

  const hasPaid = dealPayState === PayStatus.HASPAID.key;
  const hasNoPay = dealPayState === PayStatus.UNPAID.key;
  const noSupportPay = subDealType?.some(
    dealType =>
      dealType === SubSeqTypes.DEAL_WITHDRAW.key ||
      dealType === SubSeqTypes.DEAL_PUBLICCREDIT.key ||
      dealType === SubSeqTypes.DEAL_MARKETING_MEMBER.key
  );
  const isPortalWaiting = dealState === DealStatus.BOOKING.key;

  const hasSigned = dealSign || dealSignIds.includes(id);

  const signWithoutCode = isAuthorized('sign-without-code');
  const canSignWithoutCode =
    dealPlatformList && dealPlatformList.length > 0 && signWithoutCode && expiredDataAuth && !hasSigned;
  const canSign = validTicketDeal.length > 0 && hasPaid && expiredDataAuth && !hasSigned;

  const canBackToEditfn = useCallback(() => {
    //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
    return (
      (dealPlatformList && dealPlatformList.length > 0) ||
      (dealItemList && dealItemList.length > 0) ||
      (dealServicePubList && dealServicePubList.length > 0) ||
      (dealTicketList && dealTicketList.length > 0) ||
      (dealCourseList && dealCourseList.length > 0)
    );
  }, [dealInfo]);
  const canBackToEdit = hasNoPay && !(isPortalWaiting || noSupportPay) && canBackToEditfn() && expiredDataAuth;

  const canCancel =
    (isPortalWaiting ||
      !(
        noSupportPay ||
        dealState === DealStatus.CANCEL.key ||
        dealState === DealStatus.REFUNDED.key ||
        (dealAddress &&
          (dealShippingState === DealShippingStatus.WAIT_CONSIGNEE.key ||
            dealShippingState === DealShippingStatus.CONFIRM_CONSIGNEE.key))
      )) &&
    expiredDataAuth;

  // const showRefundPayment = dealPayState === PayStatus.REFUNDED.key;

  const handleDealPrint = useCallback(() => {
    dispatch(push('./print'));
  }, []);

  const handleDoBanUser = useCallback(() => {
    message.success('添加成功');
  }, []);

  const handleDoDealCancel = useCallback(() => {
    fetchDealInfo();
  }, [fetchDealInfo]);

  const handleBackToEdit = useCallback(() => {
    //  服务人员没有单独的购买渠道，依附定场，有服务人员一定有定场
    if (dealPlatformList && dealPlatformList.length > 0) {
      dispatch({
        type: 'booking/switchBookingEnv',
        payload: {
          salesId,
          itemId: dealPlatformList[0].professionalId,
          curDate: dealPlatformList[0].orderDate,
        },
      }).then(() => {
        dispatch(
          push({
            pathname: '/basic/platform/booking/booking',
            search: `id=${id}`,
          })
        );
      });
      return;
    }
    dispatch({
      type: 'orderprocessing/switchEnv',
      payload: {
        salesId,
      },
    }).then(() => {
      if (dealItemList && dealItemList.length > 0) {
        dispatch(
          push({
            pathname: '/basic/mall/sell/mall',
            search: `id=${id}`,
          })
        );
        return;
      }
      if (dealServicePubList && dealServicePubList.length > 0) {
        dispatch(
          push({
            pathname: `/basic/pub/pubservice/${dealServicePubList[0].serviceId}/sell`,
            search: `id=${id}`,
          })
        );
        return;
      }
      if (dealTicketList && dealTicketList.length > 0) {
        dispatch(
          push({
            pathname: `/basic/ticket/sell/${dealTicketList[0].dataId}/user`,
            search: `id=${id}`,
          })
        );
        return;
      }
      if (dealCourseList && dealCourseList.length > 0) {
        dispatch(
          push({
            pathname: `/basic/course/sell/${dealCourseList[0].courseDataId}/user`,
            search: `id=${id}`,
          })
        );
        return;
      }
      message.error('未实现的订单预览返回类型');
    });

    dispatch(goBack());
  }, [dealInfo]);

  const handleSignWithoutCode = useCallback(async () => {
    await dispatch({
      type: 'booking/dealSignWithoutCode',
      payload: id,
    });

    message.success('签到成功');
  }, [id]);

  const handleGetCode = useCallback(async code => {
    if (code == null || code.trim().length === 0) {
      return;
    }
    let result;
    try {
      result = await dispatch({
        type: 'global/queryByCode',
        payload: {
          code,
          // 不提供action则不要求匹配，反之要求匹配
        },
      });
    } catch {
      playVerifyAudio(false);
      return;
    }
    if (result) {
      setSignPlatformVisible(false);
      setTicketCheckResultVisible(true);
      setTicketCheckResult(result);
    }
  }, []);

  const signBtnClick = useCallback(() => {
    if (scanQRCode(handleGetCode)) {
      return;
    }
    setSignPlatformVisible(true);
  }, [handleGetCode]);

  const handleVerify = useCallback(
    async num => {
      const { data, success, isVerify } = ticketCheckResult || {};
      if (!success || isVerify) {
        return;
      }
      const { id: dataId, relType, publicStudyList } = data || {};
      let result;
      try {
        result = await dispatch({
          type: 'booking/dealSign',
          payload: {
            dataId,
            relType,
            checkedNumState: true,
            salesId: currentVenue.id,
            checkPersonNum: num,
            // 课程支持二维码后一个码一个人，课程时 publicStudyList 理论上只有一个
            // 课程核验目前只有订单详情这里能核验，追加pubStudyId参数
            pubStudyId: (publicStudyList || []).map(item => item.id),
          },
        });
      } catch {
        playVerifyAudio(false);
        return;
      }
      if (result) {
        playVerifyAudio(result.success);
        setTicketCheckResult({
          ...ticketCheckResult,
          ...result,
          isVerify: true,
        });
        const found = validTicketDeal.find(item => item.id === dataId);
        if (found == null) {
          return;
        }
        fetchDealInfo(); // 刷新页面
      }
    },
    [fetchDealInfo, ticketCheckResult]
  );

  const handleToSummary = useCallback(() => {
    if (dealPlatformList && dealPlatformList.length > 0) {
      dispatch(
        push({
          pathname: '/basic/platform/booking/summary',
          search: `id=${id}`,
        })
      );
      return;
    }
    if (dealItemList && dealItemList.length > 0) {
      dispatch(
        push({
          pathname: '/basic/mall/sell/summary',
          search: `id=${id}`,
        })
      );
      return;
    }
    if (dealServicePubList && dealServicePubList.length > 0) {
      dispatch(
        push({
          pathname: `/basic/pub/pubservice/${dealServicePubList[0].serviceId}/summary`,
          search: `id=${id}`,
        })
      );
      return;
    }
    if (dealTicketList && dealTicketList.length > 0) {
      dispatch(
        push({
          pathname: `/basic/ticket/sell/${dealTicketList[0].dataId}/summary`,
          search: `id=${id}`,
        })
      );
      return;
    }
    if (dealCourseList && dealCourseList.length > 0) {
      dispatch(
        push({
          pathname: `/basic/course/sell/${dealCourseList[0].courseDataId}/summary`,
          search: `id=${id}`,
        })
      );
      return;
    }
    dispatch(
      push({
        pathname: `/basic/deal/${id}/summary`,
      })
    );
  }, [dealInfo]);

  const handleTriggerEditing = useCallback(type => {
    setSaveType(type);
    setCommentModalVisible(true);
  }, []);

  if (deal == null) {
    return null;
  }

  // 体育场地 有核验
  const sportPlatformHasChecked = (dealPlatformList || []).some(
    item => item.checkState === CheckStatus.CHECKED.key || item.checkState === CheckStatus.PARTIAL_CHECKED.key
  );

  const sp = sportPlatformHasChecked ? 6 : 8;

  const tradeWayRender = (v, r) =>
    r.tradeWay !== PayWayTypes.PUBSERVICE.key
      ? `${formatModel(PayWayTypes, +r.tradeWay)}`
      : `${formatModel(PayWayTypes, +r.tradeWay)}:${r.tradeWayDataName}`;

  return (
    <PageHeaderLayout title="订单详情">
      <Card bordered={false} loading={fetching || isCancelLoading}>
        {deal && (
          <>
            <Descriptions column={4}>
              <Descriptions.Item label="主订单号">{id}</Descriptions.Item>
              {(pubRealName || pubMobile) && (
                <Descriptions.Item label="会员信息">
                  <Link
                    className={styles.wordBreakLink}
                    to={`/basic/pub/info/${pubAccountId}`}
                  >{`${pubRealName}/${pubMobile}`}</Link>
                </Descriptions.Item>
              )}
              {createRealName && <Descriptions.Item label="创建人">{createRealName}</Descriptions.Item>}
              {updateRealName && <Descriptions.Item label="更新人">{updateRealName}</Descriptions.Item>}
            </Descriptions>
            <Divider dashed className={styles.dividerNotTop} />
          </>
        )}

        {dealInfo && (
          <>
            <DealInfoDetail dealInfo={dealInfo} wrapClassName="detailWrapper" />
            {!dealInfo.dealWithdrawList && <Divider dashed />}
          </>
        )}

        <Row gutter={32}>
          <Col md={sp}>
            <Card bordered={false} className={styles.commonPayWrapper}>
              <Descriptions column={1} className={styles.description}>
                <Descriptions.Item label="订单金额">
                  <AmountColor inputSize>{formatMoney(payInfo?.dealTotalAmount)}</AmountColor>
                </Descriptions.Item>
                <Descriptions.Item label="实收金额">
                  <AmountColor inputSize>{formatMoney(payInfo?.payTotalAmount)}</AmountColor>
                </Descriptions.Item>
                {payInfo?.payList.map(pay =>
                  pay.tradeWay !== PayWayTypes.PUBSERVICE.key ? (
                    <Descriptions.Item label={formatModel(PayWayTypes, +pay.tradeWay)} key={pay.tradeWay}>
                      <AmountColor inputSize>{formatMoney(pay.tradeAmount)}</AmountColor>
                    </Descriptions.Item>
                  ) : (
                    <div key={pay.tradeWay}>
                      <div className={styles.flex}>
                        <div className={styles.opacicy}>优惠信息：</div>
                        <div>
                          <div>服务编号 {payInfo?.payPubService?.pubServiceId}</div>
                          <div>会员服务账户编号 {payInfo?.payPubService?.pubServiceAccountId}</div>
                          <div>服务结算 {payInfo?.payPubService?.pubServiceName}</div>
                          <div>
                            服务账户支付
                            <AmountColor inputSize>{formatMoney(pay.tradeAmount)}</AmountColor>
                          </div>
                          <div>服务支付 {pay.tradeAmountDetail}</div>
                          <div>剩余服务 {pay.tradeSurplusDetail}</div>
                        </div>
                      </div>
                    </div>
                  )
                )}
                {payInfo?.refundDescription && (
                  <Descriptions.Item label="退款信息">
                    <div>{payInfo?.refundDescription}</div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
          <Col md={sp}>
            <OrderComment
              title="订单备注"
              comment={userMessage}
              triggerEditing={() => {
                handleTriggerEditing(SaveTypes.userMessage);
              }}
            />
          </Col>
          <Col md={sp}>
            <OrderComment
              title="商家留言"
              comment={sellerMessage}
              triggerEditing={() => {
                handleTriggerEditing(SaveTypes.sellerMessage);
              }}
            />
          </Col>
          {sportPlatformHasChecked && (
            <Col md={sp}>
              <OrderComment
                title="入场人数"
                comment={dealPlatformList[0].checkPersonNum}
                triggerEditing={() => {
                  handleTriggerEditing(SaveTypes.checkPersonNum);
                }}
              />
            </Col>
          )}
          <OrderCommentModal
            type={saveType}
            SaveTypes={SaveTypes}
            deal={{
              ...deal,
              checkPersonNum: sportPlatformHasChecked ? dealPlatformList[0].checkPersonNum : null,
            }}
            visible={commentModalVisible}
            onVisibleChange={setCommentModalVisible}
            dealRefresh={val => {
              const newDeal = {
                ...deal,
              };
              let useDealPlatformList = dealPlatformList;
              switch (saveType) {
                case SaveTypes.userMessage:
                  newDeal.userMessage = val;
                  break;
                case SaveTypes.sellerMessage:
                  newDeal.sellerMessage = val;
                  break;
                case SaveTypes.checkPersonNum:
                  useDealPlatformList = dealPlatformList.map(item => ({
                    ...item,
                    checkPersonNum: val,
                  }));
                  break;
                default:
              }
              setDealInfo({
                ...dealInfo,
                deal: newDeal,
                dealPlatformList: useDealPlatformList,
              });
            }}
          />
        </Row>
        <Divider dashed />

        <Descriptions>
          <Descriptions.Item label="订单状态">{formatModel(DealStatus, deal?.dealState)}</Descriptions.Item>
          <Descriptions.Item label="支付方式">{formatPayWay(dealInfo)}</Descriptions.Item>
          {payInfo?.payFinishTime && (
            <Descriptions.Item label="支付成功时间">{formatDateTime(payInfo?.payFinishTime)}</Descriptions.Item>
          )}
          {payInfo?.cancelFinishTime && (
            <Descriptions.Item label="退款完成时间">{formatDateTime(payInfo?.cancelFinishTime)}</Descriptions.Item>
          )}
          {payInfo?.salesName && <Descriptions.Item label="收款方">{payInfo?.salesName}</Descriptions.Item>}
          {payInfo?.payOrderId && <Descriptions.Item label="支付订单号">{payInfo?.payOrderId}</Descriptions.Item>}
          {payInfo?.payTradeId && <Descriptions.Item label="支付商家订单号">{payInfo?.payTradeId}</Descriptions.Item>}
          {payInfo?.payRefundId && <Descriptions.Item label="退款单号">{payInfo?.payRefundId}</Descriptions.Item>}
          {payInfo?.refundList?.length && (
            <Descriptions.Item label="退款方式">
              退回至[{formatPayWayFromList(payInfo?.refundList?.map(pay => pay.tradeWay))}]
            </Descriptions.Item>
          )}
        </Descriptions>
        <Divider dashed className={styles.dividerNotTop} />
        {payInfo?.payList?.length && (
          <Row>
            <h4 className={styles.info}>支付详情</h4>
            <Table
              rowKey="tradeTime"
              countColsWidth
              columns={[
                {
                  title: '商家订单号',
                  align: 'center',
                  dataIndex: 'tradeId',
                  width: 140,
                },
                {
                  title: '支付金额(元)',
                  align: 'center',
                  dataIndex: 'tradeAmount',
                  render: formatMoneyLen2,
                  width: 100,
                },
                {
                  title: '支付时间',
                  align: 'center',
                  dataIndex: 'tradeTime',
                  render: formatDateTime,
                  width: 130,
                },
                {
                  title: '备注',
                  align: 'center',
                  dataIndex: 'tradeWayDataName',
                  render: tradeWayRender,
                  width: 90,
                },
              ]}
              dataSource={payInfo?.payList}
              bordered
              pagination={false}
            />
          </Row>
        )}
        {payInfo?.refundList?.length && (
          <Row>
            <h4 className={styles.info}>退款详情</h4>
            <Table
              rowKey="tradeTime"
              countColsWidth
              columns={[
                {
                  title: '商家订单号',
                  align: 'center',
                  dataIndex: 'tradeId',
                  width: 140,
                },
                {
                  title: '退款金额(元)',
                  align: 'center',
                  dataIndex: 'tradeAmount',
                  render: formatMoneyLen2,
                  width: 100,
                },
                {
                  title: '退款时间',
                  align: 'center',
                  dataIndex: 'tradeTime',
                  render: formatDateTime,
                  width: 130,
                },
                {
                  title: '备注',
                  align: 'center',
                  dataIndex: 'tradeWayDataName',
                  render: tradeWayRender,
                  width: 90,
                },
              ]}
              dataSource={payInfo?.refundList}
              bordered
              pagination={false}
            />
          </Row>
        )}
        <Divider dashed className={styles.dividerSmallTop} />
        {deal && (
          <Row gutter={65}>
            <Col md={8}>
              <Descriptions column={2}>
                {isNumber(srvId) && <Descriptions.Item label="操作终端">{formatSrvId(srvId)}</Descriptions.Item>}
                {srvName && <Descriptions.Item label="业务来源">{srvName}</Descriptions.Item>}
                {salesName && <Descriptions.Item label="营销中心">{salesName}</Descriptions.Item>}
                {updateTime && <Descriptions.Item label="更新时间"> {formatDateTime(updateTime)}</Descriptions.Item>}
                {payInfo?.payFinishTime && (
                  <Descriptions.Item label="支付时间"> {formatDateTime(payInfo.payFinishTime)}</Descriptions.Item>
                )}
                {createTime && <Descriptions.Item label="创建时间"> {formatDateTime(createTime)}</Descriptions.Item>}
              </Descriptions>
            </Col>
          </Row>
        )}

        <Row gutter={65}>
          {validTicketDeal.map(ticket => (
            <Col md={8} key={ticket.id}>
              {ticket.iotCheckLogVO && (ticket.iotCheckLogVO.checkRealName || ticket.iotCheckLogVO.gmtCreate) && (
                <Row className={styles.validCodeWrapper}>
                  <Col md={10}>
                    {ticket.iotCheckLogVO.checkRealName && (
                      <MarginBar bottom>核验人：{ticket.iotCheckLogVO.checkRealName}</MarginBar>
                    )}
                  </Col>
                  <Col md={14} className="text-right">
                    {ticket.iotCheckLogVO.gmtCreate && (
                      <MarginBar bottom>核验时间：{formatDateTime(ticket.iotCheckLogVO.gmtCreate)}</MarginBar>
                    )}
                  </Col>
                </Row>
              )}
              {/* 动态二维码不支持打印 */}
              {viewMode
                ? null
                : ticket.matrix.matrixData && (
                    <Row className={styles.validCodeWrapper}>
                      {ticket.matrix.validCode && (
                        <Col md={24} className="text-center">
                          {ticket.ticketName && <MarginBar bottom>{ticket.ticketName}</MarginBar>}
                          <MarginBar bottom>验证码：{ticket.matrix.validCode}</MarginBar>
                          <Divider dashed />
                        </Col>
                      )}
                      <Col md={24} className="text-center">
                        <canvas
                          className={styles.qrcode}
                          width={pixel}
                          height={pixel}
                          ref={dom => {
                            if (dom == null) {
                              return;
                            }
                            const ctx = dom.getContext('2d');
                            drawQrCode(ctx, ticket.matrix.matrixData, pixel, {
                              logoUrl: ticket.matrix.logoUrl,
                            });
                          }}
                        >
                          您的浏览器不支持Canvas
                        </canvas>
                      </Col>
                      <Col span={24} className="text-center">
                        总数 {ticket.salesNum || 0} ｜ 剩余数&nbsp;
                        <span className="red">{(ticket.salesNum || 0) - (ticket.checkNum || 0)}</span> | 已核验&nbsp;
                        {ticket.checkNum || 0}
                      </Col>
                    </Row>
                  )}
            </Col>
          ))}
        </Row>
      </Card>
      {deal && (
        <>
          <BanModal
            visible={buModalVisible}
            userInfo={{
              id: pubAccountId,
              realName: pubRealName,
              mobile: pubMobile,
            }}
            onVisibleChange={setBuModalVisible}
            onOk={handleDoBanUser}
          />
          <DealCancelModal
            dealId={id}
            visible={dcModalVisible}
            onVisibleChange={setDcModalVisible}
            onOk={() => handleDoDealCancel()}
          />
          <SignPlatformModal
            visible={signPlatformVisible}
            onOk={handleGetCode}
            onVisibleChange={setSignPlatformVisible}
          />
          <TicketCheckResultModal
            visible={ticketCheckResultVisible}
            result={ticketCheckResult}
            onVerify={handleVerify}
            onOk={() => {
              // 呼应“继续验票”
              setSignPlatformVisible(true);
            }}
            onVisibleChange={setTicketCheckResultVisible}
          />
          <FooterToolbar>
            {hasPaid ? (
              <MarginBar left top inline>
                <Button disabled={signLoading} onClick={handleDealPrint}>
                  打印
                </Button>
              </MarginBar>
            ) : (
              hasNoPay &&
              !noSupportPay &&
              expiredDataAuth && (
                <MarginBar left top inline>
                  <Button type="danger" disabled={signLoading} onClick={handleToSummary}>
                    {isPortalWaiting ? '改价' : '去结算'}
                  </Button>
                </MarginBar>
              )
            )}
            {canSign && (
              <AuthComponent auth="scan">
                <MarginBar top left inline>
                  <Button loading={signLoading} onClick={signBtnClick}>
                    签到核验
                  </Button>
                </MarginBar>
              </AuthComponent>
            )}
            {canSignWithoutCode && (
              <AuthComponent auth="sign-without-code">
                <MarginBar top left inline>
                  <Button loading={signLoading} onClick={handleSignWithoutCode}>
                    签到
                  </Button>
                </MarginBar>
              </AuthComponent>
            )}
            {canBackToEdit && (
              <MarginBar left top inline>
                <Button disabled={signLoading} onClick={handleBackToEdit}>
                  返回修改
                </Button>
              </MarginBar>
            )}
            {expiredDataAuth && (
              <AuthComponent auth="blacklist">
                <MarginBar left top inline>
                  <Button disabled={signLoading} onClick={() => setBuModalVisible(true)}>
                    加入黑名单
                  </Button>
                </MarginBar>
              </AuthComponent>
            )}
            {canCancel && (
              <AuthComponent auth="cancel">
                <MarginBar left top inline>
                  <Button disabled={signLoading} onClick={() => setDcModalVisible(true)}>
                    取消订单
                  </Button>
                </MarginBar>
              </AuthComponent>
            )}
            <MarginBar left top inline>
              <Button disabled={signLoading} onClick={() => dispatch(goBack())}>
                返回
              </Button>
            </MarginBar>
          </FooterToolbar>
        </>
      )}
    </PageHeaderLayout>
  );
}

DealDetail.contextTypes = {
  isAuthorized: PropTypes.func,
  playVerifyAudio: PropTypes.func,
  scanQRCode: PropTypes.func,
};

export default DealDetail;
