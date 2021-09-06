import { useState, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';
import moment from 'moment';
import { push } from 'connected-react-router';
import { Card, Row, Col, Input, Button, Modal, message, DatePicker, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import AuthComponent from '@/components/AuthComponent';
import DataContent from '@/components/PubServiceCard/DataContent';
import Datatable from '@/components/Datatable';
import { getPageQuery, isNumber } from '@/utils/utils';
import { mul } from '@/commons/lib/math';

import {
  formatDate,
  formatMoneyLen2,
  formatModel,
  formatMoney,
  formatDateTime,
  formatDateCsvt,
  fixedMoney,
  decodeMoney,
  formatSrvId,
  formatColorWrapper,
  formatPayWayFromList,
  formatMoneyLen0,
} from '@/utils/format';
import styles from './index.less';

const moneyRender = value => formatColorWrapper(formatMoney)(value);

const { Search } = Input;
const { confirm } = Modal;

export default () => {
  const { pubId } = getPageQuery();
  const [pubServiceId, setPubServiceId] = useState(pubId);
  const loading = useSelector(state => state.loading.effects['pubservice/pubServiceRecovery']);
  let startDate = useRef();
  const dispatch = useDispatch();

  const chargeAmount = useCallback((value, price) => {
    if (!isNumber(price) || price === 0 || !isNumber(value) || value === 0) {
      return 0;
    }
    return mul(decodeMoney(value), decodeMoney(price));
  }, []);

  const handleToDetail = useCallback((record, path, query, newWindow) => {
    if (newWindow) {
      window.open(`${path}`);
      return;
    }
    dispatch(
      push({
        pathname: path,
        search: stringify(query),
      })
    );
  }, []);

  const chargeAmountRender = useCallback(
    (...args) => {
      return fixedMoney(chargeAmount(...args));
    },
    [chargeAmount]
  );

  const {
    ServiceTagTypes,
    ServiceStatus,
    AnalysisWriteModeTypes,
    AnalysisCalcModeTypes,
    AnalysisCalcStatus,
    AnalysisCheckouteModeTypes,
    PubServicePrintCardStatus,
    PubServiceUnitTypes,
    PubServiceTypes,
    ActionTypes,
    DealStatus,
    ServiceActiveStatus,
    PubServiceflowTypes,
    PayStatus,
  } = useSelector(state => state.pubservice);

  const { PayWayTypes, ChangePriceTypes } = useSelector(state => state.deal);

  const columnList = useMemo(
    () => [
      {
        title: '会员服务详情',
        url: '/publicServiceAccount/dataList.do',
        column: [
          {
            title: '服务账户编号',
            dataIndex: 'id',
            width: 80,
          },
          {
            title: '服务标签',
            dataIndex: 'serviceTag',
            render: value => formatModel(ServiceTagTypes, value),
            width: 75,
          },
          {
            title: '服务分类',
            dataIndex: 'serviceCategoryName',
            width: 110,
          },
          {
            title: '服务编号',
            dataIndex: 'pubServiceId',
            width: 75,
          },
          {
            title: '服务名称',
            dataIndex: 'serviceName',
            width: 200,
          },
          {
            title: '会员姓名',
            dataIndex: 'pubRealName',
            width: 80,
          },
          {
            title: '会员手机号',
            dataIndex: 'pubMobile',
            width: 120,
          },
          {
            title: '服务状态',
            dataIndex: 'serviceState',
            render: value => formatModel(ServiceStatus, value),
            width: 75,
          },
          {
            title: '服务有效期',
            dataIndex: 'startDate',
            render: (value, record) => {
              if (record.startDate && record.endDate) {
                return (
                  <span className={record.endDate < Date.now() ? 'red' : ''}>
                    {formatDate(record.startDate)} 至 {formatDateCsvt(record.endDate)}
                  </span>
                );
              }
            },
            width: 120,
          },
          // {
          //   title: '剩余时长/次数/优惠',
          //   dataIndex: 'serviceNum',
          // },
          {
            title: '服务内容',
            dataIndex: 'pubServiceDataList',
            render: (value, { serviceUseMode }) => (
              <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
            ),
            width: 300,
          },
          {
            title: '服务类型',
            dataIndex: 'serviceType',
            render: value => formatModel(PubServiceTypes, value),
            width: 75,
          },
          {
            title: '服务单位',
            dataIndex: 'serviceUnit',
            render: value => formatModel(PubServiceUnitTypes, value),
            width: 75,
          },
          {
            title: '剩余',
            children: [
              {
                title: '计费金额',
                key: 'surplusChargeAmount',
                render: (value, record) => {
                  const { surplusValue, analysisCalcPrice } = record;
                  return chargeAmountRender(surplusValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'surplusValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'surplusAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '购买(购买-退款)',
            children: [
              {
                title: '计费金额',
                key: 'buyChargeAmount',
                render: (value, record) => {
                  const { buyValue, analysisCalcPrice } = record;
                  return chargeAmountRender(buyValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'buyValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'buyAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '消费(支付-退回)',
            children: [
              {
                title: '计费金额',
                key: 'payChargeAmount',
                render: (value, record) => {
                  const { payValue, analysisCalcPrice } = record;
                  return chargeAmountRender(payValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'payValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'payAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '折现(折现-撤销)',
            children: [
              {
                title: '计费金额',
                key: 'withdrawChargeAmount',
                render: (value, record) => {
                  const { withdrawValue, analysisCalcPrice } = record;
                  return chargeAmountRender(withdrawValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'withdrawValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'withdrawAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '转赠',
            children: [
              {
                title: '计费金额',
                key: 'giveChargeAmount',
                render: (value, record) => {
                  const { giveValue, analysisCalcPrice } = record;
                  return chargeAmountRender(giveValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'giveValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'giveAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '领取',
            children: [
              {
                title: '计费金额',
                key: 'receiveChargeAmount',
                render: (value, record) => {
                  const { receiveValue, analysisCalcPrice } = record;
                  return chargeAmountRender(receiveValue, analysisCalcPrice);
                },
                width: 75,
              },
              {
                title: '值',
                dataIndex: 'receiveValue',
                render: value => formatMoney(value),
                width: 60,
              },
              {
                title: '储值金额',
                dataIndex: 'receiveAmount',
                render: value => formatMoney(value),
                width: 75,
              },
            ],
          },
          {
            title: '计费状态',
            dataIndex: 'analysisCalcState',
            render: value => formatModel(AnalysisCalcStatus, value),
            width: 75,
          },
          {
            title: '计费日期',
            dataIndex: 'analysisCalcDate',
            render: formatDate,
            width: 130,
          },
          {
            title: '单次计金额',
            dataIndex: 'analysisCalcPrice',
            render: formatMoneyLen2,
            width: 90,
          },
          {
            title: '计费总金额',
            dataIndex: 'analysisTotalCalcPrice',
            render: formatMoneyLen2,
            width: 90,
          },
          {
            title: '购买总价格',
            dataIndex: 'buyTotalPrice',
            render: formatMoneyLen2,
            width: 90,
          },
          {
            title: '消费抵扣总金额',
            dataIndex: 'analysisTotalDiscountPrice',
            render: formatMoneyLen2,
            width: 115,
          },
          {
            title: '记入方式',
            dataIndex: 'analysisWriteMode',
            render: value => formatModel(AnalysisWriteModeTypes, value),
            width: 90,
          },
          {
            title: '计费方式',
            dataIndex: 'analysisCalcMode',
            render: value => formatModel(AnalysisCalcModeTypes, value),
            width: 75,
          },
          {
            title: '消费后结算方式',
            dataIndex: 'analysisCheckoutMode',
            render: value => formatModel(AnalysisCheckouteModeTypes, value),
            width: 160,
          },
          {
            title: '消费后结算日期',
            dataIndex: 'analysisCheckoutDate',
            render: formatDate,
            width: 160,
          },
          {
            title: '激活状态',
            dataIndex: 'activationState',
            render: value => formatModel(ServiceActiveStatus, value),
            width: 100,
          },
          {
            title: '服务激活日期',
            dataIndex: 'activationStartDate',
            render: (value, record) => {
              if (record.activationStartDate && record.activationEndDate) {
                return (
                  <span className={record.activationEndDate < Date.now() ? 'red' : ''}>
                    {formatDate(record.activationStartDate)} 至 {formatDate(record.activationEndDate)}
                  </span>
                );
              }
            },
            width: 120,
          },
          {
            title: '服务冻结日期',
            dataIndex: 'freezeStartDate',
            render: (value, record) => {
              if (record.freezeStartDate) {
                return (
                  <span className={record.freezeEndDate != null && record.freezeEndDate < Date.now() ? 'red' : ''}>
                    {formatDate(record.freezeStartDate)}
                    {record.freezeEndDate == null ? ' 起' : ` 至 ${formatDate(record.freezeEndDate)}`}
                  </span>
                );
              }
            },
            width: 120,
          },
          {
            title: '已绑定人员/学员信息',
            dataIndex: 'publicServiceStudyList',
            render: value =>
              (value || []).map(({ pubStudyId, mobile, realName }) => (
                <div key={pubStudyId}>
                  {pubStudyId}/{realName}/{mobile}
                </div>
              )),
            width: 220,
          },
          {
            title: '课程数据',
            key: 'courseScheduleCycleData',
            render: (value, { pubServiceDataList }) => {
              return (pubServiceDataList || []).map(item =>
                (item.courseList || []).map(({ courseName, courseId }) => <div key={courseId}>{courseName}</div>)
              );
            },
            width: 200,
          },
          {
            title: 'IC/物理卡号',
            dataIndex: 'cardNo',
            width: 75,
          },
          {
            title: '卡片状态',
            dataIndex: 'cardState',
            render: value => formatModel(PubServicePrintCardStatus, value),
            width: 75,
          },
          {
            title: '会员编号',
            dataIndex: 'pubAccountId',
            width: 100,
          },
          {
            title: '购买营销中心',
            dataIndex: 'buySalesName',
            width: 160,
          },
          {
            title: '有效营销中心',
            dataIndex: 'commonSalesList',
            render: value => (value || []).map(({ id, salesName }) => <div key={id}>{salesName}</div>),
            width: 160,
          },
          {
            title: '验证顺序',
            dataIndex: 'ranks',
            width: 90,
          },
          {
            title: '业务类型',
            dataIndex: 'serviceItemList',
            render: value => value?.join(', '),
            width: 75,
          },
          {
            title: '已用完时间',
            key: 'updateTime2',
            render: (_, { updateTime, serviceState }) => {
              if (serviceState === ServiceStatus.USED.key) {
                return formatDateTime(updateTime);
              }
            },
            width: 190,
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            render: formatDateTime,
            width: 190,
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: formatDateTime,
            width: 190,
          },
        ],
      },
      {
        title: '服务流水',
        url: '/pubServiceAccountRecord/dataList.do',
        column: [
          {
            title: '流水号',
            dataIndex: 'id',
            width: 100,
          },
          {
            title: '操作类型',
            dataIndex: 'recordType',
            render: value => {
              return formatModel(PubServiceflowTypes, value);
            },
            width: 150,
          },
          {
            title: '会员姓名',
            dataIndex: 'pubRealName',
            width: 130,
          },
          {
            title: '会员手机号',
            dataIndex: 'pubMobile',
            width: 130,
          },
          {
            title: '服务标签',
            dataIndex: 'serviceTag',
            render: value => {
              return formatModel(ServiceTagTypes, value);
            },
            width: 90,
          },
          {
            title: '服务账户编号',
            dataIndex: 'pubServiceAccountId',
            render: value => <Link to={`/basic/pub/pubservicesold?pubServiceAccountId=${value}`}>{value}</Link>,
            width: 110,
          },
          {
            title: '服务名称',
            dataIndex: 'pubServiceName',
            width: 250,
          },
          {
            title: '主订单号',
            dataIndex: 'dealId',
            render: value => <Link to={`/basic/deal/${value}`}>{value}</Link>,
            width: 100,
          },
          {
            title: '营销中心',
            dataIndex: 'salesName',
            width: 150,
          },
          {
            title: '服务账户发生金额',
            dataIndex: 'serviceAccountChange',
            render: formatMoneyLen2,
            width: 130,
          },
          {
            title: '服务帐户余额',
            dataIndex: 'serviceAccountBalance',
            render: formatMoneyLen2,
            width: 150,
          },
          {
            title: '服务内容消费',
            dataIndex: 'serviceDataChange',
            render: (value, { serviceUseMode }) => (
              <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
            ),
            width: 200,
          },
          {
            title: '服务内容剩余',
            dataIndex: 'serviceDataBalance',
            render: (value, { serviceUseMode }) => (
              <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />
            ),
            width: 200,
          },
          {
            title: '操作信息',
            dataIndex: 'descr',
            width: 500,
          },
          {
            title: '服务计费金额',
            dataIndex: 'serviceAnalysisCalcPrice',
            render: formatMoneyLen2,
            width: 110,
          },
          {
            title: '服务抵扣金额',
            dataIndex: 'serviceDiscountMoney',
            render: formatMoneyLen2,
            width: 110,
          },
          {
            title: '服务记入方式',
            dataIndex: 'serviceAnalysisWriteMode',
            render: value => {
              return formatModel(AnalysisWriteModeTypes, value);
            },
            width: 110,
          },
          {
            title: '订单信息',
            dataIndex: 'dealInfo',
            width: 250,
          },
          {
            title: '创建人',
            dataIndex: 'createRealName',
            width: 100,
          },
          {
            title: '更新时间',
            dataIndex: 'gmtModified',
            render: formatDateTime,
            width: 170,
          },
          {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            render: formatDateTime,
            width: 170,
          },
          {
            title: '业务来源',
            dataIndex: 'srvName',
            width: 80,
          },
          {
            title: '单位名称',
            dataIndex: 'companyName',
            width: 150,
          },
        ],
      },
      {
        title: '业务统计明细',
        url: '/analysis/serviceAccount/detail.do',
        column: [
          {
            title: '编号',
            dataIndex: 'id',
            width: 80,
          },
          {
            title: '统计开始日期',
            dataIndex: 'analysisStartDate',
            render: formatDate,
            width: 120,
          },
          {
            title: '统计结束日期',
            dataIndex: 'analysisEndDate',
            render: formatDate,
            width: 120,
          },
          {
            title: '服务对象上期剩余值',
            dataIndex: 'serviceAfterSurplusValue',
            width: 120,
          },
          {
            title: '服务对象本期剩余值',
            dataIndex: 'serviceSurplusValue',
            width: 120,
          },
          {
            title: '服务对象本期购买值',
            dataIndex: 'serviceBuyValue',
            width: 120,
          },
          {
            title: '服务对象本期支付值',
            dataIndex: 'servicePayValue',
            width: 120,
          },
          {
            title: '服务对象本期退回值',
            dataIndex: 'serviceRefundValue',
            width: 120,
          },
          {
            title: '服务对象本期折现值',
            dataIndex: 'serviceWithdrawValue',
            width: 120,
          },
          {
            title: '服务对象转赠折现值',
            dataIndex: 'serviceGiveValue',
            width: 120,
          },
          {
            title: '服务对象领取折现值',
            dataIndex: 'serviceReceiveValue',
            width: 120,
          },
          {
            title: '服务对象单次计金额',
            dataIndex: 'serviceCalcPrice',
            width: 120,
          },
          {
            title: '服务对象本期计费总金额',
            dataIndex: 'serviceTotalCalcPrice',
            width: 120,
          },
          {
            title: '服务对象本期抵扣总金额',
            dataIndex: 'serviceTotalDiscountPrice',
            width: 120,
          },
          {
            title: '服务储值上期剩余金额',
            dataIndex: 'serviceAfterSurplusAmount',
            width: 120,
          },
          {
            title: '服务储值本期剩余金额',
            dataIndex: 'serviceSurplusAmount',
            width: 120,
          },
          {
            title: '服务储值本期购买金额',
            dataIndex: 'serviceBuyAmount',
            width: 120,
          },
          {
            title: '服务储值本期支付金额',
            dataIndex: 'servicePayAmount',
            width: 120,
          },
          {
            title: '服务储值本期退款金额',
            dataIndex: 'serviceRefundAmount',
            width: 120,
          },
          {
            title: '服务储值本期折现金额',
            dataIndex: 'serviceWithdrawAmount',
            width: 120,
          },
          {
            title: '服务对象转赠金额',
            dataIndex: 'serviceGiveAmount',
            width: 120,
          },
          {
            title: '服务对象领取金额',
            dataIndex: 'serviceReceiveAmount',
            width: 120,
          },
          {
            title: '使用服务值使用是否需要余额',
            dataIndex: 'serviceIsAmount',
            width: 120,
          },
          {
            title: '服务统计记入方式',
            dataIndex: 'analysisWriteModeValue',
            width: 120,
          },
          {
            title: '服务统计计费方式',
            dataIndex: 'analysisCalcModeValue',
            width: 120,
          },
          {
            title: '本期购买单价',
            dataIndex: 'buyPrice',
            width: 100,
          },
          {
            title: '购买总张数',
            dataIndex: 'buyTotalNum',
            width: 100,
          },
          {
            title: '购买总价格',
            dataIndex: 'buyTotalPrice',
            width: 100,
          },
          {
            title: '购买总服务储值金额',
            dataIndex: 'buyTotalServiceAmount',
            width: 120,
          },
          {
            title: '购买服务对象总值',
            dataIndex: 'buyTotalServiceValue',
            width: 120,
          },
          {
            title: '用户编号',
            dataIndex: 'pubUserId',
            width: 100,
          },
          {
            title: '用户账户编号',
            dataIndex: 'pubAccountId',
            width: 100,
          },
          {
            title: '会员服务账户编号',
            dataIndex: 'pubServiceAccountId',
            width: 100,
          },
          {
            title: '真实姓名',
            dataIndex: 'realName',
            width: 100,
          },
          {
            title: '手机号',
            dataIndex: 'mobile',
            width: 100,
          },
          {
            title: '服务编号',
            dataIndex: 'serviceId',
            width: 100,
          },
          {
            title: '服务标签',
            dataIndex: 'serviceTag',
            width: 100,
          },
          {
            title: '服务名称',
            dataIndex: 'serviceName',
            width: 120,
          },
          {
            title: '服务有效场馆',
            dataIndex: 'serviceValidSalesId',
            width: 120,
          },
          {
            title: '服务值是否相加',
            dataIndex: 'serviceIsAdd',
            width: 120,
          },
          {
            title: '服务值使用方式',
            dataIndex: 'serviceUseMode',
            width: 120,
          },
          {
            title: '服务有效开始日期',
            dataIndex: 'startDate',
            render: formatDate,
            width: 120,
          },
          {
            title: '服务有效结束日期',
            dataIndex: 'endDate',
            render: formatDate,
            width: 120,
          },
          {
            title: '服务单位',
            dataIndex: 'serviceUnit',
            width: 80,
          },
          {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            render: formatDate,
            width: 120,
          },
          {
            title: '更新时间',
            dataIndex: 'gmtModified',
            render: formatDate,
            width: 120,
          },
          {
            title: '单位编号',
            dataIndex: 'companyId',
            width: 80,
          },
          {
            title: '单位名称',
            dataIndex: 'companyName',
            width: 120,
          },
        ],
      },
      {
        title: '财务统计明细',
        url: '/analysis/finance/detail.do',
        column: [
          {
            title: '主订单号',
            dataIndex: 'analysisDeal.dealId',
            width: 80,
            render: (v, r) => {
              return (
                <span className="link" onClick={() => handleToDetail(r, `../../../basic/deal/${v}/detail`, {}, true)}>
                  {v}
                </span>
              );
            },
          },
          {
            title: '操作类型',
            dataIndex: 'analysisDeal.operationAction',
            render: value => {
              return formatModel(ActionTypes, value);
            },
            width: 80,
          },
          {
            title: '会员编号',
            dataIndex: 'analysisDeal.publicAccountId',
            render: (v, r) => {
              return (
                <span className="link" onClick={() => handleToDetail(r, `../../../basic/pub/info/${v}/base`, {}, true)}>
                  {v}
                </span>
              );
            },
            width: 100,
          },
          {
            title: '会员姓名',
            dataIndex: 'analysisDeal.publicAccountRealName',
            width: 100,
          },
          {
            title: '会员手机号',
            dataIndex: 'analysisDeal.publicAccountMobile',
            width: 120,
          },
          {
            title: '营销中心',
            dataIndex: 'analysisDeal.salesName',
            width: 150,
          },
          {
            title: '订单信息',
            dataIndex: 'analysisDeal.dealDetail',
            width: 350,
          },
          {
            title: '订单状态',
            dataIndex: 'analysisDeal.dealState',
            render: value => {
              return formatModel(DealStatus, value);
            },
            width: 80,
          },
          {
            title: '订单总金额',
            dataIndex: 'analysisDeal.payTotalAmount',
            render: moneyRender,
            width: 100,
          },
          {
            title: '支付总金额',
            dataIndex: 'analysisDeal.payPaidAmount',
            render: moneyRender,
            width: 100,
          },
          {
            title: '计费总金额',
            dataIndex: 'analysisDeal.payCalcPaidAmount',
            render: moneyRender,
            width: 100,
          },
          {
            title: '支付方式',
            dataIndex: 'analysisDeal.payNewMode',
            render: formatPayWayFromList,
            width: 120,
          },
          {
            title: '支付状态',
            dataIndex: 'analysisDeal.dealPayState',
            render: value => {
              if (value == null) {
                return PayStatus.UNPAID.value;
              }
              return formatModel(PayStatus, value);
            },
            width: 80,
          },
          {
            title: '是否改价',
            dataIndex: 'analysisDeal.changePrice',
            render: value => {
              return value ? ChangePriceTypes.Change.value : ChangePriceTypes.UnChange.value;
            },
            width: 80,
          },
          {
            title: (() => {
              return PayWayTypes.WECHAT.value;
            })(),
            dataIndex: 'analysisDeal.payWechat',
            render: moneyRender,
            width: 70,
          },
          {
            title: (() => {
              return PayWayTypes.ZFB.value;
            })(),
            dataIndex: 'analysisDeal.payZfb',
            render: moneyRender,
            width: 70,
          },
          {
            title: (() => {
              return PayWayTypes.CASH.value;
            })(),
            dataIndex: 'analysisDeal.payCash',
            render: moneyRender,
            width: 70,
          },
          {
            title: (() => {
              return PayWayTypes.BANKCARD.value;
            })(),
            dataIndex: 'analysisDeal.payBankCard',
            render: moneyRender,
            width: 90,
          },
          {
            title: (() => {
              return PayWayTypes.BANKTRANSFER.value;
            })(),
            dataIndex: 'analysisDeal.payBankTransfer',
            render: moneyRender,
            width: 90,
          },
          {
            title: (() => {
              return PayWayTypes.ACCOUNT.value;
            })(),
            dataIndex: 'analysisDeal.payAccount',
            render: moneyRender,
            width: 100,
          },
          {
            title: '会员服务',
            children: [
              {
                title: '会员服务名称',
                dataIndex: 'analysisPublicService.serviceName',
                width: 210,
              },
              {
                title: '会员服务账户编号',
                dataIndex: 'analysisDeal.publicServiceAccountId',
                render: (v, r) => {
                  const {
                    analysisDeal: { salesId },
                  } = r;
                  return (
                    <>
                      {
                        // eslint-disable-next-line react/destructuring-assignment
                        v?.map(item => {
                          return (
                            <span
                              key={item}
                              className="link"
                              onClick={() =>
                                handleToDetail(r, `../../../basic/pub/pubservicesold`, {
                                  pubServiceAccountId: item,
                                  buySalesId: salesId,
                                })
                              }
                            >
                              {item}
                            </span>
                          );
                        })
                      }
                    </>
                  );
                },
                width: 150,
              },
              {
                title: '服务账户',
                dataIndex: 'analysisDeal.payServiceAccount',
                render: moneyRender,
                width: 100,
              },
              {
                title: '服务内容',
                dataIndex: 'analysisPublicService.analysisPublicServiceDataList',
                render: (value, { analysisPublicService }) => {
                  const { serviceUseMode } = analysisPublicService || {};
                  return <DataContent pubServiceDataList={value} serviceUseMode={serviceUseMode} />;
                },
                width: 250,
              },
              {
                title: '服务计费金额',
                dataIndex: 'analysisDeal.payServiceCalcPrice',
                render: moneyRender,
                width: 110,
              },
              {
                title: '服务抵扣金额',
                dataIndex: 'analysisDeal.payServiceAccountDiscount',
                render: moneyRender,
                width: 110,
              },
              {
                title: '服务记入方式',
                dataIndex: 'analysisDeal.analysisWriteMode',
                render: value => {
                  return formatModel(AnalysisWriteModeTypes, value);
                },
                width: 110,
              },
            ],
          },
          {
            title: (() => {
              return PayWayTypes.ZFB_TO_ACCOUNT.value;
            })(),
            dataIndex: 'analysisDeal.payZfbToAccount',
            render: moneyRender,
            width: 140,
          },
          {
            title: (() => {
              return PayWayTypes.WECHAT_TO_ACCOUNT.value;
            })(),
            dataIndex: 'analysisDeal.payWechatToAccount',
            render: moneyRender,
            width: 140,
          },
          {
            title: (() => {
              return PayWayTypes.CREDIT.value;
            })(),
            dataIndex: 'analysisDeal.payCredit',
            render: moneyRender,
            width: 70,
          },
          {
            title: (() => {
              return PayWayTypes.POINTS.value;
            })(),
            dataIndex: 'analysisDeal.payFee',
            render: formatColorWrapper(formatMoneyLen0),
            width: 60,
          },
          {
            title: '微信商户单号',
            dataIndex: 'analysisDeal.payWechatId',
            render: (v, r) => {
              return (
                <span
                  className="link"
                  onClick={() => handleToDetail(r, `../finance/tpdetail/wechatpay`, { payWechatId: v })}
                >
                  {v}
                </span>
              );
            },
            width: 150,
          },
          {
            title: '支付宝商家订单号',
            dataIndex: 'analysisDeal.payZfbId',
            render: (v, r) => {
              return (
                <span className="link" onClick={() => handleToDetail(r, `../finance/tpdetail/alipay`, { payZfbId: v })}>
                  {v}
                </span>
              );
            },
            width: 150,
          },
          {
            title: '订单备注',
            dataIndex: 'analysisDeal.userMessage',
            width: 110,
          },
          {
            title: '商家留言',
            dataIndex: 'analysisDeal.sellerMessage',
            width: 110,
          },
          // {
          //   title: '备注',
          //   dataIndex: 'analysisDeal.descr',
          //   width: 110,
          // },
          {
            title: '取消原因',
            dataIndex: 'analysisDeal.cancelMessage',
            width: 100,
          },
          {
            title: '创建人',
            dataIndex: 'analysisDeal.createRealName',
            width: 120,
          },
          {
            title: '操作时间',
            dataIndex: 'analysisDeal.gmtCreate',
            render: formatDateTime,
            width: 170,
          },
          {
            title: '业务来源',
            dataIndex: 'analysisDeal.srvName',
            width: 150,
          },
          {
            title: '操作终端',
            dataIndex: 'analysisDeal.srvId',
            render: formatSrvId,
            width: 80,
          },
        ],
      },
    ],
    []
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Row gutter={10}>
          <Col xs={16} sm={8}>
            <Search
              placeholder="请输入服务账户编号"
              defaultValue={pubServiceId}
              onSearch={value => {
                // 接口“服务不周到”，这个 length 判断希望能挺到退休那一天 💣
                if (Number.isFinite(+value) && value.length === 6) {
                  setPubServiceId(value);
                } else {
                  setPubServiceId();
                }
              }}
              enterButton
            />
          </Col>
          <Col xs={8} sm={4}>
            <AuthComponent auth="recover">
              <Button
                type="danger"
                onClick={() => {
                  if (Number.isFinite(+pubServiceId)) {
                    confirm({
                      title: '你确定要恢复该数据？',
                      content: (
                        <DatePicker
                          disabledDate={current => {
                            return current && current > moment().endOf('day');
                          }}
                          onChange={date => {
                            startDate = date.valueOf();
                          }}
                          placeholder="请选择恢复的日期"
                        />
                      ),
                      onOk() {
                        if (startDate && pubServiceId) {
                          dispatch({
                            type: 'pubservice/pubServiceRecovery',
                            payload: { pubServiceId, analysisStartDate: startDate },
                          });
                        } else {
                          message.warning('未选择恢复的日期');
                        }
                      },
                      onCancel() {
                        // eslint-disable-next-line no-console
                        console.log('取消恢复');
                      },
                    });
                  } else {
                    message.warning('请输入服务账户编号');
                  }
                }}
              >
                恢复
              </Button>
            </AuthComponent>
          </Col>
        </Row>
        <Spin spinning={!!loading}>
          {Number.isFinite(+pubServiceId) ? (
            columnList.map(column => (
              <div key={column.title}>
                <h4 className={styles.mt_30}>{column.title}</h4>
                <Datatable
                  url={`${column.url}?pubServiceAccountId=${pubServiceId}`}
                  rowKey="id"
                  columns={column.column}
                />
              </div>
            ))
          ) : (
            <p className={styles.textCenter}>暂无数据</p>
          )}
        </Spin>
      </Card>
    </PageHeaderLayout>
  );
};
