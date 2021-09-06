import { Button, Row, Col, Upload, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { CDN_STATIC_HOST } from '@/utils/utils';
import { FileAccept } from '@/utils/upload';
import Modal from '@/components/Modal';
import styles from './index.less';

export default function ({
  messagePushConfigId,
  onVisibleChange,
  fetchMessageInfo,
  selectPushType,
  onFail = () => {},
  ...restProps
}) {
  const dispatch = useDispatch();
  const { PushType } = useSelector(state => state.message);
  const docFileUploading = useSelector(state => state.loading.effects['message/excelLoad']);

  const customRequest = ({ onError, file, isForce = false }) => {
    dispatch({
      type: 'message/excelLoad',
      payload: {
        upFile: file,
        messagePushConfigId,
        isForce,
      },
    })
      .then(result => {
        onVisibleChange(false);
        if (result.tips !== 200) {
          onFail({ ...result, onConfirm: () => customRequest({ onError, file, isForce: true }) });
        } else {
          fetchMessageInfo();
        }
      })
      .catch(onError);
  };

  return (
    <>
      <Modal
        title="导入文件"
        onVisibleChange={onVisibleChange}
        {...restProps}
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
              customRequest={customRequest}
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
              href={`${CDN_STATIC_HOST}/template/${
                selectPushType === PushType.ShortMessage.key
                  ? '%E6%B6%88%E6%81%AF%E7%BE%A4%E5%8F%91%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF%E8%A1%A8(%E7%9F%AD%E4%BF%A1).xlsx'
                  : '%E6%B6%88%E6%81%AF%E7%BE%A4%E5%8F%91%E4%BC%9A%E5%91%98%E4%BF%A1%E6%81%AF%E8%A1%A8%20(%E5%BE%AE%E4%BF%A1).xlsx'
              }`}
            >
              模板下载
            </a>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
