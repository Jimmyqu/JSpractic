import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, Upload, Button, InputNumber, message } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import { genUploadImgCustomRequest, FileAccept, formUploadOtherProps, fileMapper } from '@/utils/upload';
import { checkUpload } from '@/commons/lib/validator';
import styles from '../index.less';

@connect(({ pubuser, loading }) => ({
  pubuser,
  saving: loading.effects['pubuser/saveMemberEquity'],
}))
@Form.create()
class EditContent extends Component {
  // eslint-disable-next-line react/destructuring-assignment
  customRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });

  getPostFileKey = value => (Array.isArray(value) ? value[0].response : value.response);

  doSure = () => {
    const { form, dispatch, sure = () => {}, edit, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { alreadyPic, notHavePic, ...formValues } = formData;
      if (edit) {
        formValues.id = selectedRows[0].memberLevelEquity.id;
      }
      await dispatch({
        type: 'pubuser/saveMemberEquity',
        payload: {
          ...formValues,
          alreadyPic: this.getPostFileKey(alreadyPic),
          notHavePic: this.getPostFileKey(notHavePic),
        },
      }).then(() => {
        if (edit) {
          message.success('编辑成功');
        } else {
          message.success('添加成功');
        }
      });
      sure();
    });
  };

  onFileChange = (name, { file }) => {
    if (file && file.status === 'done') {
      const { form } = this.props;
      setTimeout(() => {
        form.setFieldsValue({
          [name]: [file],
        });
      }, 0);
    }
  };

  render() {
    const {
      form,
      cancel,
      sure,
      saving,
      fetching,
      pubuser: { UserStatus, MemberIntersts },
      edit,
      selectedRows,
      ...restProps
    } = this.props;

    const { getFieldDecorator } = form;
    const editObj = edit ? (selectedRows || [])[0] || {} : {};
    const configObj = editObj.memberLevelEquity ? editObj.memberLevelEquity || {} : {};

    return (
      <Content
        title={`${edit ? '编辑' : '添加'}`}
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
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col md={12}>
              <Form.Item label="权益名称">
                {getFieldDecorator('equityName', {
                  initialValue: configObj.equityName,
                  rules: [
                    {
                      required: true,
                      message: '请填写权益名称',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="权益分类">
                {getFieldDecorator('equityTag', {
                  initialValue: configObj.equityTag,
                  rules: [
                    {
                      required: true,
                      message: '请选择权益分类',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(MemberIntersts).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="已拥有状态图">
                {form.getFieldDecorator('alreadyPic', {
                  ...formUploadOtherProps,
                  initialValue: editObj.alreadyPic ? [editObj.alreadyPic].map(fileMapper) : [],
                  rules: [
                    {
                      required: true,
                      validator: checkUpload,
                    },
                  ],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('alreadyPic', target)}
                  >
                    <Button icon="upload" type="primary">
                      选择
                    </Button>
                    <span className={styles.tip}>上传图标建议64x64px</span>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item label="未拥有状态图">
                {form.getFieldDecorator('notHavePic', {
                  ...formUploadOtherProps,
                  initialValue: editObj.notHavePic ? [editObj.notHavePic].map(fileMapper) : [],
                  rules: [
                    {
                      required: true,
                      validator: checkUpload,
                    },
                  ],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('notHavePic', target)}
                  >
                    <Button icon="upload" type="primary">
                      选择
                    </Button>
                    <span className={styles.tip}>上传图标建议64x64px</span>
                  </Upload>
                )}
              </Form.Item>
              <Form.Item label="权益说明">
                {getFieldDecorator('equityDesc', { initialValue: configObj.equityDesc })(
                  <Input.TextArea rows={3} placeholder="请填写" />
                )}
              </Form.Item>
              <Form.Item label="排序">
                {getFieldDecorator('ranks', {
                  initialValue: configObj.ranks,
                })(<InputNumber className="full-width" precision={0} min={0} placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="备注">
                {getFieldDecorator('remark', { initialValue: configObj.remark })(<Input.TextArea rows={3} />)}
              </Form.Item>
              <Form.Item label="状态">
                {getFieldDecorator('equityState', {
                  initialValue: configObj.equityState,
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(UserStatus).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    );
  }
}

export default EditContent;
