import { Component } from 'react';
import ExtFormItem from '.';
/**
 * 动态表单项目区域，循环
 */
class ExtFormItemArea extends Component {
  render() {
    const { fields, form, ...props } = this.props;
    const list = fields || [];
    return list.map(field => <ExtFormItem key={field.extName} field={field} form={form} {...props} />);
  }
}

export default ExtFormItemArea;
