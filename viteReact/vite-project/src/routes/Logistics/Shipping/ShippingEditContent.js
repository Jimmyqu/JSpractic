import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { modal } from '@/utils/feedback';
import Content from '@/components/Datatable/Content';
import ShippingEditor from './ShippingEditor';

@connect(({ logistics, loading }) => ({
  logistics,
  saving: loading.effects['logistics/editConsignee'],
}))
class ShippingEditContent extends Component {
  doSure = () => {
    this.editor.validate(err => {
      if (err) {
        return;
      }
      modal.confirm('确定要修改收件人信息吗？', {
        onOk: () => {
          this.editor.doSubmit({
            // 模拟arg
            deepCallOk: cb => {
              cb();
            },
          });
        },
      });
    });
    return false;
  };

  onEditorInit = editor => {
    this.editor = editor;
  };

  render() {
    const {
      form,
      dispatch,
      saving,
      cancel = () => {},
      sure,
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      logistics,
      ...restProps
    } = this.props;

    const data = selectedRows[0];

    return (
      <Content
        title="修改收件人信息"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: saving,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: saving,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <ShippingEditor dispatch={dispatch} data={data} onOk={sure} onInit={this.onEditorInit} />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default ShippingEditContent;
