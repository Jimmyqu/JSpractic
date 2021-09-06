import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Steps } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const { Step } = Steps;

@connect(({ orderprocessing, payment }) => ({
  orderprocessing,
  payment,
}))
class OrderSteps extends Component {
  static childContextTypes = {
    checkOpFailed: PropTypes.func,
    checkOpFailedAndGoBack: PropTypes.func,
    getNextStepPath: PropTypes.func,
    isSummaryPath: PropTypes.func,

    selectPubStudy: PropTypes.bool,
    validPubStudy: PropTypes.bool,
    validFace: PropTypes.bool,
  };

  getChildContext() {
    const {
      dispatch,
      orderprocessing: { dealInfo },
    } = this.props;

    const { selectPubStudy, validPubStudy, validFace } = (dealInfo || {}).deal || {};
    return {
      checkOpFailed() {
        return dealInfo == null;
      },
      checkOpFailedAndGoBack() {
        if (dealInfo == null) {
          dispatch(push('.'));
          return true;
        }
        return false;
      },
      getNextStepPath: (stepNum = 1) => {
        if (stepNum <= 0) {
          throw new Error('步进必须是正数字');
        }
        const step = this.getCurrentStep();
        const { stepList = [] } = this.props;
        const nextStep = step + stepNum;
        if (nextStep > stepList.length - 1) {
          return null;
        }
        return `./${stepList[nextStep].path}`;
      },
      // router 路由约定都用 /summary 来显示结算组件页面
      isSummaryPath: path => {
        return (path || '').endsWith('/summary');
      },
      selectPubStudy,
      validPubStudy,
      validFace,
    };
  }

  componentDidUpdate() {
    if (this.stepBox == null) {
      return;
    }
    const step = this.getCurrentStep();
    this.stepBox.scrollTop = step * 48; // 48是圆圈32+纵向连接线的高度
  }

  getCurrentStep() {
    const { stepList = [] } = this.props;
    const { pathname } = window.location;
    const pathList = pathname.split('/');
    const path = pathList[pathList.length - 1];
    return stepList.findIndex(({ path: p }) => path === p);
  }

  render() {
    const { stepList = [], ignore, children } = this.props;
    const step = this.getCurrentStep();
    const { hidden } = stepList.find((_, i) => i === step) || {};
    // 第一个默认hidden效果（step > 0）
    return step === 0 || hidden ? (
      children
    ) : (
      <PageHeaderLayout
        hideInBreadcrumb
        content={
          ignore ? null : (
            // 圆圈32
            <div
              style={{ maxHeight: 32, overflowY: 'auto' }}
              ref={node => {
                this.stepBox = node;
              }}
            >
              <Steps current={step}>
                {stepList.map(({ path, title }) => (
                  <Step title={title} key={path || title} />
                ))}
              </Steps>
            </div>
          )
        }
      >
        {children}
      </PageHeaderLayout>
    );
  }
}

export default OrderSteps;
