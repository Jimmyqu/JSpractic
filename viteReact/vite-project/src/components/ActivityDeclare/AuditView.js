import { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Upload, Form } from 'antd';
import MarginBar from '@/components/MarginBar';
import Modal from '@/components/Modal';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import { fileMapper } from '@/utils/upload';
import { formatModel } from '@/utils/format';
import { createMarkup } from '@/utils/utils';
import ViewHeader from './ViewHeader';
import style from './index.less';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ activity }) => ({
  activity,
}))
class ActivityAuditView extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  state = {
    previewVisible: false,
    previewImage: undefined,
  };

  handlePreview = ({ url, thumbUrl }) => {
    this.setState({
      previewImage: url || thumbUrl,
      previewVisible: true,
    });
  };

  handlePreviewVisibleChange = previewVisible => {
    this.setState({
      previewVisible,
    });
  };

  render() {
    const {
      detailItem,
      activity: { AuditStates, DeclareNodeDataTypes },
    } = this.props;
    const { previewVisible, previewImage } = this.state;
    const { nodeDataItems, extensionItems, auditState, nodeName, auditReasons, auditFiles } = detailItem || {};
    const nodeDataList = nodeDataItems || [];
    const extensionList = extensionItems || [];
    return (
      <MarginBar top>
        <div>
          {(nodeDataList.length > 0 || extensionList.length > 0) && (
            <ViewHeader auditState={auditState}>已上传资料</ViewHeader>
          )}
        </div>
        {nodeDataList.map(({ nodeStep, nodeName: name, nodeDataType, itemFiles, body }) => {
          const isImg = nodeDataType === DeclareNodeDataTypes.ALBUM.key;
          const fileList = itemFiles || [];
          return (
            <MarginBar key={nodeStep} top>
              <div>
                {nodeStep}. {name}
              </div>
              <p />
              {(isImg || nodeDataType === DeclareNodeDataTypes.FILE.key) && (
                <>
                  {fileList.length > 0 ? (
                    <Form>
                      <Form.Item>
                        <Upload
                          listType={isImg ? 'picture-card' : undefined}
                          disabled
                          fileList={fileList.map(fileMapper)}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: false,
                          }}
                          onPreview={isImg ? this.handlePreview : undefined}
                        />
                      </Form.Item>
                    </Form>
                  ) : (
                    <Empty />
                  )}
                </>
              )}
              {nodeDataType === DeclareNodeDataTypes.RICH_TEXT.key &&
                // eslint-disable-next-line react/no-danger
                (body ? <div dangerouslySetInnerHTML={createMarkup(body)} /> : <Empty isRichText />)}
            </MarginBar>
          );
        })}
        {extensionList.map(({ extension, extensionValue, extensionDescr, extensionFiles }) => (
          <MarginBar key={extension} top className={style.extension}>
            <div className={style.extensionTitle}>{extensionValue}</div>
            <div>
              <Descr>{extensionDescr}</Descr>
            </div>
            {(extensionFiles || []).map(item => (
              <div key={item.url}>
                <a href={item.url}>{item.fileName}</a>
              </div>
            ))}
            {(extensionFiles == null || extensionFiles.length === 0) && <Empty />}
          </MarginBar>
        ))}
        {nodeName && (
          <MarginBar top className={style.tableRowWrapper}>
            <ViewHeader auditState={auditState}>{nodeName}</ViewHeader>
            <VerticalPairColumnTable per={2}>
              <PairColumn label="审核状态">
                <span
                  className={classNames('primary-color', {
                    [style.completeColor]: auditState === AuditStates.Yes.key,
                    [style.warningColor]: auditState === AuditStates.No.key,
                  })}
                >
                  {formatModel(AuditStates, auditState)}
                </span>
              </PairColumn>
              <PairColumn label="审核备注">
                <>
                  <Descr>{auditReasons}</Descr>
                  {(auditFiles || []).map(item => (
                    <div key={item.url}>
                      <a href={item.url}>{item.fileName}</a>
                    </div>
                  ))}
                </>
              </PairColumn>
            </VerticalPairColumnTable>
          </MarginBar>
        )}
        <Modal width={768} visible={previewVisible} footer={null} onVisibleChange={this.handlePreviewVisibleChange}>
          <img alt="previewImage" className="img-max" src={previewImage} />
        </Modal>
      </MarginBar>
    );
  }
}

const Empty = ({ isRichText }) => {
  return <Descr>【{isRichText ? '无内容' : '未上传文件'}】</Descr>;
};

const Descr = ({ children }) => {
  return <span className={style.descr}>{children}</span>;
};

export default ActivityAuditView;
