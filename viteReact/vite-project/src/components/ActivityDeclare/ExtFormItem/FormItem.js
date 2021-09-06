import { Form, Alert } from 'antd';
import { staticFieldTitles } from '..';

export default p => {
  const { children, form, field, incomplete, ...props } = p;
  const { extShowName, extName, required, dataValue, descr } = field || {};
  const label = extShowName || staticFieldTitles[extName] || extName;
  const rules = [];
  if (required) {
    rules.push({
      required: true,
      message: `请填写${label}`,
    });
  }
  const initialValue = dataValue == null ? undefined : dataValue;
  return (
    <Form.Item {...props} label={label}>
      {form.getFieldDecorator(extName, {
        initialValue,
        rules,
      })(children)}
      {incomplete && <Alert message="请选择具体申报项目" type="info" showIcon />}
      {descr && (
        <div>
          {extName === 'startDate' && '项目要求时间：'}
          {descr}
        </div>
      )}
    </Form.Item>
  );
};
