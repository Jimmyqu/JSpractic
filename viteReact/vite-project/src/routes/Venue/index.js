import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Datatable from '@/components/Datatable';
import LevelView from '@/components/LevelView';
import { formatHM, formatHomeTown, formatDateTime, formatModel } from '@/utils/format';
import EditContent from './EditContent';
import Theater from './Theater';

export default () => {
  const { VenueTypes, VenueStatus } = useSelector(state => state.venue);

  const [selectedRows, setSelectedRows] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [table, setTableInit] = useState();
  const [levelView, setLevelView] = useState();

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'salesType',
        render: value => formatModel(VenueTypes, value),
        width: 100,
      },
      {
        title: '省',
        dataIndex: 'province',
        render: formatHomeTown,
        width: 100,
      },
      {
        title: '市',
        dataIndex: 'city',
        render: formatHomeTown,
        width: 100,
      },
      {
        title: '区',
        dataIndex: 'district',
        render: formatHomeTown,
        width: 100,
      },
      {
        title: '详细地址',
        dataIndex: 'salesAddress',
        width: 200,
      },
      {
        title: '营业开始时间',
        dataIndex: 'startTime',
        render: formatHM,
        width: 120,
      },
      {
        title: '营业结束时间',
        dataIndex: 'endTime',
        render: formatHM,
        width: 120,
      },
      {
        title: '微信商户号',
        dataIndex: 'wechatPayNo',
        width: 200,
      },
      {
        title: '支付宝帐号',
        dataIndex: 'alipayNo',
        width: 200,
      },
      {
        title: '线上入口',
        dataIndex: 'visitAccess',
        width: 200,
      },
      {
        title: '电话',
        dataIndex: 'salesTel',
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 250,
      },
      {
        title: '状态',
        dataIndex: 'salesState',
        render: value => formatModel(VenueStatus, value),
        width: 100,
      },
      // {
      //   title: '更新人',
      //   dataIndex: 'id',
      //   width: 100,
      // },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 100,
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
          label: '门店名称',
          name: 'salesName',
        },
        {
          label: '编号',
          name: 'id',
        },
        {
          label: '单位名称',
          name: 'companyName',
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'edit',
          text: '修改',
          forRow: 'single',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'theater',
          text: '影剧厅设置',
          type: 'danger',
          forRow: rows => {
            return rows.length === 1 && rows[0].salesType === VenueTypes.CULTURE.key;
          },
          action() {
            levelView.pushView(
              <LevelView.SubView title="影剧厅设置">
                <Theater salesId={selectedRows[0].id} />
              </LevelView.SubView>
              // , () => {
              //   // table.reload();
              // }
            );
          },
        },
      ],
    }),
    [levelView, selectedRows]
  );

  return (
    <PageHeaderLayout>
      <LevelView ref={setLevelView}>
        <Card bordered={false}>
          <Datatable
            select="multi"
            onSelectedChange={(_, rows) => {
              setSelectedRows(rows);
              setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
            }}
            url="/commonSales/storeSales.do"
            columns={columns}
            formSearch={formSearch}
            operation={operation}
            rowKey="id"
            onInit={setTableInit}
            content={(() => {
              switch (showContentMode) {
                case 1:
                  return (
                    <EditContent
                      cancel={() => setShowContentMode(null)}
                      sure={() => {
                        message.success('操作成功');
                        setShowContentMode(null);
                        table.reload();
                      }}
                    />
                  );
                default:
                  return null;
              }
            })()}
          />
        </Card>
      </LevelView>
    </PageHeaderLayout>
  );
};
