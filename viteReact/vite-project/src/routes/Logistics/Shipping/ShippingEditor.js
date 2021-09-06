import { Component } from 'react';
import { Form, Input, Cascader } from 'antd';
import { cascaderData } from '@/commons/lib/home-town';
import { checkMobile } from '@/commons/lib/validator';
import { formItemLayoutFull } from '@/utils/utils';

@Form.create()
class ShippingEdit extends Component {
  componentDidMount() {
    const { onInit, form } = this.props;
    if (onInit) {
      onInit({
        validate: cb => {
          form.validateFieldsAndScroll(cb);
        },
        doSubmit: this.doSubmit,
      });
    }
  }

  doSubmit = arg => {
    const {
      form,
      dispatch,
      onOk,
      data: { id },
    } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const formValues = {
        ...formData,
      };
      const [province, city, district] = formValues.pcd;
      delete formValues.pcd;
      arg.deepCallOk(() => {
        return dispatch({
          type: 'logistics/editConsignee',
          payload: {
            ...formValues,
            province,
            city,
            district,
            dealShippingId: id,
          },
        }).then(() => {
          onOk(arg, formValues);
        });
      });
    });
  };

  render() {
    const { form, data } = this.props;
    const { consigneeName, consigneeMobile, province, city, district, consigneeAddress } = data || {};
    return (
      <Form {...formItemLayoutFull}>
        <Form.Item label="收件人">
          {form.getFieldDecorator('consigneeName', {
            initialValue: consigneeName,
            rules: [
              {
                required: true,
                message: '请填写收件人',
              },
            ],
          })(<Input placeholder="请填写" />)}
        </Form.Item>
        <Form.Item label="收件人手机号">
          {form.getFieldDecorator('consigneeMobile', {
            initialValue: consigneeMobile,
            rules: [
              {
                required: true,
                message: '请填写收件人手机号',
              },
              {
                min: 11,
                max: 11,
                message: '请输入正确的手机号码',
                validator: checkMobile,
              },
            ],
          })(<Input placeholder="请填写" />)}
        </Form.Item>
        <Form.Item label="所在地区">
          {form.getFieldDecorator('pcd', {
            initialValue: [province, city, district],
            rules: [
              {
                required: true,
                message: '请选择所在地区',
              },
            ],
          })(<Cascader options={cascaderData} placeholder="请选择地区" />)}
        </Form.Item>
        <Form.Item label="详细地址">
          {form.getFieldDecorator('consigneeAddress', {
            initialValue: consigneeAddress,
            rules: [
              {
                required: true,
                message: '请选择详细地址',
              },
            ],
          })(<Input.TextArea placeholder="请填写" maxLength={500} />)}
        </Form.Item>
      </Form>
    );
  }
}

export default ShippingEdit;
