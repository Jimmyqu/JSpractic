import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Card, Col, Divider, Row, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import NewsIframe from '@/components/Iframe/NewsIframe';
import { getPageQuery } from '@/utils/utils';
import Step from './Step';
import Basic from './Basic';
import Data from './Data';
import Audit from './Audit';
import styles from './index.less';

@connect(({ activity2, loading }) => ({
  activity2,
  nodeListLoading: loading.effects['activity2/fetchAllNodes'],
  detailLoading: loading.effects['activity2/fetchNodeDetail'],
}))
class Activity2Info extends Component {
  state = {
    nodeList: null,
    nodeDetail: null,
    editMode: false,

    tabOptions: null,
  };

  componentDidMount() {
    this.init();
  }

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillUpdate({ location: nextLocation }) {
    const { location } = this.props;
    const newQuery = getPageQuery(nextLocation.search);
    const { nodeId: nextNodeId, id: nextId, flag: nextFlag } = newQuery;
    const { nodeId, id, flag } = getPageQuery(location.search);
    if (nextNodeId !== nodeId || nextId !== id || nextFlag !== flag) {
      this.init(newQuery);
    }
  }

  init = query => {
    if (query) {
      this.setState({
        // nodeList: null,
        // nodeDetail: null,
        editMode: false,
      });
    }
    const { reportCompanyListId, id, nodeId } = query || getPageQuery();
    const { dispatch } = this.props;
    if (id) {
      this.fetchNodeDetailByNodeId(id, nodeId);
      return;
    }
    if (reportCompanyListId) {
      dispatch({
        type: 'activity2/fetchAllNodes',
        payload: {
          reportCompanyListId,
        },
      }).then(list => {
        this.setState({
          nodeList: list,
          editMode: true,
        });
      });
    }
  };

  fetchNodeDetailByNodeId = (id, nodeId) => {
    const {
      dispatch,
      activity2: { DeclareNodeTypes },
    } = this.props;
    dispatch({
      type: 'activity2/fetchNodeDetail',
      payload: {
        exerciseId: id,
        exerciseReportNodeId: nodeId,
      },
    }).then(data => {
      this.setState({
        nodeDetail: data,
      });

      const { nodeType, reportConfigId } = data?.exerciseDetailNodeRes || {};
      if (
        reportConfigId &&
        (nodeType === DeclareNodeTypes.BASIC.key ||
          nodeType === DeclareNodeTypes.AUDIT_SELF.key ||
          nodeType === DeclareNodeTypes.AUDIT_REQ.key)
      ) {
        dispatch({
          type: 'activity2/fetchReqFields',
          payload: reportConfigId,
        });
      }
    });
  };

  initTabOptions = tabOptions => {
    this.setState({
      tabOptions,
    });
  };

  handleEditClick = editMode => {
    this.setState({
      editMode,
    });
  };

  getNodeList = () => {
    const { nodeList, nodeDetail } = this.state;
    const { allNodeList } = nodeDetail || {};
    return allNodeList || nodeList;
  };

  // 获得当前查看的的节点step
  getViewStep = node => {
    const nodeList = this.getNodeList();
    const idx = nodeList ? nodeList.indexOf(node) : 0;
    return idx + 1;
  };

  toStep = step => {
    if (!(step > 0)) {
      return;
    }
    const nodeList = this.getNodeList();
    const node = nodeList[step - 1];
    if (node?.id == null) {
      return;
    }
    const { dispatch } = this.props;
    const { nodeDetail } = this.state;
    const { id } = getPageQuery();
    const exerciseId = nodeDetail?.exerciseDetailNodeRes?.exerciseId || id;
    if (!exerciseId) {
      return;
    }
    dispatch(
      push({
        pathname: './info',
        search: `id=${exerciseId}&nodeId=${node.id}`,
      })
    );
  };

  render() {
    const { reportCompanyListId, id, nodeId } = getPageQuery();
    const {
      activity2: { DeclareNodeTypes, fieldCfgCache },
      nodeListLoading,
      detailLoading,
    } = this.props;
    const { editMode, nodeDetail, tabOptions } = this.state;

    const nodeList = this.getNodeList();
    const { exerciseDetailNodeRes } = nodeDetail || {};

    const node = id && nodeId && nodeList ? nodeList.find(item => String(item.id) === nodeId) : nodeList?.[0];

    const reportConfigFields = fieldCfgCache[exerciseDetailNodeRes?.reportConfigId];

    // 1 为第一个
    const viewStep = this.getViewStep(node);
    const nextNode = nodeList?.[viewStep]; // viewStep比索引大1
    const nextIsAuditNode =
      nextNode?.nodeType === DeclareNodeTypes.AUDIT_SELF.key || nextNode?.nodeType === DeclareNodeTypes.AUDIT_REQ.key;

    return (
      <PageHeaderLayout
        content={
          <div className={styles.stepWrapper}>
            <Step
              node={node}
              nodeList={nodeList}
              viewStep={viewStep}
              toStep={this.toStep}
              data={nodeDetail}
              editMode={editMode}
              onEditModeChange={this.handleEditClick}
              tabOptions={tabOptions}
            />
          </div>
        }
      >
        <Card bordered={false}>
          <Spin spinning={!!(nodeListLoading || detailLoading)}>
            {(() => {
              switch (node?.nodeType) {
                case DeclareNodeTypes.DATA.key:
                  return (
                    <Data
                      key={node.id}
                      node={node}
                      data={nodeDetail}
                      viewStep={viewStep}
                      toStep={this.toStep}
                      nextIsAuditNode={nextIsAuditNode}
                      initTabOptions={this.initTabOptions}
                    />
                  );
                case DeclareNodeTypes.AUDIT_SELF.key:
                case DeclareNodeTypes.AUDIT_REQ.key:
                  return (
                    <Audit
                      key={node.id}
                      node={node}
                      data={nodeDetail}
                      firstReportConfigNodeId={nodeList?.[0].reportConfigNodeId}
                      reportConfigFields={reportConfigFields}
                      initTabOptions={this.initTabOptions}
                      reload={this.init}
                    />
                  );
                case DeclareNodeTypes.BASIC.key:
                  return (
                    <Basic
                      id={id}
                      node={node}
                      data={nodeDetail}
                      reportConfigFields={reportConfigFields}
                      reportCompanyListId={reportCompanyListId}
                      editMode={editMode}
                      initTabOptions={this.initTabOptions}
                    />
                  );
                default:
              }
              return null;
            })()}
            {node?.nodeIntroId > 0 && (
              <Row>
                <Col md={4} />
                <Col md={16}>
                  <Divider />
                  <NewsIframe newsId={node?.nodeIntroId} />
                </Col>
                <Col md={4} />
              </Row>
            )}
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default Activity2Info;
