import { Divider } from 'antd';
import styles from './index.less';

export default function ({ title, children }) {
  return (
    <div className={styles.block}>
      {title != null && <div className={styles.title}>{title}</div>}
      <Divider />
      <div>{children}</div>
    </div>
  );
}
