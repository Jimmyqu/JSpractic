import { Component } from 'react';
import classNames from 'classnames';
import Modal from '@/components/Modal';
import IconFont from '@/components/Icon';
import { screenSize } from '@/utils/utils';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class FullChartModal extends Component {
  state = {
    visible: false,
  };

  handleModalVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  render() {
    const { modalTitle, chartData, fullClassName } = this.props;
    const { visible } = this.state;
    const { width: screenWidth } = screenSize();

    return (
      <>
        <div
          className={classNames(styles.fullChartsIcon, fullClassName)}
          onClick={() => this.handleModalVisibleChange(true)}
        >
          <IconFont type="fullscreen-2" />
        </div>
        <Modal
          title={modalTitle}
          width={screenWidth - 160}
          visible={visible}
          footer={null}
          onVisibleChange={this.handleModalVisibleChange}
          className={styles.fullModel}
        >
          {chartData}
        </Modal>
      </>
    );
  }
}

export default FullChartModal;
