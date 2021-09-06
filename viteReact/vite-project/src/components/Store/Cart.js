import { Component } from 'react';
import classNames from 'classnames';
import { Input, Row, Col, Button, Checkbox, message, Spin } from 'antd';
import { connect } from 'react-redux';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';
import Datatable from '@/components/Datatable';
import Cart from '@/components/Cart';
import { add, mul } from '@/commons/lib/math';
import { formatModel } from '@/utils/format';
import { getPageQuery } from '@/utils/utils';
import { queryGoodsListByIds } from '@/services/store';
import Counter from './Counter';
import style from './cart.less';

@connect(({ orderprocessing, venue, pubitem }) => ({
  orderprocessing,
  venue,
  pubitem,
}))
class ShoppingCart extends Component {
  columns = [
    {
      title: '导购员编号',
      dataIndex: 'id',
      width: 90,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 160,
    },
    {
      title: '职业',
      dataIndex: 'careerId',
      render: value => {
        const {
          venue: { Careers },
        } = this.props;
        return formatModel(Careers, value);
      },
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 130,
    },
    {
      title: '团号',
      dataIndex: 'marketingTeamId',
      width: 90,
    },
    {
      title: '团名',
      dataIndex: 'marketingTeamName',
      width: 200,
    },
    // {
    //   title: '佣金模版',
    //   dataIndex: 'id',
    // },
    // {
    //   title: '佣金比例',
    //   dataIndex: 'id',
    // },
  ];

  formSearch = {
    fields: [
      {
        label: '手机号',
        name: 'mobile',
        placeholder: '导购员手机号',
      },
      {
        label: '姓名',
        name: 'realName',
        placeholder: '导购员姓名',
      },
      {
        label: '团名',
        name: 'teamName',
        placeholder: '团队名称',
      },
      {
        label: '团号',
        name: 'marketingTeamId',
        placeholder: '团队编号',
        defHidden: true,
      },
    ],
  };

  state = {
    counterMapping: {},

    itemMapping: {},

    loading: false,

    checkedList: [],

    selectVisible: false,

    // 当前操作选择
    selectedRows: undefined,

    // 当前确认选择
    useMarktingMngmtMemberIds: [],

    // 当前人员数据缓存
    mumberListCache: {},
  };

  async componentDidMount() {
    const {
      setCart,
      dispatch,
      orderprocessing: { dealInfo },
    } = this.props;
    if (setCart) {
      setCart(this);
    }
    let tempDealInfo = dealInfo;
    const { id } = getPageQuery();
    if (tempDealInfo == null && id) {
      const mainData = await dispatch({
        type: 'orderprocessing/fetchOrder',
        payload: {
          switchEnv: true,
        },
      });
      tempDealInfo = mainData.dealInfo;
    }

    const { dealItemList } = tempDealInfo || {};

    if (dealItemList == null) {
      return;
    }

    const snapIds = [];
    dealItemList.forEach(item => {
      (item.dealItemSnapList || []).forEach(snap => {
        snapIds.push(snap.itemStockId);
      });
    });
    if (snapIds.length === 0) {
      return;
    }
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      loading: true,
    });
    let list;
    try {
      list = await queryGoodsListByIds(snapIds);
    } catch {
      return;
    } finally {
      if (!this.isUnmounted) {
        this.setState({
          loading: false,
        });
      }
    }
    if (this.isUnmounted) {
      return;
    }
    const counterMapping = {};
    const itemMapping = {};
    dealItemList.forEach(item => {
      (item.dealItemSnapList || []).forEach(snap => {
        snapIds.push(snap.itemStockId);
        const sItem = list.find(serverItem => serverItem.id === snap.itemStockId);
        if (sItem == null) {
          message.warning(`购物车已忽略某些商品`);
          return;
        }
        counterMapping[snap.itemStockId] = {
          num: snap.itemNum,
          price: snap.transactionPrice,
        };
        itemMapping[snap.itemStockId] = sItem;
      });
    });
    this.setState(
      () => ({
        counterMapping,
        itemMapping,
      }),
      this.fireChange
    );
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  getDealItemInfo = () => {
    const {
      pubitem: { DeliveryTypes },
    } = this.props;
    const { counterMapping, itemMapping, useMarktingMngmtMemberIds } = this.state;
    const dealItemSnapList = [];

    let totalPrice = 0;
    let totalNum = 0;
    Object.entries(counterMapping).forEach(([key, { num, price }]) => {
      const transactionPrice = price == null ? itemMapping[key].salesPrice : price;
      dealItemSnapList.push({
        itemStockId: +key,
        itemNum: num,
        transactionPrice,
      });
      totalPrice = add(totalPrice, mul(transactionPrice, num));
      totalNum += num;
    });
    return {
      list: [
        {
          deliverytype: DeliveryTypes.PICKUP.key, // 目前只支持自提
          dealItemSnapList,
        },
      ],
      useMarktingMngmtMemberIds,
      totalNum,
      totalPrice,
    };
  };

  // 肯定是原来选过的
  handleNumberChange = (value, id) => {
    const { counterMapping, itemMapping } = this.state;
    const config = counterMapping[id] || {};
    this.updateNumber(itemMapping[id], value - (config.num || 0)); // 要防止输入为NaN
  };

  // 肯定是原来选过的
  handlePriceChange = (value, id) => {
    const { itemMapping } = this.state;
    // 价格是直接覆盖
    this.updatePrice(itemMapping[id], value);
  };

  // 外部会调用
  updateRank = item => {
    if (item == null) {
      return;
    }
    const { itemMapping } = this.state;
    this.setState({
      itemMapping: {
        ...itemMapping,
        [item.id]: {
          ...itemMapping[item.id],
          ranks: item.ranks,
        },
      },
    });
  };

  handleCheckboxGroupChange = checkedValue => {
    this.setState({
      checkedList: checkedValue,
    });
  };

  handleCheckAllChange = e => {
    const { counterMapping } = this.state;
    const all = e.target.checked;
    this.setState({
      checkedList: all ? Object.keys(counterMapping).map(id => +id) : [],
    });
  };

  // cart里通过onChange修改的只有删除项目，所以mapping里只会是更少的数据
  handleItemChange = mapping => {
    this.setState(
      {
        counterMapping: mapping,
        checkedList: Object.keys(mapping).map(id => +id),
      },
      this.fireChange
    );
  };

  fireChange = () => {
    const { onContentChange } = this.props;
    if (onContentChange) {
      onContentChange(this.getDealItemInfo());
    }
  };

  toShowSelect = (_, e) => {
    if (e.keyCode == null) {
      this.handleSelectVisibleChange(true);
    }
  };

  handleSelectVisibleChange = selectVisible => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      selectVisible,
    });
  };

  handleSelectedChange = (_, rows) => {
    if (this.isUnmounted) {
      return;
    }
    this.setState({
      selectedRows: rows,
    });
    // 选中的数据没有互斥的
    const noConflictive = rows.every(({ marketingTeamId }) => marketingTeamId === rows[0].marketingTeamId);
    if (noConflictive) {
      return;
    }
    message.error('不可同时选择不同团队的导购员');
  };

  handleLoadData = list => {
    const newMapping = {};
    (list || []).forEach(item => {
      newMapping[item.id] = item;
    });
    this.setState(({ mumberListCache }) => ({
      mumberListCache: {
        ...mumberListCache,
        ...newMapping,
      },
    }));
  };

  setSelectMember = () => {
    this.setState(
      ({ selectedRows }) => ({
        useMarktingMngmtMemberIds: (selectedRows || []).map(({ id }) => id),
      }),
      this.fireChange
    );
  };

  // 外部会调用
  updateNumber(item, num = 0) {
    const { counterMapping, itemMapping } = this.state;
    const config = counterMapping[item.id] || {};
    const targetNum = (config.num || 0) + num;
    if (targetNum > item.stockCount) {
      return;
    }
    const statePairs = {};
    this.setState(
      () => ({
        ...statePairs,
        itemMapping: {
          ...itemMapping,
          [item.id]: {
            ...item,
            ...itemMapping[item.id],
          },
        },
        counterMapping: {
          ...counterMapping,
          [item.id]: {
            ...config,
            num: targetNum,
          },
        },
      }),
      this.fireChange
    );
  }

  // 价格是直接覆盖
  updatePrice(item, price) {
    if (price == null) {
      return;
    }
    const { counterMapping } = this.state;
    const config = counterMapping[item.id] || {};
    this.setState(
      () => ({
        counterMapping: {
          ...counterMapping,
          [item.id]: {
            ...config,
            price,
          },
        },
      }),
      this.fireChange
    );
  }

  render() {
    const { marketingTeamMemberCount, codeToAddItemStock } = this.props;
    const {
      counterMapping,
      itemMapping,
      checkedList,
      loading,
      selectVisible,
      selectedRows,
      useMarktingMngmtMemberIds,
      mumberListCache,
    } = this.state;

    const rows = selectedRows || [];

    const list = Object.entries(counterMapping);

    const useMarketingMngmt = marketingTeamMemberCount > 0;

    // 选中的数据没有互斥的
    const noConflictive = rows.every(({ marketingTeamId }) => marketingTeamId === rows[0].marketingTeamId);

    return (
      <Cart
        enterButton="添加商品"
        itemList={list.map(([key, config]) => ({
          id: +key,
          ...config,
          price: config.price || itemMapping[key].salesPrice,
        }))}
        checkedIds={checkedList}
        onCheckAllChange={this.handleCheckAllChange}
        onChange={this.handleItemChange}
        onBarCodeScan={codeToAddItemStock}
        headerExtra={
          useMarketingMngmt ? (
            <MarginBar top>
              <div className={style.markting}>
                <Input.Search
                  readOnly
                  placeholder="未选择导购，请选择"
                  enterButton="选择导购"
                  value={useMarktingMngmtMemberIds.map(id => mumberListCache[id].realName).join(', ')}
                  onSearch={this.toShowSelect}
                />
              </div>
            </MarginBar>
          ) : null
        }
      >
        <Row className={style.bodyth}>
          <Col span={10}>名称/数量</Col>
          <Col span={8}>销售价格</Col>
          <Col span={6}>销售总价</Col>
        </Row>
        <div
          className={classNames(style.content, {
            [style.marktingContent]: useMarketingMngmt,
          })}
        >
          {loading ? (
            <Spin />
          ) : (
            <Checkbox.Group value={checkedList} onChange={this.handleCheckboxGroupChange}>
              {list.map(([key, config]) => (
                <Counter
                  key={key}
                  data={itemMapping[key]}
                  config={config}
                  onNumberChange={this.handleNumberChange}
                  onPriceChange={this.handlePriceChange}
                />
              ))}
            </Checkbox.Group>
          )}
        </div>
        <Modal
          title="请选择导购员"
          width={1024}
          visible={selectVisible}
          footer={[<Button key="close" link="cancel" />, <Button key="ok" link="ok" disabled={!noConflictive} />]}
          onVisibleChange={this.handleSelectVisibleChange}
          onOk={this.setSelectMember}
        >
          <Datatable
            select="multi"
            url="/marketingTeamMember/teamMemberList.do"
            columns={this.columns}
            rowKey="id"
            formSearch={this.formSearch}
            // operation={this.operation}
            // onInit={this.handleTableInit}
            onLoadData={this.handleLoadData}
            onSelectedChange={this.handleSelectedChange}
          />
        </Modal>
      </Cart>
    );
  }
}

export default ShoppingCart;
