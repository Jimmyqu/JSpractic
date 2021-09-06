import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatSrvId, formatMoneyLen2, formatDate, formatModel, encodeMoney } from '@/utils/format';
import { isNumerical, modelMapToOption } from '@/utils/utils';

export default () => {
  const { CouponStatus, IssueModeTypes, IssueTypes } = useSelector(state => state.coupon);
  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '核验状态',
        dataIndex: 'couponState',
        render: value => formatModel(CouponStatus, value),
        width: 100,
      },
      {
        title: '优惠码',
        dataIndex: 'couponCode',
        width: 300,
      },
      {
        title: '核验时间',
        dataIndex: 'checkDataTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '核验人',
        dataIndex: 'checkRealName',
        width: 100,
      },
      {
        title: '核验营销中心',
        dataIndex: 'checkSalesName',
        width: 150,
      },
      {
        title: '核验单位',
        dataIndex: 'checkCompanyName',
        width: 150,
      },
      // {
      //   title: '数量',
      //   dataIndex: 'checkRealName',
      //   width: 100,
      // },
      {
        title: '会员名',
        dataIndex: 'pubRealName',
        width: 100,
      },
      {
        title: '手机号',
        dataIndex: 'pubMobile',
        width: 130,
      },
      {
        title: '微信商户号',
        dataIndex: 'checkWechatPayNo',
        width: 200,
      },
      {
        title: '商户订单号',
        dataIndex: 'consumeDealId',
        width: 100,
      },
      {
        title: '消费金额',
        dataIndex: 'consumeTotalPrice',
        render: formatMoneyLen2,
        collect: true,
        width: 100,
      },
      {
        title: '消费备注',
        dataIndex: 'consumeContent',
        width: 200,
      },
      {
        title: '发行时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '发行方式',
        dataIndex: 'issueMode',
        render: value => formatModel(IssueModeTypes, value),
        width: 100,
      },
      {
        title: '有效期',
        dataIndex: 'startDate',
        render: (value, { endDate }) => {
          return `${formatDate(value)}至${formatDate(endDate)}`;
        },
        width: 200,
      },
      {
        title: '优惠码/券名称',
        dataIndex: 'couponName',
        width: 130,
      },
      {
        title: '优惠码/券金额',
        dataIndex: 'couponPrice',
        render: formatMoneyLen2,
        collect: true,
        width: 130,
      },
      {
        title: '优惠码/券描述',
        dataIndex: 'descr',
        width: 200,
      },
      {
        title: '微信优惠券批次号',
        dataIndex: 'issueWechatStockId',
        width: 200,
      },
      {
        title: '发行类型',
        dataIndex: 'issueType',
        render: value => formatModel(IssueTypes, value),
        width: 100,
      },
      {
        title: '发行单位',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '业务来源',
        dataIndex: 'srvId',
        render: formatSrvId,
        width: 100,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '优惠码',
          name: 'couponCode',
        },
        {
          label: '核验状态',
          name: 'couponState',
          options: modelMapToOption(CouponStatus),
          type: ItemTypes.Select,
        },
        {
          label: '优惠码/券名称',
          name: 'couponName',
        },
        {
          label: '会员名',
          name: 'pubRealName',
          defHidden: true,
        },
        {
          label: '手机号',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '发行类型',
          name: 'issueType',
          options: modelMapToOption(IssueTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '发行方式',
          name: 'issueMode',
          options: modelMapToOption(IssueModeTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '商户订单号',
          name: 'consumeDealId',
          defHidden: true,
        },
        {
          label: '消费备注',
          name: 'consumeContent',
          defHidden: true,
        },
        {
          label: '核验营销中心',
          name: 'checkSalesId',
          type: ItemTypes.CascaderVenue,
          defHidden: true,
        },
        {
          label: '优惠码/券金额',
          name: 'consumeTotalPrice',
          searchFieldRender(val) {
            if (isNumerical(val)) {
              return encodeMoney(+val);
            }
            return val;
          },
          defHidden: true,
        },
        {
          label: '核验人',
          name: 'checkRealName',
          defHidden: true,
        },
        {
          label: '核验单位',
          name: 'checkCompanyName',
          defHidden: true,
        },
        [
          {
            label: '核验日期（始）',
            name: 'startCheckDataValue',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '核验日期（止）',
            name: 'endCheckDataValue',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '有效期（始）',
            name: 'startDateValue',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '有效期（止）',
            name: 'endDateValue',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    []
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          select="multi"
          // onSelectedChange={this.handleSelectedChange}
          url="/couponCodeList/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
          // onInit={this.handleTableInit}
          // onLoadData={this.handleLoadData}
        />
      </Card>
    </PageHeaderLayout>
  );
};
