import { Component } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import ProjectReqDataView from '@/components/Activity2/ProjectReqDataView';
import AuditConfirmModal from '@/components/Activity2/AuditConfirmModal';
import PropertiesTableView from '@/components/Activity2/PropertiesTableView';
import AuthInfoView from '@/components/Activity2/AuthInfoView';
import ColorStateView from '@/components/Activity2/ColorStateView';
import { formatModel } from '@/utils/format';
import ViewHeader from '@/components/Activity2/ViewHeader';
import MarginBar from '@/components/MarginBar';
import { HTMLSection } from '@/components/RichTextEditor';
import ExtFormItem from '@/components/Form/FormItem/ExtFormItem';
import styles from './index.less';

const Empty = ({ isRichText }) => {
  return <Descr>【{isRichText ? '无内容' : '未上传文件'}】</Descr>;
};

const Descr = ({ children }) => {
  return <span className={styles.descr}>{children}</span>;
};

@connect(({ activity2, extfield2 }) => ({
  activity2,
  extfield2,
}))
class Audit extends Component {
  state = {
    basicFields: null,
    currentAuditState: null,
  };

  componentDidMount() {
    const {
      initTabOptions,
      dispatch,
      activity2: { DeclareNodeAuditStatus },
      firstReportConfigNodeId,
    } = this.props;
    dispatch({
      type: 'activity2/fetchBasicFields',
      payload: {
        reportConfigNodeId: firstReportConfigNodeId,
      },
    }).then(list => {
      this.setState({
        basicFields: list,
      });
    });
    initTabOptions({
      auditReject: state => {
        this.setState({
          currentAuditState: state,
        });
      },
      auditResolve: () => {
        this.setState({
          currentAuditState: DeclareNodeAuditStatus.Pass.key,
        });
      },
      // onExtensionsSave: extension => {
      //   this.toExtensionsSave(extension);
      // },
    });
  }

  converState = state => {
    const {
      activity2: { DeclareNodeAuditStatus },
    } = this.props;
    switch (state) {
      case DeclareNodeAuditStatus.Pass.key:
        return PropertiesTableView.States.Yes;
      case DeclareNodeAuditStatus.Rejected.key:
      case DeclareNodeAuditStatus.Retrail.key:
      case DeclareNodeAuditStatus.Disabled.key:
        return PropertiesTableView.States.No;
      default:
    }
    return PropertiesTableView.States.Pending;
  };

  reduce = () => {
    const {
      activity2: { DeclareNodeTypes },
      data,
    } = this.props;
    const { exerciseDetailNodeResList } = data || {};

    const list = [];
    exerciseDetailNodeResList?.forEach(current => {
      const { nodeType } = current;
      if (
        nodeType === DeclareNodeTypes.BASIC.key ||
        nodeType === DeclareNodeTypes.AUDIT_SELF.key ||
        nodeType === DeclareNodeTypes.AUDIT_REQ.key
      ) {
        list.push(current);
        return;
      }
      // 把连续的、非基础和审核节点，再放入一层数组
      if (!Array.isArray(list[list.length - 1])) {
        list.push([]);
      }
      const subList = list[list.length - 1];
      subList.push(current);
    });
    return list;
  };

  handleAuditVisibleChange = visible => {
    this.setState(({ currentAuditState }) => ({
      currentAuditState: visible ? currentAuditState : null,
    }));
  };

  render() {
    const {
      activity2: { DeclareNodeTypes, DeclareNodeAuditStatus, DeclareNodeDataTypes },
      extfield2: { ExtDataTypes },
      data,
      node,
      dispatch,
      reportConfigFields,
      reload,
    } = this.props;
    const { basicFields, currentAuditState } = this.state;
    const { exerciseDetailNodeRes, reportCompanyListFiledRes } = data || {};

    const reduceList = this.reduce();
    return (
      <>
        <ProjectReqDataView fields={reportConfigFields} data={reportCompanyListFiledRes} />
        {reduceList.map((item, idx) => {
          if (Array.isArray(item)) {
            return (
              <MarginBar key={item.map(({ reportConfigNodeId }) => reportConfigNodeId).join('-')} top={12} bottom={12}>
                <ViewHeader state={ViewHeader.States.Yes}>已上传资料</ViewHeader>
                {item.map((subItem, subIdx) => {
                  // 后台处理图片与相册略有不同，界面目前一视同仁
                  const isImg =
                    subItem.nodeDataType === DeclareNodeDataTypes.ALBUM.key ||
                    subItem.nodeDataType === DeclareNodeDataTypes.IMAGE.key;
                  return (
                    <MarginBar key={subItem.reportConfigNodeId} top={12}>
                      <div>
                        {idx + subIdx + 1}. {subItem.nodeName}
                      </div>
                      <p />
                      {/* 暂时把视频设置为文件 */}
                      {(isImg ||
                        subItem.nodeDataType === DeclareNodeDataTypes.FILE.key ||
                        subItem.nodeDataType === DeclareNodeDataTypes.VIDEO.key) &&
                        (subItem.fileItemVOList?.length > 0 ? (
                          <ExtFormItem
                            isView
                            field={{
                              extKeyName: subItem.reportConfigNodeId,
                              extDataType: isImg ? ExtDataTypes.ImgFile.key : ExtDataTypes.DocFile.key,
                            }}
                            initialValue={subItem.fileItemVOList}
                          />
                        ) : (
                          <Empty />
                        ))}
                      {subItem.nodeDataType === DeclareNodeDataTypes.RICH_TEXT.key &&
                        (subItem.body ? <HTMLSection>{subItem.body}</HTMLSection> : <Empty isRichText />)}
                    </MarginBar>
                  );
                })}
              </MarginBar>
            );
          }
          // 接口这里的设计是，允许基础信息类型在中间出现多次，前端实现为有且仅有一个，且在第一个
          if (item.nodeType === DeclareNodeTypes.BASIC.key) {
            return (
              <PropertiesTableView
                key={item.reportConfigNodeId}
                title={item.nodeName}
                state={PropertiesTableView.States.Yes}
                fields={basicFields}
                data={item.fieldMap}
              />
            );
          }
          if (item.nodeType === DeclareNodeTypes.AUDIT_SELF.key || item.nodeType === DeclareNodeTypes.AUDIT_REQ.key) {
            const state = this.converState(item.nodeAuditState);
            return (
              <AuthInfoView
                key={item.reportConfigNodeId}
                title={item.nodeName}
                state={state}
                data={{
                  fileItemVOList: item.fileItemVOList,
                  auditDescription: item.nodeAuditDescription,
                  auditState: (
                    <ColorStateView state={state}>
                      {formatModel(DeclareNodeAuditStatus, item.nodeAuditState)}
                    </ColorStateView>
                  ),
                }}
              />
            );
          }
          return null;
        })}
        <AuditConfirmModal
          visible={currentAuditState != null}
          title={formatModel(DeclareNodeAuditStatus, currentAuditState)}
          onVisibleChange={this.handleAuditVisibleChange}
          onSure={async ({ auditReasons, fileKeys }) => {
            await dispatch({
              type: 'activity2/audit',
              payload: {
                exerciseId: exerciseDetailNodeRes.exerciseId,
                exerciseReportNodeId: node.id,
                auditReasons,
                auditState: currentAuditState,
                fileKey: fileKeys?.[0], // FIXME: 这里应该支持多个
              },
            });
            reload();
          }}
          onOk={() => {
            this.setState({
              currentAuditState: null,
            });
            message.success('操作成功');
          }}
        />
      </>
    );
  }
}

export default Audit;
