import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Card } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import PlatformLockedCancelModal from '@/components/Modal/PlatformLockedCancelModal';
import { WeekDays1, formatModel, formatDate, formatHM, formatDateTime, formatWeekDay } from '@/utils/format';
import { getPageQuery, modelMapToOption } from '@/utils/utils';

export default () => {
  const dispatch = useDispatch();
  const [cancelVisible, setCancelVisible] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTableInit] = useState();
  const { PlatformLockStatus } = useSelector(state => state.pubplatform);

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '锁场状态',
        dataIndex: 'lockState',
        render: value => formatModel(PlatformLockStatus, value),
        width: 90,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '场地名称',
        dataIndex: 'platformName',
        width: 150,
      },
      {
        title: '锁场日期',
        dataIndex: 'orderDate',
        render: formatDate,
        width: 130,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: formatHM,
        width: 90,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: formatHM,
        width: 90,
      },
      {
        title: '星期/工作日/节假日',
        dataIndex: 'weekDate',
        render: value => formatWeekDay(value, 1),
        width: 150,
      },
      {
        title: '锁场用户名',
        dataIndex: 'pubRealName',
        width: 90,
      },
      {
        title: '用户手机号',
        dataIndex: 'pubMobile',
        width: 130,
      },
      {
        title: '锁场备注',
        dataIndex: 'lockMessage',
        width: 200,
      },
      {
        title: '商家留言',
        dataIndex: 'sellerMessage',
        width: 200,
      },
      {
        title: '取消原因',
        dataIndex: 'cancelMessage',
        width: 200,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 190,
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
        width: 90,
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
          type: ItemTypes.CascaderVenue,
        },
        {
          label: '星期几',
          name: 'weekDate',
          options: WeekDays1.map((item, i) => ({
            key: i,
            text: item,
          })),
          type: ItemTypes.Select,
        },
        {
          label: '锁场配置编号',
          name: 'platformForeverId',
          initialValue: getPageQuery().sportPlatformForeverId,
        },
        {
          label: '锁场状态',
          name: 'lockState',
          options: modelMapToOption(PlatformLockStatus),
          type: ItemTypes.Select,
          defHidden: true,
        },
        {
          label: '锁场备注',
          name: 'lockMessage',
          defHidden: true,
        },
        {
          label: '场地名',
          name: 'platformName',
          defHidden: true,
        },
        {
          label: '用户手机号',
          name: 'pubMobile',
          defHidden: true,
        },
        {
          label: '锁场用户名',
          name: 'pubRealName',
          defHidden: true,
        },
        [
          {
            label: '开始时间',
            name: 'lockStartTime',
            type: ItemTypes.TimePickerRangeStart2,
            defHidden: true,
          },
          {
            label: '结束时间',
            name: 'lockEndTime',
            type: ItemTypes.TimePickerRangeEnd2,
            defHidden: true,
          },
        ],
        [
          {
            label: '创建时间（始）',
            name: 'createStartDate',
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '创建时间（止）',
            name: 'createEndDate',
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        [
          {
            label: '更新时间（始）',
            name: 'modifiedStartDate',
            initialValue: moment(),
            type: ItemTypes.DatePickerRangeStart,
            defHidden: true,
          },
          {
            label: '更新时间（止）',
            name: 'modifiedEndDate',
            initialValue: moment(),
            type: ItemTypes.DatePickerRangeEnd,
            defHidden: true,
          },
        ],
        {
          label: '更新人',
          name: 'updateRealName',
          defHidden: true,
        },
        {
          label: '创建人',
          name: 'createRealName',
          defHidden: true,
        },
        {
          label: '取消原因',
          name: 'cancelMessage',
          defHidden: true,
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '修改',
          auth: 'edit',
          forRow(rows) {
            return rows.length === 1 && rows[0].lockState === PlatformLockStatus.Locked.key;
          },
          action() {
            dispatch(
              push({
                pathname: '/basic/platform/booking/booking',
                search: `id=${selectedRows[0].platformLockId}&lock=1`,
              })
            );
          },
        },
        {
          text: '取消锁场',
          icon: 'delete',
          auth: 'delete',
          forRow(rows) {
            return rows.length > 0 && rows.every(item => item.lockState === PlatformLockStatus.Locked.key);
          },
          action() {
            setCancelVisible(true);
          },
        },
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
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
          }}
          url="/sportPlatformLock/dataList.do"
          columns={columns}
          rowKey="id"
          formSearch={formSearch}
          operation={operation}
          onInit={setTableInit}
        />
      </Card>
      <PlatformLockedCancelModal
        dispatchData={{
          type: 'pubplatform/removeLockedLogs',
          payload: {
            lockDataIds: (selectedRows || []).map(item => item.id),
          },
        }}
        visible={cancelVisible}
        onVisibleChange={setCancelVisible}
        onOk={() => {
          table.reload();
        }}
      />
    </PageHeaderLayout>
  );
};
