import { Component } from 'react';
import { Row, Col, Card } from 'antd';
import { connect } from 'react-redux';
import Content from '@/components/Datatable/Content';
import VerticalPairColumnTable from '@/components/VerticalPairColumnTable';
import { formatMoney } from '@/commons/lib/format';

const { PairColumn } = VerticalPairColumnTable;

@connect(({ pubmktmb, loading }) => ({
  pubmktmb,
  checkoutIng: loading.effects['pubmktmb/checkout'],
}))
class CheckoutContent extends Component {
  doSure = async () => {
    const { sure, dispatch, selectedRows } = this.props;
    await dispatch({
      type: 'pubmktmb/checkout',
      payload: selectedRows[0].id,
    });
    sure();
  };

  render() {
    const {
      form,
      dispatch,
      cancel,
      sure,
      checkoutIng,
      //
      selectedRows,
      composeStateMapping,
      handleComposeStateChange,
      ...restProps
    } = this.props;
    const { id, dealId, dealDescription, performanceTotalPrice, marketingTeamName, realName, mobile } = selectedRows[0];
    return (
      <Content
        title="结算分成"
        {...restProps}
        buttons={[
          {
            text: '取消',
            disabled: checkoutIng,
            action: cancel,
          },
          {
            text: '确定',
            type: 'primary',
            loading: checkoutIng,
            action: this.doSure,
          },
        ]}
      >
        <Card bordered={false}>
          <Row gutter={16}>
            <Col md={12}>
              <VerticalPairColumnTable labelCol={6} wrapperCol={14}>
                <PairColumn label="分成报表状态">{id}</PairColumn>
                <PairColumn label="销售分成总金额（元）">{formatMoney(performanceTotalPrice)}</PairColumn>
                <PairColumn label="主订单号">{dealId}</PairColumn>
                <PairColumn label="订单信息">{dealDescription}</PairColumn>
                <PairColumn label="销售团队">{marketingTeamName}</PairColumn>
                <PairColumn label="销售成员">{realName}</PairColumn>
                <PairColumn label="销售成员手机号">{mobile}</PairColumn>
              </VerticalPairColumnTable>
            </Col>
          </Row>
        </Card>
      </Content>
    );
  }
}

export default CheckoutContent;
