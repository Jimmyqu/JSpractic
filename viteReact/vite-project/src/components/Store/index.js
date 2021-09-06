import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Input, Button, Tree, Pagination, Form, message } from 'antd';
import MarginBar from '@/components/MarginBar';
import VenueSwitcher from '@/components/VenueSwitcher';
import Model from '@/components/Modal';
import CountInput from '@/components/CountInput';
import { queryGoodsListByCategory, searchGoodsListByKeyword } from '@/services/store';
import { notification } from '@/utils/feedback';
import { formItemLayoutNormal, isMobileDevice } from '@/utils/utils';
import Goods from './Goods';
import Cart from './Cart';
import styles from './index.less';

const { TreeNode } = Tree;

const defaultPageIndex = 1;
const pageSizeOptions = ['18', '30', '50', '100', '200', '500', '1000'];
// test
// const pageSizeOptions = ['2', '5', '10'];
const defaultPageSize = +pageSizeOptions[0];

@connect(({ store, venue, global: { QrCodeMatrixActions }, loading }) => ({
  store,
  venue,
  QrCodeMatrixActions,
  scanning: loading.effects['global/wxScan'],
}))
@Form.create()
class Store extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
    scanQRCode: PropTypes.func,
  };

  state = {
    currentCategoryId: undefined,
    // 默认直接初始
    pageSize: defaultPageSize,
    pageIndex: defaultPageIndex,

    goodsResult: undefined,

    listLoading: false,

    defaultSelectedKeys: undefined,
    selectedKeys: undefined,

    searchKeyword: undefined,

    editRankVisible: false,
    editRankItem: undefined,
  };

  componentDidMount() {
    this.fetchCategoryList();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { venue } = this.props;
    const { venue: nextVenue } = nextProps;
    const cVenue = venue.currentVenue || {};
    const ncVenue = nextVenue.currentVenue || {};
    if (cVenue.id !== ncVenue.id) {
      this.fetchCategoryList();
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  setCart = cart => {
    this.cart = cart;
  };

  handleGoodsClick = item => {
    this.cart.updateNumber(item, 1);
  };

  handleCartContentChange = dealItemInfo => {
    const { onContentChange } = this.props;
    if (onContentChange) {
      onContentChange(dealItemInfo);
    }
  };

  handleTreeSelect = (selectedKeys, { selected }) => {
    // 不给取消选中
    if (selected) {
      this.setState({
        selectedKeys,
      });
      this.switchGoodsByCategory(selectedKeys[0]);
    }
  };

  handlePaginationChange = (page, pageSize) => {
    this.setState(
      () => ({
        pageIndex: page,
        pageSize,
      }),
      () => {
        const { searchKeyword } = this.state;
        if (searchKeyword === null) {
          this.fetchGoods();
        } else {
          this.fetchGoodsBySearch();
        }
      }
    );
  };

  handleKeywordSearch = async value => {
    this.setState(
      () => ({
        searchKeyword: value,
        // 保持size
        // pageSize: defaultPageSize,
        pageIndex: defaultPageIndex,
      }),
      () => {
        this.fetchGoodsBySearch();
      }
    );
  };

  toMobileScanAdd = () => {
    const { scanQRCode } = this.context;
    scanQRCode(resultStr => {
      this.codeToAddItemStock(resultStr == null ? null : resultStr.split(',').pop());
    });
  };

  // 条吗添加商品
  codeToAddItemStock = value => {
    const code = (value == null ? '' : value).trim();
    if (code.length === 0) {
      message.warn('条码内容为空，请纠正后重试！');
      return;
    }
    const {
      dispatch,
      venue: { currentVenue },
      QrCodeMatrixActions,
    } = this.props;
    dispatch({
      type: 'store/queryByCode',
      payload: {
        salesId: currentVenue.id,
        // 不提供action则不要求匹配，反之要求匹配
        action: QrCodeMatrixActions.FetchGoods.key,
        barCode: code,
      },
    }).then(result => {
      if (result) {
        const itemStockList = result;
        if (itemStockList.length > 0) {
          itemStockList.forEach(item => {
            this.handleGoodsClick(item);
          });
          return;
        }
        notification.error('未能检索到商品，请检查条码正确性');
      }
    });
  };

  showEditGoodRank = item => {
    this.setState({
      editRankItem: item,
      editRankVisible: true,
    });
  };

  sureEdit = ({ deepCallOk }) => {
    const { form } = this.props;
    form.validateFields((err, { ranks }) => {
      if (err) {
        return;
      }
      deepCallOk(() => this.toSaveEditRank(ranks));
    });
    return false;
  };

  toSaveEditRank = ranks => {
    const { dispatch } = this.props;
    const { editRankItem, goodsResult } = this.state;
    return dispatch({
      type: 'store/editRank',
      payload: {
        id: editRankItem.id,
        ranks,
      },
    }).then(() => {
      message.success('修改成功');
      // 刷新页面
      const { rows = [] } = goodsResult;
      const index = rows.findIndex(item => item.id === editRankItem.id);
      const editItem = rows[index];
      const list = [...rows];
      list[index] = {
        ...editItem,
        ranks,
      };
      this.setState({
        goodsResult: {
          ...goodsResult,
          rows: list,
        },
      });
      // 刷新 cart里（是否必要？）
      this.cart.updateRank({
        ...editRankItem,
        ranks,
      });
    });
  };

  handleEditRankVisibleChange = visible => {
    this.setState({
      editRankVisible: visible,
    });
  };

  async fetchGoodsBySearch() {
    const {
      venue: { currentVenue },
    } = this.props;
    this.setState({
      listLoading: true,
    });
    const { searchKeyword, pageIndex, pageSize } = this.state;
    let result;
    try {
      result = await searchGoodsListByKeyword({
        salesId: currentVenue.id,
        itemPinyin: searchKeyword,
        page: pageIndex,
        rows: pageSize,
      });
    } catch {
      return;
    } finally {
      this.setState({
        listLoading: false,
      });
    }

    if (this.isUnmounted) {
      return;
    }
    this.setState({
      goodsResult: result,
    });
  }

  fetchCategoryList() {
    const { dispatch, isBooking, onEmptyLoad } = this.props;
    dispatch({
      type: 'store/fetchCategoryListBySales',
    }).then(list => {
      if (this.isUnmounted) {
        return;
      }
      const defaultNode = (list || []).find(item => item.parentId === 0);
      if (defaultNode == null && isBooking && onEmptyLoad) {
        onEmptyLoad();
        return;
      }
      if (defaultNode) {
        const skey = [`${defaultNode.id}`];
        this.setState({
          defaultSelectedKeys: skey,
          selectedKeys: skey,
        });
        this.switchGoodsByCategory(defaultNode.id, result => {
          if (isBooking && onEmptyLoad) {
            const { total = 0, rows = [], page = 1 } = result || {};
            if (total === 0 || (page === 1 && rows.length === 0)) {
              onEmptyLoad();
            }
          }
        });
      }
    });
  }

  switchGoodsByCategory(categoryId, fn) {
    this.setState(
      () => ({
        currentCategoryId: categoryId,
        // 保持size
        // pageSize: defaultPageSize,
        pageIndex: defaultPageIndex,
        searchKeyword: null,
      }),
      () => {
        this.fetchGoods().then(fn);
      }
    );
  }

  async fetchGoods() {
    const {
      venue: { currentVenue },
    } = this.props;
    this.setState({
      listLoading: true,
    });
    const { pageIndex, pageSize, currentCategoryId } = this.state;
    let result;
    try {
      result = await queryGoodsListByCategory({
        categoryId: currentCategoryId,
        salesId: currentVenue.id,
        page: pageIndex,
        rows: pageSize,
      });
    } catch {
      result = {};
    } finally {
      this.setState({
        listLoading: false,
      });
    }

    if (this.isUnmounted) {
      return;
    }
    this.setState({
      goodsResult: result,
    });

    return result;
  }

  render() {
    const {
      store,
      isBooking,
      scanning,
      form,
      marketingTeamMemberCount,
      venue: { VenueTypes },
    } = this.props;

    const { isMobile } = this.context;
    const {
      goodsResult,
      listLoading,
      defaultSelectedKeys,
      selectedKeys,
      editRankVisible,
      editRankItem = {},
    } = this.state;
    const { rows = [], page, total } = goodsResult || {};
    const rowSorted = [...rows].sort((a, b) => b.ranks - a.ranks);
    const { categoryListForSales = [] } = store;

    const buildTreeNode = (parentId, list) => {
      if (list == null || list.length === 0) {
        return null;
      }
      const remaining = [];
      const nodes = [];
      list.forEach(item => {
        if (item.parentId === parentId) {
          nodes.push(item);
        } else {
          remaining.push(item);
        }
      });

      return nodes.map(item => (
        <TreeNode title={item.categoryName} key={`${item.id}`} data={item}>
          {buildTreeNode(item.id, remaining)}
        </TreeNode>
      ));
    };

    return (
      <Card>
        <Row className={styles.nav} gutter={8}>
          <Col md={4}>
            <MarginBar top>
              <VenueSwitcher filter={item => item.salesType !== VenueTypes.WAREHOUSE.key} />
            </MarginBar>
          </Col>
          <Col md={7}>
            <MarginBar top>
              <Input.Search placeholder="请输入商品名称或首字母" onSearch={this.handleKeywordSearch} enterButton />
            </MarginBar>
          </Col>
          <Col md={13}>
            {isMobileDevice() && (
              <MarginBar top inline>
                <Button type="primary" loading={scanning} onClick={this.toMobileScanAdd}>
                  手机扫码加入
                </Button>
              </MarginBar>
            )}
            {!isBooking && (
              <MarginBar left top inline>
                <Link to="/basic/deal/item">
                  <Button>所有记录</Button>
                </Link>
              </MarginBar>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <MarginBar top>
              {categoryListForSales.length > 0 && (
                <Tree
                  defaultExpandAll
                  showLine
                  className={styles.tree}
                  defaultSelectedKeys={defaultSelectedKeys}
                  selectedKeys={selectedKeys}
                  onSelect={this.handleTreeSelect}
                >
                  {buildTreeNode(0, categoryListForSales)}
                </Tree>
              )}
            </MarginBar>
          </Col>
          <Col md={15}>
            <Card loading={listLoading} bordered={false} bodyStyle={{ padding: 0 }}>
              {rowSorted.map(item => (
                <Goods
                  key={item.id}
                  data={item}
                  onClick={this.handleGoodsClick}
                  onEditGoodRank={this.showEditGoodRank}
                />
              ))}
            </Card>
            <MarginBar top={32} className="text-center">
              {rowSorted.length > 0 || listLoading ? (
                <Pagination
                  defaultCurrent={defaultPageIndex}
                  defaultPageSize={defaultPageSize}
                  current={page}
                  total={total}
                  size={isMobile ? 'small' : null}
                  onChange={this.handlePaginationChange}
                  showTotal={t => `共${t}条`}
                  showSizeChanger
                  pageSizeOptions={pageSizeOptions}
                  onShowSizeChange={(current, size) => {
                    // 切换分页大小，从第一页重新开始
                    this.handlePaginationChange(1, size);
                  }}
                />
              ) : (
                '暂无数据'
              )}
            </MarginBar>
          </Col>
          <Col md={6}>
            <MarginBar top>
              <Cart
                marketingTeamMemberCount={marketingTeamMemberCount}
                setCart={this.setCart}
                onContentChange={this.handleCartContentChange}
                codeToAddItemStock={this.codeToAddItemStock}
              />
            </MarginBar>
          </Col>
        </Row>

        <Model
          title="编辑商品排序"
          visible={editRankVisible}
          onVisibleChange={this.handleEditRankVisibleChange}
          onOk={this.sureEdit}
        >
          <Form {...formItemLayoutNormal}>
            <Form.Item label="商品">{editRankItem.itemName}</Form.Item>
            <Form.Item label="排序">
              {form.getFieldDecorator('ranks', {
                initialValue: editRankItem.ranks,
                rules: [
                  {
                    required: true,
                    message: '请填写排序值',
                  },
                ],
              })(<CountInput fullWidth />)}
            </Form.Item>
          </Form>
        </Model>
      </Card>
    );
  }
}

export default Store;
