import { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  formatMoneyLen2,
  formatDate,
  formatHM,
  fixedMoney,
  formatTimeDuration,
  encodeMoney,
  decodeMoney,
  formatDay,
  formatMD,
  formatModel,
  formatSeatData,
  formatMoney,
  formatDateHM,
} from '@/utils/format';
import MarginBar from '@/components/MarginBar';
import Table from '@/components/Datatable/BaseTable';
import EditableCellTable from '@/components/EditableCellTable';
import DataContent from '@/components/PubServiceCard/DataContent';
import AmountColor from '@/components/Amount/Color';
import AmountInput from '@/components/Amount/Input';
import { div, mul, add } from '@/commons/lib/math';
import { CommonFileLinkTypes } from '@/utils/upload';
import ContactInfo from './ContactInfo';
import style from './index.less';

const tableAlign = 'center';

@connect(({ venue, deal, pubsignup, pubservice, pubcourse, rent, pubwithdraw }) => ({
  venue,
  deal,
  pubsignup,
  pubservice,
  pubcourse,
  pubwithdraw,
  rent,
}))
class DealInfoDetail extends Component {
  static contextTypes = {
    isAuthorized: PropTypes.func,
  };

  state = {
    dealInfo: {},
    fileList: [],
  };

  componentDidMount() {
    const { dealInfo, pubServiceCoupon } = this.props;
    this.calculateDealInfoData(dealInfo, pubServiceCoupon);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ dealInfo: nextDealInfo, pubServiceCoupon: nextPubServiceCoupon }) {
    const { dealInfo, pubServiceCoupon } = this.props;
    if (dealInfo !== nextDealInfo || pubServiceCoupon !== nextPubServiceCoupon) {
      this.calculateDealInfoData(nextDealInfo, nextPubServiceCoupon);
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  onDataChange() {
    const { onDataChange } = this.props;
    if (onDataChange == null) {
      return;
    }
    let allPrice = 0;
    const newPriceInfoList = [];
    let allUnknown = true;
    const resolvePrice = (listKey, quantityKey) => {
      const { totalPrice, priceInfoList, unknown } = this.calcPrice(listKey, quantityKey);
      allPrice = add(allPrice, totalPrice);
      newPriceInfoList.push(...priceInfoList);
      if (allUnknown && !unknown) {
        allUnknown = unknown;
      }
    };

    resolvePrice('dealPlatformList');
    resolvePrice('dealServiceUserList');
    resolvePrice('dealItemSnapList', 'itemNum');
    resolvePrice('dealServicePubList', 'buyNum');
    resolvePrice('dealTicketList', 'salesNum');
    resolvePrice('dealSportPlatformTicketList', 'salesNum');
    resolvePrice('dealSignupList');
    resolvePrice('dealPublicCreditList');
    resolvePrice('dealPublicAccountList');
    resolvePrice('dealCourseList');
    resolvePrice('dealAddress');
    resolvePrice('dealLeaseList');

    const { pubServiceCoupon } = this.props;
    const { payServicePrice = {} } = pubServiceCoupon || {};
    onDataChange(
      allUnknown,
      allPrice, // 总价
      payServicePrice.serviceDiscountPrice || 0, // 优惠
      payServicePrice.serviceAmountSubPrice || 0, // 服务抵扣
      newPriceInfoList
    );
  }

  handleEdit = (key, record) => {
    const { dealInfo } = this.state;
    const dealSomethingList = dealInfo[key] || [];
    // eslint-disable-next-line no-underscore-dangle
    const idx = dealSomethingList.findIndex(item => item._rowIndex === record._rowIndex);
    if (idx >= 0) {
      const { onBeforeEdit } = this.props;
      if (onBeforeEdit) {
        onBeforeEdit();
      }
      const list = [...dealSomethingList];
      list[idx] = record;
      if (this.isUnmounted) {
        return;
      }
      this.setState(
        // 重新取
        ({ dealInfo: newPrevDealInfo }) => ({
          dealInfo: {
            ...newPrevDealInfo,
            [key]: list,
          },
        }),
        this.onDataChange
      );
    }
  };

  handlePlatformEdit = record => {
    this.handleEdit('dealPlatformList', record);
  };

  handleServiceUserEdit = record => {
    this.handleEdit('dealServiceUserList', record);
  };

  handleServicePubListEdit = record => {
    this.handleEdit('dealServicePubList', record);
  };

  handleTicketListEdit = record => {
    this.handleEdit('dealTicketList', record);
  };

  handleSportPlatformTicketListEdit = record => {
    this.handleEdit('dealSportPlatformTicketList', record);
  };

  handleItemSnapEdit = record => {
    this.handleEdit('dealItemSnapList', record);
  };

  handleSignupEdit = record => {
    this.handleEdit('dealSignupList', record);
  };

  handleAddressEdit = record => {
    this.handleEdit('dealAddress', record);
  };

  handleLeaseListEdit = record => {
    this.handleEdit('dealLeaseList', record);
  };

  // 计算总价和统计价格变化数据
  calcPrice(key, quantityKey) {
    const { dealInfo } = this.state;
    const priceInfoList = [];
    const dealSomethingList = dealInfo[key] || [];
    const totalPrice = dealSomethingList.reduce((prev, current) => {
      let quantity = quantityKey == null ? Number.NaN : +current[quantityKey];
      quantity = Number.isFinite(quantity) ? quantity : 1;
      const newPrice = encodeMoney(mul(current.transactionEditPrice, quantity));
      priceInfoList.push({
        newPrice,
        dataId: current.id,
        relType: current.dealRelType,
      });
      return add(prev, newPrice);
    }, 0);
    return {
      totalPrice,
      priceInfoList,
      unknown: dealSomethingList.length === 0,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  spreadpubStudy(set, list, subKey) {
    if (set instanceof Set && Array.isArray(list) && subKey) {
      list.forEach(({ [subKey]: studyList }) => {
        (studyList || []).forEach(({ pubStudyId }) => {
          set.add(pubStudyId);
        });
      });
    }
  }

  fetchFaces(dealInfo) {
    if (dealInfo == null) {
      return;
    }
    const {
      deal,
      dealPlatformList,
      dealPlatformStudyList,
      dealServicePubList,
      dealServicePubStudyList,
      dealCourseList,
      dealTicketList,
      dealSportPlatformTicketList,
    } = dealInfo;
    if (deal == null) {
      return;
    }
    const { selectPubStudy } = deal;
    if (!selectPubStudy) {
      return;
    }
    const typeIdsMapping = {};
    Object.values(CommonFileLinkTypes).forEach(item => {
      typeIdsMapping[item.key] = new Set();
    });
    const studySet = typeIdsMapping[CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key];
    // 体育场地 也使用联系人人脸
    if (Array.isArray(dealPlatformList) && dealPlatformList.length > 0) {
      (dealPlatformStudyList || []).forEach(item => {
        studySet.add(item.pubStudyId);
      });
    }
    // 会员服务 也使用联系人人脸
    if (Array.isArray(dealServicePubList) && dealServicePubList.length > 0) {
      (dealServicePubStudyList || []).forEach(item => {
        studySet.add(item.pubStudyId);
      });
    }
    // 课程
    this.spreadpubStudy(
      typeIdsMapping[CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key],
      dealCourseList,
      'dealCourseStudyList'
    );
    // 场地票务
    this.spreadpubStudy(
      typeIdsMapping[CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key],
      dealSportPlatformTicketList,
      'dealSportTicketStudyList'
    );
    // 活动票务
    this.spreadpubStudy(
      typeIdsMapping[CommonFileLinkTypes.PUBLICSTUDY_FACE_AVATAR.key],
      dealTicketList,
      'dealTicketStudyList'
    );
    const { dispatch } = this.props;
    const promiseList = [];
    Object.keys(typeIdsMapping).forEach(typeKey => {
      const set = typeIdsMapping[typeKey];
      if (set.size > 0) {
        promiseList.push(
          dispatch({
            type: 'global/fetchFiles',
            payload: {
              linkType: typeKey,
              linkId: [...set],
            },
          })
        );
      }
    });
    Promise.all(promiseList).then(data => {
      if (this.isUnmounted) {
        return;
      }
      const all = data.reduce((prev, list) => [...prev, ...(list || [])], []);
      this.setState({
        fileList: all,
      });
    });
  }

  calculateDealInfoData(info, pubServiceCoupon) {
    this.fetchFaces(info);
    const dealInfo = info || {};

    const deal = dealInfo.deal || {};

    const dealPlatformList = dealInfo.dealPlatformList || [];
    const dealServiceUserList = dealInfo.dealServiceUserList || [];
    const dealItemList = dealInfo.dealItemList || [];
    const dealServicePubList = dealInfo.dealServicePubList || [];
    const dealTicketList = dealInfo.dealTicketList || [];
    const dealSportPlatformTicketList = dealInfo.dealSportPlatformTicketList || [];
    const dealSignupList = dealInfo.dealSignupList || [];
    const dealPublicCreditList = dealInfo.dealPublicCreditList || [];
    const dealPublicAccountList = dealInfo.dealPublicAccountList || [];
    const dealCourseList = dealInfo.dealCourseList || [];
    const dealLeaseList = dealInfo.dealLeaseList || [];
    // 有收获地址/存在运费
    const dealAddress = deal.dealAddress && dealInfo.dealAddress ? [dealInfo.dealAddress] : [];

    const { dealServicePrice = [] } = pubServiceCoupon || {};

    const calcTransactionEditPrice = (item, quantity = 1) => {
      const couponInfo = dealServicePrice.find(cInfo => cInfo.relType === item.dealRelType && cInfo.dataId === item.id);
      if (couponInfo) {
        return decodeMoney(div(couponInfo.newPrice, quantity));
      }
      return item.transactionEditPrice == null ? decodeMoney(item.transactionPrice) : item.transactionEditPrice;
    };

    if (this.isUnmounted) {
      return;
    }

    this.setState(
      () => ({
        dealInfo: {
          ...dealInfo,
          dealPlatformList: dealPlatformList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item),
            };
          }),
          dealServiceUserList: dealServiceUserList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item),
            };
          }),
          dealItemSnapList: (() => {
            const list = [];
            dealItemList.forEach(item => {
              (item.dealItemSnapList || []).forEach(subItem => {
                list.push({
                  ...subItem,
                  _rowIndex: list.length,
                  transactionEditPrice: calcTransactionEditPrice(subItem, subItem.itemNum),
                });
              });
            });
            return list;
          })(),
          dealServicePubList: dealServicePubList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item, item.buyNum),
            };
          }),
          dealTicketList: dealTicketList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item, item.salesNum),
            };
          }),
          dealSportPlatformTicketList: dealSportPlatformTicketList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item, item.salesNum),
            };
          }),
          dealSignupList: dealSignupList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item),
            };
          }),
          dealPublicCreditList: dealPublicCreditList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice({
                ...item,
                transactionPrice: item.amount,
              }),
            };
          }),
          dealPublicAccountList: dealPublicAccountList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice({
                ...item,
                transactionPrice: item.amount,
              }),
            };
          }),
          dealCourseList: dealCourseList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice({
                ...item,
                transactionPrice: mul(item.dealCourseStudyList?.length || 0, item.transactionUnitPrice || 0),
              }),
            };
          }),
          dealAddress: dealAddress.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice(item),
            };
          }),
          dealLeaseList: dealLeaseList.map((item, i) => {
            return {
              ...item,
              _rowIndex: i,
              transactionEditPrice: calcTransactionEditPrice({
                ...item,
                transactionPrice: add(item.rentalTotalAmount, item.depositTotalAmount),
              }),
            };
          }),
        },
      }),
      this.onDataChange
    );
  }

  render() {
    const { isAuthorized } = this.context;
    const {
      isOrderSummary,
      venue,
      wrapClassName,
      deal: { PayStatus },
      rent: { LeaseTypes },
    } = this.props;
    const { dealInfo, fileList } = this.state;
    // console.log(dealInfo);
    const { ProfessionTypes, Careers } = venue;

    const deal = dealInfo.deal || {};
    const { selectPubStudy, dealPayState, createTime } = deal;
    const dealPlatformList = dealInfo.dealPlatformList || [];
    const dealPlatformStudyList = dealInfo.dealPlatformStudyList || [];
    const dealServiceUserList = dealInfo.dealServiceUserList || [];
    const dealItemSnapList = dealInfo.dealItemSnapList || [];
    const dealMarketingMemberList = dealInfo.dealMarketingMemberList || [];
    const dealServicePubList = dealInfo.dealServicePubList || [];
    const dealServicePubStudyList = dealInfo.dealServicePubStudyList || [];
    const dealTicketList = dealInfo.dealTicketList || [];
    const dealSportPlatformTicketList = dealInfo.dealSportPlatformTicketList || [];
    const dealSignupList = dealInfo.dealSignupList || [];
    const dealPublicCreditList = dealInfo.dealPublicCreditList || [];
    const dealPublicAccountList = dealInfo.dealPublicAccountList || [];
    const dealCourseList = dealInfo.dealCourseList || [];
    const dealWithdrawList = dealInfo.dealWithdrawList || [];
    const dealScanCodeList = dealInfo.dealScanCodeList || [];
    const dealAddress = dealInfo.dealAddress || [];
    // 锁场数据模拟
    const sportPlatformLockDataList = dealInfo.sportPlatformLockDataList || [];
    const dealLeaseList = dealInfo.dealLeaseList || [];

    const hasColor = dealPlatformList.some(item => !!item.sportTeamColor);

    const hasNoPay = dealPayState === PayStatus.UNPAID.key;

    const TableComp = isOrderSummary && hasNoPay ? EditableCellTable : Table;

    const disabled = !isAuthorized('edit-amount');
    return (
      <div className={style[wrapClassName]}>
        {sportPlatformLockDataList.length > 0 && (
          <Row>
            <Col className={style.title}>锁场信息</Col>
            <Col>
              <TableComp
                rowKey="id"
                countColsWidth
                columns={[
                  {
                    title: '时间',
                    align: tableAlign,
                    dataIndex: 'orderDate',
                    render: (value, record) => {
                      if (record.isTotal) {
                        return null;
                      }
                      return `${formatDate(value)} ${formatHM(record.startTime)}-${formatHM(record.endTime)}`;
                    },
                    width: 130,
                  },
                  {
                    title: '场地',
                    align: tableAlign,
                    dataIndex: 'platformName',
                    render: (value, record) => {
                      if (record.isTotal) {
                        return '合计';
                      }
                      return `${record.platformParentId ? `${record.platformParentName}-` : ''}${value}`;
                    },
                    width: 120,
                  },
                  {
                    title: '数量/小时',
                    align: tableAlign,
                    dataIndex: 'bookingTime',
                    width: 100,
                  },
                  {
                    title: '原价/元',
                    align: tableAlign,
                    dataIndex: 'platformPrice',
                    render: formatMoneyLen2,
                    width: 100,
                  },
                ]}
                dataSource={[
                  ...sportPlatformLockDataList,
                  {
                    isTotal: true,
                    noEditable: true,
                    id: Date.now(),
                    bookingTime: sportPlatformLockDataList.reduce(
                      (prev, current) => prev + (current.bookingTime || 0),
                      0
                    ),
                    platformPrice: sportPlatformLockDataList.reduce(
                      (prev, current) => prev + (current.platformPrice || 0),
                      0
                    ),
                  },
                ]}
                bordered
                pagination={false}
              />
            </Col>
          </Row>
        )}
        {dealPlatformList.length > 0 && (
          <Row>
            <Col className={style.title}>场地信息</Col>
            <Col>
              <TableComp
                rowKey="id"
                countColsWidth
                onEdit={this.handlePlatformEdit}
                columns={[
                  {
                    title: '时间',
                    align: tableAlign,
                    dataIndex: 'orderDate',
                    render: (value, record) => {
                      if (record.isTotal) {
                        return null;
                      }
                      return `${formatDate(value)} ${formatHM(record.startTime)}-${formatHM(record.endTime)}`;
                    },
                    width: 130,
                  },
                  {
                    title: '场地',
                    align: tableAlign,
                    dataIndex: 'platformName',
                    render: (value, record) => {
                      if (record.isTotal) {
                        return '合计';
                      }
                      return `${record.platformParentId ? `${record.platformParentName}-` : ''}${value}`;
                    },
                    width: 120,
                  },
                  selectPubStudy && {
                    title: '人员信息',
                    align: tableAlign,
                    render: (_, { isTotal }) =>
                      isTotal ? null : (
                        <ContactInfo selectPubStudy list={dealPlatformStudyList} faceFileList={fileList} />
                      ),
                    width: 170,
                  },
                  {
                    title: '数量/小时',
                    align: tableAlign,
                    dataIndex: 'bookingTime',
                    width: 100,
                  },
                  {
                    title: '原价/元',
                    align: tableAlign,
                    dataIndex: 'platformPrice',
                    render: formatMoneyLen2,
                    width: 100,
                  },
                  {
                    title: '成交价/元',
                    align: tableAlign,
                    dataIndex: 'transactionEditPrice',
                    editable: {
                      required: true,
                      disabled,
                      node: <AmountInput disabled={disabled} min={0} precision={2} />,
                    },
                    render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                    width: 120,
                  },
                  {
                    title: '人员(教练/裁判)',
                    align: tableAlign,
                    dataIndex: 'dealUserList',
                    render: value => (value || []).map(item => item.realName).join(','),
                    width: 110,
                  },
                  hasColor && {
                    title: '球队信息',
                    align: tableAlign,
                    dataIndex: 'sportTeamColor',
                    render: (value, record) => {
                      if (value) {
                        return `${record.sportTeamColorValue}${record.fightMobile ? `/${record.fightMobile}` : ''}`;
                      }
                      return null;
                    },
                    width: 110,
                  },
                ].filter(Boolean)}
                dataSource={[
                  ...dealPlatformList,
                  {
                    isTotal: true,
                    noEditable: true,
                    id: Date.now(),
                    bookingTime: dealPlatformList.reduce((prev, current) => prev + (current.bookingTime || 0), 0),
                    platformPrice: dealPlatformList.reduce((prev, current) => prev + (current.platformPrice || 0), 0),
                    transactionPrice: dealPlatformList.reduce(
                      (prev, current) => prev + (current.transactionPrice || 0),
                      0
                    ),
                    transactionEditPrice: dealPlatformList.reduce(
                      (prev, current) => prev + (current.transactionEditPrice || 0),
                      0
                    ),
                  },
                ]}
                bordered
                pagination={false}
              />
            </Col>
          </Row>
        )}
        {dealServiceUserList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>服务人员信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleServiceUserEdit}
                  columns={[
                    {
                      title: '姓名',
                      align: tableAlign,
                      dataIndex: 'realName',
                      width: 100,
                    },
                    {
                      title: '项目',
                      align: tableAlign,
                      dataIndex: 'professionalId',
                      render: value => formatModel(ProfessionTypes, value),
                      width: 80,
                    },
                    {
                      title: '职业',
                      align: tableAlign,
                      dataIndex: 'careerId',
                      render: value => formatModel(Careers, value),
                      width: 80,
                    },
                    {
                      title: '时间',
                      align: tableAlign,
                      dataIndex: 'orderDate',
                      render: (value, record) =>
                        `${formatDate(value)} ${formatHM(record.startTime)}-${formatHM(record.endTime)}`,
                      width: 130,
                    },
                    {
                      title: '场地',
                      align: tableAlign,
                      dataIndex: 'platformName',
                      width: 100,
                    },
                    {
                      title: '原价/元',
                      align: tableAlign,
                      dataIndex: 'servicePrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '成交价/元',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 120,
                    },
                  ]}
                  dataSource={dealServiceUserList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealItemSnapList.length > 0 && (
          <>
            <MarginBar top>
              <Row>
                <Col className={style.title}>商品信息</Col>
                <Col>
                  <TableComp
                    rowKey="id"
                    countColsWidth
                    onEdit={this.handleItemSnapEdit}
                    columns={[
                      {
                        title: '商品名称',
                        align: tableAlign,
                        dataIndex: 'itemName',
                        width: 140,
                      },
                      {
                        title: '原单价/元',
                        align: tableAlign,
                        dataIndex: 'itemPrice',
                        render: formatMoneyLen2,
                        width: 100,
                      },
                      {
                        title: '销售单价/元',
                        align: tableAlign,
                        dataIndex: 'transactionEditPrice',
                        editable: {
                          required: true,
                          disabled,
                          node: <AmountInput disabled={disabled} min={0} precision={2} />,
                        },
                        render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                        width: 130,
                      },

                      {
                        title: '数量',
                        align: tableAlign,
                        dataIndex: 'itemNum',
                        width: 90,
                      },
                      {
                        title: '总价/元',
                        align: tableAlign,
                        dataIndex: 'transactionTotalPrice',
                        render: (_, { transactionEditPrice, itemNum }) => (
                          <AmountColor inputSize>{fixedMoney(mul(transactionEditPrice, itemNum))}</AmountColor>
                        ),
                        width: 110,
                      },
                    ]}
                    dataSource={dealItemSnapList}
                    bordered
                    pagination={false}
                  />
                </Col>
              </Row>
            </MarginBar>
            {dealMarketingMemberList.length > 0 && (
              <MarginBar top>
                <Row>
                  <Col className={style.title}>导购信息</Col>
                  <Col>
                    <TableComp
                      rowKey="id"
                      countColsWidth
                      columns={[
                        {
                          title: '姓名',
                          align: tableAlign,
                          dataIndex: 'realName',
                          width: 140,
                        },
                        {
                          title: '手机号',
                          align: tableAlign,
                          dataIndex: 'mobile',
                          width: 130,
                        },
                        {
                          title: '团号',
                          align: tableAlign,
                          dataIndex: 'marketingTeamId',
                          width: 90,
                        },
                        {
                          title: '团队',
                          align: tableAlign,
                          dataIndex: 'marketingTeamName',
                          width: 250,
                        },
                      ]}
                      dataSource={dealMarketingMemberList}
                      bordered
                      pagination={false}
                    />
                  </Col>
                </Row>
              </MarginBar>
            )}
          </>
        )}
        {dealServicePubList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>会员服务信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleServicePubListEdit}
                  columns={[
                    {
                      title: '服务名称',
                      align: tableAlign,
                      dataIndex: 'serviceName',
                      width: 120,
                    },
                    selectPubStudy && {
                      title: '人员信息',
                      align: tableAlign,
                      render: (_, { isTotal }) =>
                        isTotal ? null : (
                          <ContactInfo selectPubStudy list={dealServicePubStudyList} faceFileList={fileList} />
                        ),
                      width: 210,
                    },
                    {
                      title: '原价(元)',
                      align: tableAlign,
                      dataIndex: 'servicePrice',
                      render: formatMoneyLen2,
                      width: 120,
                    },
                    {
                      title: '成交单价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '数量',
                      align: tableAlign,
                      dataIndex: 'buyNum',
                      width: 120,
                    },
                    {
                      title: '成交总价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionTotalPrice',
                      render: (_, { transactionEditPrice, buyNum }) => (
                        <AmountColor inputSize>{fixedMoney(mul(transactionEditPrice, buyNum))}</AmountColor>
                      ),
                      width: 140,
                    },
                    {
                      title: '储值金额(元)',
                      align: tableAlign,
                      dataIndex: 'serviceAmount',
                      render: formatMoneyLen2,
                      width: 140,
                    },
                    {
                      title: '服务内容',
                      align: tableAlign,
                      dataIndex: 'dealServicePubSnapList',
                      render: (value, { serviceUseMode }) => (
                        <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
                      ),
                      width: 240,
                    },
                    {
                      title: '有效类型',
                      align: tableAlign,
                      dataIndex: 'serviceType',
                      render: value => {
                        const {
                          pubservice: { ServiceTypes },
                        } = this.props;
                        return formatModel(ServiceTypes, value);
                      },
                      width: 100,
                    },
                    {
                      title: '有效期(天)',
                      align: tableAlign,
                      dataIndex: 'serviceValid',
                      render: (value, record) => {
                        const {
                          pubservice: { ServiceTypes },
                        } = this.props;
                        if (record.serviceType === ServiceTypes.DYNAMICINVISIBLE.key) {
                          return formatTimeDuration(value);
                        }
                        return null;
                      },
                      width: 100,
                    },
                    {
                      title: '有效开始日期',
                      dataIndex: 'startDate',
                      render: (value, record) => {
                        const {
                          pubservice: { ServiceTypes },
                        } = this.props;
                        if (record.serviceType === ServiceTypes.FIXATIONINVISIBLE.key) {
                          return formatDate(value);
                        }
                        return null;
                      },
                      width: 140,
                    },
                    {
                      title: '有效结束日期',
                      dataIndex: 'endDate',
                      render: (value, record) => {
                        const {
                          pubservice: { ServiceTypes },
                        } = this.props;
                        if (record.serviceType === ServiceTypes.FIXATIONINVISIBLE.key) {
                          return formatDate(value);
                        }
                        return null;
                      },
                      width: 140,
                    },
                  ].filter(Boolean)}
                  dataSource={dealServicePubList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealLeaseList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>租赁信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleLeaseListEdit}
                  columns={[
                    {
                      title: '租赁类型',
                      dataIndex: 'leaseType',
                      render: value => formatModel(LeaseTypes, value),
                      width: 90,
                    },
                    {
                      title: '组别',
                      dataIndex: 'groupId',
                      width: 90,
                    },
                    {
                      title: '项目名称',
                      dataIndex: 'projectName',
                      width: 90,
                    },
                    {
                      title: '卡号/编号',
                      dataIndex: 'projectId',
                      width: 90,
                    },
                    {
                      title: '总租金(元)',
                      align: tableAlign,
                      dataIndex: 'rentalTotalAmount',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '总押金(元)',
                      align: tableAlign,
                      dataIndex: 'depositTotalAmount',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '总成交押金(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 100,
                    },
                    {
                      title: '成交总价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionTotalPrice',
                      render: (_, { transactionEditPrice }) => (
                        <AmountColor inputSize>{fixedMoney(transactionEditPrice)}</AmountColor>
                      ),
                      width: 140,
                    },
                  ]}
                  dataSource={dealLeaseList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealTicketList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>
                购票信息&nbsp;
                <span className={style.subtitle}>
                  (购票日期
                  {formatDate(createTime)})
                </span>
              </Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleTicketListEdit}
                  columns={[
                    {
                      title: '时间',
                      align: tableAlign,
                      dataIndex: 'orderDate',
                      render: (value, record) => {
                        if (record.isTotal) {
                          return null;
                        }
                        return `${formatDate(value)} ${formatHM(record.startTime)}`;
                      },
                      width: 130,
                    },
                    {
                      title: '票务名称',
                      align: tableAlign,
                      dataIndex: 'ticketName',
                      width: 140,
                    },
                    selectPubStudy && {
                      title: '人员信息',
                      align: tableAlign,
                      dataIndex: 'dealTicketStudyList',
                      render: (value, { isTotal }) =>
                        isTotal ? null : <ContactInfo selectPubStudy list={value} faceFileList={fileList} />,
                      width: 260,
                    },
                    {
                      title: '座位号',
                      align: tableAlign,
                      dataIndex: 'seatDataName',
                      render: formatSeatData,
                      width: 170,
                    },
                    {
                      title: '单价(元)',
                      align: tableAlign,
                      dataIndex: 'ticketPrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '数量',
                      align: tableAlign,
                      dataIndex: 'salesNum',
                      width: 90,
                    },
                    {
                      title: '成交单价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '成交总价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionTotalPrice',
                      render: (_, { transactionEditPrice, salesNum }) => (
                        <AmountColor inputSize>{fixedMoney(mul(transactionEditPrice, salesNum))}</AmountColor>
                      ),
                      width: 140,
                    },
                  ].filter(Boolean)}
                  dataSource={dealTicketList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealSportPlatformTicketList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>
                购票信息&nbsp;
                <span className={style.subtitle}>
                  (购票日期
                  {formatDate(createTime)})
                </span>
              </Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleSportPlatformTicketListEdit}
                  columns={[
                    {
                      title: '时间',
                      align: tableAlign,
                      dataIndex: 'orderDate',
                      render: (value, record) => {
                        if (record.isTotal) {
                          return null;
                        }
                        return `${formatDate(value)} ${formatHM(record.startTime)}-${formatHM(record.endTime)}`;
                      },
                      width: 130,
                    },
                    {
                      title: '场地',
                      align: tableAlign,
                      dataIndex: 'platformName',
                      render: (value, record) =>
                        `${record.platformParentName ? `${record.platformParentName}-` : ''}${value}`,
                      width: 140,
                    },
                    selectPubStudy && {
                      title: '人员信息',
                      align: tableAlign,
                      dataIndex: 'dealSportTicketStudyList',
                      render: (value, { isTotal }) =>
                        isTotal ? null : <ContactInfo selectPubStudy list={value} faceFileList={fileList} />,
                      width: 170,
                    },
                    {
                      title: '单价(元)',
                      align: tableAlign,
                      dataIndex: 'ticketPrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '数量',
                      align: tableAlign,
                      dataIndex: 'salesNum',
                      width: 90,
                    },
                    {
                      title: '成交单价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '成交总价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionTotalPrice',
                      render: (_, { transactionEditPrice, salesNum }) => (
                        <AmountColor inputSize>{fixedMoney(mul(transactionEditPrice, salesNum))}</AmountColor>
                      ),
                      width: 140,
                    },
                  ].filter(Boolean)}
                  dataSource={dealSportPlatformTicketList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealSignupList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>报名信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleSignupEdit}
                  columns={[
                    {
                      title: '名称',
                      align: tableAlign,
                      dataIndex: 'objectName',
                      width: 140,
                    },
                    {
                      title: '日期',
                      align: tableAlign,
                      dataIndex: 'objectStartDate',
                      render: formatDate,
                      width: 100,
                    },
                    {
                      title: '地址',
                      align: tableAlign,
                      dataIndex: 'objectAddress',
                      width: 140,
                    },
                    {
                      title: '状态',
                      align: tableAlign,
                      dataIndex: 'dealState',
                      render: value => {
                        const { pubsignup } = this.props;
                        return formatModel(pubsignup.DealStatus, value);
                      },
                      width: 100,
                    },
                    {
                      title: '团队名称',
                      align: tableAlign,
                      dataIndex: 'pubTeamName',
                      width: 140,
                    },
                    {
                      title: '原价(元)',
                      align: tableAlign,
                      dataIndex: 'signupPrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '成交价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                  ]}
                  dataSource={dealSignupList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealPublicCreditList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>白条还款信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  columns={[
                    {
                      title: '营销中心',
                      align: tableAlign,
                      dataIndex: 'salesName',
                      width: 160,
                    },
                    {
                      title: '还款金额(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      // 不可编辑
                      // editable: {
                      //   required: true,
                      //   disabled,
                      //   node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      // },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '备注',
                      align: tableAlign,
                      dataIndex: 'descr',
                      width: 140,
                    },
                  ]}
                  dataSource={dealPublicCreditList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealPublicAccountList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>会员充值信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  columns={[
                    {
                      title: '营销中心',
                      align: tableAlign,
                      dataIndex: 'salesName',
                      width: 160,
                    },
                    {
                      title: '充值金额(元)',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      // 不可编辑
                      // editable: {
                      //   required: true,
                      //   disabled,
                      //   node: <AmountInput disabled={disabled} disabled={disabled} min={0} precision={2} />,
                      // },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '备注',
                      align: tableAlign,
                      dataIndex: 'descr',
                      width: 160,
                    },
                  ]}
                  dataSource={dealPublicAccountList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealCourseList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>课程信息-报名人员</Col>
              <Col>
                {/* 课程永久不支持编辑价格 */}
                <Table
                  rowKey="id"
                  countColsWidth
                  columns={[
                    {
                      title: '课程名称',
                      align: tableAlign,
                      dataIndex: 'courseName',
                      width: 160,
                    },
                    {
                      title: '课程类型',
                      align: tableAlign,
                      dataIndex: 'courseType',
                      render: value => {
                        const {
                          pubcourse: { CourseTypes },
                        } = this.props;
                        return formatModel(CourseTypes, value);
                      },
                      width: 120,
                    },
                    {
                      title: '课程时间',
                      align: tableAlign,
                      dataIndex: 'dealCourseDataList',
                      render: value =>
                        (value || []).map(({ id, classDate, classStartTime, classEndTime }) => (
                          <div key={id}>
                            {formatDay(classDate)} {formatMD(classDate)} {formatHM(classStartTime)}-
                            {formatHM(classEndTime)}
                          </div>
                        )),
                      width: 200,
                    },
                    {
                      title: '人员信息',
                      align: tableAlign,
                      dataIndex: 'dealCourseStudyList',
                      render: value => (
                        <ContactInfo selectPubStudy={selectPubStudy} list={value} faceFileList={fileList} />
                      ),
                      width: 200,
                    },
                    {
                      title: '课时',
                      align: tableAlign,
                      dataIndex: 'courseLength',
                      width: 80,
                    },
                    {
                      title: '课时单价(元)',
                      align: tableAlign,
                      dataIndex: 'singlePrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '课程单价(元)',
                      align: tableAlign,
                      dataIndex: 'unitPrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '课程成交单价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionUnitPrice',
                      render: value => <AmountColor inputSize>{formatMoney(value)}</AmountColor>,
                      width: 140,
                    },
                    {
                      title: '课程总价(元)',
                      align: tableAlign,
                      dataIndex: 'totalPrice',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                    {
                      title: '课程成交总价(元)',
                      align: tableAlign,
                      dataIndex: 'transactionTotalPrice',
                      render: value => <AmountColor inputSize>{formatMoney(value)}</AmountColor>,
                      width: 140,
                    },
                  ]}
                  dataSource={dealCourseList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealWithdrawList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>提现/折现信息</Col>
              <Col>
                {/* 课程永久不支持编辑价格 */}
                <Table
                  rowKey="id"
                  countColsWidth
                  columns={[
                    {
                      title: '会员服务账户编号',
                      align: tableAlign,
                      dataIndex: 'publicServiceAccountId',
                      render: (value, r) => (
                        <Link to={`/basic/pub/info/${r.publicAccountId}/service?pubServiceAccountId=${value}`}>
                          {value}
                        </Link>
                      ),
                      width: 100,
                    },
                    {
                      title: '服务编号',
                      align: tableAlign,
                      dataIndex: 'publicServiceId',
                      width: 100,
                    },
                    {
                      title: '服务名称',
                      align: tableAlign,
                      dataIndex: 'publicServiceName',
                      width: 120,
                    },
                    {
                      title: '提现/折现原因',
                      align: tableAlign,
                      dataIndex: 'descr',
                      width: 200,
                    },
                    {
                      title: '提现/折现类型',
                      align: tableAlign,
                      dataIndex: 'withdrawType',
                      render: value => {
                        const {
                          pubwithdraw: { WithdrawTypes },
                        } = this.props;
                        return formatModel(WithdrawTypes, value);
                      },
                      width: 100,
                    },
                  ]}
                  dataSource={dealWithdrawList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {dealScanCodeList.length > 0 && (
          <MarginBar top>
            <Row>
              <Col className={style.title}>扫码信息</Col>
              <Col>
                <Table
                  rowKey="id"
                  countColsWidth
                  columns={[
                    {
                      title: '营销中心',
                      align: tableAlign,
                      dataIndex: 'salesName',
                      width: 160,
                    },
                    {
                      title: '创建时间',
                      align: tableAlign,
                      dataIndex: 'gmtCreate',
                      render: formatDateHM,
                      width: 120,
                    },
                    {
                      title: '支付金额(元)',
                      align: tableAlign,
                      dataIndex: 'amount',
                      render: formatMoneyLen2,
                      width: 100,
                    },
                  ]}
                  dataSource={dealScanCodeList}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
        {/* 有收获地址/存在运费 */}
        {deal.dealAddress && (
          <MarginBar>
            <Row>
              <Col className={style.title}>运费信息</Col>
              <Col>
                <TableComp
                  rowKey="id"
                  countColsWidth
                  onEdit={this.handleAddressEdit}
                  columns={[
                    {
                      title: '运费总金额',
                      align: tableAlign,
                      dataIndex: 'shippingPrice',
                      render: formatMoneyLen2,
                      width: 150,
                    },
                    {
                      title: '运费成交金额',
                      align: tableAlign,
                      dataIndex: 'transactionEditPrice',
                      editable: {
                        required: true,
                        disabled,
                        node: <AmountInput disabled={disabled} min={0} precision={2} />,
                      },
                      render: value => <AmountColor inputSize>{fixedMoney(value)}</AmountColor>,
                      width: 150,
                    },
                  ]}
                  dataSource={dealAddress}
                  bordered
                  pagination={false}
                />
              </Col>
            </Row>
          </MarginBar>
        )}
      </div>
    );
  }
}

export default DealInfoDetail;
