import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, message, Row, Upload, Button, Icon, Col } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import Modal from '@/components/Modal';
import { formatModel, formatDateTime } from '@/utils/format';
import { modelMapToOption, CDN_STATIC_HOST } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import { FileAccept } from '@/utils/upload';
import GroupView from './Group';
import PriceView from './Price';
import EditContent from './EditContent';
import styles from './index.less';

function ListIndex() {
  const [showContentMode, setShowContentMode] = useState();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [levelView, setLevelView] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [table, setTableInit] = useState();
  const [fileList, setFileList] = useState([]);
  const [groupList, setGroupList] = useState();
  const { ProfessionTypes } = useSelector(state => state.venue);
  const { LeaseTypes, RentStates } = useSelector(state => state.rent);
  const docFileUploading = useSelector(state => state.loading.effects['rent/leaseBatchImport']);
  const dispatch = useDispatch();

  const fetchGroupList = useCallback(
    (setter = setGroupList, onlyFirstLevel) => {
      dispatch({
        type: 'rent/queryLeaseGroupList',
        payload: onlyFirstLevel
          ? {
              parentId: 0,
            }
          : null,
      }).then(list => {
        setter(
          list?.reduce((prev, current) => {
            // 租赁分组最多支持两级，服务端按无限级实现的
            const { children, ...item } = current;
            return [
              ...prev,
              item,
              ...(onlyFirstLevel
                ? []
                : (children || []).map(({ children: c, ...subItem }) => ({
                    ...subItem,
                    groupName: `${item.groupName}-${subItem.groupName}`,
                  }))),
            ];
          }, [])
        );
      });
    },
    [setGroupList]
  );

  useEffect(() => {
    fetchGroupList(setGroupList);
  }, []);

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

  const columns = useMemo(
    () => [
      {
        title: '编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'projectName',
        width: 150,
      },
      {
        title: '卡号',
        dataIndex: 'projectNumber',
        width: 150,
      },
      {
        title: '单位',
        dataIndex: 'projectUnit',
        width: 60,
      },
      {
        title: '租赁类型',
        dataIndex: 'leaseType',
        render: value => formatModel(LeaseTypes, value),
        width: 90,
      },
      {
        title: '营销中心',
        dataIndex: 'salesName',
        width: 150,
      },
      {
        title: '专业项目',
        dataIndex: 'professionalId',
        render: value => formatModel(ProfessionTypes, value),
        width: 80,
      },
      {
        title: '租赁分组',
        dataIndex: 'groupName',
        width: 130,
      },
      {
        title: '价格分组名称',
        dataIndex: 'priceGroupName',
        width: 130,
      },
      // {
      //   title: '租赁配置',
      //   dataIndex: 'leaseType',
      //   render: value => formatModel(LeaseTypes, value),
      //   width: 90,
      // },
      {
        title: '备注',
        dataIndex: 'descr',
        width: 150,
      },
      {
        title: '当前状态',
        dataIndex: 'currentState',
        render: value => formatModel(RentStates, value),
        width: 90,
      },
      {
        title: '排序',
        dataIndex: 'ranks',
        width: 70,
      },
      {
        title: '更新人',
        dataIndex: 'updateRealName',
        width: 90,
      },
      {
        title: '更新时间',
        dataIndex: 'gmtModified',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建人',
        dataIndex: 'createRealName',
        width: 90,
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        render: formatDateTime,
        width: 170,
      },
      {
        title: '创建单位',
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
          label: '租赁类型',
          name: 'leaseType',
          placeholder: '请选择',
          options: modelMapToOption(LeaseTypes),
          type: ItemTypes.Select,
        },
        {
          label: '名称',
          name: 'projectName',
        },
        {
          label: '卡号',
          name: 'projectNumber',
        },
        {
          label: '组别',
          name: 'groupId',
          placeholder: '请选择',
          options: groupList?.map(item => ({
            key: item.id,
            text: item.groupName,
          })),
          type: ItemTypes.Select,
          defHidden: true,
        },
        // {
        //   label: '在线预订',
        //   name: 'orderState',
        //   placeholder: '请选择',
        //   options: modelMapToOption(OnlineOrderStates),
        //   type: ItemTypes.Select,
        //   defHidden: true,
        // },
        {
          label: '状态',
          name: 'currentState',
          placeholder: '请选择',
          options: modelMapToOption(RentStates),
          type: ItemTypes.Select,
          defHidden: true,
        },
      ],
    }),
    [groupList]
  );

  const operation = useMemo(
    () => ({
      buttons: [
        {
          auth: 'edit',
          text: '添加',
          icon: 'plus',
          action() {
            setShowContentMode(1);
          },
        },
        {
          auth: 'edit',
          text: '修改',
          icon: 'edit',
          forRow: 'single',
          action() {
            setShowContentMode(2);
          },
        },
        {
          auth: 'remove',
          text: '删除',
          type: 'danger',
          icon: 'delete',
          forRow: 'multi',
          action() {
            modal.confirm('您确定要删除所选数据吗？', {
              onOk: async () => {
                await dispatch({
                  type: 'rent/deleteLeaseProject',
                  payload: (selectedRows || []).map(item => item.id),
                });
                message.success('删除成功');
                table.reload();
              },
            });
          },
        },
        {
          auth: 'multi-edit',
          text: '批量修改',
          icon: 'edit',
          forRow: 'multi',
          action() {
            setShowContentMode(3);
          },
        },
        {
          auth: 'upload',
          text: '批量导入',
          icon: 'plus',
          action() {
            setUploadModalVisible(true);
          },
        },
        {
          auth: 'group',
          text: '租赁分组',
          type: 'primary',
          action() {
            levelView.pushView(
              <LevelView.SubView title="租赁分组">
                <GroupView fetchGroupList={fetchGroupList} />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
        {
          auth: 'price',
          text: '价格分组',
          type: 'primary',
          action() {
            levelView.pushView(
              <LevelView.SubView title="价格分组">
                <PriceView />
              </LevelView.SubView>,
              () => {
                table.reload();
              }
            );
          },
        },
      ],
    }),
    [showContentMode, selectedRows, groupList]
  );

  return (
    <PageHeaderLayout>
      <LevelView ref={setLevelView}>
        <Card bordered={false}>
          <Datatable
            select="multi"
            url="/leaseProject/dataList.do"
            columns={columns}
            rowKey="id"
            formSearch={formSearch}
            operation={operation}
            onInit={setTableInit}
            onSelectedChange={onSelectedChange}
            content={(() => {
              switch (showContentMode) {
                case 1:
                case 2:
                case 3:
                  return (
                    <EditContent
                      isEdit={showContentMode === 2}
                      isMultiEdit={showContentMode === 3}
                      cancel={cancelContent}
                      sure={handleEditOrNewFormSubmit}
                      groupList={groupList}
                    />
                  );
                default:
                  return null;
              }
            })()}
          />
        </Card>
        <Modal
          title="批量导入"
          visible={uploadModalVisible}
          onVisibleChange={setUploadModalVisible}
          footer={[
            <Button key="cancel" link="cancel" disabled={docFileUploading}>
              取消
            </Button>,
          ]}
        >
          <Row type="flex" justify="center">
            <Col className="text-center">
              <Upload
                className={styles.uploader}
                accept={FileAccept.DOC}
                fileList={fileList}
                onChange={({ fileList: list }) => {
                  setFileList([...list]);
                }}
                customRequest={({ onSuccess, onError, file }) => {
                  dispatch({
                    type: 'rent/leaseBatchImport',
                    payload: {
                      upFile: file,
                    },
                  })
                    .then(data => {
                      onSuccess(data, file);
                      setUploadModalVisible(false);
                      setFileList([]);
                      message.success('导入成功');
                      table.reload();
                    })
                    .catch(onError);
                }}
                disabled={docFileUploading}
              >
                <div className={styles.uploaderBtn}>
                  <Icon type="plus" />
                </div>
              </Upload>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <a
                href={`${CDN_STATIC_HOST}/template/%E7%A7%9F%E8%B5%81%E9%A1%B9%E7%9B%AE%E5%AF%BC%E5%85%A5%E4%BF%A1%E6%81%AF%E8%A1%A8.xlsx`}
              >
                模板下载
              </a>
            </Col>
          </Row>
        </Modal>
      </LevelView>
    </PageHeaderLayout>
  );
}

export default ListIndex;
