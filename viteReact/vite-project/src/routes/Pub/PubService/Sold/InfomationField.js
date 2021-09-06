import { Row, Col } from 'antd';
import { formItemLayoutNormal } from '@/utils/utils';

const formItemLayout = formItemLayoutNormal;

export default ({ data }) => {
  const { label, value } = data || {};
  return (
    <Row key={label}>
      <Col span={formItemLayout.labelCol.span} className="text-right" style={{ paddingRight: 4 }}>
        {label}
      </Col>
      <Col span={formItemLayout.wrapperCol.span}>{value}</Col>
    </Row>
  );
};
