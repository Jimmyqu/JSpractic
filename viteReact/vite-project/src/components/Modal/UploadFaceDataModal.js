import { useState } from 'react';
import { Row, Col, Button, Upload } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getPageQuery } from '@/utils/utils';
import MarginBar from '@/components/MarginBar';
import AFRManageModal from '@/components/Modal/AFRManageModal';
import { FileAccept } from '@/utils/upload';
import Modal from '.';

export default function (props) {
  const { type, id } = getPageQuery();
  const { isEdit, onSave, fileId, setModalVisible, ...restProps } = props;

  const [afrManageVisible, setAfrManageVisible] = useState(false);
  const fileSaving = useSelector(state => state.loading.effects['global/saveStreamFile']);
  const fileUpdating = useSelector(state => state.loading.effects['global/updateFaceFile']);
  const dispatch = useDispatch();

  const toUpload = file => {
    setAfrManageVisible(false);
    (isEdit
      ? dispatch({
          type: 'global/updateFaceFile',
          payload: {
            file,
            id: fileId,
          },
        })
      : dispatch({
          type: 'global/saveStreamFile',
          payload: {
            file,
            linkType: type,
            linkId: id,
          },
        })
    ).then(() => {
      setModalVisible(false);
      onSave();
    });
  };

  const uploadProps = {
    name: 'file',
    accept: FileAccept.IMG,
    showUploadList: false,
    disabled: fileSaving || fileUpdating,
    customRequest: info => {
      const { file } = info;
      const reader = new FileReader();
      reader.addEventListener('load', async e => {
        const { result } = e.target || e.srcElement;
        toUpload(result);
      });
      reader.readAsDataURL(file); // 将binary转换成base64
    },
  };

  return (
    <Modal
      title={isEdit ? '修改' : '添加'}
      footer={[
        <Button key="cancel" link="cancel">
          取消
        </Button>,
      ]}
      {...restProps}
    >
      <Row type="flex" justify="center">
        <Col span={6}>
          <MarginBar top bottom>
            <Button
              type="primary"
              block
              disabled={fileSaving || fileUpdating}
              loading={fileSaving || fileUpdating}
              onClick={() => setAfrManageVisible(true)}
            >
              拍照
            </Button>
          </MarginBar>
        </Col>
      </Row>
      <Row type="flex" justify="center">
        <Col span={6}>
          <MarginBar top bottom>
            <Upload {...uploadProps}>
              <Button loading={fileSaving || fileUpdating}>添加本地图片</Button>
            </Upload>
          </MarginBar>
        </Col>
      </Row>
      <AFRManageModal
        visible={afrManageVisible}
        justFile
        type={type}
        id={id}
        onVisibleChange={setAfrManageVisible}
        onOk={({ url }) => toUpload(url)}
      />
    </Modal>
  );
}
