import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import Datatable, { ItemTypes } from '@/components/Datatable';
import { modelMapToOption } from '@/utils/utils';
import Modal from '@/components/Modal';

@connect(({ pubuser, loading }) => ({
  pubuser,
  saving: loading.effects['pubuser/relevanceBusiness'],
}))
class RelevanceBusinessModal extends Component {
  state = {
    selectedRows: null,
  };

  handleLoadData = list => {
    this.setState({
      selectedRows: list.filter(item => item.flag),
    });
  };

  render() {
    const {
      data,
      visible,
      onOk,
      onVisibleChange,
      dispatch,
      saving,
      pubuser: { BusinessTypes },
      ...restProps
    } = this.props;
    const { selectedRows } = this.state;
    const { memberLevelEquity, relType } = (data || [])[0] || {};
    const initialRelType = relType || Object.values(BusinessTypes)[0].key;
    const equityId = memberLevelEquity ? memberLevelEquity.id : null;
    return (
      <Modal
        title="关联业务内容"
        width={1024}
        {...restProps}
        visible={visible}
        onVisibleChange={onVisibleChange}
        footer={[
          <Button key="close" link="cancel" disabled={saving} />,
          <Button key="ok" link="ok" disabled={selectedRows == null || selectedRows.length === 0} loading={saving} />,
        ]}
        onOk={arg => {
          const fn = () =>
            dispatch({
              type: 'pubuser/relevanceBusiness',
              payload: {
                dataId: selectedRows[0].id,
                dataName: selectedRows[0].serviceName,
                memberLevelEquityId: equityId,
                relType: initialRelType,
              },
            }).then(() => {
              message.success('关联成功');
              onOk(arg);
            });
          return fn();
        }}
      >
        <Datatable
          url={`/memberLevelEquityAction/findRelevanceByCompanyId.do?equityId=${equityId}`}
          rowKey="id"
          select="single"
          pagination={false}
          personalization={false}
          onLoadData={this.handleLoadData}
          rowSelection={{
            selectedRows,
          }}
          onSelectedChange={(_, rows) => {
            this.setState({
              selectedRows: rows,
            });
          }}
          formSearch={{
            fields: [
              {
                label: '业务数据类型',
                name: 'interstsName',
                optionAll: false,
                options: modelMapToOption(BusinessTypes),
                initialValue: initialRelType,
                type: ItemTypes.Select,
              },
            ],
          }}
          columns={[
            {
              title: '数据编号',
              dataIndex: 'id',
              width: 100,
            },
            {
              title: '服务名称',
              dataIndex: 'serviceName',
              width: 200,
            },
            {
              title: '单位名称',
              dataIndex: 'companyName',
              width: 100,
            },
          ]}
        />
      </Modal>
    );
  }
}

export default RelevanceBusinessModal;
