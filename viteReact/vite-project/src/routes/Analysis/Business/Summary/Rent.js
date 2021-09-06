import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import MarginBar from '@/components/MarginBar';
import { formatModel, formatMoney } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

function AnalysisBusinessSummaryRent() {
  const [formNode, setFormNode] = useState();
  const { LeaseTypes } = useSelector(state => state.rent);
  const { ProfessionTypes } = useSelector(state => state.venue);

  const columns = useMemo(
    () => [
      {
        title: '租赁配置编号',
        dataIndex: 'id',
        width: 110,
      },
      {
        title: '租赁类型',
        dataIndex: 'leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 90,
      },
      {
        title: '名称',
        dataIndex: 'groupName',
        width: 110,
      },
      {
        title: '租赁组别',
        dataIndex: 'groupId',
        width: 90,
      },
      {
        title: '押金单价',
        dataIndex: 'depositAmount',
        render: value => formatMoney(value),
      },
      {
        title: '租金单价',
        dataIndex: 'rentalAmount',
        render: value => formatMoney(value),
      },
      {
        title: '总押金',
        dataIndex: 'dayDepositAmount',
        render: value => formatMoney(value),
      },
      {
        title: '总租金',
        dataIndex: 'dayRentalAmount',
        render: value => formatMoney(value),
      },
      {
        title: '课程单价',
        dataIndex: 'unitPrice',
        render: value => formatMoney(value),
        width: 90,
      },
      {
        title: '使用中',
        dataIndex: 'currentUsedNum',
        width: 110,
      },
      {
        title: '已清柜',
        dataIndex: 'dayUsedNum',
        width: 110,
      },
      {
        title: '可用',
        dataIndex: 'currentAvaliableNum',
        width: 110,
      },
      {
        title: '项目',
        dataIndex: 'professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 80,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 150,
      },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      getContainer: () => formNode,
      fields: [
        {
          label: '营销中心',
          placeholder: '默认全部营销中心',
          name: 'salesIds',
          mode: 'multiple',
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '租赁类型',
          name: 'leaseType',
          placeholder: '请选择',
          options: modelMapToOption(LeaseTypes),
          type: ItemTypes.Select,
        },
        {
          label: '组别',
          name: 'groupId',
          placeholder: '请选择',
          type: ItemTypes.Select,
        },
        [
          {
            name: 'presetDate',
            // initialValue: 2,
            type: ItemTypes.DatePickerRangePreset,
            defHidden: true,
          },
          {
            label: '统计开始日期',
            name: 'analysisStartDate',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '统计结束日期',
            name: 'analysisEndDate',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    }),
    [formNode]
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'export-rent',
          btnType: ButtonTypes.Export,
        },
      ],
    }),
    []
  );

  return (
    <>
      <MarginBar bottom>
        <Card bordered={false}>
          <div ref={setFormNode} />
        </Card>
      </MarginBar>
      <MarginBar bottom>
        <Card bordered={false}>
          <Datatable
            url="/leaseStatistic/dataList.do"
            bodyScroll={false}
            columns={columns}
            rowKey="id"
            formSearch={formSearch}
            operation={operation}
          />
        </Card>
      </MarginBar>
    </>
  );
}

export default AnalysisBusinessSummaryRent;
