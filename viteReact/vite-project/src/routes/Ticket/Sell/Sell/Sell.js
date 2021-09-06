import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import { Card, Radio, Form, Button } from 'antd';
import AmountInputWapper from '@/components/Amount/InputWapper';
import CountInput from '@/components/CountInput';
import AmountColor from '@/components/Amount/Color';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { formatMD, formatDay, formatHM, formatMoney } from '@/utils/format';
import { mul } from '@/commons/lib/math';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ ticketselling, orderprocessing, pubticket, loading }) => ({
  ticketselling,
  pubticket,
  orderprocessing,
  fetching: loading.effects['ticketselling/fetchConfirmTicketInfo'],
  saving: loading.effects['orderprocessing/saveOrder'],
}))
@Form.create()
class TicketSellingSell extends Component {
  static contextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
    // validFace: PropTypes.bool,
  };

  state = {
    data: undefined,
    sales: undefined,
    platform: undefined,
    dateTime: undefined,
    priceInfo: undefined,
  };

  async componentDidMount() {
    const { checkOpFailedAndGoBack } = this.context;
    if (checkOpFailedAndGoBack()) {
      return;
    }
    const {
      dispatch,
      match: { params },
      orderprocessing: { dealInfo },
    } = this.props;
    const result = await dispatch({
      type: 'ticketselling/fetchConfirmTicketInfo',
      payload: params.id,
    });
    if (this.isUnmounted) {
      return;
    }
    const data = result || {};

    // 票务未拆分，传入和输出不同
    const { dealTicketList } = dealInfo || {};
    const { scheduleDetailId } = (dealTicketList || [])[0] || {};
    const stateObj = {};
    let noFireChange = false;
    if (scheduleDetailId) {
      noFireChange = (data.commonScheduleInfoList || []).some(sales => {
        return (sales.platformList || []).some(platform => {
          return (platform.dateTimeList || []).some(dateTime => {
            return (dateTime.priceList || []).some(priceInfo => {
              if (priceInfo.scheduleDetailId === scheduleDetailId) {
                Object.assign(stateObj, {
                  sales,
                  platform,
                  dateTime,
                  priceInfo,
                });
                return true;
              }
              return false;
            });
          });
        });
      });
    }

    this.setState(
      () => ({
        data,
        ...stateObj,
      }),
      () => {
        if (noFireChange) {
          return;
        }
        this.handleSalesChange({
          target: {
            value: (data.commonScheduleInfoList || [])[0],
          },
        });
      }
    );
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  handleSalesChange = e => {
    const sales = e.target.value;
    this.setState(
      () => ({
        sales,
      }),
      () => {
        const platformList = sales.platformList || [];
        this.handlePlatformChange({
          target: {
            value: platformList[0] || {},
          },
        });
      }
    );
  };

  handlePlatformChange = e => {
    const platform = e.target.value;
    this.setState(
      () => ({
        platform,
      }),
      () => {
        const dateTimeList = platform.dateTimeList || [];
        this.handleDateTimeChange({
          target: {
            value: dateTimeList[0] || {},
          },
        });
      }
    );
  };

  handleDateTimeChange = e => {
    const dateTime = e.target.value;
    this.setState(
      () => ({
        dateTime,
      }),
      () => {
        const priceList = dateTime.priceList || [];
        this.handlePriceChange({
          target: {
            value: priceList[0] || {},
          },
        });
      }
    );
  };

  handlePriceChange = e => {
    const priceInfo = e.target.value;
    this.setState({
      priceInfo,
    });
  };

  handleNextStep = summary => {
    const { dispatch, form } = this.props;
    const { getNextStepPath } = this.context;
    form.validateFieldsAndScroll((err, formData) => {
      if (err) {
        return;
      }
      const { num } = formData;
      const { platform, dateTime, priceInfo } = this.state;
      const { platformName } = platform;
      const { scheduleDetailId, price, fee, pushSeat } = priceInfo;
      const { fromDate, toDate, startTime, calendarType } = dateTime;

      dispatch({
        type: 'ticketselling/sellNextStep',
        // 冗余一些字段给人脸采集时用
        payload: {
          salesNum: num,
          scheduleDetailId,
          transactionPrice: price,
          fee,
          calendarType,
          // orderDate: clearHMS(moment(startTime)).valueOf(),
          fromDate,
          toDate,
          startTime,
          // endTime,
          platformName,
          // platformParentName: '',
        },
        summary,
        pushSeat,
      }).then(id => {
        if (summary) {
          if (id) {
            dispatch(
              push({
                pathname: './summary',
                search: `id=${id}`,
              })
            );
          }
          return;
        }
        dispatch(push(getNextStepPath()));
      });
    });
  };

  render() {
    const { checkOpFailed, selectPubStudy, validPubStudy } = this.context;
    if (checkOpFailed()) {
      return null;
    }
    const {
      fetching,
      saving,
      form,
      pubticket: { CalendarTypes },
      orderprocessing: { dealInfo },
    } = this.props;
    // 票务未拆分，传入和输出不同
    const { dealTicketList, deal } = dealInfo || {};
    const { salesNum } = (dealTicketList || [])[0] || {};
    const { data, sales, platform, dateTime, priceInfo } = this.state;
    const { commonScheduleInfoList, ticketName } = data || {};
    const salesList = commonScheduleInfoList || [];
    const platformList = (sales || {}).platformList || [];
    const dateTimeList = (platform || {}).dateTimeList || [];
    const priceList = (dateTime || {}).priceList || [];

    const max = priceInfo == null ? 0 : priceInfo.surplusNum || 0;
    const min = Math.min(1, max);
    const oldValue = salesNum > 0 && deal.id ? salesNum : min;
    const num = Math.min(form.getFieldValue('num') || oldValue || min, max);

    return (
      <>
        <Card title="票务信息" loading={fetching}>
          <VerticalPairColumnTable>
            <PairColumn label="票务名称">{ticketName}</PairColumn>
            <PairColumn label="场馆">
              <Radio.Group value={sales} onChange={this.handleSalesChange}>
                {salesList.map(item => (
                  <Radio.Button key={item.salesId} value={item}>
                    {item.salesName}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </PairColumn>
            <PairColumn label="场地">
              <Radio.Group value={platform} onChange={this.handlePlatformChange}>
                {platformList.map(item => (
                  <Radio.Button key={item.platformId} value={item}>
                    {item.platformName}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </PairColumn>
            <PairColumn label="排期场次">
              <Radio.Group value={dateTime} onChange={this.handleDateTimeChange}>
                {dateTimeList.map(item => (
                  <Radio.Button key={item.scheduleId} value={item}>
                    {(() => {
                      switch (item.calendarType) {
                        case CalendarTypes.FIXEDSCHEDULE.key:
                          return `${formatMD(item.startTime)} ${formatDay(item.startTime)} ${formatHM(item.startTime)}`;
                        case CalendarTypes.VALIDITYSCHEDULE.key:
                          return `${formatMD(item.fromDate)}至${formatDay(item.toDate)}`;
                        default:
                          return '?';
                      }
                    })()}
                    {item.descr}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </PairColumn>

            <PairColumn label="票面">
              <Radio.Group value={priceInfo} onChange={this.handlePriceChange}>
                {priceList.map(item => (
                  <Radio.Button key={item.scheduleDetailId} value={item}>
                    {(() => {
                      // 这里的积分和价格都没有100倍
                      const text = [];
                      if (item.fee > 0 || (item.marketPrice === 0 && (item.subPrice === 0 || item.price > 0))) {
                        if (item.fee) {
                          text.push(formatMoney(item.fee, 0));
                        } else if (item.price) {
                          text.push(formatMoney(item.price));
                        } else {
                          text.push('免费');
                        }
                        if (item.fee || (item.marketPrice === 0 && item.price > 0) || item.descr) {
                          if (item.fee) {
                            text.push(
                              item.descr || item.descr1
                                ? `${item.descr || ''}${item.descr && item.descr1 ? '-' : ''}${item.descr1 || ''}`
                                : '积分兑换'
                            );
                          } else {
                            text.push(item.descr);
                          }
                        }
                      } else {
                        if (item.descr && item.descr1) {
                          text.push(`${item.descr}-${item.descr1}`);
                        } else {
                          text.push(`市场票价${formatMoney(item.marketPrice)}元-优惠${formatMoney(item.subPrice)}元`);
                        }
                        text.push(item.price > 0 ? `售${formatMoney(item.price)}元` : '免费');
                        if (item.descr) {
                          text.push(item.descr1 ? '现价' : item.descr);
                        }
                      }
                      return text.filter(t => t != null && t.toString().length > 0).join('/');
                    })()}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </PairColumn>

            <PairColumn label="单价">
              {/* 这里的积分和价格都没有100倍 */}
              {priceInfo == null ? (
                formatMoney(0)
              ) : (
                <> {priceInfo.fee ? formatMoney(priceInfo.fee, 0) : formatMoney(priceInfo.price)}</>
              )}
            </PairColumn>

            <PairColumn label="单位">{priceInfo && priceInfo.fee > 0 ? '分' : '元'}</PairColumn>
          </VerticalPairColumnTable>
        </Card>
        <Card title="选择数量" loading={fetching}>
          <Form>
            <VerticalPairColumnTable>
              <PairColumn label="剩余张数">{priceInfo == null ? 0 : priceInfo.surplusNum}</PairColumn>
              <PairColumn label="销售张数">
                <AmountInputWapper>
                  {form.getFieldDecorator('num', {
                    initialValue: min,
                  })(<CountInput min={min} max={max} />)}
                </AmountInputWapper>
              </PairColumn>
              <PairColumn label="合计">
                <AmountColor inputSize>
                  {priceInfo == null ? (
                    formatMoney(0)
                  ) : (
                    <>
                      {priceInfo.fee ? formatMoney(mul(priceInfo.fee, num), 0) : formatMoney(mul(priceInfo.price, num))}
                    </>
                  )}
                </AmountColor>
              </PairColumn>
            </VerticalPairColumnTable>
          </Form>
        </Card>

        <FooterToolbar>
          <MarginBar left top inline>
            <Button disabled={fetching || saving} onClick={this.handleGoBack}>
              返回
            </Button>
          </MarginBar>
          {(selectPubStudy || deal?.pushSeat || priceInfo?.pushSeat) && (
            <MarginBar left top inline>
              <Button type="primary" disabled={num <= 0 || saving} onClick={() => this.handleNextStep()}>
                下一步
              </Button>
            </MarginBar>
          )}
          {!(selectPubStudy && validPubStudy) && (
            <MarginBar left top inline>
              <Button type="danger" disabled={num <= 0} loading={saving} onClick={() => this.handleNextStep(true)}>
                结算
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default TicketSellingSell;
