import { Component } from 'react';
import { connect } from 'react-redux';
import { Form, message, Card, Input, Select } from 'antd';
import Datatable from '@/components/Datatable';
import Modal from '@/components/Modal';
import { formItemLayoutNormal } from '@/utils/utils';
import { formatDateTime } from '@/utils/format';
import { modal } from '@/utils/feedback';

@connect(({ pubuser, loading }) => ({
  pubuser,
  deleting: loading.effects['pubuser/deleteOuterRel'],
  saveing: loading.effects['pubuser/saveOuterRel'],
}))
@Form.create()
class ThreeGradeSetting extends Component {
  state = {
    showMode: undefined,
    selectedRows: {},
    visible: false,
  };

  componentDidMount() {
    const { dispatch, data } = this.props;
    const { companyId, srvId } = data[0].memberLevelConfig || {};
    dispatch({
      type: 'pubuser/getLevelList',
      payload: {
        srvId,
        companyId,
      },
    }).then(result => {
      this.setState({
        levelList: result,
      });
    });
  }

  handleVisibleChange = visible => {
    this.setState({
      visible,
    });
  };

  handleSelectedChange = (_, rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleTableInit = table => {
    this.table = table;
  };

  onSure = () => {
    const {
      form,
      dispatch,
      pubuser: { srvList },
    } = this.props;
    const { showMode, selectedRows, levelList = [] } = this.state;
    const edit = showMode === 1;
    form.validateFields(async (err, formData) => {
      if (err) {
        return;
      }
      const { levelId, srvId, ...formValues } = formData;
      if (edit) {
        formValues.id = selectedRows[0].id;
      }
      formValues.levelName = levelList.find(item => item.id === levelId).name;
      formValues.srvName = srvList.find(item => item.srvId === srvId).srvName;
      await dispatch({
        type: 'pubuser/saveOuterRel',
        payload: {
          ...formValues,
          levelId,
          srvId,
        },
      });
      if (edit) {
        message.success('编辑成功');
      } else {
        message.success('添加成功');
      }
      this.handleVisibleChange(false);
      this.table.reload();
    });
    return false;
  };

  operation = () => {
    const { deleting, dispatch } = this.props;
    return {
      buttons: [
        {
          text: '添加',
          disabled: deleting,
          action: () => {
            this.setState({
              visible: true,
              showMode: 0,
            });
          },
        },
        {
          text: '编辑',
          type: 'primary',
          forRow: 'single',
          disabled: deleting,
          action: () => {
            this.setState({
              visible: true,
              showMode: 1,
            });
          },
        },
        {
          text: '删除',
          type: 'danger',
          forRow: 'multi',
          loading: deleting,
          action: () => {
            modal.confirm('确认删除吗？', {
              onOk: () => {
                const { selectedRows } = this.state;
                dispatch({
                  type: 'pubuser/deleteOuterRel',
                  payload: {
                    id: selectedRows[0].id,
                  },
                }).then(() => {
                  message.success('删除成功');
                  this.table.reload();
                });
              },
            });
          },
        },
      ],
    };
  };

  render() {
    const {
      form,
      data,
      pubuser: { srvList },
    } = this.props;
    const { id, srvId } = data[0].memberLevelConfig;
    const { getFieldDecorator } = form;
    const { visible, showMode, selectedRows, levelList = [] } = this.state;
    const selectedRow = showMode === 1 ? selectedRows[0] || {} : {};
    return (
      <div>
        <Card bordered={false}>
          <Datatable
            url={`/memberLevelOuterRelAction/findOuterRelById.do?id=${id}`}
            columns={[
              {
                title: '编号',
                dataIndex: 'id',
                width: 100,
              },
              {
                title: '会员等级',
                dataIndex: 'levelConfigName',
                width: 100,
              },
              {
                title: '第三方对应等级名称',
                dataIndex: 'outerLevelName',
                width: 150,
              },
              {
                title: 'key',
                dataIndex: 'outerLevelKey',
                width: 80,
              },
              {
                title: '业务编号',
                dataIndex: 'srvId',
                width: 100,
              },
              {
                title: '业务名称',
                dataIndex: 'srvName',
                width: 100,
              },
              {
                title: '备注',
                dataIndex: 'remark',
                width: 250,
              },
              {
                title: '更新时间',
                dataIndex: 'gmtModified',
                render: formatDateTime,
                width: 170,
              },
              {
                title: '创建人',
                dataIndex: 'createRealName',
                width: 100,
              },
              {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                render: formatDateTime,
                width: 170,
              },
              {
                title: '单位名称',
                dataIndex: 'companyName',
                width: 150,
              },
            ]}
            rowKey="id"
            operation={this.operation()}
            pagination={false}
            select="multi"
            onInit={this.handleTableInit}
            onSelectedChange={this.handleSelectedChange}
          />
        </Card>
        <Modal
          title={showMode === 0 ? '添加' : '编辑'}
          width={630}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          onOk={this.onSure}
        >
          <Form {...formItemLayoutNormal}>
            <Form.Item label="会员等级">
              {getFieldDecorator('levelId', {
                initialValue: id || selectedRow.levelConfigId,
                rules: [
                  {
                    required: true,
                    message: '请选择会员等级',
                  },
                ],
              })(
                <Select placeholder="请选择" disabled>
                  {levelList.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="第三方对应等级名称">
              {getFieldDecorator('outerLevelName', {
                initialValue: selectedRow.outerLevelName,
                rules: [
                  {
                    required: true,
                    message: '请填写第三方对应等级名称',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="key">
              {getFieldDecorator('outerLevelKey', {
                initialValue: selectedRow.outerLevelKey,
                rules: [
                  {
                    required: true,
                    message: '请填写key',
                  },
                ],
              })(<Input placeholder="请填写" />)}
            </Form.Item>
            <Form.Item label="业务名称">
              {getFieldDecorator('srvId', {
                initialValue: srvId,
              })(
                <Select placeholder="请选择" disabled>
                  {srvList.map(item => (
                    <Select.Option key={item.srvId} value={item.srvId}>
                      {item.srvName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ThreeGradeSetting;
