import { Row, Col } from 'antd';
import styles from './index.less';

export default ({ label, children, labelCol, wrapperCol }) => (
  <Row className={styles.field}>
    <Col span={8} {...labelCol}>
      {label}
    </Col>
    <Col span={16} {...wrapperCol} className="text-right">
      {children}
    </Col>
  </Row>
);
