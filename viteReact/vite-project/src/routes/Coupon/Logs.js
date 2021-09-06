import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import { formatModel, formatSrvId, formatDateTime, formatMoneyLen2 } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

export default () => {
  const { VerifyActionTypes, IssueTypes } = useSelector(state => state.coupon);
  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '操作',
        dataIndex: 'codeAction',
        render: value => formatModel(VerifyActionTypes, value),
        width: 90,
      },
      {
        title: '优惠码',
        dataIndex: 'couponCode',
        width: 300,
      },
      {
        title: '优惠码/券金额',
        dataIndex: 'couponPrice',
        render: formatMoneyLen2,
        collect: true,
        width: 130,
      },
      {
        title: '优惠码/券名称',
        dataIndex: 'couponName',
        width: 130,
      },
      {
        title: '商户消费订单号',
        dataIndex: 'consumeDealId',
        width: 130,
      },
      {
        title: '消费商户号',
        dataIndex: 'checkWechatPayNo',
        width: 130,
      },
      {
        title: '消费营销中心',
        dataIndex: 'checkSalesName',
        width: 130,
      },
      {
        title: '消费总金额',
        dataIndex: 'consumeTotalPrice',
        render: formatMoneyLen2,
        collect: true,
        width: 100,
      },
      {
        title: '消费内容',
        dataIndex: 'consumeContent',
        width: 200,
      },
      {
        title: '优惠码配置',
        dataIndex: 'codeConfigId',
        width: 100,
      },
      {
        title: '发行类型',
        dataIndex: 'issueType',
        render: value => formatModel(IssueTypes, value),
        width: 100,
      },
      {
        title: '发行商户号',
        dataIndex: 'issueWechatPayNo',
        width: 90,
      },
      {
        title: '微信优惠券名称',
        dataIndex: 'issueWechatStockName',
        width: 130,
      },
      {
        title: '微信优惠券批次号',
        dataIndex: 'issueWechatStockId',
        width: 130,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 300,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 130,
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
        title: '发行单位',
        dataIndex: 'issueCompanyName',
        width: 130,
      },
      {
        title: '操作终端',
        dataIndex: 'srvId',
        render: formatSrvId,
        width: 100,
      },
      {
        title: '业务名称',
        dataIndex: 'srvName',
        width: 130,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 130,
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
          name: 'codeAction',
          options: modelMapToOption(VerifyActionTypes),
          type: ItemTypes.Select,
        },
        {
          label: '优惠码/券名称',
          name: 'couponName',
        },
        {
          label: '优惠码/券金额',
          name: 'couponPrice',
          defHidden: true,
        },
        {
          label: '消费备注',
          name: 'descr',
          defHidden: true,
        },
        {
          label: '核验单位',
          name: 'companyName',
          defHidden: true,
        },
        {
          label: '消费营销中心',
          name: 'checkSalesName',
          defHidden: true,
        },
        {
          label: '消费商户号',
          name: 'checkWechatPayNo',
          defHidden: true,
        },
        {
          label: '微信优惠券批次号',
          name: 'issueWechatStockId',
          defHidden: true,
        },
        {
          label: '创建人',
          name: 'createUserNme',
          defHidden: true,
        },
        [
          {
            label: '操作时间(始)',
            name: 'startDateValue',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '操作时间(止)',
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
          url="/couponCodeLog/dataList.do"
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
