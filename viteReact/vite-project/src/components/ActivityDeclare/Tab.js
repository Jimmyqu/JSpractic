import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Row, Col, Button, Upload, Icon, message } from 'antd';
import uniqWith from 'lodash/unionWith';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import { getActiveStep } from '@/components/ActivityDeclare';
import RichTextEditor from '@/components/RichTextEditor';
import { modal } from '@/utils/feedback';
import { genUploadDocCustomRequest, genUploadImgCustomRequest, FileAccept, fileMapper } from '@/utils/upload';
import styles from './index.less';

@connect(({ activity, loading }) => ({
  activity,
  imgFileUploading: loading.effects['global/uploadImgFile'],
  docFileUploading: loading.effects['global/uploadDocFile'],
}))
class ActivityTab extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    const { declareFileItemList, body } = data;
    const files = uniqWith(declareFileItemList || [], (a, b) => a.fileKey === b.fileKey);
    const fileList = files.map(fileMapper);
    this.state = {
      previewVisible: false,
      previewFile: undefined,
      richText: body,
      fileList,
      oldFileList: files,
    };

    // eslint-disable-next-line react/destructuring-assignment
    this.customImgRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });
    // eslint-disable-next-line react/destructuring-assignment
    this.customDocRequest = genUploadDocCustomRequest({ dispatch: this.props.dispatch });
  }

  componentDidMount() {
    const { onInit, dispatch } = this.props;
    if (typeof onInit === 'function') {
      onInit({
        onDataSave: async (afterSaveFn = () => {}, fileChangeCheck = true) => {
          const {
            data,
            activity: { DeclareNodeDataTypes },
          } = this.props;
          const {
            declareCurrentNode: { nodeDataType },
            declareDetail: { id },
          } = data;
          const activeStep = getActiveStep(data);
          const { removeKeys, addKeys, ...rest } = this.getPayloadKeysProps();
          if (
            fileChangeCheck &&
            (nodeDataType === DeclareNodeDataTypes.ALBUM.key || nodeDataType === DeclareNodeDataTypes.FILE.key) &&
            removeKeys.length === 0 &&
            addKeys.length === 0
          ) {
            message.info('无文件内容修改');
            return;
          }
          await dispatch({
            type: 'activity/saveTabData',
            payload: {
              exerciseId: id,
              nodeStep: activeStep,
              removeKeys,
              addKeys,
              ...rest,
            },
          });
          message.success('保存成功');
          this.setState(
            ({ fileList }) => ({
              // oldFileList 只使用了fileKey
              oldFileList: fileList.map(({ response: { fileKey } }) => ({
                fileKey,
              })),
            }),
            afterSaveFn
          );
        },
        onDataSubmit: async () => {
          modal.confirm('确认提交审核吗？', {
            onOk: () => {
              const {
                data,
                activity: { DeclareNodeDataTypes },
              } = this.props;
              const {
                declareCurrentNode: { nodeDataMax, nodeDataMin, nodeDataType },
                declareDetail,
              } = data;
              const { id } = declareDetail;
              const { fileList } = this.state;
              if (nodeDataType === DeclareNodeDataTypes.ALBUM.key || nodeDataType === DeclareNodeDataTypes.FILE.key) {
                if (nodeDataMin > 0 && fileList.length < nodeDataMin) {
                  message.error(`请添加不少于${nodeDataMin}个文件`);
                  return;
                }
                if (nodeDataMax > 0 && fileList.length > nodeDataMax) {
                  message.error(`请添加不多于${nodeDataMax}个文件`);
                  return;
                }
              }
              const activeStep = getActiveStep(data);
              const props = this.getPayloadKeysProps();
              dispatch({
                type: 'activity/submitNode',
                payload: {
                  exerciseId: id,
                  nodeStep: activeStep,
                  ...props,
                },
              }).then(() => {
                message.success('提交成功');
                dispatch(
                  push({
                    pathname: './info',
                    search: `id=${id}&step=${activeStep + 1}&flag=${Date.now()}`,
                  })
                );
              });
            },
          });
        },
      });
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data: nextData } = nextProps;
    const { data: current } = this.props;
    if (nextData !== current) {
      const { declareFileItemList, body } = nextData || {};
      const files = uniqWith(declareFileItemList || [], (a, b) => a.fileKey === b.fileKey);
      const fileList = files.map(fileMapper);
      this.setState({
        fileList,
        oldFileList: files,
        richText: body,
      });
    }
  }

  getPayloadKeysProps() {
    const { fileList: stateFileList, oldFileList, richText } = this.state;
    const fileList = stateFileList.filter(item => item.status === 'done');
    const removeKeys = [];
    const addKeys = [];
    if (oldFileList) {
      oldFileList.forEach(({ fileKey }) => {
        if (fileList.some(it => it.response.fileKey === fileKey)) {
          return;
        }
        removeKeys.push(fileKey);
      });
    }
    fileList.forEach(item => {
      if (oldFileList.some(({ fileKey }) => fileKey === item.response.fileKey)) {
        return;
      }
      addKeys.push(item.response.fileKey);
    });
    return {
      removeKeys,
      addKeys,
      body: richText,
    };
  }

  handleChange = ({ fileList }) => {
    this.setState({
      fileList,
    });
  };

  handlePreview = ({ url, thumbUrl, response: { fileKey }, name }) => {
    this.setState({
      previewFile: {
        url: url || thumbUrl,
        fileName: name,
        fileKey,
      },
      previewVisible: true,
    });
  };

  handlePreviewVisibleChange = previewVisible => {
    this.setState({
      previewVisible,
    });
  };

  handleRichTextChange = richText => {
    this.setState({
      richText,
    });
  };

  handleImageEdit = (arg, fileKey, result) => {
    const { fileList, oldFileList } = this.state;
    const it = fileMapper(result);
    this.setState({
      fileList: (fileList || []).map(item => {
        if (item.response.fileKey === fileKey) {
          return {
            ...item,
            response: {
              ...item.response,
              fileKey: it.response.fileKey,
            },
            url: it.url,
          };
        }
        return item;
      }),
      oldFileList: (oldFileList || []).map(item => {
        if (item.fileKey === fileKey) {
          return {
            ...item,
            fileKey: it.response.fileKey,
            url: it.url,
          };
        }
        return item;
      }),
    });
  };

  render() {
    const {
      data,
      imgFileUploading,
      docFileUploading,
      activity: { DeclareNodeDataTypes },
    } = this.props;
    const { declareCurrentNode, body } = data;
    const { nodeDataType, canEdit, nodeDataMax, nodeDataMin } = declareCurrentNode || {};
    const fileMax = +nodeDataMax;
    const fileMin = +nodeDataMin;
    const { fileList, previewVisible, previewFile } = this.state;
    const isImg = nodeDataType === DeclareNodeDataTypes.ALBUM.key;
    const disabled = !canEdit || (fileMax > 0 && fileList.length >= fileMax);

    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          {(isImg || nodeDataType === DeclareNodeDataTypes.FILE.key) && (
            <>
              {fileList.length === 0 && <div style={{ padding: '8px 0' }}>暂无文件</div>}
              <Upload
                multiple
                accept={isImg ? FileAccept.IMG : FileAccept.DOC}
                customRequest={isImg ? this.customImgRequest : this.customDocRequest}
                listType={isImg ? 'picture-card' : undefined}
                fileList={fileList}
                onPreview={isImg ? this.handlePreview : undefined}
                onChange={this.handleChange}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: canEdit,
                }}
                disabled={disabled || imgFileUploading || docFileUploading}
              >
                {!disabled &&
                  (isImg ? (
                    <div>
                      <Icon type="plus" theme="outlined" style={{ fontSize: 32 }} />
                      <div className="ant-upload-text">上传</div>
                    </div>
                  ) : (
                    <>
                      <Button icon="upload" type="primary" loading={imgFileUploading || docFileUploading}>
                        上传
                      </Button>
                      &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
                    </>
                  ))}
              </Upload>
              <div className={styles.tabFileLimit}>
                {canEdit && fileMin > 0 && (
                  <span>
                    不少于
                    <span>{fileMin}</span>
                    个文件
                  </span>
                )}
                {canEdit && fileMax > 0 && (
                  <span>
                    不多于
                    <span>{fileMax}</span>
                    个文件
                  </span>
                )}
              </div>
            </>
          )}
          {nodeDataType === DeclareNodeDataTypes.RICH_TEXT.key && (
            <RichTextEditor onChange={this.handleRichTextChange} value={body} />
          )}
          {isImg && (
            <ImageViewModal
              visible={previewVisible}
              onVisibleChange={this.handlePreviewVisibleChange}
              file={previewFile}
              canEdit
              onOk={this.handleImageEdit}
            />
          )}
        </Col>
        <Col md={4} />
      </Row>
    );
  }
}

export default ActivityTab;
