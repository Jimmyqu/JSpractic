import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, message } from 'antd';
import LevelView from '@/components/LevelView';
import Datatable, { ButtonTypes, ItemTypes } from '@/components/Datatable';
import EllipsisCell from '@/components/EllipsisCell';
import PlatformLockedCancelModal from '@/components/Modal/PlatformLockedCancelModal';
import { WeekDays1, formatDateTime, formatDate, formatHM, formatModel, formatWeekDay } from '@/utils/format';
import UpdateContent from './UpdateContent';
import Add from './Add';

function LockList(props, { pushView }) {
  const [cancelVisible, setCancelVisible] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [forAll, setForAll] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTableInit] = useState();
  const { PlatformLockStatus } = useSelector(state => state.pubplatform);

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const onResume = useCallback(
    success => {
      if (success) {
        table.reload();
      }
    },
    [table]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url="/sportPlatformForeverLock/dataList.do"
        columns={[
          {
            title: '编号',
            dataIndex: 'sportPlatformForeverId',
            render: value => <Link to={`./locklogs?sportPlatformForeverId=${value}`}>{value}</Link>,
            width: 90,
          },
          {
            title: '营销中心',
            dataIndex: 'salesName',
            width: 150,
          },
          {
            title: '场地名称',
            dataIndex: 'sportPlatformList',
            render: value =>
              (value || [])
                .map(
                  item => `${item.parentPlatformName || ''}${item.parentPlatformName ? '-' : ''}${item.platformName}; `
                )
                .join(''),
            width: 150,
          },
          {
            title: '星期/工作日/节假日',
            dataIndex: 'weekDate',
            render: value => formatWeekDay(value, 1),
            width: 150,
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
            title: '开始日期',
            dataIndex: 'startDate',
            render: formatDate,
            width: 130,
          },
          {
            title: '结束日期',
            dataIndex: 'endDate',
            render: formatDate,
            width: 130,
          },
          {
            title: '锁场备注',
            dataIndex: 'userMessage',
            width: 200,
          },
          {
            title: '商家留言',
            dataIndex: 'sellerMessage',
            width: 200,
          },
          {
            title: '取消原因',
            dataIndex: 'updateMessage',
            width: 200,
          },
          {
            title: '锁场结果',
            dataIndex: 'lockResultList',
            render: value => (
              <EllipsisCell>
                {(value || [])
                  .map(
                    ({ orderDate, startTime, endTime, parentPlatformName, platformName, lockState }) => `${formatDate(
                      orderDate
                    )} ${formatHM(startTime)}-${formatHM(endTime)} ${parentPlatformName ? `${parentPlatformName}-` : ''}
                ${platformName} ${formatModel(PlatformLockStatus, lockState)}; `
                  )
                  .join('')}
              </EllipsisCell>
            ),
            width: 200,
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
          // {
          //   title: '更新人',
          //   dataIndex: 'updateRealName',
          //   width: 130,
          // },
          {
            title: '创建人',
            dataIndex: 'createRealName',
            width: 130,
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            render: formatDateTime,
            width: 190,
          },
          {
            title: '创建时间',
            dataIndex: 'createTime',
            render: formatDateTime,
            width: 190,
          },
          {
            title: '单位名称',
            dataIndex: 'companyName',
            width: 130,
          },
        ]}
        rowKey="sportPlatformForeverId"
        formSearch={{
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
            // {
            //   label: '场地名',
            //   name: 'platformName',
            // },
            {
              label: '锁场备注',
              name: 'lockMessage',
              // defHidden: true,
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
                type: ItemTypes.DatePickerRangeStart,
                defHidden: true,
              },
              {
                label: '更新时间（止）',
                name: 'modifiedEndDate',
                type: ItemTypes.DatePickerRangeEnd,
                defHidden: true,
              },
            ],
            // {
            //   label: '更新人',
            //   name: 'updateRealName',
            //   defHidden: true,
            // },
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
        }}
        operation={{
          buttons: [
            {
              text: '添加',
              icon: 'plus',
              auth: 'add',
              action() {
                pushView(
                  <LevelView.SubView title="添加锁场">
                    <Add />
                  </LevelView.SubView>,
                  onResume
                );
              },
            },
            {
              text: '取消锁场',
              icon: 'delete',
              auth: 'delete',
              forRow: 'single',
              action() {
                setForAll(false);
                setCancelVisible(true);
              },
            },
            {
              text: '批量删除',
              icon: 'delete',
              auth: 'delete-all',
              forRow: 'multi',
              action() {
                setForAll(true);
                setCancelVisible(true);
              },
            },
            {
              text: '更新有效期',
              type: 'primary',
              icon: 'edit',
              auth: 'edit',
              forRow: 'single',
              action() {
                setShowContentMode(1);
              },
            },
            {
              auth: 'export',
              btnType: ButtonTypes.Export,
            },
          ],
        }}
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
              return (
                <UpdateContent
                  cancel={cancelContent}
                  sure={() => {
                    message.success('更新成功');
                    cancelContent();
                    table.reload();
                  }}
                />
              );
            default:
              return null;
          }
        })()}
      />
      <PlatformLockedCancelModal
        dispatchData={
          forAll
            ? {
                type: 'pubplatform/deleteFoeverLocked',
                payload: {
                  ids: selectedRows?.map(item => item.sportPlatformForeverId),
                },
              }
            : {
                type: 'pubplatform/removeFoeverLocked',
                payload: {
                  id: selectedRows?.[0]?.sportPlatformForeverId,
                },
              }
        }
        withDateRange={
          forAll || selectedRows.length === 0 ? null : [selectedRows[0].startDate, selectedRows[0].endDate]
        }
        visible={cancelVisible}
        onVisibleChange={setCancelVisible}
        onOk={() => {
          table.reload();
        }}
      />
    </Card>
  );
}

LockList.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default LockList;
