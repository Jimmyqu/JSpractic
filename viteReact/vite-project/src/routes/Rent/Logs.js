import { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from 'antd';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDateTime, formatModel, formatMoneyLen2 } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';

export default function () {
  const dispatch = useDispatch();
  const [groupList, setGroupList] = useState();
  const { ProfessionTypes } = useSelector(state => state.venue);
  const { LeaseTypes, RefundStatus, RentLogStates } = useSelector(state => state.rent);

  useEffect(() => {
    dispatch({
      type: 'rent/queryLeaseGroupList',
    }).then(list => {
      setGroupList(
        list?.reduce((prev, current) => {
          // 租赁分组最多支持两级，服务端按无限级实现的
          const { children, ...item } = current;
          return [
            ...prev,
            item,
            ...(children || []).map(({ children: c, ...subItem }) => ({
              ...subItem,
              groupName: `${item.groupName}-${subItem.groupName}`,
            })),
          ];
        }, [])
      );
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '数据组',
        dataIndex: 'dataGroup',
        width: 300,
      },
      {
        title: '主订单',
        dataIndex: 'dealId',
        width: 100,
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '租赁项目状态',
        dataIndex: 'dataState',
        render: value => formatModel(RentLogStates, value),
        width: 120,
      },
      {
        title: '租赁类型',
        dataIndex: 'leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 90,
      },
      {
        title: '租赁项目名称',
        dataIndex: 'projectName',
        width: 120,
      },
      {
        title: '分组名称',
        dataIndex: 'groupName',
        width: 100,
      },
      {
        title: '租金',
        dataIndex: 'rentalAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '押金',
        dataIndex: 'depositAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '退还金额',
        dataIndex: 'refundAmount',
        render: formatMoneyLen2,
        width: 100,
      },
      {
        title: '退还时间',
        dataIndex: 'refundDatetime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '退款状态',
        dataIndex: 'refundState',
        render: value => formatModel(RefundStatus, value),
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'projectNum',
        width: 90,
      },
      {
        title: '单位',
        dataIndex: 'projectUnit',
        width: 90,
      },
      {
        title: '价格分组',
        dataIndex: 'priceGroupName',
        width: 150,
      },
      {
        title: '专业',
        dataIndex: 'professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 100,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '会员名',
        dataIndex: 'pubRealName',
        width: 100,
      },
      {
        title: '会员手机号',
        dataIndex: 'pubMobile',
        width: 130,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 250,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 100,
      },
      {
        title: '单位名称',
        dataIndex: 'companyName',
        width: 150,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 100,
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
        width: 100,
      },
      // {
      //   title: '创建单位',
      //   dataIndex: 'id',
      //   width: 100,
      // },
    ],
    []
  );

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '卡号',
          name: 'projectNumber',
        },
        {
          label: '名称',
          name: 'projectName',
        },
        {
          label: '营销中心',
          name: 'salesId',
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '项目',
          name: 'professionalId',
          options: modelMapToOption(ProfessionTypes),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '租赁项目状态',
          name: 'dataState',
          options: modelMapToOption(RentLogStates),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '退款状态',
          name: 'refundState',
          options: modelMapToOption(RefundStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '组别',
          name: 'groupId',
          options: groupList?.map(item => ({
            key: item.id,
            text: item.groupName,
          })),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '姓名',
          name: 'pubRealName',
          defHidden: true,
        },
        {
          label: '会员手机号',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '更新人',
          name: 'updateRealName',
          defHidden: true,
        },
        [
          {
            label: '使用时间(始)',
            name: 'startDateSt',
            placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '使用时间(止)',
            name: 'startDateEt',
            placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '归还时间(始)',
            name: 'endDateSt',
            placeholder: '开始',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '归还时间(止)',
            name: 'endDateEt',
            placeholder: '结束',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
      ],
    }),
    [groupList]
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
          url="/leaseData/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
        />
      </Card>
    </PageHeaderLayout>
  );
}
