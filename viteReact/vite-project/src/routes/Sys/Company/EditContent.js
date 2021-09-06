import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, Input, Upload, Button } from 'antd';
import Content from '@/components/Datatable/Content';
import {
  genUploadImgCustomRequest,
  FileAccept,
  formUploadOtherProps,
  fileMapper,
  formFileMapper,
} from '@/utils/upload';
import { checkUpload } from '@/commons/lib/validator';
import { formItemLayoutNormal, toUndefinedIfNull } from '@/utils/utils';

@connect(({ company, loading }) => ({
  company,
  editing: loading.effects['company/edit'],
}))
@Form.create()
class EditContent extends Component {
  // eslint-disable-next-line react/destructuring-assignment
  customRequest = genUploadImgCustomRequest({ dispatch: this.props.dispatch });

  getPostFileKey = value => (Array.isArray(value) ? formFileMapper(value)[0] : formFileMapper(value));

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const { picUrl, sysCompanyAuditInfoVO } = formData;
      await dispatch({
        type: 'company/edit',
        payload: {
          ...formData,
          picUrl: Array.isArray(picUrl) ? formFileMapper(picUrl)[0] : formFileMapper(picUrl),
          sysCompanyAuditInfoVO: {
            ...sysCompanyAuditInfoVO,
            img: this.getPostFileKey(sysCompanyAuditInfoVO.img),
            businessLicense: this.getPostFileKey(sysCompanyAuditInfoVO.businessLicense),
            wechatPayNoImg: this.getPostFileKey(sysCompanyAuditInfoVO.wechatPayNoImg),
            relevantDocuments: this.getPostFileKey(sysCompanyAuditInfoVO.relevantDocuments),
          },
          id: selectedRows[0].id,
        },
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
      dispatch,
      cancel,
      sure,
      editing,
      company: { CompanyStatus, IdCardTypes },
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    return (
      <Content
        title="编辑"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: editing,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: editing,
            action: this.doSure,
          },
        ]}
      >
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col md={8}>
              <Form.Item label="单位全称">
                {form.getFieldDecorator('companyName', {
                  initialValue: selectedRows[0].companyName,
                  rules: [
                    {
                      required: true,
                      message: '请填写单位全称',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="状态">
                {form.getFieldDecorator('status', {
                  initialValue: toUndefinedIfNull(selectedRows[0].status),
                  rules: [
                    {
                      required: true,
                      message: '请选择状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(CompanyStatus).map(item => (
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="单位邮箱">
                {form.getFieldDecorator('email', {
                  initialValue: selectedRows[0].email,
                  rules: [
                    {
                      required: true,
                      message: '请填写单位邮箱',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="法人">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.corporate', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.corporate,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写法人',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="法人电话">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.corporateTel', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.corporateTel,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写法人电话',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="办公电话">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.officeTel', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.officeTel,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写办公电话',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="办公地点">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.officeLocation', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.officeLocation,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写办公地点',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="证件类型">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.idCardType', {
                  initialValue: toUndefinedIfNull(selectedRows[0].sysCompanyAuditInfoVO.idCardType),
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请选择证件类型',
                  //   },
                  // ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(IdCardTypes).map(item => (
                      <Select.Option value={item.key} key={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="证件号码">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.idCardNo', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.idCardNo,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写证件号码',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="开户银行">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.bankName', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.bankName,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写办公地点',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="银行卡号">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.bankCardNo', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.bankCardNo,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写办公地点',
                  //   },
                  // ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="微信商户号">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.wechatPayNo', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.wechatPayNo,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="微信商户号图片">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.wechatPayNoImg', {
                  ...formUploadOtherProps,
                  initialValue: selectedRows[0].wechatPayNoImg ? [selectedRows[0].wechatPayNoImg].map(fileMapper) : [],
                  rules: [
                    {
                      validator: checkUpload,
                    },
                  ],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('sysCompanyAuditInfoVO.wechatPayNoImg', target)}
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="支付宝账号">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.alipayNo', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.alipayNo,
                })(<Input placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="相关证件">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.relevantDocuments', {
                  ...formUploadOtherProps,
                  initialValue: selectedRows[0].relevantDocuments
                    ? [selectedRows[0].relevantDocuments].map(fileMapper)
                    : [],
                  rules: [
                    {
                      validator: checkUpload,
                    },
                  ],
                })(
                  <Upload
                    accept={FileAccept.IMG}
                    customRequest={this.customRequest}
                    onChange={target => this.onFileChange('sysCompanyAuditInfoVO.relevantDocuments', target)}
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="证书">
                {form.getFieldDecorator('picUrl', {
                  ...formUploadOtherProps,
                  initialValue: selectedRows[0].fileItemVO ? [selectedRows[0].fileItemVO].map(fileMapper) : [],
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
                    onChange={target => this.onFileChange('picUrl', target)}
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="经营范围图片">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.img', {
                  ...formUploadOtherProps,
                  initialValue: [(selectedRows[0].sysCompanyAuditInfoVO || {}).fileItemVO || {}].map(fileMapper),
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
                    onChange={target => this.onFileChange('sysCompanyAuditInfoVO.img', target)}
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="经营范围">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.businessScope', {
                  initialValue: selectedRows[0].sysCompanyAuditInfoVO.businessScope,
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '请填写经营范围',
                  //   },
                  // ],
                })(<Input.TextArea placeholder="请填写" />)}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="营业许可证">
                {form.getFieldDecorator('sysCompanyAuditInfoVO.businessLicense', {
                  ...formUploadOtherProps,
                  initialValue: [(selectedRows[0].sysCompanyAuditInfoVO || {}).businessLicense || {}].map(fileMapper),
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
                    onChange={target => this.onFileChange('sysCompanyAuditInfoVO.businessLicense', target)}
                  >
                    <Button icon="upload">上传</Button>
                  </Upload>
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
