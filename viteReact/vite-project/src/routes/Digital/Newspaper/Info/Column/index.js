import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, message } from 'antd';
import Datatable from '@/components/Datatable';
import { getPageQuery } from '@/utils/utils';
import { formatDateHM, formatModel } from '@/utils/format';
import EditContent from './EditContent';

export default function () {
  const dispatch = useDispatch();
  const { PaperConfigurations } = useSelector(state => state.digital);
  const [table, setTableInit] = useState();
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [parentTemplateNames, setParentTemplateNames] = useState([]); // 父级模板列表

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const onSelectedChange = useCallback((_, rows) => {
    setSelectedRows(rows);
    setShowContentMode(rows == null || rows.length === 0 ? null : showContentMode);
  }, []);

  const handleLoadData = list => {
    setParentTemplateNames([
      {
        id: 0,
        templateName: '无',
      },
      ...(list || []).map(item => {
        return {
          id: item.id,
          templateName: item.templateName,
        };
      }),
    ]);
  };

  const templateType = `${PaperConfigurations.VERSION_NAME.key}${PaperConfigurations.COLUMN.key}`;

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'templateName',
        width: 100,
      },
      {
        title: '模板类型',
        dataIndex: 'templateType',
        render: value => formatModel(PaperConfigurations, value),
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 60,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateHM,
        width: 130,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateHM,
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
          label: '名称',
          name: 'templateName',
        },
        {
          label: '媒体名称',
          name: 'mediaName',
          initialValue: (() => {
            const { mediaName } = getPageQuery();
            if (mediaName) {
              return mediaName;
            }
          })(),
        },
      ],
    }),
    []
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'add',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          type: 'primary',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          icon: 'delete',
          forRow: 'multi',
          async action() {
            await dispatch({
              type: 'digital/deletePaperConfig',
              payload: {
                ids: (selectedRows || []).map(item => item.id),
              },
            });
            message.success('删除成功');
            table.reload();
          },
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  return (
    <Card bordered={false}>
      <Datatable
        select="multi"
        url={`/digitalMediaTemplate/dataList.do?templateType=${templateType}`}
        pagination={false}
        columns={columns}
        rowKey="id"
        formSearch={formSearch}
        operation={operation}
        onInit={setTableInit}
        onLoadData={handleLoadData}
        onSelectedChange={onSelectedChange}
        content={(() => {
          switch (showContentMode) {
            case 1:
            case 2:
              return (
                <EditContent
                  isEdit={showContentMode === 2}
                  templateType={templateType}
                  parentTemplateNames={parentTemplateNames}
                  cancel={cancelContent}
                  sure={handleEditOrNewFormSubmit}
                />
              );
            default:
              return null;
          }
        })()}
      />
    </Card>
  );
}
