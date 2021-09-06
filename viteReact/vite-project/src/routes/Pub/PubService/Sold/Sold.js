import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, message } from 'antd';
import moment from 'moment';
import LevelView from '@/components/LevelView';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import { mul } from '@/commons/lib/math';
import { modal } from '@/utils/feedback';
import { isNumber, modelMapToOption, getPageQuery, clearHMS, isMobileDevice } from '@/utils/utils';
import {
  formatDate,
  formatMoneyLen2,
  formatModel,
  formatMoney,
  formatDateTime,
  formatDateCsvt,
  decodeMoney,
  fixedMoney,
} from '@/utils/format';
import UpdateContent from './UpdateContent';
import BindingSimpleContent from '../../../Device/BindingSimpleContent';
import BatchDelayContent from './BatchDelayContent';
import FreezeContent from './FreezeContent';
import LinkContact from './LinkContact';
import PrintCardView from './PrintCardView';
import WithdrawContent from './WithdrawContent';
import WithdrawToAccountContent from './WithdrawToAccountContent';
import DisableStateContent from './DisableStateContent';
import LinkCourseScheduleModal from './LinkCourseScheduleModal';
import RankEditModal from './RankEditModal';

const SortRules = {
  B_H2L: {
    key: 1,
    value: '按剩余值从高到低',
  },
  B_L2H: {
    key: 2,
    value: '按剩余值从低到高',
  },
  C_H2L: {
    key: 3,
    value: '按消费值从高到低',
  },
  C_L2H: {
    key: 4,
    value: '按消费值从低到高',
  },
};

const FlowDataAmount = {
  OnlyB: {
    key: 1,
    value: '只显示剩余值大于0',
  },
  OnlyC: {
    key: 2,
    value: '只显示消费大于0',
  },
};

export default ({ usePubAccountId }) => {
  const {
    salesIds,
    buySalesId,
    pubServiceAccountId,
    pubServiceId,
    objectName,
    serviceTag,
    serviceCategoryId,
    analysisCalcState,
    analysisStartDate,
    analysisEndDate,
  } = getPageQuery();
  const dispatch = useDispatch();
  const { RelTypes } = useSelector(state => state.global);
  const { list, currentVenue = {} } = useSelector(state => state.venue);
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
    PubServiceObjTypes,
    categoryList,
    ServiceActiveStatus,
  } = useSelector(state => state.pubservice);

  const checkouting = useSelector(state => state.loading.effects['pubservice/analysisCheckoutForSold']);
  const unfreezing = useSelector(state => state.loading.effects['pubservice/removeFreeze']);
  const contactLinking = useSelector(state => state.loading.effects['pubservice/linkStudy']);

  const [levelView, setLevelView] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [table, setTable] = useState();
  const [courseScheduleVisible, setCourseScheduleVisible] = useState();
  const [rankEditVisible, setRankEditVisible] = useState();

  const canNotEdit = useCallback(
    ({ serviceState }) => serviceState === ServiceStatus.FREEZE.key || serviceState === ServiceStatus.Disable.key,
    []
  );

  const chargeAmount = useCallback((value, price) => {
    if (!isNumber(price) || price === 0 || !isNumber(value) || value === 0) {
      return 0;
    }
    return mul(decodeMoney(value), decodeMoney(price));
  }, []);

  const chargeAmountRender = useCallback(
    (...args) => {
      return fixedMoney(chargeAmount(...args));
    },
    [chargeAmount]
  );

  useEffect(() => {
    dispatch({
      type: 'pubservice/fetchServiceCategory',
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '服务账户编号',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: 'IC/物理卡号',
        dataIndex: 'cardNo',
        width: 170,
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
        collect: true,
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
        collect: true,
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
        collect: true,
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
        collect: true,
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
        collect: true,
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
        collect: true,
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
        collect: true,
      },
      {
        title: '计费总金额',
        dataIndex: 'analysisTotalCalcPrice',
        render: formatMoneyLen2,
        width: 90,
        collect: true,
      },
      {
        title: '购买总价格',
        dataIndex: 'buyTotalPrice',
        render: formatMoneyLen2,
        width: 90,
        collect: true,
      },
      {
        title: '消费抵扣总金额',
        dataIndex: 'analysisTotalDiscountPrice',
        render: formatMoneyLen2,
        width: 115,
        collect: true,
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
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '有效场馆',
          name: 'salesId',
          options: (list || []).map(item => ({
            key: item.id,
            text: item.salesName,
          })),
          initialValue: (() => {
            if (pubServiceAccountId || pubServiceId || objectName) {
              return '';
            }
            if (salesIds || serviceCategoryId) {
              return +salesIds || '';
            }
            return usePubAccountId ? '' : currentVenue.id;
          })(),
          type: ItemTypes.Select,
        },
        {
          label: '服务帐户编号',
          name: 'pubServiceAccountId',
          initialValue: (() => {
            if (pubServiceAccountId) {
              return pubServiceAccountId;
            }
          })(),
        },
        {
          label: 'IC/物理卡号',
          name: 'cardNo',
        },
        {
          label: '服务分类',
          name: 'serviceCategoryId',
          options: modelMapToOption(categoryList),
          initialValue: (() => {
            if (serviceCategoryId) {
              return +serviceCategoryId;
            }
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '卡片状态',
          name: 'cardState',
          options: modelMapToOption(PubServicePrintCardStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务编号',
          name: 'pubServiceId',
          initialValue: pubServiceId,
          defHidden: true,
        },
        {
          label: '服务名称',
          name: 'serviceName',
          defHidden: true,
        },
        {
          label: '服务标签',
          name: 'serviceTag',
          options: modelMapToOption(ServiceTagTypes),
          initialValue: (() => {
            if (serviceTag) {
              return +serviceTag;
            }
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '购买营销中心',
          name: 'buySalesId',
          options: (list || []).map(item => ({
            key: item.id,
            text: item.salesName,
          })),
          initialValue: (() => {
            if (buySalesId) {
              return +buySalesId;
            }
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        usePubAccountId
          ? {
              name: 'pubAccountId',
              initialValue: usePubAccountId,
              // 永远不显示
              hidden: true,
            }
          : {
              label: '会员编号',
              name: 'pubAccountId',
              initialValue: (() => {
                const { pubAccountId } = getPageQuery();
                if (pubAccountId) {
                  return pubAccountId;
                }
              })(),
              // 默认不显示
              defHidden: true,
            },
        !usePubAccountId && {
          label: '会员姓名',
          name: 'realName',
          defHidden: true,
        },
        !usePubAccountId && {
          label: '会员手机号',
          name: 'mobile',
          defHidden: true,
        },
        {
          label: '业务类型',
          name: 'serviceItem',
          options: modelMapToOption(PubServiceObjTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '人员/学员编号',
          name: 'pubStudyId',
          defHidden: true,
        },
        {
          label: '人员/学员姓名',
          name: 'pubStudyRealName',
          defHidden: true,
        },
        {
          label: '人员/学员手机号',
          name: 'pubStudyMobile',
          defHidden: true,
        },
        {
          label: '是否过期',
          name: 'overdue',
          options: [
            {
              key: 1,
              text: '是',
            },
            {
              key: 0,
              text: '否',
            },
          ],
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '服务状态',
          name: 'serviceState',
          mode: 'multiple',
          options: modelMapToOption(ServiceStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '计费状态',
          name: 'analysisCalcState',
          options: modelMapToOption(AnalysisCalcStatus),
          initialValue: (() => {
            if (analysisCalcState) {
              return +analysisCalcState;
            }
          })(),
          type: ItemTypes.Select,
          defHidden: true,
        },
        [
          {
            label: '创建时间(始)',
            name: 'createTime',
            placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间(止)',
            name: 'endTime',
            placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '计费日期（始）',
            name: 'analysisCalcStartDate',
            placeholder: '开始',
            initialValue: (() => {
              if ((salesIds || analysisStartDate || analysisEndDate) && analysisStartDate) {
                return moment(+analysisStartDate);
              }
            })(),
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '计费日期（止）',
            name: 'analysisCalcEndDate',
            placeholder: '结束',
            initialValue: (() => {
              if ((salesIds || analysisStartDate || analysisEndDate) && analysisEndDate) {
                return moment(+analysisEndDate);
              }
            })(),
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '激活状态',
          name: 'activationState',
          options: modelMapToOption(ServiceActiveStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '记入方式',
          name: 'analysisWriteMode',
          options: modelMapToOption(AnalysisWriteModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '计费方式',
          name: 'analysisCalcMode',
          options: modelMapToOption(AnalysisCalcModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '课程名称',
          name: 'objectName',
          initialValue: objectName,
          defHidden: true,
        },
        {
          label: '显示顺序',
          name: 'sortRule',
          options: modelMapToOption(SortRules),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '显示数据量',
          name: 'serviceValue',
          options: modelMapToOption(FlowDataAmount),
          type: ItemTypes.Select,
          defHidden: true,
        },
        [
          {
            label: '已用完时间（始）',
            name: 'updateStartTime',
            // placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '已用完时间（止）',
            name: 'updateEndTime',
            // placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '有效日期（始）',
            name: 'startDate',
            placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '有效日期（止）',
            name: 'endDate',
            placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ].filter(Boolean),
    }),
    [usePubAccountId, currentVenue, categoryList]
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '服务流水',
          auth: 'service-flow',
          type: 'primary',
          forRow: 'single',
          action: () => {
            const { pubAccountId, id } = selectedRows[0];
            dispatch(
              push({
                pathname: usePubAccountId ? './serviceflow' : `./info/${pubAccountId}/serviceflow`,
                search: `pubServiceAccountId=${id}`,
              })
            );
          },
        },
        {
          text: '服务明细',
          auth: 'service-detail',
          type: 'primary',
          forRow: 'single',
          action: () => {
            const { id } = selectedRows[0];
            dispatch(
              push({
                pathname: `./recover`,
                search: `pubId=${id}`,
              })
            );
          },
        },
        {
          text: '有效期',
          buttons: [
            {
              text: '调整有效期',
              auth: 'validity',
              // type: 'primary',
              forRow: rows => {
                return rows.length === 1 && rows[0].startDate > 0 && rows[0].endDate > 0 && !canNotEdit(rows[0]);
              },
              action: () => {
                setShowContentMode(1);
              },
            },
            {
              text: '批量延期',
              auth: 'batchdelay',
              forRow: rows => {
                if (rows.length === 0) {
                  return false;
                }
                return rows.every(row => !canNotEdit(row));
              },
              action: () => {
                setShowContentMode(3);
              },
            },
          ],
        },
        {
          text: '调整状态',
          type: 'danger',
          buttons: [
            {
              text: '冻结',
              auth: 'freeze',
              forRow: rows => {
                if (rows.length === 0) {
                  return false;
                }
                return rows.every(row => !canNotEdit(row));
              },
              action: () => {
                setShowContentMode(4);
              },
            },
            {
              text: '解冻',
              auth: 'unfreeze',
              loading: unfreezing,
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                return rows[0].serviceState === ServiceStatus.FREEZE.key;
              },
              action: () => {
                modal.confirm('确认解冻该服务吗？', {
                  onOk: async () => {
                    await dispatch({
                      type: 'pubservice/removeFreeze',
                      payload: {
                        publicServiceAccountId: selectedRows[0].id,
                      },
                    });
                    message.success('解冻成功');
                    table.reload();
                  },
                });
              },
            },
            {
              text: '禁用',
              auth: 'disable',
              // type: 'danger',
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                return rows[0].serviceState === ServiceStatus.Enable.key;
              },
              action: () => {
                setShowContentMode(7);
              },
            },
            {
              text: '启用',
              auth: 'enable',
              // type: 'primary',
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                return rows[0].serviceState === ServiceStatus.Disable.key;
              },
              action: () => {
                modal.confirm('确认启用该服务吗？', {
                  onOk: async () => {
                    await dispatch({
                      type: 'pubservice/disableOrEnableService',
                      payload: {
                        publicServiceAccountId: selectedRows[0].id,
                        enable: true,
                      },
                    });
                    message.success('启用成功');
                    table.reload();
                  },
                });
              },
            },
          ],
        },
        {
          text: '绑定',
          type: 'primary',
          buttons: [
            {
              text: '绑定IC/物理卡',
              auth: 'binding',
              // type: 'primary',
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                return !rows[0].cardNo;
              },
              action: () => {
                setShowContentMode(2);
              },
            },
            {
              text: '制卡',
              auth: 'print-card',
              forRow: rows => {
                if (isMobileDevice() || rows.length !== 1) {
                  return false;
                }
                const { publicServiceStudyList, cardNo, cardState } = rows[0];
                return (
                  publicServiceStudyList?.length === 1 &&
                  !!cardNo &&
                  (cardState === PubServicePrintCardStatus.NotYet.key ||
                    cardState === PubServicePrintCardStatus.Printing.key)
                );
              },
              action: () => {
                levelView.pushView(
                  <LevelView.SubView title="制卡">
                    <PrintCardView data={selectedRows[0]} />
                  </LevelView.SubView>,
                  () => {
                    table.reload();
                  }
                );
              },
            },
            {
              text: '关联人员/学员',
              auth: 'link-contact',
              // type: 'primary',
              disabled: contactLinking,
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                if (canNotEdit(rows[0])) {
                  return false;
                }
                const { cardState } = rows[0];
                return cardState === PubServicePrintCardStatus.NotYet.key;
              },
              action: () => {
                setShowContentMode(5);
              },
            },
            {
              text: '取消关联人员/学员',
              auth: 'link-contact',
              // type: 'danger',
              loading: contactLinking,
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                if (canNotEdit(rows[0])) {
                  return false;
                }
                const { cardState, publicServiceStudyList } = rows[0];
                return (
                  publicServiceStudyList &&
                  publicServiceStudyList.length > 0 &&
                  cardState === PubServicePrintCardStatus.NotYet.key
                );
              },
              action: async () => {
                const { id } = selectedRows[0];
                modal.confirm('确认取消关联人员吗？', {
                  onOk: async () => {
                    await dispatch({
                      type: 'pubservice/linkStudy',
                      payload: {
                        pubServiceAccountId: id,
                        // pubStudyId: contactSelectRows[0].id,
                      },
                    });
                    message.success('取消关联成功');
                    table.reload();
                  },
                });
              },
            },
            {
              text: '绑定课程',
              auth: 'link-course',
              // type: 'primary',
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                if (canNotEdit(rows[0])) {
                  return false;
                }
                return (rows[0].pubServiceDataList || []).some(
                  item => item.serviceObj === PubServiceObjTypes.Course.key
                );
              },
              action: () => {
                setCourseScheduleVisible(true);
              },
            },
            {
              text: '取消绑定课程',
              auth: 'link-course',
              // type: 'danger',
              loading: contactLinking,
              forRow: rows => {
                if (rows.length !== 1) {
                  return false;
                }
                if (canNotEdit(rows[0])) {
                  return false;
                }
                return (rows[0].pubServiceDataList || []).some(
                  item => item.serviceObj === PubServiceObjTypes.Course.key && item.courseList?.length > 0
                );
              },
              action: async () => {
                const { id } = selectedRows[0];
                modal.confirm('确认取消绑定课程吗？', {
                  onOk: async () => {
                    await dispatch({
                      type: 'pubcourse/saveLinkCourseCycle',
                      payload: {
                        pubServiceAccountId: id,
                        // 不给值
                        // courseIds: selectedRows.map(item => item.courseId),
                      },
                    });
                    message.success('取消绑定成功');
                    table.reload();
                  },
                });
              },
            },
            {
              auth: 'edit-rank',
              text: '调整验证顺序',
              forRow: 'single',
              action() {
                setRankEditVisible(true);
              },
            },
          ],
        },
        {
          text: '结费',
          type: 'danger',
          buttons: [
            {
              text: '服务计费结算', // 售后
              // type: 'danger',
              auth: 'analysis-checkout-sold',
              loading: checkouting,
              forRow: rows => {
                if (rows.length === 0) {
                  return false;
                }
                return rows.every(row => !canNotEdit(row) && row.analysisCalcState !== AnalysisCalcStatus.Done.key);
              },
              action: () => {
                modal.confirm(
                  '您确认要全部结算计费此服务吗？结算后此服务将全额计费到总计费金额并计入统计；剩余和消费的（值、计费金额）不变！',
                  {
                    onOk: async () => {
                      await dispatch({
                        type: 'pubservice/analysisCheckoutForSold',
                        payload: selectedRows.map(item => item.id),
                      });
                      table.reload();
                    },
                  }
                );
              },
            },
            {
              // type: 'danger',
              auth: 'withdraw',
              text: '退款折现',
              forRow: rows => {
                return rows.length === 1 && !canNotEdit(rows[0]);
              },
              action: () => {
                setShowContentMode(6);
              },
            },
            {
              // type: 'danger',
              auth: 'withdraw-to-account',
              text: '转结至账户',
              forRow: rows => {
                return (
                  rows.length === 1 && !(canNotEdit(rows[0]) || rows[0].serviceState === ServiceStatus.WITHDRAW.key)
                );
              },
              action: () => {
                setShowContentMode(8);
              },
            },
          ],
        },
        {
          auth: 'go-class',
          text: '去上课',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { serviceItemList, serviceUnit, serviceState, endDate, surplusValue } = rows[0];
            return (
              serviceItemList[0] === PubServiceObjTypes.Course.value &&
              serviceUnit === PubServiceUnitTypes.CLASS_TIME.key &&
              serviceState === ServiceStatus.Enable.key &&
              (endDate === null || clearHMS(endDate).add('1', 'days').valueOf() >= Date.now()) &&
              surplusValue > 0
            );
          },
          action: () => {
            const { pubServiceDataList } = selectedRows[0];
            dispatch(
              push({
                pathname: `/basic/course/sell/list`,
                search: `courseId=${pubServiceDataList[0].courseList[0].courseId}`,
              })
            );
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [selectedRows, checkouting, unfreezing, contactLinking]
  );

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleSuccess = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const handleAdjustFormSubmit = useCallback(() => {
    message.success('保存成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleICCardBingdingFormSubmit = useCallback(() => {
    message.success('绑定成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleBatchDelayFormSubmit = useCallback(() => {
    message.success('延期成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleFreezeFormSubmit = useCallback(() => {
    message.success('冻结成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleLinkFormSubmit = useCallback(() => {
    message.success('关联成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleWithdraw = useCallback(() => {
    cancelContent();
    dispatch(push(usePubAccountId ? './dealflow' : `./info/${selectedRows[0].pubAccountId}/dealflow`));
  }, [handleSuccess, usePubAccountId, selectedRows]);

  const handleWithdrawFormSubmit = useCallback(() => {
    message.success('折现成功');
    handleWithdraw();
  }, [handleWithdraw]);

  const handleWithdrawToAccountFormSubmit = useCallback(() => {
    message.success('转结成功');
    handleWithdraw();
  }, [handleWithdraw]);

  const handleLinkCourseSubmit = useCallback(() => {
    message.success('关联成功');
    handleSuccess();
  }, [handleSuccess]);

  const handleDisabled = useCallback(() => {
    message.success('禁用成功');
    handleSuccess();
  }, [handleSuccess]);

  const onSelectedChange = useCallback(
    (_, rows) => {
      cancelContent(rows == null || rows.length === 0 ? null : showContentMode);
      setSelectedRows(rows);
    },
    [showContentMode]
  );

  return (
    <LevelView ref={setLevelView}>
      <Card bordered={false}>
        <Datatable
          select="multi"
          onSelectedChange={onSelectedChange}
          url="/publicServiceAccount/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
          onInit={setTable}
          content={(() => {
            switch (showContentMode) {
              case 1:
                return <UpdateContent cancel={cancelContent} sure={handleAdjustFormSubmit} />;
              case 2:
                return (
                  <BindingSimpleContent
                    cancel={cancelContent}
                    userId={selectedRows[0].pubAccountId}
                    relType={RelTypes.PUBSERVICE_ACCOUNT.key}
                    sure={handleICCardBingdingFormSubmit}
                  />
                );
              case 3:
                return <BatchDelayContent cancel={cancelContent} sure={handleBatchDelayFormSubmit} />;
              case 4:
                return <FreezeContent cancel={cancelContent} sure={handleFreezeFormSubmit} />;
              case 5:
                return <LinkContact cancel={cancelContent} sure={handleLinkFormSubmit} />;
              case 6:
                return (
                  <WithdrawContent cancel={cancelContent} sure={handleWithdrawFormSubmit} chargeAmount={chargeAmount} />
                );
              case 7:
                return <DisableStateContent cancel={cancelContent} sure={handleDisabled} />;
              case 8:
                return (
                  <WithdrawToAccountContent
                    cancel={cancelContent}
                    sure={handleWithdrawToAccountFormSubmit}
                    chargeAmount={chargeAmount}
                  />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
      <LinkCourseScheduleModal
        visible={courseScheduleVisible}
        onVisibleChange={setCourseScheduleVisible}
        data={selectedRows?.[0]}
        onOk={handleLinkCourseSubmit}
      />
      <RankEditModal
        visible={rankEditVisible}
        onVisibleChange={setRankEditVisible}
        data={selectedRows?.[0]}
        onOk={() => {
          message.success('修改成功');
          handleSuccess();
        }}
      />
    </LevelView>
  );
};
