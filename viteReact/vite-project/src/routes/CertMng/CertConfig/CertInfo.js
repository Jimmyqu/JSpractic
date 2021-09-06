import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { modal } from '@/utils/feedback';
import { formatDateTime, formatBoolean, formatModel } from '@/utils/format';
import EditContent from './CertInfoEditContent';

export default ({ certConfigId }) => {
  const dispatch = useDispatch();
  const deleting = useSelector(state => state.loading.effects['pubserviceuser/delCertInfoByIds']);
  const { CertShowMode } = useSelector(state => state.pubserviceuser);
  const [table, setTableInit] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [showContentMode, setShowContentMode] = useState();

  function cancelContent() {
    setShowContentMode(null);
  }

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '显示名称',
        dataIndex: 'extShowName',
        width: 130,
      },
      {
        title: '认证字段',
        dataIndex: 'extFieldName',
        width: 100,
      },
      {
        title: '下拉项',
        dataIndex: 'extDataTypeValue',
        render: value => (value || []).map(item => item.name).join(','),
        width: 100,
      },
      {
        title: '占位符',
        dataIndex: 'placeholder',
        width: 200,
      },
      // {
      //   title: '字段类型',
      //   dataIndex: 'id',
      //   width: 100,
      // },
      // {
      //   title: '值',
      //   dataIndex: 'id',
      //   width: 100,
      // },
      {
        title: '是否必填',
        dataIndex: 'required',
        render: formatBoolean,
        width: 100,
      },
      {
        title: '手机端是否显示',
        dataIndex: 'showMode',
        render: val => formatModel(CertShowMode, val),
        width: 100,
      },
      {
        title: '支持筛选',
        dataIndex: 'filter',
        render: formatBoolean,
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 100,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 150,
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
        width: 150,
      },
    ],
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'info-add',
          text: '添加',
          disabled: deleting,
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'info-edit',
          text: '修改',
          forRow: 'single',
          disabled: deleting,
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'info-remove',
          type: 'danger',
          text: '删除',
          forRow: 'multi',
          loading: deleting,
          action() {
            modal.confirm('确认删除所选数据吗？', {
              async onOk() {
                await dispatch({
                  type: 'pubserviceuser/delCertInfoByIds',
                  payload: selectedRows.map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
      ],
    }),
    [selectedRows, deleting]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        onSelectedChange={(_, rows) => {
          setSelectedRows(rows);
        }}
        url={`/commonExtConfig/dataList.do?certConfigId=${certConfigId}`}
        columns={columns}
        rowKey="id"
        // formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  edit={showContentMode === 2}
                  certConfigId={certConfigId}
                  cancel={cancelContent}
                  sure={() => {
                    message.success(`${showContentMode === 2 ? '修改' : '添加'}成功`);
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
    </Card>
  );
};
