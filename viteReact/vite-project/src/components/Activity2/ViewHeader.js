import { Icon } from 'antd';
import IconFont from '@/components/Icon';
import styles from './index.less';

function ViewHeader({ state, children }) {
  return (
    <div className={styles.viewHeader}>
      {(() => {
        switch (state) {
          case ViewHeader.States.Yes:
            return <Icon type="check-circle" theme="filled" className={styles.completeColor} />;
          case ViewHeader.States.No:
            return <Icon type="exclamation-circle" theme="filled" className={styles.warningColor} />;
          default:
            return <IconFont type="ellipsis-filled" className="primary-color" />;
        }
      })()}
      &nbsp;
      {children}
    </div>
  );
}

ViewHeader.States = {
  Yes: 1,
  No: 2,
  Pending: 3,
};

export default ViewHeader;
