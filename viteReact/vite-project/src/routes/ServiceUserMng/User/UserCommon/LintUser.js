import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Content from '@/components/Datatable/Content';
import Datatable from '@/components/Datatable';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  saving: loading.effects['pubserviceuser/certUserlinkPubUser'],
}))
class AddContent extends Component {
  state = {
    records: undefined,
  };

  doSure = async () => {
    const { dispatch, sure = () => {}, selectedRows } = this.props;
    const { records } = this.state;
    await dispatch({
      type: 'pubserviceuser/certUserlinkPubUser',
      payload: {
        id: selectedRows?.[0].id,
        pubAccountId: records?.[0].id,
      },
    });
    sure();
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
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { records } = this.state;

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
        <Row>
          <Col md={16}>
            <Datatable
              personalization={false}
              select="single"
              onSelectedChange={this.handleSelectedChange}
              url="/publicAccount/dataList.do"
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
