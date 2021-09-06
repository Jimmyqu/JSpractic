import { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import Item, { ItemTypes } from '@/components/Datatable/Item';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubservice, loading }) => ({
  pubservice,
  changIng: loading.effects['pubservice/changePublicServiceAccountPeriod'],
}))
@Form.create()
class UpdateContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'pubservice/changePublicServiceAccountPeriod',
        payload: {
          ...formData,
          id: selectedRows[0].id,
          startDate: formData.startDate.valueOf(),
          endDate: formData.endDate.valueOf(),
        },
      });
      sure();
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      changIng,
      pubservice,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    return (
      <Content
        title="调整有效期"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: changIng,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: changIng,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="开始时间">
                {form.getFieldDecorator('startDate', {
                  initialValue: moment(selectedRows[0].startDate),
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间',
                    },
                  ],
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeStart}
                    form={form}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={handleComposeStateChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="结束时间">
                {form.getFieldDecorator('endDate', {
                  initialValue: moment(selectedRows[0].endDate),
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间',
                    },
                  ],
                })(
                  <Item
                    compose="1"
                    type={ItemTypes.DatePickerRangeEnd}
                    form={form}
                    composeStateMapping={composeStateMapping}
                    handleComposeStateChange={handleComposeStateChange}
                  />
                )}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr')(<Input.TextArea placeholder="请填写" rows={3} />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default UpdateContent;
