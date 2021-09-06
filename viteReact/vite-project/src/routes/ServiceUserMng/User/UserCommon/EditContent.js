import { Component } from 'react';
// import moment from 'moment';
import { connect } from 'react-redux';
import { Row, Col, Form, Select, InputNumber } from 'antd';
import Content from '@/components/Datatable/Content';
import ExtFormItem from '@/components/ExtFormItem';
import { formItemLayoutNormal } from '@/utils/utils';
import { converFormDataToServerReady } from '@/utils/form';

@connect(({ pubserviceuser, venue, extfield, loading }) => ({
  pubserviceuser,
  venue,
  extfield,
  editing: loading.effects['pubserviceuser/updateCertUser'],
  fetching: loading.effects['pubserviceuser/fetchCertUser'],
}))
@Form.create()
class EditContent extends Component {
  state = {
    certUserExtInfo: null,
  };

  async componentDidMount() {
    const { dispatch, selectedRows } = this.props;
    const result = await dispatch({
      type: 'pubserviceuser/fetchCertUser',
      payload: selectedRows?.[0]?.id,
    });
    this.setState({
      certUserExtInfo: result,
    });
  }

  getExtfields = () => {
    const {
      extfield: { ExtDataTypes },
    } = this.props;
    const { certUserExtInfo } = this.state;

    return (certUserExtInfo?.extValueList || []).filter(item => item.extDataType !== ExtDataTypes.Contact.key);
  };

  doSure = () => {
    const { form, dispatch, selectedRows, sure = () => {} } = this.props;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }

      const extfields = this.getExtfields();
      const { ranks, ...careerCertData } = converFormDataToServerReady(extfields, formData);
      await dispatch({
        type: 'pubserviceuser/updateCertUser',
        payload: {
          ranks,
          careerCertData,
          userExtId: selectedRows?.[0]?.id,
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
      editing,
      fetching,
      pubserviceuser,
      venue,
      extfield,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const { Industries, ProfessionTypes } = venue;

    const selectedRow = selectedRows?.[0] || {};

    const extfields = this.getExtfields();

    return (
      <Content
        title="编辑"
        loading={fetching}
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
              <Form.Item label="行业类型">
                <Select defaultValue={selectedRow.industryId} disabled>
                  {Object.values(Industries).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="项目类型">
                <Select defaultValue={selectedRow.professionalId} disabled>
                  {Object.values(ProfessionTypes).map(item => (
                    <Select.Option key={item.key} value={item.key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {extfields.map(field => (
              <Col md={8} key={field.extName}>
                <ExtFormItem field={field} form={form} canEdit />
              </Col>
            ))}
            <Col md={8}>
              <Form.Item label="排序">
                {form.getFieldDecorator('ranks', {
                  initialValue: selectedRow.ranks,
                })(<InputNumber precision={0} placeholder="请填写" className="full-width" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    );
  }
}

export default EditContent;
