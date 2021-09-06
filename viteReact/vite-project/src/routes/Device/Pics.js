import { useState } from 'react';
import { Card, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';
import Datatable from '@/components/Datatable';
import IconFont from '@/components/Icon';
import Result from '@/components/Result';
import UploadFaceDataModal from '@/components/Modal/UploadFaceDataModal';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formatDateTime } from '@/utils/format';
import { getPageQuery } from '@/utils/utils';
import { modal } from '@/utils/feedback';

export default function () {
  const { type, id } = getPageQuery(); // 获取页面参数
  const [selectedRows, setSelectedRows] = useState([]);
  const [fileId, setFileId] = useState();
  const [table, setTableInit] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fileSaving = useSelector(state => state.loading.effects['global/saveStreamFile']);
  const fileDeleting = useSelector(state => state.loading.effects['global/deleteStreamFileSync']);
  const fileUpdating = useSelector(state => state.loading.effects['global/updateFaceFile']);
  const fileSyncUpdating = useSelector(state => state.loading.effects['global/syncFaceFile']);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    dispatch(goBack());
  };

  const delFile = () => {
    modal.confirm('确认删除照片吗？', {
      onOk: async () => {
        await dispatch({
          type: 'global/deleteStreamFileSync',
          payload: {
            ids: selectedRows.map(({ id: rowId }) => rowId),
            linkType: type,
            linkId: id,
          },
        });
        table.reload();
      },
    });
  };

  const updateFile = () => {
    modal.confirm('确认同步更新照片吗？', {
      onOk: async () => {
        await dispatch({
          type: 'global/syncFaceFile',
          payload: {
            linkType: type,
            linkId: id,
          },
        });
      },
    });
  };

  return (
    <PageHeaderLayout title="认证图片">
      <Card bordered={false}>
        {type == null || id == null ? (
          <Result
            type="error"
            title="错误"
            description="本功能不支持从菜单直接访问，请从会员信息或者联系人管理处进入"
            actions={
              <Button type="primary" onClick={handleGoBack}>
                返回
              </Button>
            }
          />
        ) : (
          <Datatable
            select="multi"
            onSelectedChange={(_, rows) => {
              setSelectedRows(rows);
            }}
            url={`/iotFaceData/faceDataList.do?linkType=${type}&linkId=${id}`}
            columns={[
              {
                title: '编号',
                dataIndex: 'id',
                width: 100,
              },
              {
                title: '认证图片',
                dataIndex: 'faceUrl',
                render: value => <img src={value} alt="认证图片" style={{ width: '50px' }} />,
                width: 100,
              },
              {
                title: '姓名',
                dataIndex: 'realName',
                width: 150,
              },
              {
                title: '是否认证',
                dataIndex: 'mobile',
                render: value => {
                  if (value) {
                    return '是';
                  }
                  return '否';
                },
                width: 100,
              },
              {
                title: '排序',
                dataIndex: 'weight',
                width: 100,
              },
              {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                render: formatDateTime,
                width: 100,
              },
              {
                title: '所属单位',
                dataIndex: 'companyName',
                width: 100,
              },
            ]}
            rowKey="id"
            onInit={setTableInit}
            operation={{
              buttons: [
                {
                  auth: 'add',
                  text: '重新认证',
                  icon: 'plus',
                  disabled: fileSaving || fileUpdating || fileDeleting || fileSyncUpdating,
                  loading: fileSaving,
                  action: () => {
                    setModalVisible(!modalVisible);
                    setIsEdit(false);
                  },
                },
                {
                  text: '修改',
                  icon: <IconFont type="editor" />,
                  auth: 'edit',
                  disabled: fileSaving || fileUpdating || fileDeleting || fileSyncUpdating,
                  loading: fileUpdating,
                  forRow: 'single',
                  action: () => {
                    setModalVisible(!modalVisible);
                    setIsEdit(true);
                    setFileId(selectedRows[0].id);
                  },
                },
                {
                  text: '删除',
                  icon: <IconFont type="cancel" />,
                  auth: 'remove',
                  disabled: fileSaving || fileUpdating || fileDeleting || fileSyncUpdating,
                  loading: fileDeleting,
                  forRow: rows => {
                    return rows.length > 0;
                  },
                  action: () => {
                    delFile();
                  },
                },
                {
                  text: '同步更新',
                  type: 'primary',
                  auth: 'syncUpdate',
                  disabled: fileSaving || fileUpdating || fileDeleting || fileSyncUpdating,
                  loading: fileSyncUpdating,
                  action: () => {
                    updateFile();
                  },
                },
              ],
            }}
          />
        )}
      </Card>
      <UploadFaceDataModal
        fileId={fileId}
        onSave={() => {
          table.reload();
        }}
        isEdit={isEdit}
        visible={modalVisible}
        setModalVisible={setModalVisible}
        onCancel={() => setModalVisible(!modalVisible)}
      />
    </PageHeaderLayout>
  );
}
