import { useState, useCallback, useMemo } from 'react';
import { Card, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { formatDateTime, formatImageUrl, formatModel } from '@/utils/format';
import { modelMapToOption } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import RelevanceBusinessModal from './RelevanceBusinessModal';
import EditContent from './InterestsManageEditContent';

export default function () {
  const [showContentMode, setShowContentMode] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [table, setTableInit] = useState();
  const [interestsVisible, setInterestsVisible] = useState();
  const { BusinessTypes, MemberIntersts, UserStatus } = useSelector(state => state.pubuser);
  const saving = useSelector(state => state.loading.effects['pubuser/saveMemberEquity']);
  const deleting = useSelector(state => state.loading.effects['pubuser/deleteMemberEquity']);
  const dispatch = useDispatch();

  const cancelContent = useCallback(() => {
    setShowContentMode(null);
  }, []);

  const handleEditOrNewFormSubmit = useCallback(() => {
    cancelContent();
    table.reload();
  }, [table]);

  const handleModelVisibleChange = visible => {
    setInterestsVisible(visible);
  };

  const onSure = () => {
    setInterestsVisible(false);
    table.reload();
  };

  const operation = useMemo(
    () => ({
      buttons: [
        {
          text: '添加',
          icon: 'plus',
          disabled: deleting || saving,
          action() {
            setShowContentMode(1);
          },
        },
        {
          text: '编辑',
          type: 'primary',
          icon: 'edit',
          forRow: 'single',
          disabled: deleting || saving,
          action() {
            setShowContentMode(2);
          },
        },
        {
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          loading: deleting,
          disabled: saving,
          async action() {
            modal.confirm('确认删除吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'pubuser/deleteMemberEquity',
                  payload: {
                    id: selectedRows[0].memberLevelEquity.id,
                  },
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          text: '关联业务内容',
          forRow: 'single',
          action() {
            setInterestsVisible(true);
          },
        },
      ],
    }),
    [showContentMode, selectedRows]
  );

  const imgPreviewRender = (obj, alt) => {
    if (obj) {
      return <img src={formatImageUrl(obj, 'album_preview')} alt={alt} className="img-max" />;
    }
    return null;
  };

  const formSearch = useMemo(
    () => ({
      fields: [
        {
          label: '权益名称',
          name: 'equityName',
        },
        {
          label: '权益分类',
          name: 'equityTag',
          options: modelMapToOption(MemberIntersts),
          type: ItemTypes.Select,
        },
        {
          label: '业务数据类型',
          name: 'relType',
          options: modelMapToOption(BusinessTypes),
          type: ItemTypes.Select,
        },
      ],
    }),
    []
  );

  const columns = [
    {
      title: '编号',
      dataIndex: 'memberLevelEquity.id',
      width: 80,
    },
    {
      title: '权益名称',
      dataIndex: 'memberLevelEquity.equityName',
      width: 120,
    },
    {
      title: '权益分类',
      dataIndex: 'memberLevelEquity.equityTag',
      render: value => formatModel(MemberIntersts, value),
      width: 100,
    },
    {
      title: '权益说明',
      dataIndex: 'memberLevelEquity.equityDesc',
      width: 250,
    },
    {
      title: '已拥有状态图',
      dataIndex: 'alreadyPic.url',
      render: value => imgPreviewRender(value, '已拥有状态图'),
      width: 110,
    },
    {
      title: '未拥有状态图',
      dataIndex: 'notHavePic.url',
      render: value => imgPreviewRender(value, '未拥有状态图'),
      width: 110,
    },
    {
      title: '业务数据类型',
      dataIndex: 'memberLevelEquity.relType',
      render: value => formatModel(BusinessTypes, value),
      width: 120,
    },
    {
      title: '业务数据名称',
      dataIndex: 'memberLevelEquity.dataName',
      width: 170,
    },
    {
      title: '业务数据编号',
      dataIndex: 'memberLevelEquity.dataId',
      render: value => value || '',
      width: 110,
    },
    {
      title: '备注',
      dataIndex: 'memberLevelEquity.remark',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'memberLevelEquity.equityState',
      render: value => formatModel(UserStatus, value),
      width: 50,
    },
    {
      title: '排序',
      dataIndex: 'memberLevelEquity.ranks',
      width: 60,
    },
    // {
    //   title: '更新人',
    //   dataIndex: '',
    //   width: 170,
    // },
    {
      title: '更新时间',
      dataIndex: 'memberLevelEquity.gmtModified',
      render: formatDateTime,
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'memberLevelEquity.createRealName',
      width: 130,
    },
    {
      title: '创建时间',
      dataIndex: 'memberLevelEquity.gmtCreate',
      render: formatDateTime,
      width: 150,
    },
    {
      title: '单位名称',
      dataIndex: 'memberLevelEquity.companyName',
      width: 130,
    },
  ];

  return (
    <>
      <Card bordered={false}>
        <Datatable
          url="/memberLevelEquityAction/dataList.do"
          formSearch={formSearch}
          columns={columns}
          rowKey={record => record.memberLevelEquity.id}
          operation={operation}
          select="multi"
          onInit={setTableInit}
          onSelectedChange={(_, rows) => {
            setSelectedRows(rows);
            cancelContent();
          }}
          content={(() => {
            switch (showContentMode) {
              case 1:
              case 2:
                return (
                  <EditContent edit={showContentMode === 2} cancel={cancelContent} sure={handleEditOrNewFormSubmit} />
                );
              default:
                return null;
            }
          })()}
        />
      </Card>
      <RelevanceBusinessModal
        data={selectedRows}
        visible={interestsVisible}
        onVisibleChange={handleModelVisibleChange}
        onOk={onSure}
      />
    </>
  );
}
