import { Card, Divider } from 'antd';
import Operation from './Operation';
import styles from './content.less';

export default props => {
  const { title, buttons, children, operation, composeStateMapping, handleComposeStateChange, loading, ...resetProps } =
    props;

  return (
    <Card bordered={false} loading={loading} className={styles.content}>
      <div className={styles.actionContent}>
        <div>
          {title && <h3>{title}</h3>}
          <Divider />
          {children}
          <Divider />
        </div>
      </div>
      <Operation
        config={{
          ...operation,
          buttons,
        }}
        {...resetProps}
      />
    </Card>
  );
};
