import { Component } from 'react';
import { connect } from 'react-redux';
import uniqWith from 'lodash/uniqWith';
// import { push } from 'connected-react-router';
import { Button, Col, Icon, message, Row, Upload } from 'antd';
import RichTextEditor from '@/components/RichTextEditor';
import ImageViewModal from '@/components/Modal/ImageViewModal';
import { FileAccept, fileMapper, genUploadDocCustomRequest, genUploadImgCustomRequest } from '@/utils/upload';
// import { modal } from '@/utils/feedback';
import styles from './index.less';

@connect(({ activity2, loading }) => ({
  activity2,
  imgFileStyleUpdating: loading.effects['global/updateFileStyle'],
  imgFileUploading: loading.effects['global/uploadImgFile'],
  docFileUploading: loading.effects['global/uploadDocFile'],
}))
class Data extends Component {
  state = {
    previewFile: undefined,
    richText: null,
    originRichText: null,
    fileList: [],
    oldFileList: [],
  };

  constructor(props) {
    super(props);
    // eslint-disable-next-line react/destructuring-assignment
    this.customImgRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });
    // eslint-disable-next-line react/destructuring-assignment
    this.customDocRequest = genUploadDocCustomRequest({ dispatch: this.props.dispatch });
  }

  componentDidMount() {
    const { initTabOptions } = this.props;
    initTabOptions({
      dataSave: this.dataSave,
    });
    this.init();
  }

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillUpdate({ data: nextData }) {
    const { data } = this.props;
    if (data !== nextData) {
      this.init(nextData);
    }
  }

  init = nextData => {
    const { data: d } = this.props;
    const data = nextData || d;
    const { fileItemVOList, body } = data?.exerciseDetailNodeRes || {};
    const files = uniqWith(fileItemVOList || [], (a, b) => a.fileKey === b.fileKey);
    const fileList = files.map(fileMapper);
    const originRichText = body == null ? null : body;
    this.setState({
      previewFile: undefined,
      richText: originRichText,
      originRichText,
      fileList,
      oldFileList: files,
    });
  };

  submit = async () => {
    const { node, viewStep, toStep, dispatch } = this.props;
    await dispatch({
      type: 'activity2/submitToAudit',
      payload: {
        exerciseReportNodeId: node.id,
      },
    });
    message.success('提交成功');
    toStep(viewStep + 1);
  };

  dataSave = async () => {
    const {
      activity2: { DeclareNodeDataTypes },
      node,
      dispatch,
      data,
      // 1 为第一个
      viewStep,
      toStep,
      nextIsAuditNode,
    } = this.props;
    const { nodeDataType, id } = node;
    const { exerciseId } = data?.exerciseDetailNodeRes || {};
    const { richText } = this.state;
    const payload = {
      exerciseId,
      exerciseNodeId: id,
    };
    if (nodeDataType === DeclareNodeDataTypes.RICH_TEXT.key) {
      await dispatch({
        type: 'activity2/saveDataInfo',
        payload: {
          ...payload,
          body: richText,
        },
      });
    } else {
      const { removeKeys, addKeys } = this.getPayloadKeysProps();
      if (addKeys.length > 0 || removeKeys.length > 0) {
        await dispatch({
          type: 'activity2/saveDataInfo',
          payload: {
            ...payload,
            addKeys,
            removeKeys,
          },
        });
      } else if (!nextIsAuditNode) {
        message.info('文件无变化');
        return;
      }
    }
    if (nextIsAuditNode) {
      // modal.confirm('保存成功，是否提交审核？', {
      //   onOk: () => {
      //     this.submit();
      //   },
      // });
      this.submit();
      return;
    }
    message.success('保存成功');
    toStep(viewStep + 1);
  };

  getPayloadKeysProps = () => {
    const { fileList: stateFileList, oldFileList } = this.state;
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
    };
  };

  handleRichTextChange = richText => {
    this.setState({
      richText,
    });
  };

  handlePreviewVisibleChange = visible => {
    this.setState(({ previewFile }) => ({
      previewFile: visible ? previewFile : null,
    }));
  };

  handleChange = ({ fileList }) => {
    this.setState({
      fileList,
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
      activity2: { DeclareNodeDataTypes },
      node: { nodeDataType },
      imgFileUploading,
      docFileUploading,
      imgFileStyleUpdating,
      data,
    } = this.props;
    const { fileList, previewFile, originRichText } = this.state;
    const { nodeDataMax, nodeDataMin, isEdit } = data?.exerciseDetailNodeRes || {};
    // 后台处理图片与相册略有不同，界面目前一视同仁
    const isImg = nodeDataType === DeclareNodeDataTypes.ALBUM.key || nodeDataType === DeclareNodeDataTypes.IMAGE.key;
    // 暂时把视频设置为文件
    const isDoc = nodeDataType === DeclareNodeDataTypes.FILE.key || nodeDataType === DeclareNodeDataTypes.VIDEO.key;

    const fileMax = +nodeDataMax;
    const fileMin = +nodeDataMin;
    const dis = imgFileUploading || docFileUploading || imgFileStyleUpdating;

    return (
      <Row>
        <Col md={4} />
        <Col md={16}>
          {(isImg || isDoc) && (
            <>
              {fileList.length === 0 && <div style={{ padding: '8px 0' }}>暂无文件</div>}
              <Upload
                accept={isImg ? FileAccept.IMG : FileAccept.DOC}
                customRequest={isImg ? this.customImgRequest : this.customDocRequest}
                listType={isImg ? 'picture-card' : undefined}
                fileList={fileList}
                onPreview={isImg ? this.handlePreview : undefined}
                onChange={this.handleChange}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: isEdit,
                }}
                disabled={dis}
              >
                {fileList.length === fileMax
                  ? null
                  : isEdit && (
                      <>
                        {isImg ? (
                          <div>
                            <Icon type="plus" theme="outlined" style={{ fontSize: 32 }} />
                            <div className="ant-upload-text">上传</div>
                          </div>
                        ) : (
                          <>
                            <Button icon="upload" type="primary" loading={dis}>
                              上传
                            </Button>
                            &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
                          </>
                        )}
                      </>
                    )}
                {/* {isEdit && (
                  <>
                    {isImg ? (
                      <div>
                        <Icon type="plus" theme="outlined" style={{ fontSize: 32 }} />
                        <div className="ant-upload-text">上传</div>
                      </div>
                    ) : (
                      <>
                        <Button icon="upload" type="primary" loading={dis}>
                          上传
                        </Button>
                        &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
                      </>
                    )}
                  </>
                )} */}
              </Upload>
              <div className={styles.tabFileLimit}>
                {isEdit && fileMin > 0 && (
                  <span>
                    不少于
                    <span>{fileMin}</span>
                    个文件
                  </span>
                )}
                {isEdit && fileMax > 0 && (
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
            <RichTextEditor disabled={!isEdit || dis} onChange={this.handleRichTextChange} value={originRichText} />
          )}
          {isImg && (
            <ImageViewModal
              visible={!!previewFile}
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

export default Data;
