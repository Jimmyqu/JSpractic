import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Steps } from 'antd';
import MarginBar from '@/components/MarginBar';
import FooterToolbar from '@/components/FooterToolbar';
import styles from './index.less';

@connect(({ activity2, loading }) => ({
  activity2,
  saving: loading.effects['activity2/saveBasicInfo'] || loading.effects['activity2/saveDataInfo'],
  nodeListLoading: loading.effects['activity2/fetchAllNodes'],
  detailLoading: loading.effects['activity2/fetchNodeDetail'],
}))
class Step extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  stepBox = null;

  componentDidUpdate() {
    const { isMobile } = this.context;
    if (!isMobile || this.stepBox == null) {
      return;
    }
    const { viewStep } = this.props;
    this.stepBox.scrollTop = (viewStep - 1) * 48; // 48是圆圈纵向连接线的高度（因为垂直了）
  }

  // 获得当前业务步骤
  getDateStep = () => {
    const {
      activity2: { DeclareNodeTypes, DeclareNodeAuditStatus },
      nodeList,
    } = this.props;
    // 找到最远的非灰色节点
    let index = 0;
    nodeList?.some(({ nodeSubmitData, nodeType, nodeAuditState }, idx) => {
      const next = nodeList[idx + 1];
      if (next == null) {
        index = idx;
        return true;
      }
      // 如果是审核类节点
      if (
        (nodeType === DeclareNodeTypes.AUDIT_SELF.key || nodeType === DeclareNodeTypes.AUDIT_REQ.key) &&
        !next.nodeSubmitData &&
        nodeAuditState !== DeclareNodeAuditStatus.Pass.key
      ) {
        index = idx;
        return true;
      }
      if (!nodeSubmitData) {
        index = idx;
        return true;
      }
      return false;
    });
    return index + 1;
  };

  handleEditClick = val => {
    const { onEditModeChange } = this.props;
    if (typeof onEditModeChange === 'function') {
      onEditModeChange(val);
    }
  };

  handleRevokeClick = () => {
    // TODO 撤销审核
    // eslint-disable-next-line no-console
    console.log('Revoke');
  };

  render() {
    const { isMobile } = this.context;
    const {
      activity2: { DeclareNodeTypes, DeclareNodeAuditStatus },
      node,
      saving,
      nodeListLoading,
      detailLoading,
      data,
      editMode,
      nodeList: list,
      tabOptions,
      toStep,
      // 1 为第一个
      viewStep,
    } = this.props;

    const { isEdit, isAuth } = data?.exerciseDetailNodeRes || {};

    const nodeList = list || [];

    const { dataSave, auditReject, auditResolve } = tabOptions || {};
    // 1 为第一个
    const dataStep = this.getDateStep();

    const prevStep = viewStep - 1;
    const nextStep = viewStep + 1;

    const btnDisabled = saving;
    // || tabDataSaving || fetchDetailIng || nodeSubmittIng;

    // console.log(prevStep, viewStep, dataStep);
    const prevNode = nodeList[viewStep - 2]; // viewStep比索引大1
    const nextNode = nodeList[viewStep]; // viewStep比索引大1
    const prevIsAuditNode =
      prevNode?.nodeType === DeclareNodeTypes.AUDIT_SELF.key || prevNode?.nodeType === DeclareNodeTypes.AUDIT_REQ.key;
    const nextIsAuditNode =
      nextNode?.nodeType === DeclareNodeTypes.AUDIT_SELF.key || nextNode?.nodeType === DeclareNodeTypes.AUDIT_REQ.key;
    const isAuditNode =
      node?.nodeType === DeclareNodeTypes.AUDIT_SELF.key || node?.nodeType === DeclareNodeTypes.AUDIT_REQ.key;
    const isCanAudit = isAuth && isAuditNode && node?.nodeAuditState === DeclareNodeAuditStatus.Wait.key;
    return (
      <div
        //  圆圈maxHeight
        style={isMobile ? { maxHeight: 24, overflowY: 'auto' } : undefined}
        ref={n => {
          this.stepBox = n;
        }}
      >
        <Steps
          current={dataStep - 1}
          // https://github.com/react-component/steps/pull/48
          // icons={{
          //   finish: <Icon type="google-plus" theme="outlined" />,
          // }}
          labelPlacement="vertical"
          direction={isMobile ? 'vertical' : 'horizontal'}
          size="small"
        >
          {nodeList?.map((item, i, array) => {
            // let prevAuditNode;
            let nextAuditNode;
            let isBefore = true;
            for (let idx = 0; idx < array.length; idx += 1) {
              const n = array[idx];
              if (idx === i) {
                isBefore = false;
              } else if (
                n.nodeType === DeclareNodeTypes.AUDIT_SELF.key ||
                n.nodeType === DeclareNodeTypes.AUDIT_REQ.key ||
                n.nodeType === DeclareNodeTypes.BASIC.key
              ) {
                if (isBefore) {
                  // prevAuditNode = n;
                } else {
                  nextAuditNode = n;
                  break;
                }
              }
            }

            const auditNode =
              item.nodeType === DeclareNodeTypes.AUDIT_SELF.key || item.nodeType === DeclareNodeTypes.AUDIT_REQ.key;
            const stepNumber = i + 1;
            const stepDone = stepNumber <= dataStep;
            const stepResolve =
              nextAuditNode?.nodeAuditState === DeclareNodeAuditStatus.Pass.key ||
              (auditNode && item.nodeAuditState === DeclareNodeAuditStatus.Pass.key);
            const stepReject =
              auditNode &&
              [
                DeclareNodeAuditStatus.Rejected.key,
                DeclareNodeAuditStatus.Retrail.key,
                DeclareNodeAuditStatus.Disabled.key,
              ].includes(item.nodeAuditState);
            const stepActive = stepNumber === viewStep;
            return (
              <Steps.Step
                key={item.id}
                title={item.nodeName}
                // status={(() => {

                // })()}
                // https://github.com/react-component/steps/pull/48
                // icon={}
                className={classNames({
                  [styles.stepDone]: stepDone,
                  [styles.stepResolve]: stepResolve,
                  [styles.stepReject]: stepReject,
                  [styles.stepActive]: item === node,
                })}
                onClick={() => {
                  if (stepActive) {
                    return;
                  }
                  if (stepDone) {
                    toStep(stepNumber);
                  }
                }}
              />
            );
          })}
        </Steps>
        <FooterToolbar>
          {editMode ? (
            data ? (
              <>
                <MarginBar left top inline>
                  <Button
                    disabled={saving || nodeListLoading || detailLoading}
                    onClick={() => this.handleEditClick(false)}
                  >
                    取消
                  </Button>
                </MarginBar>
                <MarginBar left top inline>
                  <Button
                    type={nextIsAuditNode ? 'danger' : 'primary'}
                    disabled={saving || nodeListLoading || detailLoading}
                    onClick={dataSave}
                  >
                    保存并下一步
                  </Button>
                </MarginBar>
              </>
            ) : (
              <MarginBar left top inline>
                <Button type="primary" disabled={nodeListLoading || detailLoading} loading={saving} onClick={dataSave}>
                  下一步
                </Button>
              </MarginBar>
            )
          ) : (
            <>
              {isEdit && !isAuditNode && (
                <MarginBar left top inline>
                  {node?.nodeType === DeclareNodeTypes.BASIC.key ? (
                    <Button
                      type="primary"
                      disabled={saving || nodeListLoading || detailLoading}
                      onClick={() => this.handleEditClick(true)}
                    >
                      编辑
                    </Button>
                  ) : (
                    <Button type="primary" disabled={saving || nodeListLoading || detailLoading} onClick={dataSave}>
                      {/* 审核节点前为提交 */}
                      保存{nextIsAuditNode ? '并提交' : '并下一步'}
                    </Button>
                  )}
                </MarginBar>
              )}
              {/* {isEdit && isAuditNode && node?.nodeAuditState === DeclareNodeAuditStatus.Wait.key && (
                <MarginBar left top inline>
                  <Button
                    type="danger"
                    disabled={saving || nodeListLoading || detailLoading}
                    onClick={() => this.handleRevokeClick()}
                  >
                    撤销
                  </Button>
                </MarginBar>
              )} */}
              {isCanAudit && (
                <>
                  {!prevIsAuditNode && (
                    <MarginBar left top inline>
                      <Button
                        type="danger"
                        disabled={nodeListLoading || detailLoading}
                        onClick={() => auditReject(DeclareNodeAuditStatus.Rejected.key)}
                      >
                        驳回
                      </Button>
                    </MarginBar>
                  )}
                  <MarginBar left top inline>
                    <Button
                      type="danger"
                      disabled={nodeListLoading || detailLoading}
                      onClick={() => auditReject(DeclareNodeAuditStatus.Retrail.key)}
                    >
                      驳回重填
                    </Button>
                  </MarginBar>
                  <MarginBar left top inline>
                    <Button
                      type="danger"
                      disabled={nodeListLoading || detailLoading}
                      onClick={() => auditReject(DeclareNodeAuditStatus.Disabled.key)}
                    >
                      驳回禁用
                    </Button>
                  </MarginBar>
                  <MarginBar left top inline>
                    <Button type="primary" disabled={nodeListLoading || detailLoading} onClick={auditResolve}>
                      通过
                    </Button>
                  </MarginBar>
                </>
              )}
            </>
          )}
          {prevStep > 0 && prevStep <= nodeList.length && prevStep <= dataStep && (
            <MarginBar left top inline>
              <Button disabled={btnDisabled} onClick={() => toStep(prevStep)}>
                查看上一步
              </Button>
            </MarginBar>
          )}
          {nextStep > 0 && nextStep <= nodeList.length && nextStep <= dataStep && (
            <MarginBar left top inline>
              <Button disabled={btnDisabled} onClick={() => toStep(nextStep)}>
                查看下一步
              </Button>
            </MarginBar>
          )}
        </FooterToolbar>
      </div>
    );
  }
}

export default Step;
