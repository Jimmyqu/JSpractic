import { Card, Row, Col, Button } from 'antd';
import styles from './index.less';

export default function (props) {
  const { comment, triggerEditing, title, disabled } = props;

  return (
    <Card bordered={false} hoverable>
      <Row type="flex" align="middle" justify="space-between">
        <Col className={styles.commentTitle}>{title}</Col>
        {!disabled && (
          <Col>
            <Button type="primary" onClick={triggerEditing}>
              修改
            </Button>
          </Col>
        )}
      </Row>
      <Row className={styles.commentWrapper}>
        <Col md={24}>{comment}</Col>
      </Row>
    </Card>
  );
}
