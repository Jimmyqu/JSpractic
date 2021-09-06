import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'antd';
import { useSelector } from 'react-redux';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import DataContent from '@/components/PubServiceCard/DataContent';
import { formatDateTime, formatMoneyLen2, formatModel } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

const overrideSetting = {
  // override
  render: value => value,
};

export default ({ usePubAccountId }) => {
  const { pubServiceAccountId } = getPageQuery();
  const { PubServiceflowTypes, ServiceTagTypes, AnalysisWriteModeTypes } = useSelector(state => state.pubservice);
  const { currentVenue } = useSelector(state => state.venue);
  const [table, setTableInit] = useState();
  const columns = useMemo(
    () => [
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
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '营销中心',
          name: 'salesId',
          initialValue: usePubAccountId ? '' : currentVenue.id,
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '服务编号',
          name: 'pubServiceId',
        },
        {
          label: '服务名称',
          name: 'pubServiceName',
        },
        {
          label: '服务账户编号',
          name: 'pubServiceAccountId',
          initialValue: pubServiceAccountId,
          defHidden: true,
        },
        usePubAccountId
          ? {
              label: '会员账户编号',
              name: 'pubAccountId',
              initialValue: usePubAccountId,
              // 永远不显示
              hidden: true,
            }
          : {
              label: '会员账户编号',
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
        {
          label: '主订单编号',
          name: 'dealId',
          defHidden: true,
        },
        {
          label: '会员手机号',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '服务标签',
          name: 'serviceTag',
          options: modelMapToOption(ServiceTagTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '操作类型',
          name: 'recordTypes',
          mode: 'multiple',
          options: modelMapToOption(PubServiceflowTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '操作信息',
          name: 'descr',
          defHidden: true,
        },
        [
          {
            label: '创建时间(始)',
            name: 'startGmtCreate',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间(止)',
            name: 'endGmtCreate',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '创建人',
          name: 'createRealName',
          defHidden: true,
        },
        {
          label: '业务来源',
          name: 'srvName',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      export: {
        settings: {
          pubServiceAccountId: overrideSetting,
          dealId: overrideSetting,
        },
      },
      buttons: [
        {
          text: '冻结记录',
          action() {
            table.setFieldsValue(
              {
                recordTypes: [PubServiceflowTypes.FROZEN.key, PubServiceflowTypes.UNFROZEN.key],
              },
              table.toSearch
            );
          },
        },
        {
          text: '延期记录',
          action() {
            table.setFieldsValue(
              {
                recordTypes: [PubServiceflowTypes.DELAY.key],
              },
              table.toSearch
            );
          },
        },
        {
          text: '有效期调整记录',
          action() {
            table.setFieldsValue(
              {
                recordTypes: [PubServiceflowTypes.VALID_DATA.key],
              },
              table.toSearch
            );
          },
        },
        {
          text: '转赠记录',
          action() {
            table.setFieldsValue(
              {
                recordTypes: [
                  PubServiceflowTypes.GIVE.key,
                  PubServiceflowTypes.REVICE.key,
                  PubServiceflowTypes.CANCEL.key,
                ],
              },
              table.toSearch
            );
          },
        },
        {
          auth: 'export',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    [table]
  );

  return (
    <Card bordered={false}>
      <Datatable
        url="/pubServiceAccountRecord/dataList.do"
        columns={columns}
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        rowKey="id"
      />
    </Card>
  );
};
