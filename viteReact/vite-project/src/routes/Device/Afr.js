import { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { Row, Col, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import AFRManager from '@/components/AFRManager';
import Result from '@/components/Result';
import { getPageQuery } from '@/utils/utils';
import { modal } from '@/utils/feedback';
import styles from './index.less';

@connect(({ loading }) => ({
  deleting: loading.effects['global/deleteStreamFile'] || loading.effects['global/deleteStreamFileSync'],
  saving: loading.effects['global/saveStreamFile'],
}))
class Afr extends Component {
  state = {
    files: undefined,
    deleteId: undefined,
  };

  headStyle = { textAlign: 'center' };

  componentDidMount() {
    this.loadFiles();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleGoBack = () => {
    const { dispatch } = this.props;
    dispatch(goBack());
  };

  loadFiles = async () => {
    const { type, id } = getPageQuery();
    if (type == null || id == null) {
      return;
    }
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'global/fetchFiles',
      payload: {
        linkType: type,
        linkId: [id],
      },
    });
    if (this.isUnmounted) {
      return;
    }
    if (result) {
      this.setState({
        files: result,
      });
    }
  };

  onSave = () => {
    this.loadFiles();
  };

  delFile = deleteId => {
    modal.confirm('确认删除照片吗？', {
      onOk: async () => {
        const { type, id } = getPageQuery();
        const { dispatch } = this.props;
        this.setState({
          deleteId,
        });
        await dispatch({
          type: 'global/deleteStreamFileSync',
          payload: {
            ids: [deleteId],
            linkType: type,
            linkId: id,
          },
        });
        this.loadFiles();
      },
    });
  };

  render() {
    const { type, id } = getPageQuery();
    const { deleting, saving } = this.props;
    const { files, deleteId } = this.state;
    return (
      <PageHeaderLayout>
        {type == null || id == null ? (
          <Card bordered={false}>
            <Result
              type="error"
              title="错误"
              description="本功能不支持从菜单直接访问，请从会员信息或者联系人管理处进入"
              actions={
                <Button type="primary" onClick={this.handleGoBack}>
                  返回
                </Button>
              }
            />
          </Card>
        ) : (
          <Row gutter={8}>
            <Col md={24} lg={12}>
              <AFRManager type={type} id={id} headStyle={this.headStyle} onSave={this.onSave} />
            </Col>
            <Col md={24} lg={12}>
              <Card title="已上传照片" loading={saving} headStyle={this.headStyle}>
                {files == null || files.length === 0 ? (
                  <div className={classNames('text-center', styles.fileItem)}>暂无照片</div>
                ) : (
                  files.map(({ fileKey, url, id: fileId, fileName }) => (
                    <div key={fileKey} className={styles.fileItem}>
                      <div className={styles.fileBox}>
                        <img src={url} alt="alt" />
                        <div className={styles.fileContent}>{fileName}</div>
                        <div className={styles.fileRight}>
                          <Button
                            type="danger"
                            disabled={deleting && deleteId !== fileId}
                            loading={deleting && deleteId === fileId}
                            onClick={() => this.delFile(fileId)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>
        )}
      </PageHeaderLayout>
    );
  }
}

export default Afr;
