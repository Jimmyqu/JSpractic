import { Component } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'antd';
import { modal } from '@/utils/feedback';
import Modal from '@/components/Modal';
import styles from './index.less';

@connect(({ logistics }) => ({
  logistics,
}))
class ConfirmDeliverModal extends Component {
  sure = arg => {
    modal.confirm('确定提交批量发货吗？', {
      onOk: () => {
        const { onOk } = this.props;
        arg.deepCallOk(onOk);
      },
    });
    return false;
  };

  render() {
    const { data, onOk, ...restProps } = this.props;
    const { totalNum, invalidNum, effectiveNum, dealIds } = data || {};
    return (
      <Modal title="请确认批量发货数据" width={640} {...restProps} onOk={this.sure}>
        <div>
          <div>您已上传发货的数据&nbsp;{totalNum}&nbsp;条</div>
          <div>
            有效数据<span className={styles.batchInfo}>&nbsp;{effectiveNum}&nbsp;</span>条
          </div>
          {invalidNum > 0 && (
            <>
              <div>
                无效数据<span className={styles.batchWarning}>&nbsp;{invalidNum}&nbsp;</span>
                条，具体订单如下
              </div>
              <div className={styles.batchWarning}>{dealIds}</div>
            </>
          )}
        </div>
        <Divider />
        <span className={styles.batchWarning}>注意：</span>
        确认发货后，您提交的有效数据将发货成功，无效数据可后续校正后再发货
      </Modal>
    );
  }
}

export default ConfirmDeliverModal;
