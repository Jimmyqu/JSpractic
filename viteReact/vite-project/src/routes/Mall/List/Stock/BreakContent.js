import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, InputNumber, Input } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ store, loading }) => ({
  store,
  breaking: loading.effects['store/breakNum'],
}))
@Form.create()
class BreakContent extends Component {
  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'store/breakNum',
        payload: {
          ...formData,
          itemStockId: selectedRows[0].id,
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
      store,
      breaking,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    return (
      <Content
        title="报损"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: breaking,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: breaking,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="商品编号">
                <Input value={selectedRows[0].itemId} disabled readOnly />
              </Form.Item>
              <Form.Item label="商品名称">
                <Input value={selectedRows[0].itemName} disabled readOnly />
              </Form.Item>
              <Form.Item label="单位">
                <Input value={selectedRows[0].stockUnit} disabled readOnly />
              </Form.Item>
              <Form.Item label="当前库存">
                <Input value={selectedRows[0].stockCount} disabled readOnly />
              </Form.Item>
              <Form.Item label="报损数量">
                {form.getFieldDecorator('num', {
                  initialValue: 0,
                  rules: [
                    {
                      message: '报损数量必须大于0',
                      validator(rule, value, fn) {
                        if (value > 0) {
                          fn();
                          return;
                        }
                        fn([new Error('invalid')]);
                      },
                    },
                  ],
                })(
                  <InputNumber
                    placeholder="请填写"
                    className="full-width"
                    min={0}
                    max={selectedRows[0].stockCount}
                    precision={0}
                  />
                )}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('descr', {})(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default BreakContent;
