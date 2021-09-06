import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Select, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import { encodeMoney, decodeMoney, formatModel } from '@/utils/format';
import { formItemLayoutNormal } from '@/utils/utils';

@connect(({ pubinvoice, loading }) => ({
  pubinvoice,
  invoicing: loading.effects['pubinvoice/invoice'],
  companyLoading: loading.effects['pubinvoice/fetchAllCompany'],
}))
@Form.create()
class InvoiceContent extends Component {
  componentDidMount() {
    const { dispatch, pubAccountId } = this.props;
    dispatch({
      type: 'pubinvoice/fetchAllCompany',
      payload: {
        pubAccountId,
      },
    });
  }

  doSure = () => {
    const { form, dispatch, sure = () => {}, selectedRows, pubAccountId } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      const result = await dispatch({
        type: 'pubinvoice/invoice',
        payload: {
          ...formData,
          invoiceMoney: encodeMoney(formData.invoiceMoney),
          pubAccountId,
          dealIds: selectedRows.map(({ id }) => id),
        },
      });
      sure(result);
    });
  };

  handleIssueTypeChange = () => {
    const { form } = this.props;
    form.setFieldsValue({
      invoiceInfoId: undefined,
      email: undefined,
    });
  };

  handleInvoiceInfoIdChange = id => {
    const {
      form,
      pubinvoice: { companyList },
    } = this.props;
    const { email } = (companyList || []).find(item => item.id === id) || {};
    form.setFieldsValue({
      email,
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      pubinvoice: { InvoiceIssueTypes, InvoiceModeTypes, InvoiceTypes, companyList },
      invoicing,
      companyLoading,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const issueType = form.getFieldValue('issueType');
    const invoiceInfoId = form.getFieldValue('invoiceInfoId');

    const isCompany = issueType === InvoiceIssueTypes.ENTERPRISE.key;

    const company = isCompany ? companyList.find(item => item.id === invoiceInfoId) : null;

    const total = selectedRows.reduce((prev, { dealAmount }) => prev + dealAmount, 0);

    return (
      <Content
        title="编辑"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: invoicing || companyLoading,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            disabled: companyLoading,
            loading: invoicing,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Form {...formItemLayoutNormal}>
              <Form.Item label="开具类型">
                {form.getFieldDecorator('issueType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开具类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择" onChange={this.handleIssueTypeChange}>
                    {Object.values(InvoiceIssueTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {isCompany ? (
                <Form.Item label="发票抬头">
                  {form.getFieldDecorator('invoiceInfoId', {
                    rules: [
                      {
                        required: true,
                        message: '请选择开具类型',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" onChange={this.handleInvoiceInfoIdChange}>
                      {companyList.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.invoiceName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              ) : (
                <Form.Item label="姓名">
                  {form.getFieldDecorator('personName')(<Input placeholder="请填写" />)}
                </Form.Item>
              )}
              <Form.Item label="开票方式">
                {form.getFieldDecorator('invoiceMode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开票方式',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(InvoiceModeTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="发票类型">
                {form.getFieldDecorator('invoiceType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择发票类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(InvoiceTypes).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="开票总额">
                {form.getFieldDecorator('invoiceMoney', {
                  initialValue: decodeMoney(total),
                  rules: [
                    {
                      required: true,
                      message: '请填写开票总额',
                    },
                  ],
                })(<InputNumber placeholder="请填写" min={0} precision={2} className="full-width" />)}
              </Form.Item>
              <Form.Item label="收件邮箱">
                {form.getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: '请输入正确的邮件格式',
                    },
                  ],
                })(<Input placeholder="请填写" />)}
              </Form.Item>
              <Form.Item label="备注">
                {form.getFieldDecorator('invoiceNote')(<Input.TextArea placeholder="请填写" rows={4} />)}
              </Form.Item>
            </Form>
          </Col>
          {company != null && (
            <Col md={12}>
              <Row>
                <Col span={6}>开具类型：</Col>
                <Col span={4}>{formatModel(InvoiceIssueTypes, issueType)}</Col>
              </Row>
              <Row>
                <Col span={6}>开票方式：</Col>
                <Col span={4}>{formatModel(InvoiceModeTypes, form.getFieldValue('invoiceMode'))}</Col>
              </Row>
              <Row>
                <Col span={6}>发票类型：</Col>
                <Col span={4}>{formatModel(InvoiceTypes, form.getFieldValue('invoiceType'))}</Col>
              </Row>
              <Row>
                <Col span={6}>发票抬头：</Col>
                <Col span={4}>{company.invoiceName}</Col>
              </Row>
              <Row>
                <Col span={6}>开户银行：</Col>
                <Col span={4}>{company.bankName}</Col>
              </Row>
              <Row>
                <Col span={6}>开户账号：</Col>
                <Col span={4}>{company.bankAccount}</Col>
              </Row>
              <Row>
                <Col span={6}>单位注册地址：</Col>
                <Col span={4}>{company.regAddress}</Col>
              </Row>
              <Row>
                <Col span={6}>联系电话：</Col>
                <Col span={4}>{company.contact}</Col>
              </Row>
              <Row>
                <Col span={6}>收件邮箱：</Col>
                <Col span={4}>{company.email}</Col>
              </Row>
            </Col>
          )}
        </Row>
      </Content>
    );
  }
}

export default InvoiceContent;
