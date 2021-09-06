import { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import uniqWith from 'lodash/unionWith';
import { List, Spin, Row, Col, Checkbox, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import MarginBar from '@/components/MarginBar';
import DealCancelModal from '@/components/Modal/DealCancelModal';
import AmountColor from '@/components/Amount/Color';
import { formatDate, formatMoney } from '@/utils/format';
import { DEFAULT_GIFT_PIC_FULLPATH } from '@/utils/utils';
import { mul } from '@/commons/lib/math';
import style from './index.less';

@connect(({ loading }) => ({
  unpaidListLoading: loading.effects['deal/fetchUnpaidGoodsDealList'],
}))
class Unpaid extends Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,

    checkedList: [],
    indeterminate: false,
    checkAll: false,

    dcModalVisible: false,
  };

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleDealCancelBtn = () => {
    this.handleDealCancelVisibleChange(true);
  };

  handleDealCancelVisibleChange = visible => {
    this.setState({
      dcModalVisible: visible,
    });
  };

  handleToSummary = () => {
    const { dispatch } = this.props;
    const { checkedList } = this.state;
    dispatch(
      push({
        pathname: './summary',
        search: `id=${checkedList[0]}`,
      })
    );
  };

  handleToEdit = () => {
    const { checkedList } = this.state;
    window.open(`/basic/mall/sell/mall?id=${checkedList[0]}`);
  };

  handleDoDealCancel = async (arg, { dealId }) => {
    const { handleFetchUnpaidCount } = this.props;
    handleFetchUnpaidCount();
    this.setState(({ data }) => ({
      data: data.filter(item => !dealId.includes(item.dealId)),
      checkedList: [],
      indeterminate: false,
      checkAll: false,
    }));
  };

  handleCheckboxGroupChange = checkedValue => {
    const { data } = this.state;
    const allLength = data.length;
    this.setState({
      checkedList: checkedValue,
      indeterminate: checkedValue.length > 0 && checkedValue.length < allLength,
      checkAll: checkedValue.length === allLength,
    });
  };

  handleCheckAllChange = e => {
    const { data } = this.state;
    const all = e.target.checked;
    this.setState({
      checkAll: all,
      indeterminate: false,
      checkedList: all ? data.map(item => item.dealId) : [],
    });
  };

  handleInfiniteOnLoad = async page => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const result = await dispatch({
      type: 'deal/fetchUnpaidGoodsDealList',
      payload: {
        page,
        rows: 20,
      },
    });
    if (result) {
      this.setState(({ data }) => {
        const newData = [...data, ...(result.rows || [])];
        return {
          data: uniqWith(newData, (a, b) => a.dealId === b.dealId),
          loading: false,
          hasMore: newData.length < result.total,
        };
      });
    }
  };

  render() {
    const { unpaidListLoading } = this.props;
    const { data, loading, hasMore, indeterminate, checkAll, checkedList, dcModalVisible } = this.state;
    return (
      <div className={style.container}>
        <InfiniteScroll
          className={style.scroll}
          // initialLoad={false}
          // pageStart={0}
          loader={<Spin key={Date.now()} />}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <Checkbox.Group value={checkedList} onChange={this.handleCheckboxGroupChange}>
            <List
              dataSource={data}
              renderItem={item => (
                <div key={item.dealId}>
                  <Row>
                    <Col xs={8}>
                      <Checkbox value={item.dealId} key={item.dealId}>
                        订单号:
                        <Link to={`/basic/deal/${item.dealId}`}>{item.dealId}</Link>
                      </Checkbox>
                    </Col>
                    <Col xs={8} className="text-center">
                      时间:
                      {formatDate(item.createTime)}
                    </Col>
                    <Col xs={8} className="text-right">
                      <AmountColor>合计: ¥{formatMoney(item.transactionPrice)}</AmountColor>
                    </Col>
                  </Row>
                  {item.dealItemSnapList &&
                    item.dealItemSnapList.map(snap => {
                      const oldTotalPrice = mul(snap.itemPrice, snap.itemNum);
                      return (
                        <div key={snap.itemStockId} className={style.snap}>
                          <img alt="img" className="img-max" src={snap.picUrl || DEFAULT_GIFT_PIC_FULLPATH} />
                          <div className={style.content}>
                            <Row className={style.top}>
                              <Col span={14}>{snap.itemName}</Col>
                              <Col span={10} className={classNames('text-right', style.right)}>
                                <div>¥{formatMoney(snap.transactionTotalPrice)}</div>
                                {oldTotalPrice > snap.transactionTotalPrice && (
                                  <div>
                                    <del>¥{formatMoney(oldTotalPrice)}</del>
                                  </div>
                                )}
                              </Col>
                            </Row>
                            <Row className={style.bottom}>
                              <Col span={12}>¥{formatMoney(snap.itemPrice)}</Col>
                              <Col span={12} className={style.bottomRight}>
                                <span>x{snap.itemNum}</span>
                                <span className="text-overflow">{item.operator}</span>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            />
          </Checkbox.Group>
        </InfiniteScroll>
        <div className={style.unpaidOperation}>
          <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={this.handleCheckAllChange}>
            全选
          </Checkbox>
          {unpaidListLoading && '加载中...'}
          <div>
            {checkedList.length === 0 && '请选择订单...'}
            {checkedList.length > 0 && (
              <Button type="danger" onClick={this.handleDealCancelBtn}>
                删除
              </Button>
            )}
            {checkedList.length === 1 && (
              <>
                <MarginBar left inline>
                  <Button onClick={this.handleToEdit}>修改</Button>
                </MarginBar>
                <MarginBar left inline>
                  <Button type="primary" onClick={this.handleToSummary}>
                    去支付
                  </Button>
                </MarginBar>
              </>
            )}
          </div>
          <DealCancelModal
            dealId={checkedList}
            visible={dcModalVisible}
            onVisibleChange={this.handleDealCancelVisibleChange}
            onOk={this.handleDoDealCancel}
          />
        </div>
      </div>
    );
  }
}

export default Unpaid;
