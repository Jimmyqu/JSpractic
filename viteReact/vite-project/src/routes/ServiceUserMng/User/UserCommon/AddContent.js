import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Select } from 'antd';
import Content from '@/components/Datatable/Content';
import { formItemLayoutNormal } from '@/utils/utils';
import Datatable from '@/components/Datatable';

@connect(({ pubserviceuser, venue, loading }) => ({
  pubserviceuser,
  venue,
  saving: loading.effects['pubserviceuser/addCertUser'],
}))
@Form.create()
class AddContent extends Component {
  state = {
    records: undefined,
  };

  doSure = () => {
    const { form, dispatch, sure = () => {}, careerId } = this.props;
    const { records } = this.state;
    form.validateFieldsAndScroll(async (err, formData) => {
      if (err) {
        return;
      }
      await dispatch({
        type: 'pubserviceuser/addCertUser',
        payload: {
          ...formData,
          careerId,
          sysUserIds: records.map(item => item.id),
        },
      });
      sure();
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      records: rows,
    });
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      saving,
      pubserviceuser,
      venue,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { records } = this.state;

    const { Industries, ProfessionTypes } = venue;

    return (
      <Content
        title="添加"
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
            disabled: records == null || records.length === 0,
            action: this.doSure,
          },
        ]}
      >
        <Form {...formItemLayoutNormal}>
          <Row>
            <Col md={8}>
              <Form.Item label="行业类型">
                {form.getFieldDecorator('industryId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择行业类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(Industries).map(item => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="专业类型">
                {form.getFieldDecorator('professionalId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择专业类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {Object.values(ProfessionTypes).map(item => (
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
        <Row>
          <Col md={16}>
            <Datatable
              personalization={false}
              select="multi"
              onSelectedChange={this.handleSelectedChange}
              url="/sysUser/dataList.do"
              columns={[
                {
                  title: '真实姓名',
                  dataIndex: 'realName',
                  width: 150,
                },
                {
                  title: '手机号',
                  dataIndex: 'mobile',
                  width: 120,
                },
                {
                  title: '单位名称',
                  dataIndex: 'companyName',
                  width: 200,
                },
              ]}
              rowKey="id"
              formSearch={{
                col: {
                  sm: 24,
                  md: 8,
                },
                fields: [
                  {
                    label: '姓名',
                    name: 'realName',
                  },
                  {
                    label: '手机号',
                    name: 'mobile',
                  },
                ],
              }}
            />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default AddContent;
