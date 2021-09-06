import { Component } from 'react';
import moment from 'moment';
import { stringify } from 'qs';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import IconFont from '@/components/Icon';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import {
  formatMoneyLen2,
  formatDateTime,
  formatModel,
  formatDate,
  formatHM,
  formatPayWay,
  formatSrvId,
  formatStudyList,
} from '@/utils/format';
import { getPageQuery, modelMapToOption, print } from '@/utils/utils';
import AuthComponent from '@/components/AuthComponent';
import OrderPrint from '@/components/OrderPrint';

@connect(({ venue, pubcourse, pubticket, deal, loading }) => ({
  venue,
  pubcourse,
  pubticket,
  deal,
  printFetching: loading.effects['print/fetch'],
}))
class CourseDeal extends Component {
  /**
   * 生成不同链接效果的 render
   */
  // eslint-disable-next-line react/sort-comp
  genLinkWrapperRender =
    (render = value => value, genQuery = () => {}, isIgnore = () => false) =>
    (...args) => {
      const [, record] = args;
      const v = render(...args);
      if (isIgnore(...args)) {
        return v;
      }
      return (
        <span className="link" onClick={() => this.handleToCourseAttendance(record, genQuery(...args))}>
          {v}
        </span>
      );
    };

  columns = [
    {
      title: '订单编号',
      dataIndex: 'dealCourseId',
      width: 80,
    },
    {
      title: '主订单编号',
      dataIndex: 'dealId',
      width: 90,
    },
    {
      title: '订单状态',
      dataIndex: 'dealState',
      render: value => {
        const {
          pubcourse: { DealStatus },
        } = this.props;
        return (
          <span
            className={classNames({
              link: DealStatus.COURSE_PASS.key === value,
            })}
          >
            {formatModel(DealStatus, value)}
          </span>
        );
      },
      width: 100,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 130,
    },
    {
      title: '项目类型',
      dataIndex: 'professionalId',
      render: value => {
        const {
          venue: { ProfessionTypes },
        } = this.props;
        return formatModel(ProfessionTypes, value);
      },
      width: 130,
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      render: value => {
        const {
          pubcourse: { CourseTypes },
        } = this.props;
        return formatModel(CourseTypes, value);
      },
      width: 150,
    },
    {
      title: '课程日期',
      dataIndex: 'courseDate',
      render: formatDate,
      width: 130,
    },
    {
      title: '开始时间',
      dataIndex: 'courseStartTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '结束时间',
      dataIndex: 'courseEndTime',
      render: formatHM,
      width: 80,
    },
    {
      title: '营销中心',
      dataIndex: 'salesName',
      width: 130,
    },
    {
      title: '场地名称',
      dataIndex: 'courseDataPlatformDTOList',
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
      dataIndex: 'courseDataSysUserDTOList',
      render: value => (value || []).map(({ realName, mobile }) => `${realName}/${mobile}`).join('; '),
      width: 160,
    },
    {
      title: '预约人数',
      dataIndex: 'bookingNum',
      collect: true,
      width: 120,
    },
    {
      title: '会员姓名',
      dataIndex: 'pubRealName',
      width: 120,
    },
    {
      title: '会员手机号',
      dataIndex: 'pubMobile',
      width: 120,
    },
    {
      title: '人员/学员',
      dataIndex: 'dealCourseStudyList',
      render: formatStudyList,
      width: 260,
    },
    {
      title: '课程单价',
      dataIndex: 'unitPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '课程成交单价',
      dataIndex: 'transactionUnitPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 130,
    },
    {
      title: '课程总价',
      dataIndex: 'totalPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 100,
    },
    {
      title: '课程成交总价',
      dataIndex: 'transactionTotalPrice',
      render: formatMoneyLen2,
      collect: true,
      width: 130,
    },
    {
      title: '主订单支付总价',
      dataIndex: 'payInfo.payTotalAmount',
      render: formatMoneyLen2,
      collect: true,
      width: 130,
    },
    {
      title: '支付方式',
      dataIndex: 'payInfo.payList',
      render: (_, record) => formatPayWay(record),
      width: 120,
    },
    {
      title: '支付信息',
      dataIndex: 'payInfo.payDescription',
      width: 180,
    },
    {
      title: '退款信息',
      dataIndex: 'payInfo.refundDescription',
      width: 180,
    },
    {
      title: '订单备注',
      dataIndex: 'userMessage',
      width: 300,
    },
    {
      title: '商家留言',
      dataIndex: 'sellerMessage',
      width: 100,
    },
    {
      title: '取消原因',
      dataIndex: 'cancelMessage',
      width: 120,
    },
    {
      title: '核验状态',
      dataIndex: 'checkState',
      render: this.genLinkWrapperRender(
        value => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return formatModel(CheckStatus, value);
        },
        (value, record) => {
          const { dealId, courseName, courseStartTime, courseEndTime, pubRealName, pubMobile } = record;
          return {
            dealId,
            courseName,
            courseStartTime,
            courseEndTime,
            pubRealName,
            pubMobile,
          };
        },
        value => {
          const {
            pubticket: { CheckStatus },
          } = this.props;
          return value === CheckStatus.UNCHECKED.key;
        }
      ),
      width: 80,
    },
    {
      title: '已到人数',
      dataIndex: 'arriveNum',
      width: 80,
    },
    {
      title: '未到人数',
      dataIndex: 'notArriveNum',
      width: 80,
    },
    {
      title: '签到时间',
      dataIndex: 'signIn',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '更新人',
      dataIndex: 'updateRealName',
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '创建人',
      dataIndex: 'createRealName',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'gmtCreate',
      render: formatDateTime,
      width: 190,
    },
    {
      title: '单位名称',
      dataIndex: 'companyName',
      width: 130,
    },
    {
      title: '订单来源',
      dataIndex: 'srvName',
      width: 100,
    },
    {
      title: '操作终端',
      dataIndex: 'srvId',
      render: formatSrvId,
      width: 100,
    },
  ];

  formSearch = {
    fields: [
      {
        label: '营销中心',
        name: 'salesId',
        initialValue: (() => {
          const { salesId } = getPageQuery();
          if (salesId) {
            return +salesId;
          }
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
      {
        label: '场地名称',
        name: 'platformName',
      },
      [
        {
          label: '课程日期（始）',
          name: 'courseStateDate',
          placeholder: '开始时间',
          initialValue: (() => {
            const { analysisStartDate } = getPageQuery();
            if (analysisStartDate) {
              return moment(+analysisStartDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '课程日期（止）',
          name: 'courseEndDate',
          placeholder: '结束时间',
          initialValue: (() => {
            const { analysisEndDate } = getPageQuery();
            if (analysisEndDate) {
              return moment(+analysisEndDate);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
      [
        {
          label: '开始时间',
          name: 'courseStartTime',
          type: ItemTypes.TimePickerRangeStart2,
          defHidden: true,
        },
        {
          label: '结束时间',
          name: 'courseEndTime',
          type: ItemTypes.TimePickerRangeEnd2,
          defHidden: true,
        },
      ],
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
        label: '会员姓名',
        name: 'pubRealName',
        defHidden: true,
      },
      {
        label: '会员手机号',
        name: 'pubMobile',
        defHidden: true,
      },
      {
        label: '入场人员手机号',
        name: 'pubStudyMobile',
        defHidden: true,
      },
      {
        label: '入场人员姓名',
        name: 'pubStudyRealName',
        defHidden: true,
      },
      {
        label: '课程名称',
        name: 'courseName',
        initialValue: (() => {
          const { courseName } = getPageQuery();
          if (courseName) {
            return courseName;
          }
        })(),
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
      {
        label: '订单状态',
        name: 'dealState',
        mode: 'multiple',
        options: (() => {
          const {
            pubcourse: { DealStatus },
          } = this.props;
          return modelMapToOption(DealStatus);
        })(),
        initialValue: (() => {
          const { dealState } = getPageQuery();
          if (dealState) {
            return dealState
              .split(',')
              .filter(id => id)
              .map(id => +id);
          }
        })(),
        type: ItemTypes.Select,
        defHidden: true,
      },
      {
        label: '课程订单编号',
        name: 'dealCourseId',
        defHidden: true,
      },
      {
        label: '主订单编号',
        name: 'dealId',
        defHidden: true,
      },
      {
        label: '创建人',
        name: 'createRealName',
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
        label: '业务编号',
        name: 'srvId',
        defHidden: true,
      },
      [
        {
          label: '更新时间(始)',
          name: 'updateStartTime',
          placeholder: '开始',
          initialValue: (() => {
            const { updateStartTime } = getPageQuery();
            if (updateStartTime) {
              return moment(+updateStartTime);
            }
          })(),
          type: ItemTypes.DatePickerRangeStart,
          defHidden: true,
        },
        {
          label: '更新时间(止)',
          name: 'updateEndTime',
          placeholder: '结束',
          initialValue: (() => {
            const { updateEndTime } = getPageQuery();
            if (updateEndTime) {
              return moment(+updateEndTime);
            }
          })(),
          type: ItemTypes.DatePickerRangeEnd,
          defHidden: true,
        },
      ],
    ],
  };

  state = {
    selectedRows: undefined,

    dcModalVisible: false,
  };

  operation = () => {
    const {
      dispatch,
      deal: { PayStatus, DealStatus },
      printFetching,
    } = this.props;
    return {
      buttons: [
        {
          text: '去支付',
          icon: <IconFont type="pay" />,
          auth: 'pay',
          type: 'danger',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0];
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        {
          text: '编辑',
          auth: 'edit',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0];
            if (dealState === DealStatus.BOOKING.key) {
              return false;
            }
            return dealPayState === PayStatus.UNPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            const { dealId, dealCourseDataId } = selectedRows[0];
            dispatch(
              push({
                pathname: `/basic/course/sell/${dealCourseDataId}/user`,
                search: `id=${dealId}`,
              })
            );
          },
        },
        {
          text: '取消订单',
          icon: <IconFont type="cancel" />,
          auth: 'remove',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState } = rows[0];
            return !(
              dealState === DealStatus.CANCEL.key ||
              dealState === DealStatus.REFUNDED.key ||
              dealState === DealStatus.BOOKING.key
            );
          },
          action: () => {
            this.handleDealCancelVisibleChange(true);
          },
        },
        {
          text: '改价',
          auth: 'edit-amount-btn',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealState, dealPayState } = rows[0];
            return dealPayState === PayStatus.UNPAID.key || dealState === DealStatus.BOOKING.key;
          },
          action: () => {
            this.goToSummary();
          },
        },
        // {
        //   text: '发货',
        //   auth: 'deliver',
        //   forRow: rows => {
        //     if (rows.length !== 1) {
        //       return false;
        //     }
        //     const dealInfo = rows[0] || {};
        //     const { dealAddress, dealShippingState } = dealInfo.deal || {};
        //     return dealAddress && dealShippingState === DealShippingStatus.WAIT_SEND.key;
        //   },
        //   action: () => {
        //     const { selectedRows } = this.state;
        //     dispatch(
        //       push({
        //         pathname: '/basic/logistics/shipping',
        //         search: `id=${selectedRows[0].deal.id}`,
        //       })
        //     );
        //   },
        // },
        {
          text: '打印',
          icon: <IconFont type="print" />,
          loading: printFetching,
          auth: 'print',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealPayState } = rows[0];
            return dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            print();
          },
        },
        {
          text: '打印预览',
          icon: <IconFont type="print" />,
          auth: 'print',
          forRow: rows => {
            if (rows.length !== 1) {
              return false;
            }
            const { dealPayState } = rows[0];
            return dealPayState === PayStatus.HASPAID.key;
          },
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/print`));
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
        {
          text: '订单详情',
          icon: <IconFont type="menu-deal-main" />,
          forRow: 'single',
          action: () => {
            const { selectedRows } = this.state;
            dispatch(push(`./${selectedRows[0].dealId}/detail`));
          },
        },
      ],
    };
  };

  handleToCourseAttendance = (record, query) => {
    const finalQuery = {
      ...query,
    };

    const { dispatch } = this.props;
    dispatch(
      push({
        pathname: '/basic/course/attendance',
        search: stringify(finalQuery),
      })
    );
  };

  goToSummary = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    const { dealId, dealCourseDataId } = selectedRows[0];
    dispatch(
      push({
        pathname: `/basic/course/sell/${dealCourseDataId}/summary`,
        search: `id=${dealId}`,
      })
    );
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleDoDealCancel = () => {
    this.table.reload();
  };

  handleTableInit = table => {
    this.table = table;
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleBeforeLoadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deal/breakPolling',
    });
  };

  render() {
    const {
      deal: { PayStatus },
    } = this.props;
    const { selectedRows = [], dcModalVisible } = this.state;
    const printId = selectedRows?.[0]?.dealPayState === PayStatus.HASPAID.key ? selectedRows[0]?.dealId : null;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={this.handleSelectedChange}
            url="/dealCourse/dataList.do"
            columns={this.columns}
            rowKey="dealCourseDataId"
            formSearch={this.formSearch}
            operation={this.operation()}
            onInit={this.handleTableInit}
            onBeforeLoadData={this.handleBeforeLoadData}
            // onLoadData={this.handleLoadData}
          />
        </Card>
        <DealCancelModal
          dealId={(selectedRows[0] || {}).dealId}
          visible={dcModalVisible}
          onVisibleChange={this.handleDealCancelVisibleChange}
          onOk={this.handleDoDealCancel}
        />
        {/* //FIXME 选行即加载的方式性能非常不好，但疑似受限于 https://github.com/facebook/react/issues/16734 ，只能先这样 */}
        <AuthComponent auth="print">
          <OrderPrint id={printId} onlyPrint />
        </AuthComponent>
      </PageHeaderLayout>
    );
  }
}

export default CourseDeal;
