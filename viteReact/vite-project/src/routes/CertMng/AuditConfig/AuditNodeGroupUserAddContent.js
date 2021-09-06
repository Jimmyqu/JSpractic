import { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import Content from '@/components/Datatable/Content';
import Datatable from '@/components/Datatable';

@connect(({ pubserviceuser, loading }) => ({
  pubserviceuser,
  saving: loading.effects['pubserviceuser/addAuditNodeGroupUser'],
}))
class AddContent extends Component {
  state = {
    selectedRows: undefined,
  };

  columns = [
    {
      title: '真实姓名',
      dataIndex: 'realName',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'companyName',
      width: 150,
    },
  ];

  formSearch = {
    col: 8,
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
  };

  doSure = async () => {
    const { groupId, dispatch, sure = () => {} } = this.props;
    const { selectedRows } = this.state;

    await dispatch({
      type: 'pubserviceuser/addAuditNodeGroupUser',
      payload: {
        groupId,
        sysUserIds: selectedRows.map(item => item.id),
      },
    });
    sure();
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  render() {
    const {
      dispatch,
      cancel,
      sure,
      saving,
      groupId,
      auditConfigId,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;

    const { selectedRows: rows } = this.state;

    return (
      <Content
        title="关联人员"
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
            disabled: rows == null || rows.length === 0,
            loading: saving,
            action: this.doSure,
          },
        ]}
      >
        <Row>
          <Col md={12}>
            <Datatable
              personalization={false}
              select="multi"
              onSelectedChange={this.handleSelectedChange}
              url={`/auditGroupUser/sysUserList.do?configId=${auditConfigId}&groupId=${groupId}`}
              columns={this.columns}
              rowKey="id"
              formSearch={this.formSearch}
            />
          </Col>
        </Row>
      </Content>
    );
  }
}

export default AddContent;
