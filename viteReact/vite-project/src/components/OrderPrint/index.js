import { Fragment, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';
import { Card, Button, Row, Col, Divider, message } from 'antd';
import Result from '@/components/Result';
import MarginBar from '@/components/MarginBar';
import {
  formatDate,
  formatHM,
  formatMoney,
  formatDateTime,
  formatDateHM,
  formatModel,
  formatSecretPhone,
  formatSecretName,
} from '@/utils/format';
import { drawQrCode } from '@/commons/lib/qrcode';
import { isPDA, print } from '@/utils/utils';
import styles from './index.less';

const pixel = 640;

function TicketComp({ list }) {
  if (list == null || list.length === 0) {
    return null;
  }
  return (
    <>
      <Row>
        <Col span={24}>
          <Divider dashed />
        </Col>
      </Row>
      <Col span={24}>
        <h4>票务信息</h4>
      </Col>
      {list.map(item => (
        <Fragment key={item.id}>
          <Row>
            <Col span={8}>场馆：</Col>
            <Col span={16}>{item.salesName}</Col>
          </Row>
          <Row>
            <Col span={8}>票名：</Col>
            <Col span={16}>
              {item.ticketName || (item.platformParentId > 0 ? `${item.platformParentName}-` : '') + item.platformName}
            </Col>
          </Row>
          <Row>
            <Col span={8}>数量：</Col>
            <Col span={16}>{item.salesNum} 张</Col>
          </Row>
          <Row>
            <Col span={8}>日期：</Col>
            <Col span={16}>{formatDate(item.orderDate)}</Col>
          </Row>
          <Row>
            <Col span={8}>时间：</Col>
            <Col span={16}>
              {formatHM(item.startTime)}
              {item.endTime != null && `-${formatHM(item.endTime)}`}
            </Col>
          </Row>
          {item.fromDate > 0 && item.toDate > 0 && (
            <Row>
              <Col span={8}>有效期：</Col>
              <Col span={16}>
                {formatDate(item.fromDate)}-{formatDate(item.toDate)}
              </Col>
            </Row>
          )}
          <Row>
            <Col span={8}>成交单价：</Col>
            <Col span={16}>￥{formatMoney(item.transactionPrice)}</Col>
          </Row>
          <Row>
            <Col span={8}>成交总价：</Col>
            <Col span={16}>￥{formatMoney(item.transactionTotalPrice)}</Col>
          </Row>
        </Fragment>
      ))}
    </>
  );
}

function OrderPrint({ id, onlyPrint, onLoadData }, { getCurrentServerTime }) {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [printing, setPrinting] = useState();
  const [serverTime, setServerTime] = useState(getCurrentServerTime());
  const inPDA = isPDA();
  const dealInfo = data?.dealInfo;
  const { member: isFastSaveDeal, printingMessage } = data?.printConfig || {};
  useEffect(() => {
    if (id == null) {
      setData(null);
      return;
    }
    dispatch({
      type: 'print/fetch',
      payload: id,
    }).then(setData);
  }, [id]);

  useEffect(() => {
    onLoadData?.(dealInfo);
  }, [dealInfo]);

  const { PayStatus, PayWayTypes, CourseTypes, DealStatus } = useSelector(state => state.print);
  const { Careers, ProfessionTypes } = useSelector(state => state.venue);
  const fetching = useSelector(state => state.loading.effects['print/fetch']);
  const execPrint = useCallback(() => {
    setServerTime(getCurrentServerTime());
    setPrinting(true);
    print(dealInfo)
      .catch(e => {
        message.error(`打印异常：${e.message}`);
      })
      .finally(() => {
        setPrinting(false);
      });
  }, [dealInfo]);

  if (id == null) {
    return null;
  }

  const { dealPlatformList, dealSportPlatformTicketList, dealTicketList, dealCourseList } = dealInfo || {};

  const canPrint = dealInfo?.deal?.dealPayState === PayStatus.HASPAID.key;

  const serviceInfo = dealInfo?.payInfo?.payList.find(pay => pay.tradeWay === PayWayTypes.PUBSERVICE.key);

  // 如果仅隐式打印模式，不可打印时返回null
  if (onlyPrint && !canPrint) {
    return null;
  }

  const validTicketDeal = [
    ...(dealTicketList || []),
    ...(dealSportPlatformTicketList || []),
    ...(dealPlatformList || []),
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
  ].filter(item => item.matrix && item.matrix.validCode != null);

  return (
    <Card
      bordered={false}
      loading={fetching}
      className={classNames(styles.printCard, {
        [styles.onlyPrint]: onlyPrint,
      })}
    >
      {canPrint ? (
        <Row>
          <Col md={6} />
          <Col
            md={12}
            id="print-target"
            className={classNames({
              [styles.bigger]: inPDA,
            })}
          >
            <h2 className="text-center">{dealInfo.deal.salesName}</h2>
            <Row>
              <Col span={18}>
                订单编号：
                {dealInfo.deal.id}
              </Col>
              <Col span={6}>结账单</Col>
              {dealInfo.dealPlatformList && dealInfo.dealPlatformList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>场地信息</h4>
                  </Col>
                  {dealInfo.dealPlatformList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>名称：</Col>
                        <Col span={16}>
                          {item.platformParentName ? `${item.platformParentName}-` : ''}
                          {item.platformName}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>日期：</Col>
                        <Col span={16}>{formatDate(item.orderDate)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>时间：</Col>
                        <Col span={16}>
                          {formatHM(item.startTime)}-{formatHM(item.endTime)}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交价格：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionPrice)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealServiceUserList && dealInfo.dealServiceUserList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>服务人员信息</h4>
                  </Col>
                  {dealInfo.dealServiceUserList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>姓名：</Col>
                        <Col span={16}>{item.realName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>职业：</Col>
                        <Col span={16}>{formatModel(Careers, item.careerId)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>内容：</Col>
                        <Col span={16}>{formatModel(ProfessionTypes, item.professionalId)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>时间：</Col>
                        <Col span={16}>
                          {formatHM(item.startTime)}-{formatHM(item.endTime)}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交价格：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionPrice)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealItemList?.[0]?.dealItemSnapList?.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>商品信息</h4>
                  </Col>
                  {dealInfo.dealItemList.map(item =>
                    item.dealItemSnapList.map(subItem => (
                      <Fragment key={subItem.id}>
                        <Row>
                          <Col span={8}>商品：</Col>
                          <Col span={16}>{subItem.itemName}</Col>
                        </Row>
                        <Row>
                          <Col span={8}>数量：</Col>
                          <Col span={16}>
                            {subItem.itemNum} {subItem.itemUnit}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={8}>成交单价：</Col>
                          <Col span={16}>¥{formatMoney(subItem.transactionPrice)}</Col>
                        </Row>
                        <Row>
                          <Col span={8}>成交总价：</Col>
                          <Col span={16}>¥{formatMoney(subItem.transactionTotalPrice)}</Col>
                        </Row>
                      </Fragment>
                    ))
                  )}
                </>
              )}
              {dealInfo.dealServicePubList && dealInfo.dealServicePubList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>会员服务信息</h4>
                  </Col>
                  {dealInfo.dealServicePubList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>场馆：</Col>
                        <Col span={16}>{item.salesName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>服务名称：</Col>
                        <Col span={16}>{item.serviceName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>数量：</Col>
                        <Col span={16}>{item.buyNum} 张</Col>
                      </Row>
                      <Row>
                        <Col span={8}>储值金额：</Col>
                        <Col span={16}>¥{formatMoney(item.serviceAmount)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交单价：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionPrice)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交总价：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionTotalPrice)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              <TicketComp list={dealTicketList} />
              <TicketComp list={dealSportPlatformTicketList} />
              {dealInfo.dealSignupList && dealInfo.dealSignupList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>报名信息</h4>
                  </Col>
                  {dealInfo.dealSignupList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>名称：</Col>
                        <Col span={16}>{item.objectName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>日期：</Col>
                        <Col span={16}>{formatDate(item.signupStartDate)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>地址：</Col>
                        <Col span={16}>{item.objectAddress}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>状态：</Col>
                        <Col span={16}>{formatModel(DealStatus, item.dealState)}</Col>
                      </Row>
                      {item.pubTeamId && (
                        <Row>
                          <Col span={8}>团队名称：</Col>
                          <Col span={16}>{item.pubTeamName}</Col>
                        </Row>
                      )}
                      <Row>
                        <Col span={8}>成交价：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionPrice)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealCourseList && dealInfo.dealCourseList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>课程信息</h4>
                  </Col>
                  {dealInfo.dealCourseList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>课程名称：</Col>
                        <Col span={16}>{item.courseName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>课程类型：</Col>
                        <Col span={16}>{formatModel(CourseTypes, item.courseType)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>开始时间：</Col>
                        <Col span={16}>{formatDateHM(item.courseStartTime)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>结束时间：</Col>
                        <Col span={16}>{formatDateHM(item.courseEndTime)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>预约人数：</Col>
                        <Col span={16}>{(item.dealCourseStudyList || []).length}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>学员信息：</Col>
                        <Col span={16}>
                          {(item.dealCourseStudyList || [])
                            .map(({ realName, mobile }) => `${formatSecretName(realName)}/${formatSecretPhone(mobile)}`)
                            .join(', ')}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交单价：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionUnitPrice)}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>成交总价：</Col>
                        <Col span={16}>¥{formatMoney(item.transactionTotalPrice)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealPublicAccountList && dealInfo.dealPublicAccountList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>账户信息</h4>
                  </Col>
                  {dealInfo.dealPublicAccountList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>账户编号：</Col>
                        <Col span={16}>{item.publicAccountId}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>营销中心：</Col>
                        <Col span={16}>{item.salesName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>发生金额：</Col>
                        <Col span={16}>¥{formatMoney(item.amount)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealScanCodeList && dealInfo.dealScanCodeList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>扫码信息</h4>
                  </Col>
                  {dealInfo.dealScanCodeList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>付款人账号：</Col>
                        <Col span={16}>{item.payAccount}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>营销中心：</Col>
                        <Col span={16}>{item.salesName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>发生金额：</Col>
                        <Col span={16}>¥{formatMoney(item.amount)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.dealPublicCreditList && dealInfo.dealPublicCreditList.length > 0 && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Col span={24}>
                    <h4>白条还款信息</h4>
                  </Col>
                  {dealInfo.dealPublicCreditList.map(item => (
                    <Fragment key={item.id}>
                      <Row>
                        <Col span={8}>账户编号：</Col>
                        <Col span={16}>{item.publicAccountId}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>营销中心：</Col>
                        <Col span={16}>{item.salesName}</Col>
                      </Row>
                      <Row>
                        <Col span={8}>发生金额：</Col>
                        <Col span={16}>¥{formatMoney(item.amount)}</Col>
                      </Row>
                    </Fragment>
                  ))}
                </>
              )}
              {dealInfo.payInfo && (
                <>
                  <Row>
                    <Col span={24}>
                      <Divider dashed />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>订单总价：</Col>
                    <Col span={16}>¥{formatMoney(dealInfo.payInfo.dealTotalAmount)}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>实付款：</Col>
                    <Col span={16}>¥{formatMoney(dealInfo.payInfo.payTotalAmount)}</Col>
                  </Row>
                  <Row>
                    <Col span={8}>支付方式：</Col>
                    <Col span={16}>
                      {dealInfo.payInfo.payList
                        .filter(pay => pay.tradeWay !== PayWayTypes.PUBSERVICE.key)
                        .map(pay => {
                          return (
                            <div key={pay.tradeWay}>
                              {formatModel(PayWayTypes, +pay.tradeWay)} ¥
                              {pay.tradeAmount > 0 ? formatMoney(pay.tradeAmount) : null}
                            </div>
                          );
                        })}
                    </Col>
                  </Row>
                  {serviceInfo?.tradeWayDataId && (
                    <>
                      <Row>
                        <Col span={8}>优惠信息：</Col>
                        <Col span={16}>
                          <div>服务结算 {serviceInfo?.tradeWayDataName}</div>
                          <div>服务支付 {serviceInfo?.tradeAmountDetail}</div>
                          <div>剩余服务 {serviceInfo?.tradeSurplusDetail}</div>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
              <Divider dashed />
              <Row>
                <Col span={8}>付款时间：</Col>
                <Col span={16}>{formatDateTime(dealInfo.deal.updateTime)}</Col>
              </Row>
              <Row>
                <Col span={8}>账户：</Col>
                <Col span={16}>
                  {isFastSaveDeal
                    ? '散客'
                    : `${formatSecretName(dealInfo.deal.pubRealName)}/${formatSecretPhone(dealInfo.deal.pubMobile)}`}
                </Col>
              </Row>
              {dealInfo.deal.srvId > 0 ? null : (
                <Row>
                  <Col span={8}>操作员ID：</Col>
                  <Col span={16}>{dealInfo.deal.createUserId}</Col>
                </Row>
              )}
              {dealInfo.deal.sellerMessage && (
                <Row>
                  <Col span={8}>商家留言：</Col>
                  <Col span={16}>{dealInfo.deal.sellerMessage}</Col>
                </Row>
              )}
              {dealInfo.deal.userMessage && (
                <Row>
                  <Col span={8}>订单备注：</Col>
                  <Col span={16}>{dealInfo.deal.userMessage}</Col>
                </Row>
              )}
              <Row className={styles.onlyPrint}>
                <Divider dashed />
                <Col span={8}>打印时间：</Col>
                <Col span={16}>{formatDateTime(serverTime)}</Col>
              </Row>
              {printingMessage ? (
                <Row key={1} className={styles.onlyPrint}>
                  <Divider dashed />
                  <Col span={24}>{printingMessage}</Col>
                </Row>
              ) : (
                <Row key={2} className={styles.onlyPrint}>
                  <Divider dashed />
                  <Col span={24} className="text-center">
                    谢谢惠顾，小票仅当天有效
                  </Col>
                  <Col span={24} className="text-center">
                    为保障权益，请您保留小票
                  </Col>
                </Row>
              )}
              {/* 动态二维码不支持打印 */}
              {dealInfo.deal.viewMode
                ? null
                : validTicketDeal.map(ticket => (
                    <Row key={ticket.id}>
                      <Divider dashed />
                      <Col span={24} className="text-center">
                        {ticket.ticketName}
                        <MarginBar top>验证码：{ticket.matrix.validCode}</MarginBar>
                      </Col>
                      {ticket.matrix.matrixData && (
                        <Col span={24} className="text-center">
                          <MarginBar top>
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
                          </MarginBar>
                        </Col>
                      )}
                      <Col span={24} className="text-center">
                        数量：{ticket.salesNum || ticket.totalNum || ticket.buyNum}
                      </Col>
                    </Row>
                  ))}
              {validTicketDeal.length > 0 && (
                <Row>
                  <Divider dashed />
                  <Col span={24} className="text-center">
                    订单号：{dealInfo.deal.id}
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={24}>&nbsp;</Col>
              </Row>
              <Row className={styles.operation}>
                <Col span={24}>
                  <Divider dashed />
                  {window.opener && window.opener !== window ? (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button type="primary" block loading={printing} onClick={execPrint}>
                          打印
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button block>关闭</Button>
                      </Col>
                    </Row>
                  ) : (
                    <Col span={24}>
                      <Button type="primary" block loading={printing} onClick={execPrint}>
                        打印
                      </Button>
                    </Col>
                  )}
                </Col>
              </Row>
            </Row>
          </Col>
          <Col md={6} />
        </Row>
      ) : (
        <Result
          type="error"
          title="错误"
          description="未能查询到相关已支付订单，请检查订单号或者支付状态是否正确"
          actions={
            <Button type="primary" onClick={() => dispatch(goBack())}>
              返回
            </Button>
          }
        />
      )}
    </Card>
  );
}

OrderPrint.contextTypes = {
  getCurrentServerTime: PropTypes.func,
};

export default OrderPrint;
