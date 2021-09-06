import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { formatMoneyLen2, formatDateTime, formatModel, formatPayWay } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

function CertDeal() {
  const { ProfessionTypes } = useSelector(state => state.venue);
  const { CertExtStates } = useSelector(state => state.pubserviceuser);
  const certStates = [CertExtStates.CertStart, CertExtStates.PayWait, CertExtStates.Cancel, CertExtStates.Complete];

  const columns = useMemo(
    () => [
      {
        title: '认证订单号',
        dataIndex: 'dealCertData.certConfigId',
        width: 90,
      },
      {
        title: '主订单号',
        dataIndex: 'deal.id',
        width: 90,
      },
      {
        title: '状态',
        dataIndex: 'dealCertData.dealState',
        render: value => formatModel(CertExtStates, value),
        width: 100,
      },
      {
        title: '会员姓名',
        dataIndex: 'dealCertData.publicRealName',
        width: 90,
      },
      {
        title: '手机号',
        dataIndex: 'dealCertData.publicMobile',
        width: 120,
      },
      {
        title: '金额',
        dataIndex: 'dealCertData.certPrice',
        render: formatMoneyLen2,
        width: 120,
      },
      {
        title: '成交金额',
        dataIndex: 'payInfo.payTotalAmount',
        render: formatMoneyLen2,
        width: 120,
      },
      {
        title: '认证名称',
        dataIndex: 'dealCertData.certTitle',
        width: 130,
      },
      {
        title: '专业项目',
        dataIndex: 'dealCertData.professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 90,
      },
      {
        title: '支付方式',
        dataIndex: 'payInfo.payList',
        render: (_, record) => formatPayWay(record),
        width: 90,
      },
      {
        title: '支付信息',
        dataIndex: 'payInfo.payDescription',
        width: 120,
      },
      {
        title: '退款信息',
        dataIndex: 'payInfo.refundDescription',
        width: 120,
      },
      {
        title: '订单备注',
        dataIndex: 'deal.remark',
        width: 250,
      },
      {
        title: '商家留言',
        dataIndex: 'deal.sellerMessage',
        width: 80,
      },
      {
        title: '取消原因',
        dataIndex: 'deal.cancelMessage',
        width: 110,
      },
      {
        title: '支付时间',
        dataIndex: 'payInfo.createTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '更新人',
        dataIndex: 'deal.updateRealName',
        width: 120,
      },
      {
        title: '更新时间',
        dataIndex: 'dealCertData.updateTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'deal.createRealName',
        width: 120,
      },
      {
        title: '创建时间',
        dataIndex: 'dealCertData.createTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '业务来源',
        dataIndex: 'deal.srvName',
        width: 170,
      },
      {
        title: '单位名称',
        dataIndex: 'deal.companyName',
        width: 170,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '主订单号',
          name: 'dealId',
        },
        {
          label: '认证订单号',
          name: 'id',
        },
        {
          label: '认证名称',
          name: 'certTitle',
        },
        {
          label: '专业项目',
          name: 'professionalId',
          options: modelMapToOption(ProfessionTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '会员手机号',
          name: 'publicMobile',
          defHidden: true,
        },
        {
          label: '会员姓名',
          name: 'publicRealName',
          defHidden: true,
        },
        [
          {
            label: '创建时间(始)',
            name: 'createStartTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间(止)',
            name: 'createEndTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '更新时间(始)',
            name: 'updateStartTime',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '更新时间(止)',
            name: 'updateEndTime',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '业务来源编号',
          name: 'srvId',
          defHidden: true,
        },
        {
          label: '订单状态',
          name: 'dealState',
          options: modelMapToOption(certStates),
          type: ItemTypes.Select,
          defHidden: true,
        },
      ],
    }),
    []
  );

  return (
    <PageHeaderLayout>
      <Card bordered={false}>
        <Datatable
          url="/dealCertData/dataList.do"
          columns={columns}
          rowKey={record => record.dealCertData.id}
          formSearch={formSearch}
        />
      </Card>
    </PageHeaderLayout>
  );
}

export default CertDeal;
