import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Steps, Button } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import MarginBar from '@/components/MarginBar';
import { getActiveStep, calcAuditState, needConfirm } from '@/components/ActivityDeclare';
import { formatModel } from '@/utils/format';
import { getPageQuery } from '@/utils/utils';
import style from './index.less';

const { Step } = Steps;

@connect(({ activity, loading }) => ({
  activity,
  saving: loading.effects['activity/save'],
  tabDataSaving: loading.effects['activity/saveTabData'],
  nodeSubmittIng: loading.effects['activity/submitNode'],
  fetchDetailIng: loading.effects['activity/fetchNodeDetail'],
  //
  fetchCompanyIng: loading.effects['activity/fetchDeclareCompany'],
  fetchDeclareFillListIng: loading.effects['activity/fetchExerciseDeclareFillList'],
  fetchDeclareFieldsIng: loading.effects['activity/fetchDeclareFields'],
  fetchDeclareFixedFieldsIng: loading.effects['activity/fetchDeclareFixedFields'],
  fetchDeclareTypesIng: loading.effects['activity/fetchDeclareTypes'],
}))
class ActivityStep extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
  };

  componentDidMount() {
    const { id } = getPageQuery();
    if (id) {
      return;
    }
    this.fetchNodeList();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { data: nextData } = nextProps;
    const { configId: nextConfigId, id: nextId } = nextData?.declareDetail || {};
    // 有 id 不用单独查询 nodeList
    if (nextId) {
      return;
    }
    if (nextConfigId) {
      this.fetchNodeList(nextConfigId);
    }
  }

  componentDidUpdate() {
    const { isMobile } = this.context;
    if (!isMobile || this.stepBox == null) {
      return;
    }
    const activeStep = this.getCurrentActiveStep();
    this.stepBox.scrollTop = (activeStep - 1) * 48; // 48是圆圈纵向连接线的高度（因为垂直了）
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getCurrentActiveStep = () => {
    const { data, step } = this.props;
    return step || getActiveStep(data || {});
  };

  handleEditClick = val => {
    const { onEditModeChange } = this.props;
    if (typeof onEditModeChange === 'function') {
      onEditModeChange(val);
    }
  };

  handleDataSave = (afterSaveFn, fileChangeCheck) => {
    const { tabOptions } = this.props;
    const { onDataSave } = tabOptions || {};
    if (typeof onDataSave === 'function') {
      onDataSave(afterSaveFn, fileChangeCheck);
    }
  };

  handleDataSubmit = () => {
    const { tabOptions } = this.props;
    const { onDataSubmit } = tabOptions || {};
    if (typeof onDataSubmit === 'function') {
      this.handleDataSave(onDataSubmit, false);
    }
  };

  handleStepClick = stepNumber => {
    const { data } = this.props;
    const { id } = data.declareDetail;
    if (id == null) {
      return;
    }
    this.toStep(stepNumber);
  };

  handleAuditReject = () => {
    const { tabOptions } = this.props;
    const { onAuditReject } = tabOptions || {};
    if (typeof onAuditReject === 'function') {
      onAuditReject();
    }
  };

  handleAuditResolve = () => {
    const { tabOptions } = this.props;
    const { onAuditResolve } = tabOptions || {};
    if (typeof onAuditResolve === 'function') {
      onAuditResolve();
    }
  };

  handleExtensionsSave = extension => {
    const { tabOptions } = this.props;
    const { onExtensionsSave } = tabOptions || {};
    if (typeof onExtensionsSave === 'function') {
      onExtensionsSave(extension);
    }
  };

  goToNext = () => {
    const activeStep = this.getCurrentActiveStep();
    this.toStep(activeStep + 1);
  };

  toStep = step => {
    const { dispatch, data } = this.props;
    const { id } = data.declareDetail;
    if (id == null) {
      return;
    }
    dispatch(
      push({
        pathname: './info',
        search: `id=${id}&step=${step}`,
      })
    );
  };

  fetchNodeList(configId) {
    const {
      dispatch,
      activity: { nodeListMapping },
    } = this.props;
    if (configId == null) {
      return;
    }
    const list = nodeListMapping[configId];
    if (list) {
      return;
    }
    dispatch({
      type: 'activity/fetchNodeList',
      payload: configId,
    });
  }

  render() {
    const {
      data,
      activity,
      editMode,
      saving,
      tabDataSaving,
      nodeSubmittIng,
      fetchDetailIng,
      fetchCompanyIng,
      incomplete,
      fetchDeclareFillListIng,
      fetchDeclareFixedFieldsIng,
      fetchDeclareFieldsIng,
      fetchDeclareTypesIng,
    } = this.props;
    const { nodeListMapping, AuditStates, DeclareNodeTypes, ExtensionsFunctionTypes } = activity;
    const { isMobile } = this.context;
    const { declareNodeList: dList, declareCurrentNode, declareDetail } = data || {};
    const { canEdit, canAudit, canExtensions, extensionsFunction, fromServer } = declareCurrentNode || {};
    const { configId, currentNodeStep: dStep } = declareDetail || {};
    const { listNode, currentNodeStep } = nodeListMapping[configId] || {};
    const list = (dList || listNode || []).map((item, i, array) => {
      return {
        ...item,
        auditState: calcAuditState(activity, item, array),
      };
    });
    if (list == null) {
      return null;
    }
    // 申报审核流程节点的当前step
    const nowNodeStep = dList ? dStep : currentNodeStep;
    const direction = isMobile ? 'vertical' : 'horizontal';
    // Steps组件激活的当前step
    const activeStep = this.getCurrentActiveStep();
    const activeNode = list[activeStep - 1] || {};
    const prevStep = activeStep - 1;
    const nextStep = activeStep + 1;
    const confirm = needConfirm(activity, data);

    const extensionsFunList = extensionsFunction ? extensionsFunction.split(',') : [];

    const btnDisabled = saving || tabDataSaving || fetchDetailIng || nodeSubmittIng;

    const basicSaveBtn =
      activeNode.nodeType === DeclareNodeTypes.BASIC.key && (!fromServer || editMode) ? (
        <MarginBar left top inline>
          <Button
            type="primary"
            disabled={
              fetchCompanyIng ||
              incomplete ||
              fetchDetailIng ||
              fetchDeclareFillListIng ||
              fetchDeclareFixedFieldsIng ||
              fetchDeclareFieldsIng ||
              fetchDeclareTypesIng
            }
            loading={saving}
            // 内部实现决定是否下一步
            onClick={() => this.handleDataSave()}
          >
            {confirm ? '提交' : ' 保存并下一步'}
          </Button>
        </MarginBar>
      ) : null;
    return (
      <>
        {/* 圆圈maxHeight */}
        <div
          style={isMobile ? { maxHeight: 24, overflowY: 'auto' } : undefined}
          ref={node => {
            this.stepBox = node;
          }}
        >
          <Steps
            current={nowNodeStep - 1}
            // https://github.com/react-component/steps/pull/48
            // icons={{
            //   finish: <Icon type="google-plus" theme="outlined" />,
            // }}
            labelPlacement="vertical"
            direction={direction}
            size="small"
          >
            {list.map((item, i, array) => {
              // const activeNode.nodeType === DeclareNodeTypes.AUDIT.key
              const stepNumber = i + 1;
              const stepDone = stepNumber <= nowNodeStep;
              const stepResolve = item.auditState === AuditStates.Yes.key;
              const stepReject = item.auditState === AuditStates.No.key;
              const stepActive = stepNumber === activeStep;
              return (
                <Step
                  key={item.nodeStep}
                  title={item.nodeName}
                  status={(() => {
                    if (item.nodeType === DeclareNodeTypes.BASIC.key || item.nodeType === DeclareNodeTypes.AUDIT.key) {
                      return;
                    }
                    let prevAuditNode;
                    let nextAuditNode;
                    let isBefore = true;
                    for (let idx = 0; idx < array.length; idx += 1) {
                      const node = array[idx];
                      if (idx === i) {
                        isBefore = false;
                      } else if (
                        node.nodeType === DeclareNodeTypes.AUDIT.key ||
                        node.nodeType === DeclareNodeTypes.BASIC.key
                      ) {
                        if (isBefore) {
                          prevAuditNode = node;
                        } else {
                          nextAuditNode = node;
                          break;
                        }
                      }
                    }
                    if (
                      prevAuditNode?.nodeStep - 1 < i &&
                      ((prevAuditNode?.nodeType === DeclareNodeTypes.BASIC.key && fromServer) ||
                        prevAuditNode?.nodeType === DeclareNodeTypes.AUDIT.key) &&
                      nextAuditNode?.nodeType === DeclareNodeTypes.AUDIT.key &&
                      (nextAuditNode.auditState == null || nextAuditNode.auditState === AuditStates.Wait.key) &&
                      nextAuditNode.nodeStep - 1 > i
                    ) {
                      return 'process';
                    }
                  })()}
                  // https://github.com/react-component/steps/pull/48
                  // icon={}
                  className={classNames({
                    [style.stepDone]: stepDone,
                    [style.stepResolve]: stepResolve,
                    [style.stepReject]: stepReject,
                    [style.stepActive]: stepActive,
                  })}
                  onClick={() => {
                    if (stepActive) {
                      return;
                    }
                    if (stepDone) {
                      this.handleStepClick(stepNumber);
                    }
                  }}
                />
              );
            })}
          </Steps>
        </div>
        <FooterToolbar>
          {editMode ? (
            <>
              {basicSaveBtn}
              <MarginBar left top inline>
                <Button type="danger" disabled={btnDisabled} onClick={() => this.handleEditClick(false)}>
                  取消
                </Button>
              </MarginBar>
            </>
          ) : (
            <>
              {canEdit && (
                <>
                  {activeNode.nodeType === DeclareNodeTypes.BASIC.key &&
                    (fromServer ? (
                      <MarginBar left top inline>
                        <Button type="primary" disabled={btnDisabled} onClick={() => this.handleEditClick(true)}>
                          编辑
                        </Button>
                      </MarginBar>
                    ) : (
                      basicSaveBtn
                    ))}
                  {activeNode.nodeType === DeclareNodeTypes.DATA.key && (
                    <>
                      <MarginBar left top inline>
                        <Button type="primary" disabled={btnDisabled} onClick={() => this.handleDataSave()}>
                          暂存
                        </Button>
                      </MarginBar>
                      {confirm ? (
                        <MarginBar left top inline>
                          <Button type="danger" disabled={btnDisabled} onClick={this.handleDataSubmit}>
                            保存并提交
                          </Button>
                        </MarginBar>
                      ) : (
                        <MarginBar left top inline>
                          <Button
                            type="primary"
                            disabled={btnDisabled}
                            onClick={() => this.handleDataSave(this.goToNext)}
                          >
                            保存并下一步
                          </Button>
                        </MarginBar>
                      )}
                    </>
                  )}
                </>
              )}
              {activeNode.nodeType === DeclareNodeTypes.AUDIT.key && (
                <>
                  {canAudit && (
                    <>
                      <MarginBar left top inline>
                        <Button type="danger" disabled={btnDisabled} onClick={this.handleAuditReject}>
                          驳回
                        </Button>
                      </MarginBar>
                      <MarginBar left top inline>
                        <Button type="primary" disabled={btnDisabled} onClick={this.handleAuditResolve}>
                          通过
                        </Button>
                      </MarginBar>
                    </>
                  )}
                  {canExtensions &&
                    extensionsFunList.map(type => {
                      const extension = +type;
                      return (
                        <MarginBar left top inline key={extension}>
                          <Button
                            type="primary"
                            disabled={btnDisabled}
                            onClick={() => this.handleExtensionsSave(extension)}
                          >
                            {formatModel(ExtensionsFunctionTypes, extension)}
                          </Button>
                        </MarginBar>
                      );
                    })}
                </>
              )}
              {prevStep > 0 && prevStep <= list.length && prevStep <= nowNodeStep && (
                <MarginBar left top inline>
                  <Button disabled={btnDisabled} onClick={() => this.toStep(prevStep)}>
                    查看上一步
                  </Button>
                </MarginBar>
              )}
              {nextStep > 0 && nextStep <= list.length && nextStep <= nowNodeStep && (
                <MarginBar left top inline>
                  <Button disabled={btnDisabled} onClick={() => this.toStep(nextStep)}>
                    查看下一步
                  </Button>
                </MarginBar>
              )}
            </>
          )}
        </FooterToolbar>
      </>
    );
  }
}

export default ActivityStep;
