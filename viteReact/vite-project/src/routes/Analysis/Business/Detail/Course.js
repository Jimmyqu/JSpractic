import { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import {
  formatMoney,
  formatColorWrapper,
  formatDateTime,
  formatSrvId,
  formatSubSeq,
  formatPayWayFromList,
  formatModel,
  formatMoneyLen0,
  formatDate,
  formatHM,
  formatTimeDuration,
} from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

@connect(({ venue, deal, pubcourse, analysis }) => ({
  venue,
  deal,
  pubcourse,
  analysis,
}))
class AnalysisBusinessDetailCourse extends Component {
  // eslint-disable-next-line react/sort-comp
  moneyRender = value => formatColorWrapper(formatMoney)(value);

  columns = [
    {
      title: '主订单号',
      dataIndex: 'analysisDeal.dealId',
      width: 100,
    },
    {
      title: '操作类型',
      dataIndex: 'analysisDeal.operationAction',
      render: value => {
        const {
          analysis: { ActionTypes },
        } = this.props;
        return formatModel(ActionTypes, value);
      },
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'analysisCourse.dealState',
      render: value => {
        const {
          pubcourse: { DealStatus },
        } = this.props;
        return formatModel(DealStatus, value);
      },
      width: 100,
    },
    {
      title: '订单类型',
      dataIndex: 'analysisDeal.subDealType',
      render: formatSubSeq,
      width: 100,
    },
    {
      title: '支付状态',
      dataIndex: 'analysisDeal.dealPayState',
      render: value => {
        const {
          deal: { PayStatus },
        } = this.props;
        return formatModel(PayStatus, value);
      },
      width: 100,
    },
    {
      title: '营销中心',
      dataIndex: 'analysisDeal.salesName',
      width: 180,
    },
    {
      title: '项目类型',
      dataIndex: 'analysisCourse.professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 80,
    },
    {
      title: '课程类型',
      dataIndex: 'analysisCourse.courseType',
      render: value => {
        const {
          pubcourse: { CourseTypes },
        } = this.props;
        return formatModel(CourseTypes, value);
      },
      width: 150,
    },
    {
      title: '课程名称',
      dataIndex: 'analysisCourse.courseName',
      width: 200,
    },
    {
      title: '课程日期',
      dataIndex: 'analysisCourse.courseDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '开始时间',
      dataIndex: 'analysisCourse.courseStartTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '结束时间',
      dataIndex: 'analysisCourse.courseEndTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '单节课时长',
      dataIndex: 'analysisCourse.timeCalcOneCourse',
      render: value => formatTimeDuration(value),
      width: 100,
    },
    {
      title: '课时数',
      dataIndex: 'analysisCourse.courseLength',
      collect: true,
      width: 90,
    },
    {
      title: '场地名称',
      dataIndex: 'analysisCourse.courseDataPlatformDTOList',
      render: value =>
        (value || [])
          .map(
            ({ parentPlatformName, platformName }) =>
              `${parentPlatformName || ''}${parentPlatformName ? '-' : ''}${platformName}`
          )
          .join('; '),
      width: 150,
    },
    {
      title: '教职人员',
      dataIndex: 'analysisCourse.courseDataSysUserDTOList',
      render: value => (value || []).map(({ realName, mobile }) => `${realName}/${mobile}`).join('; '),
      width: 160,
    },
    {
      title: '预约人数',
      dataIndex: 'analysisCourse.bookingNum',
      collect: true,
      render: formatColorWrapper(),
      width: 120,
    },
    {
      title: '会员编号',
      dataIndex: 'analysisDeal.publicAccountId',
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
      width: 130,
    },
    {
      title: '人员/学员',
      dataIndex: 'analysisCourse.analysisCourseStudyVOList',
      render: value => (value || []).map(({ realName, mobile }) => `${realName}/${mobile}`).join('; '),
      width: 160,
    },
    {
      title: '课程单价',
      dataIndex: 'analysisCourse.unitPrice',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '课程总价',
      dataIndex: 'analysisCourse.totalPrice',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '课程成交单价',
      dataIndex: 'analysisCourse.transactionUnitPrice',
      render: this.moneyRender,
      collect: true,
      width: 130,
    },
    {
      title: '课程成交总价',
      dataIndex: 'analysisCourse.transactionTotalPrice',
      render: this.moneyRender,
      collect: true,
      width: 130,
    },
    // {
    //   title: '现金流水金额',
    //   dataIndex: 'analysisCourse.cashFlowAmount',
    //   render: this.moneyRender,
    //   collect: true,
    //   width: 120,
    // },
    // {
    //   title: '消费收入金额',
    //   dataIndex: 'analysisCourse.consumeFlowAmount',
    //   render: this.moneyRender,
    //   collect: true,
    //   width: 120,
    // },
    {
      title: '支付方式',
      dataIndex: 'analysisDeal.payNewMode',
      render: formatPayWayFromList,
      width: 120,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT.value;
      })(),
      dataIndex: 'analysisDeal.payWechat',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB.value;
      })(),
      dataIndex: 'analysisDeal.payZfb',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CASH.value;
      })(),
      dataIndex: 'analysisDeal.payCash',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKCARD.value;
      })(),
      dataIndex: 'analysisDeal.payBankCard',
      render: this.moneyRender,
      collect: true,
      width: 90,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.BANKTRANSFER.value;
      })(),
      dataIndex: 'analysisDeal.payBankTransfer',
      render: this.moneyRender,
      collect: true,
      width: 90,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payAccount',
      render: this.moneyRender,
      collect: true,
      width: 100,
    },
    {
      title: '会员服务',
      children: [
        {
          title: '会员服务名称',
          dataIndex: 'analysisPublicService.serviceName',
          width: 150,
        },
        {
          title: '服务账户',
          dataIndex: 'analysisDeal.payServiceAccount',
          render: this.moneyRender,
          collect: true,
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
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
        {
          title: '服务抵扣金额',
          dataIndex: 'analysisDeal.payServiceAccountDiscount',
          render: this.moneyRender,
          collect: true,
          width: 110,
        },
      ],
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.WECHAT_TO_ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payWechatToAccount',
      render: this.moneyRender,
      collect: true,
      width: 140,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.ZFB_TO_ACCOUNT.value;
      })(),
      dataIndex: 'analysisDeal.payZfbToAccount',
      render: this.moneyRender,
      collect: true,
      width: 140,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.CREDIT.value;
      })(),
      dataIndex: 'analysisDeal.payCredit',
      render: this.moneyRender,
      collect: true,
      width: 70,
    },
    {
      title: (() => {
        const {
          deal: { PayWayTypes },
        } = this.props;
        return PayWayTypes.POINTS.value;
      })(),
      dataIndex: 'analysisDeal.payFee',
      render: formatColorWrapper(formatMoneyLen0),
      collect: true,
      width: 60,
    },
    {
      title: '微信商户单号',
      dataIndex: 'analysisDeal.payWechatId',
      width: 230,
    },
    {
      title: '支付宝商家订单号',
      dataIndex: 'analysisDeal.payZfbId',
      width: 220,
    },
    {
      title: '订单备注',
      dataIndex: 'analysisDeal.userMessage',
      width: 100,
    },
    {
      title: '商家留言',
      dataIndex: 'analysisDeal.sellerMessage',
      width: 100,
    },
    // {
    //   title: '备注',
    //   dataIndex: 'analysisDeal.descr',
    // },
    {
      title: '取消原因',
      dataIndex: 'analysisDeal.cancelMessage',
      width: 120,
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
    // {
    //   title: '支付时间',
    //   dataIndex: 'analysisDeal.a',
    //   render: formatDateTime,
    // },
    // {
    //   title: '核销时间',
    //   dataIndex: 'analysisDeal.checkDate',
    //   render: formatDateTime,
    //   width: 150,
    // },
    {
      title: '业务来源',
      dataIndex: 'analysisDeal.srvName',
      width: 130,
    },
    {
      title: '操作终端',
      dataIndex: 'analysisDeal.srvId',
      render: formatSrvId,
      width: 100,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        placeholder: '默认全部营销中心',
        name: 'salesIds',
        mode: 'multiple',
        initialValue: (() => {
          const { type, salesIds, courseId, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } =
            getPageQuery();
          if (type || salesIds || courseId || orderStartDate || orderEndDate || analysisStartDate || analysisEndDate) {
            return (salesIds || '')
              .split(',')
              .filter(id => id)
              .map(id => +id);
          }
          const {
            venue: { currentVenue },
          } = this.props;
          return [currentVenue.id];
        })(),
        type: ItemTypes.CascaderVenue,
      },
      {
        label: '项目类型',
        name: 'professionalId',
        options: (() => {
          const {
            venue: { ProfessionTypes },
          } = this.props;
          return modelMapToOption(ProfessionTypes);
        })(),
        type: ItemTypes.Select,
      },
      [
        {
          name: 'presetDate',
          // initialValue: 2,
          type: ItemTypes.DatePickerRangePreset,
        },
        {
          label: '操作时间（始）',
          name: 'analysisStartDate',
          placeholder: '操作开始时间',
          initialValue: (() => {
            const { type, salesIds, courseId, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } =
              getPageQuery();
            if (
              type ||
              salesIds ||
              courseId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate
            ) {
              if (analysisStartDate) {
                return moment(+analysisStartDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeStart,
        },
        {
          label: '操作时间（止）',
          name: 'analysisEndDate',
          placeholder: '操作结束时间',
          initialValue: (() => {
            const { type, salesIds, courseId, orderStartDate, orderEndDate, analysisStartDate, analysisEndDate } =
              getPageQuery();
            if (
              type ||
              salesIds ||
              courseId ||
              orderStartDate ||
              orderEndDate ||
              analysisStartDate ||
              analysisEndDate
            ) {
              if (analysisEndDate) {
                return moment(+analysisEndDate);
              }
              return;
            }
            return moment();
          })(),
          type: ItemTypes.DatePickerRangeEnd,
        },
      ],
      {
        label: '订单状态',
        name: 'dealState',
        options: (() => {
          const {
            pubcourse: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '支付状态',
        name: 'dealPayState',
        options: (() => {
          const {
            deal: { PayStatus },
          } = this.props;
          return modelMapToOption(PayStatus);
        })(),
        initialValue: (() => {
          const { type } = getPageQuery();
          if (type) {
            const {
              deal: { PayStatus },
              analysis: { ActionTypes },
            } = this.props;
            switch (+type) {
              case ActionTypes.DEAL_CHECKOUT.key:
                return PayStatus.HASPAID.key;
              case ActionTypes.DEAL_CANCEL.key:
                return PayStatus.REFUNDED.key;
              case ActionTypes.DEAL_ADD.key:
                return PayStatus.UNPAID.key;
              default:
            }
          }
        })(),
        type: ItemTypes.Select,
      },
      {
        label: '主订单号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '课程编号',
        name: 'courseId',
        initialValue: (() => {
          const { courseId } = getPageQuery();
          if (courseId) {
            return courseId;
          }
        })(),
        defHidden: true,
      },
      {
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
        defHidden: true,
      },
      [
        {
          label: '课程开始时间',
          name: 'courseStartTime',
          type: ItemTypes.TimePickerRangeStart2,
          defHidden: true,
        },
        {
          label: '课程结束时间',
          name: 'courseEndTime',
          type: ItemTypes.TimePickerRangeEnd2,
          defHidden: true,
        },
      ],
      {
        label: '操作终端',
        name: 'srvType',
        options: (() => {
          const {
            deal: { SrvTypes },
          } = this.props;
          return modelMapToOption(SrvTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '支付方式',
        name: 'payNewModes',
        mode: 'multiple',
        options: (() => {
          const {
            deal: { PayModeTypesWithOutGroup },
          } = this.props;
          return modelMapToOption(PayModeTypesWithOutGroup);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '订单备注',
        name: 'userMessage',
        defHidden: true,
      },
      {
        label: '商家留言',
        name: 'sellerMessage',
        defHidden: true,
      },
      {
        label: '取消原因',
        name: 'cancelMessage',
        defHidden: true,
      },
      {
        label: '教职人员',
        name: 'sysRealName',
        defHidden: true,
      },
      {
        label: '教职人员手机号',
        name: 'sysMobile',
        defHidden: true,
      },
      {
        label: '课程名称',
        name: 'courseName',
        defHidden: true,
      },
      {
        label: '课程类型',
        name: 'courseType',
        options: (() => {
          const {
            pubcourse: { CourseTypes },
          } = this.props;
          return modelMapToOption(CourseTypes);
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
    ],
  };

  operation = {
    buttons: [
      {
        auth: 'export-course',
        btnType: ButtonTypes.Export,
      },
    ],
  };

  render() {
    return (
      <Card bordered={false}>
        <Datatable
          url="/analysis/course/detail.do"
          columns={this.columns}
          rowKey={record => record.analysisCourse.analysisCourseDataId}
          formSearch={this.formSearch}
          operation={this.operation}
          rowSpanByValue={record => `${record.analysisDeal.dealId}-${record.analysisDeal.operationAction}`}
        />
      </Card>
    );
  }
}

export default AnalysisBusinessDetailCourse;
