import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import LevelView from '@/components/LevelView';
import { formatBoolean, formatDateTime, formatModel } from '@/utils/format';
import EditContent from './EditContent';
import SeatCategory from './SeatCategory';
import SeatAreaMap from './SeatAreaMap';
import Seat from './Seat';
import SeatMatrix from './SeatMatrix';

function Theater({ salesId }, { pushView }) {
  const dispatch = useDispatch();
  const CultureTypes = useSelector(state => state.venue.CultureTypes);
  const [selectedRows, setSelectedRows] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [table, setTableInit] = useState();

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 90,
      },
      {
        title: '场地名称',
        dataIndex: 'platformName',
        width: 150,
      },
      {
        title: '场地备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'platformType',
        render: value => formatModel(CultureTypes, value),
        width: 150,
      },
      {
        title: '是否开放显示',
        dataIndex: 'platformOpen',
        render: formatBoolean,
        width: 150,
      },
      {
        title: '是否可在线预订',
        dataIndex: 'onlineBooking',
        render: formatBoolean,
        width: 150,
      },
      {
        title: '可容纳人数',
        dataIndex: 'limitPeople',
        width: 150,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 150,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: formatDateTime,
        width: 190,
      },
      {
        title: '创建单位',
        dataIndex: 'companyName',
        width: 150,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add-theater',
          text: '添加',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit-theater',
          text: '修改',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'del-theater',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          action() {
            modal.confirm('您确认要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'venue/delTheaterSettingByIds',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'seat-category-theater',
          text: '设置座位分类',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="座位分类">
                <SeatCategory salesId={salesId} dataId={selectedRows[0].id} />
              </LevelView.SubView>
              // , () => {
              //   // table.reload();
              // }
            );
          },
        },
        {
          auth: 'seat-list-theater',
          text: '座位列表',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="座位列表">
                <Seat salesId={salesId} dataId={selectedRows[0].id} />
              </LevelView.SubView>
              // , () => {
              //   // table.reload();
              // }
            );
          },
        },
        {
          auth: 'seat-matrix-theater',
          text: '座位矩阵',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="座位矩阵">
                <SeatMatrix salesId={salesId} data={selectedRows[0]} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
        {
          auth: 'seat-map-theater',
          text: '座位平面图',
          forRow: 'single',
          action() {
            pushView(
              <LevelView.SubView title="座位平面图">
                <SeatAreaMap salesId={salesId} dataId={selectedRows[0].id} />
              </LevelView.SubView>
              // , () => {
              //   // table.reload();
              // }
            );
          },
        },
      ],
    }),
    [selectedRows]
  );

  const cancel = () => setShowContentMode(null);
  const sure = () => {
    message.success('操作成功');
    setShowContentMode(null);
    table.reload();
  };

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
          setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
        }}
        url={`/culturePlatform/culturePlatformList.do?salesId=${salesId}`}
        columns={columns}
        // formSearch={formSearch}
        operation={operation}
        rowKey="id"
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return <EditContent salesId={salesId} edit={showContentMode === 2} cancel={cancel} sure={sure} />;
            default:
              return null;
          }
        })()}
      />
    </Card>
  );
}

Theater.contextTypes = {
  pushView: PropTypes.func,
  popView: PropTypes.func,
};

export default Theater;
