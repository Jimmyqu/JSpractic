import { Row, Col } from 'antd';

export default ({ label, value }) => {
  return (
    <Row key={label}>
      <Col span={6} className="text-right">
        {label}：
      </Col>
      <Col span={18}>{value}</Col>
    </Row>
  );
};
