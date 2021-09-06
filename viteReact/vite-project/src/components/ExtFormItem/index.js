import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input, Select, Upload, Button, DatePicker, TimePicker, InputNumber } from 'antd';
import { FileAccept, genUploadDocCustomRequest, genUploadImgCustomRequest } from '@/utils/upload';
import ethnicList from '@/commons/lib/data/ethnic';
import FormItem from './FormItem';

@connect(({ extfield }) => ({
  extfield,
}))
class ExtFormItem extends Component {
  static contextTypes = {
    declareFillList: PropTypes.array,
  };

  state = {
    open: false,
  };

  // eslint-disable-next-line react/destructuring-assignment
  customDocRequest = genUploadDocCustomRequest({ dispatch: this.props.dispatch });

  // eslint-disable-next-line react/destructuring-assignment
  customImgRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });

  handleOpenChange = open => {
    this.setState({
      open,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const {
      field,
      form,
      canEdit,
      extfield: { ExtDataTypes },
      dispatch,
      ...props
    } = this.props;
    if (form == null) {
      return null;
    }
    const { open } = this.state;
    const { declareFillList } = this.context;

    let disabled = !canEdit;
    const { extDataType, placeholder, dataValue, extDataTypeValue, single, extName, descr } = field || {};

    let dataValueOverride = dataValue;
    let descrOverride = descr;

    const declareFill = (declareFillList || []).find(item => item.name === extName);
    if (declareFill) {
      const { value, descr: ds } = declareFill;
      disabled = true;
      if (value) {
        dataValueOverride = value;
      }
      if (ds) {
        descrOverride = ds;
      }
    }

    const newField = {
      ...field,
      dataValue: dataValueOverride,
      descr: descrOverride,
    };

    const itemProps = {};
    if (placeholder != null) {
      itemProps.placeholder = placeholder;
    }

    const nowValue = form.getFieldValue(extName);
    switch (extDataType) {
      // 1 文本
      case ExtDataTypes.Text.key:
      // 11 身份证
      // eslint-disable-next-line no-fallthrough
      case ExtDataTypes.IDCard.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Input placeholder="请填写" {...itemProps} disabled={disabled} />
          </FormItem>
        );
      // 2 数字
      case ExtDataTypes.Number.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <InputNumber placeholder="请填写" className="full-width" {...itemProps} disabled={disabled} />
          </FormItem>
        );
      // 3 下拉
      case ExtDataTypes.Select.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Select placeholder="请选择" mode={single ? undefined : 'multiple'} {...itemProps} disabled={disabled}>
              {(extDataTypeValue || []).map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        );
      // 4 文档
      case ExtDataTypes.ImgFile.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Upload
              accept={FileAccept.IMG}
              customRequest={this.customImgRequest}
              multiple={!single}
              {...itemProps}
              disabled={disabled || (single && Array.isArray(nowValue) && nowValue.length > 0)}
            >
              <Button icon="upload" disabled={disabled || (single && Array.isArray(nowValue) && nowValue.length > 0)}>
                上传
              </Button>
              &nbsp;
              {itemProps.placeholder}
              &nbsp; 上传图片格式为：jpg, png, gif
            </Upload>
          </FormItem>
        );
      // 5 文档
      case ExtDataTypes.DocFile.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Upload
              accept={FileAccept.DOC}
              customRequest={this.customDocRequest}
              multiple={!single}
              {...itemProps}
              disabled={disabled || (single && Array.isArray(nowValue) && nowValue.length > 0)}
            >
              <Button icon="upload" disabled={disabled || (single && Array.isArray(nowValue) && nowValue.length > 0)}>
                上传
              </Button>
              &nbsp;
              {itemProps.placeholder}
              &nbsp; 上传附件格式为：xls,xlsx,ppt,pptx,docx,doc,pdf
            </Upload>
          </FormItem>
        );
      // 7 文本域
      case ExtDataTypes.TextArea.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Input.TextArea placeholder="请填写" rows={4} autoSize {...itemProps} disabled={disabled} />
          </FormItem>
        );
      // 8 日期
      case ExtDataTypes.Date.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <DatePicker placeholder="请选择" className="full-width" {...itemProps} disabled={disabled} />
          </FormItem>
        );
      // 9 时分
      case ExtDataTypes.HourAndMinute.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <TimePicker
              {...itemProps}
              className="full-width"
              disabled={disabled}
              format="HH:mm"
              placeholder="请选择"
              open={open}
              onOpenChange={this.handleOpenChange}
              addon={() => (
                <Button size="small" type="primary" onClick={this.handleClose}>
                  Ok
                </Button>
              )}
            />
          </FormItem>
        );
      // 10.日期时间
      case ExtDataTypes.DateTime.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <DatePicker placeholder="请选择" className="full-width" {...itemProps} disabled={disabled} showTime />
          </FormItem>
        );
      // 11.民族
      case ExtDataTypes.Ethnic.key:
        return (
          <FormItem form={form} field={newField} {...props}>
            <Select placeholder="请选择" mode={single ? undefined : 'multiple'} {...itemProps} disabled={disabled}>
              {ethnicList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        );
      default:
        return null;
    }
  }
}

export default ExtFormItem;
