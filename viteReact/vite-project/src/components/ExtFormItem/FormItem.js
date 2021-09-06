import { Component } from 'react';
import moment from 'moment';
import { Form } from 'antd';
import { connect } from 'react-redux';
import { checkUpload, checkExtField } from '@/commons/lib/validator';
import { fileMapper, formUploadOtherProps } from '@/utils/upload';
import { isNumerical } from '@/utils/utils';

@connect(({ extfield }) => ({
  extfield,
}))
class FormItem extends Component {
  getRuleType = (extDataType, single) => {
    const {
      extfield: { ExtDataTypes },
    } = this.props;
    switch (extDataType) {
      case ExtDataTypes.Select.key:
      case ExtDataTypes.Contact.key:
      case ExtDataTypes.Ethnic.key:
        return single ? 'number' : 'array';
      case ExtDataTypes.Date.key:
      case ExtDataTypes.HourAndMinute.key:
      case ExtDataTypes.DateTime.key:
        return 'date';
      case ExtDataTypes.Cascader.key:
        return 'array';
      default:
        return 'string';
    }
  };

  render() {
    const { children, form, field, extfield, dispatch, ...props } = this.props;
    const { ExtDataTypes } = extfield;
    const { extDataType, extShowName, extName, required, dataValue, single, validAlert, descr } = field || {};
    const rules = [];
    if (required) {
      // 文件
      if (extDataType === ExtDataTypes.DocFile.key) {
        rules.push({
          required: true,
          validator: checkUpload,
        });
      } else {
        rules.push({
          required: true,
          message: `请填写${extShowName || extName}`,
        });
      }
    }
    rules.push({
      type: this.getRuleType(extDataType, single),
      message: validAlert || `${extShowName}填写无效，请重新填写`,
      // 此处不要用箭头函数，因为里面要取原this使用
      validator() {
        // eslint-disable-next-line prefer-rest-params
        return checkExtField.apply(this, [...arguments, field]);
      },
    });
    let initialValue = dataValue == null ? undefined : dataValue;
    let otherProps = {};
    // 文件和图片
    if (extDataType === ExtDataTypes.DocFile.key || extDataType === ExtDataTypes.ImgFile.key) {
      if (initialValue) {
        initialValue = (Array.isArray(initialValue) ? initialValue : [initialValue]).map(fileMapper);
      }
      otherProps = {
        ...otherProps,
        ...formUploadOtherProps,
      };
    } else if (
      extDataType === ExtDataTypes.Date.key ||
      extDataType === ExtDataTypes.HourAndMinute.key ||
      extDataType === ExtDataTypes.DateTime.key
    ) {
      initialValue = isNumerical(initialValue) ? moment(+initialValue) : initialValue;
    }
    return (
      <Form.Item label={extShowName || extName} {...props}>
        {form.getFieldDecorator(extName, {
          initialValue,
          rules,
          ...otherProps,
        })(children)}
        {descr && <div>{descr}</div>}
      </Form.Item>
    );
  }
}

export default FormItem;
