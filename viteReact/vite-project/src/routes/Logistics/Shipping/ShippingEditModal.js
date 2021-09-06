import { Component } from 'react';
import { connect } from 'react-redux';
import { modal } from '@/utils/feedback';
import Modal from '@/components/Modal';
import ShippingEditor from './ShippingEditor';

@connect(({ logistics }) => ({
  logistics,
}))
class ShippingEditModal extends Component {
  sure = arg => {
    this.editor.validate(err => {
      if (err) {
        return;
      }
      modal.confirm('确定要修改收件人信息吗？', {
        onOk: () => {
          this.editor.doSubmit(arg);
        },
      });
    });
    return false;
  };

  onEditorInit = editor => {
    this.editor = editor;
  };

  render() {
    const { data, onOk, form, dispatch, ...restProps } = this.props;
    return (
      <Modal title="修改收件人信息" {...restProps} onOk={this.sure}>
        <ShippingEditor dispatch={dispatch} data={data} onOk={onOk} onInit={this.onEditorInit} />
      </Modal>
    );
  }
}

export default ShippingEditModal;
