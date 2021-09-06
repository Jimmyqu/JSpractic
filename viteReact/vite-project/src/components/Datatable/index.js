import { Component, Children, cloneElement } from 'react';
import { findDOMNode, render as domRender } from 'react-dom';
import { Resizable } from 'react-resizable';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import moment from 'moment';
import { connect, Provider } from 'react-redux';
import { Icon, Spin, Modal } from 'antd';
import omit from 'omit.js';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import throttle from 'lodash/throttle';
import { get, store } from '@/utils/request';
import Table from '@/components/Datatable/BaseTable';
import {
  formatDate,
  formatMonth,
  formatHMS,
  formatMoneyLen2,
  formatDateTime,
  formatFaceImgInTable,
  formatNothing,
  fixedMoney,
} from '@/utils/format';
import { uuid, isNumber } from '@/utils/utils';
// import ImageViewModal from '@/components/Modal/ImageViewModal';
import { div, add } from '@/commons/lib/math';
import { RenderTypes } from '@/commons/lib/table';
import SearchForm, { ItemTypes } from './SearchForm';
import Operation, { ButtonTypes } from './Operation';
import ExportCancelError from './ExportCancelError';
import styles from './index.less';

// const { ColumnGroup, Column } = Table;
export { SearchForm, ItemTypes, ButtonTypes };

const collectTitleRowKey = '_collect_title';
const collectBodyRowKey = '_collect_body';

@connect(
  ({ global = {}, venue, datatable }) => ({
    venue,
    datatable,
    todoNotices:
      global == null || global.NoticeTypes == null || global.notices == null
        ? []
        : global.notices.filter(item => item.type === global.NoticeTypes.Todo.key),
  }),
  null,
  (stateProps, dispatchProps, ownProps) => {
    const { tableId, url, rowKey } = ownProps;
    const props = {
      ...ownProps,
      ...dispatchProps,
      ...stateProps,
      // 一个url页面为单位
      // 这样做是懒得给全部已有的表格添加属性，但是针对url会变化的或者不同表格使用相同url的仍然需要补充自己的tableId
      tableId: tableId || (url ? url.split('?')[0] : Date.now()), // 没有提供tableId或者url的情况下使用Date.now()，相当于永远不匹配数据，因为一直在变
      rowKey:
        typeof rowKey === 'function'
          ? (reocrd, index) => {
              // isTotalRow的才try
              // eslint-disable-next-line no-underscore-dangle
              if (reocrd.isTotalRow) {
                let val;
                try {
                  val = rowKey(reocrd);
                } catch {
                  return `${index}-${Date.now()}`;
                }
                // 在calcCollectColumnData中使用setDataIndexValue落地总计值时，可能间接使rowKey执行时满足对象申明而不再抛出异常
                if (val == null) {
                  return `${index}-${Date.now()}`;
                }
              }
              return rowKey(reocrd, index);
            }
          : rowKey,
    };
    // 如果制定了pageSizeOptions但是没有同时指定pageSize，则默认把pageSize设置为pageSizeOptions的第一个值
    if (
      isPlainObject(props.pagination) &&
      props.pagination.pageSizeOptions?.length > 0 &&
      !isNumber(props.pagination.pageSize)
    ) {
      // eslint-disable-next-line prefer-destructuring
      props.pagination.pageSize = +props.pagination.pageSizeOptions[0] || 10;
    }
    return props;
  }
)
class Datatable extends Component {
  components = {
    header: {
      cell: props => {
        const { onResize, onResizeStart, onResizeStop, width, ...restProps } = props;

        if (!width) {
          return <th {...restProps} />;
        }

        return (
          <Resizable
            width={width}
            height={0}
            onResize={onResize}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
          >
            <th {...restProps} />
          </Resizable>
        );
      },
    },
  };

  static contextTypes = {
    isMobile: PropTypes.bool,
    getGlobalFooterHeight: PropTypes.func,
    getWrapperHeight: PropTypes.func,
    outSideContentClassName: PropTypes.string,
    writeFile: PropTypes.func,
    getTableNavPath: PropTypes.func,
    convertNodeToString: PropTypes.func,
  };

  static defaultProps = {
    personalization: true,
  };

  state = {
    formValues: {},
    orders: null,
    filters: {},
    loading: false,
    dataList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30', '50', '100', '200', '500', '1000'],
      showTotal: total => `共${total}条`,
    },

    summaryLoading: false,
    summaryData: null, // 总页合计
    selectedRows: [],

    // 上次查询使用的条件对象
    tempParams: undefined,

    bodyHeight: undefined,

    composeStateMapping: {},

    // 个性化列配置
    columns: [],
    noCheckedKeys: [],
    frozenCheckedKeys: [],

    // 每次拖拽完成前从state刷新来快速反应到UI上，拖拽完成才执行保存
    resizeHoldOn: false,
    resizeWidths: {},
  };

  calcBodyHeight = throttle(() => {
    const { bodyScroll = true, minBodyHeight } = this.props;
    if (!bodyScroll) {
      return;
    }
    const {
      outSideContentClassName,
      getGlobalFooterHeight = () => 0,
      getWrapperHeight = () => 0,
      isMobile,
    } = this.context;
    if (outSideContentClassName == null) {
      return;
    }
    const contentNode = document.querySelector(`.${outSideContentClassName}`);
    let nodeList = contentNode.querySelectorAll('.ant-table-body');
    if (nodeList.length > 1 && contentNode.querySelectorAll('.ant-tabs').length > 0) {
      nodeList = contentNode.querySelectorAll('.ant-tabs-tabpane-active .ant-table-body');
    }
    let modalOffset = 0;
    if (nodeList.length === 0) {
      nodeList = document.querySelectorAll('.ant-modal .ant-table-body');
      modalOffset = 24 * 2 + 14;
    }
    if (nodeList.length === 1) {
      const tableDom = nodeList[0];
      const offset = tableDom.getBoundingClientRect().top;
      // 其他占有高度的元素
      const otherDomHeight = [contentNode.querySelector('.ant-pagination')].reduce(
        (prev, current) => prev + (current ? Math.max(current.offsetHeight, current.clientHeight) : 0),
        0
      );
      const globalFooterHeight = getGlobalFooterHeight();
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let bodyHeight =
        screenHeight -
        offset -
        otherDomHeight -
        globalFooterHeight -
        modalOffset -
        12 - // 通常 table是放Card里面的，下方有个padding, 上方的被offset包含了
        8 - // PageHeaderLayout__content margin-top 8 和 主动保留下边距间隔 8, 上方的被offset包含了
        16 * 1; // 分页组件的margin 16x1, 之前是x2因为样式去掉了bottom
      if (isMobile) {
        const wrapperHeight = getWrapperHeight();
        const header = contentNode.querySelector('.ant-table-header table') || {};
        const min =
          screenHeight -
          wrapperHeight -
          otherDomHeight -
          Math.max(header.offsetHeight || 0, header.clientHeight || 0) -
          12 * 2 - // 通常 table是放Card里面的，上下方有个padding
          16 * 1; // 分页组件的margin 16x1, 之前是x2因为样式去掉了bottom
        bodyHeight = Math.max(bodyHeight, min);
      }
      bodyHeight = Math.max(bodyHeight, minBodyHeight || 0, 200); // 最小
      bodyHeight = Math.floor(bodyHeight); // 向下取整
      const { bodyHeight: stateBodyHeight } = this.state;
      if (stateBodyHeight === bodyHeight) {
        return;
      }
      this.setState({
        bodyHeight,
      });
    }
  }, 50);

  componentDidMount() {
    const { onInit } = this.props;
    this.setStateColumns();
    // 由表单ready后出发首次查询
    if (onInit) {
      onInit({
        reload: this.reload,
        handleFormSearch: this.handleFormSearch,
        toSearch: this.toSearch,
        setFieldsValue: this.setFieldsValue,
        // 清空除了特例之外的表单项
        clearFieldsValueButIgnoreBy: arr => {
          if (Array.isArray(arr) && arr.length > 0) {
            const { formSearch } = this.props;
            const targetObj = {};
            formSearch?.fields?.forEach(field => {
              // 最多两层
              if (Array.isArray(field)) {
                field.forEach(f => {
                  // 绝对性隐藏的和指定忽略的除外
                  if (f.hidden || arr.includes(f.name)) {
                    return;
                  }
                  targetObj[f.name] = undefined;
                });
                return;
              }
              // 绝对性隐藏的和指定忽略的除外
              if (field.hidden || arr.includes(field.name)) {
                return;
              }
              targetObj[field.name] = undefined;
            });
            this.setFieldsValue(targetObj);
          }
        },
      });
    }

    window.addEventListener('resize', this.calcBodyHeight);
    this.calcBodyHeight();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      url: nextUrl,
      columns: nextColumns,
      datatable: { nextDatatable },
      dataList: nextDataList,
      pagination: nextPagination,
      content: nextContent,
    } = nextProps;
    const { url, columns, datatable, content, dataList } = this.props;
    if (nextUrl !== url) {
      this.reload({ url: nextUrl });
    }
    if (columns !== nextColumns || nextDatatable !== datatable) {
      this.setStateColumns({}, nextProps);
    }
    // 重置 compose 存储
    if (nextContent == null && content != null) {
      this.setState({
        composeStateMapping: {},
      });
    }
    if (nextDataList !== dataList) {
      this.setState({
        dataList: nextDataList,
        pagination: this.getPagination(nextPagination),
      });
    }
  }

  componentDidUpdate() {
    this.appendCollectDataManually();
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    window.removeEventListener('resize', this.calcBodyHeight);
  }

  handleSelectedChange(selectedRows) {
    const { onSelectedChange } = this.props;
    const rows = selectedRows || [];
    this.setState({
      selectedRows: rows,
    });
    if (typeof onSelectedChange === 'function') {
      onSelectedChange(
        rows.map(item => this.getRowKey(item)),
        rows
      );
    }
  }

  getPagination(newPagination) {
    const { pagination: propPagination = {} } = this.props;
    const { pagination: statePagination } = this.state;
    const propPaginationIsPlainObject = isPlainObject(propPagination);
    if (propPaginationIsPlainObject) {
      return newPagination ? { ...statePagination, ...propPagination, ...newPagination } : statePagination;
    }
    return propPagination;
  }

  getSelectedRows() {
    const { rowSelection = {} } = this.props;
    const { selectedRows } = this.state;
    return rowSelection.selectedRows || selectedRows;
  }

  getRowKey(record = {}) {
    const { rowKey } = this.props;
    if (typeof rowKey === 'string') {
      return this.getDataIndexValue(record, rowKey);
    }
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return null;
  }

  onFormInit = (form, cb) => {
    this.form = form;
    this.toSearch = cb;
  };

  setFieldsValue = (...args) => {
    return this.form.setFieldsValue(...args);
  };

  reload = opts => {
    const { url, formValues } = opts || {};
    const { tempParams } = this.state;
    this.fetch(formValues ? { formValues } : tempParams, undefined, url);
  };

  saveTablePersonalization = async data => {
    const {
      dispatch,
      tableId,
      datatable: { tablePersonalizationMapping },
    } = this.props;
    const config = tablePersonalizationMapping[tableId] || {};
    await dispatch({
      type: 'datatable/saveTablePersonalization',
      payload: {
        key: tableId,
        config: {
          ...config,
          ...data,
        },
      },
    });
  };

  handleColumnsCheck = async noCheckedKeys => {
    await this.saveTablePersonalization({
      noCheckedKeys,
    });
    this.setStateColumns({
      noCheckedKeys,
    });
  };

  handleColumnsFrozenCheck = async frozenCheckedKeys => {
    await this.saveTablePersonalization({
      frozenCheckedKeys,
    });
    this.setStateColumns({
      frozenCheckedKeys,
    });
  };

  handlePersonalizationReset = async () => {
    const { dispatch, tableId } = this.props;
    await dispatch({
      type: 'datatable/saveTablePersonalization',
      payload: {
        key: tableId,
        config: {},
      },
    });
    this.setState(
      () => ({
        noCheckedKeys: [],
        frozenCheckedKeys: [],
        resizeWidths: {},
      }),
      this.setStateColumns
    );
  };

  getTableWrapper = () => {
    if (this.datatableNode) {
      return this.datatableNode.querySelector('.ant-table-wrapper');
    }
    return null;
  };

  /**
   * 刷新StateColumns
   */
  setStateColumns = (options = {}, props) => {
    const {
      tableId,
      columns,
      personalization,
      datatable: { tablePersonalizationMapping },
    } = props || this.props;
    const { noCheckedKeys, frozenCheckedKeys } = options;
    const { noCheckedKeys: storeNoCheckedKeys, frozenCheckedKeys: storeFrozenCheckedKeys } =
      tablePersonalizationMapping[tableId] || {};
    const { noCheckedKeys: stateNoCheckedKeys, frozenCheckedKeys: stateFrozenCheckedKeys } = this.state;

    let useNoCheckedKeys = [];
    let useFrozenCheckedKeys = [];
    if (personalization) {
      useNoCheckedKeys = noCheckedKeys || (tableId == null ? stateNoCheckedKeys : storeNoCheckedKeys);
      useFrozenCheckedKeys = frozenCheckedKeys || (tableId == null ? stateFrozenCheckedKeys : storeFrozenCheckedKeys);
    }

    const newOpts = {
      noCheckedKeys: useNoCheckedKeys,
      frozenCheckedKeys: useFrozenCheckedKeys,
    };
    const useColumns = this.doTablePersonalization(columns, newOpts);

    this.setState({
      columns: useColumns,
      ...newOpts,
    });
  };

  doTablePersonalization = (columns, options = {}, level = 0) => {
    if (columns == null || columns.length === 0) {
      return columns;
    }
    const {
      noCheckedKeys,
      //  frozenCheckedKeys
    } = options;
    return columns?.reduce((prev, current, idx) => {
      // copy
      const column = { ...current };
      const { dataIndex, key, children } = column;
      const indexStr = dataIndex || key;
      if (noCheckedKeys && noCheckedKeys.includes(indexStr)) {
        return prev;
      }
      if (Array.isArray(children) && children.length > 0) {
        const newChildren = this.doTablePersonalization(children, options, level + 1);
        if (newChildren.length === 0) {
          return prev;
        }
        column.children = newChildren;
      }
      // else if (frozenCheckedKeys && frozenCheckedKeys.includes(indexStr)) {
      // column.fixed = 'left';
      // }
      if (indexStr == null) {
        column.dataIndex = `${level}-${idx}`;
      }
      return [...prev, column];
    }, []);
  };

  /**
   * 计算合计时使用的行对象
   */
  getCollectData = () => {
    const { rowKey } = this.props;
    const { dataList } = this.state;
    if (dataList == null || dataList.length === 0) {
      return [];
    }
    const sumSpObj = {
      isTotalRow: true,
    };
    // rowKey是函数的情况在顶部connect的mergeProps里处理了
    if (typeof rowKey === 'string') {
      this.setDataIndexValue(sumSpObj, rowKey, collectTitleRowKey);
    }
    return [sumSpObj, this.buildCollectData()];
  };

  // 展开columns
  reduceColumns = (columns = [], parentCollect) => {
    return columns.reduce((prev, current) => {
      const { children, collect } = current;
      const useCurrent =
        'collect' in current
          ? current
          : {
              ...current,
              collect: parentCollect,
            };
      return [
        ...prev,
        ...(Array.isArray(children) && children.length > 0 ? this.reduceColumns(children, collect) : [useCurrent]),
      ];
    }, []);
  };

  // 修改col render来显示总计
  getCollectCols = (columns = [], targetColumn, colSpan) => {
    const { dataList } = this.state;
    return columns.map(col => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        return {
          ...col,
          children: this.getCollectCols(col.children, targetColumn, colSpan),
        };
      }
      return {
        ...col,
        render: (text, row, index) => {
          const children = typeof col.render === 'function' ? col.render(text, row, index) : text;
          // 只有紧跟着的那个才按collect的title处理
          if (dataList && index === dataList.length) {
            return {
              children: '总计',
              props: {
                colSpan: col === targetColumn ? colSpan : 0,
              },
            };
          }
          return children;
        },
      };
    });
  };

  // collect 在分页的情况下，补充的两行会被干掉, 这里用手动追加的方式补上
  // 其实最好是从antd的table组件上支持分页情况下显示溢出行
  // https://github.com/ant-design/ant-design/blob/master/components/table/Table.tsx#L408
  appendCollectDataManually = () => {
    const { columns = [], dataList, summaryLoading, summaryData } = this.state;
    const { summaryUrl, select } = this.props;

    if (this.table == null) {
      return;
    }
    // eslint-disable-next-line react/no-find-dom-node
    const tableDom = findDOMNode(this.table);
    const body = tableDom.querySelector('.ant-table-body');
    const tbody = body.querySelector('.ant-table-tbody');

    const oldTitleTr = tbody.querySelector(`[data-row-key="${collectTitleRowKey}"]`);
    if (oldTitleTr) {
      tbody.removeChild(oldTitleTr);
    }
    const oldBodyTr = tbody.querySelector(`[data-row-key="${collectBodyRowKey}"]`);
    if (oldBodyTr) {
      tbody.removeChild(oldBodyTr);
    }

    if (dataList == null || dataList.length === 0) {
      return;
    }

    const hasUICollect = this.hasCollect();
    const hasServerCollect = !!summaryUrl;

    if (!hasServerCollect && !hasUICollect) {
      return;
    }

    // 优先判断 hasServerCollect
    if (hasServerCollect && !summaryLoading && !summaryData) {
      return;
    }

    const reduceColumnsList = this.reduceColumns(columns);
    const columnLength = reduceColumnsList.length + (select === 'single' || select === 'multi' ? 1 : 0);

    const titleTr = document.createElement('tr');
    titleTr.classList.add('ant-table-row', 'ant-table-row-level-0');
    titleTr.dataset.rowKey = collectTitleRowKey;

    const titleTd = document.createElement('td');
    titleTd.setAttribute('colspan', columnLength);
    if (hasServerCollect) {
      domRender(summaryLoading ? <Spin size="small" /> : '所有页总计', titleTd);
    } else {
      titleTd.innerHTML = '当前页总计';
    }

    titleTr.appendChild(titleTd);
    tbody.appendChild(titleTr);

    if (hasServerCollect && summaryLoading) {
      // 滚到底部
      setTimeout(() => {
        body.scrollTop = Number.MAX_SAFE_INTEGER;
      }, 0);
      return;
    }

    const [, collectDataRow] = !hasServerCollect ? this.getCollectData() : [];

    const bodyTr = document.createElement('tr');
    bodyTr.classList.add('ant-table-row', 'ant-table-row-level-0');
    bodyTr.dataset.rowKey = collectBodyRowKey;

    const offset = columnLength === reduceColumnsList.length ? 0 : -1;
    for (let i = offset; i < columnLength + offset; i += 1) {
      const bodyTd = document.createElement('td');
      const column = reduceColumnsList[i];
      if (column) {
        const { collect, dataIndex, key, render: colRender } = column;
        const indexStr = dataIndex || key;
        // 优先判断
        if (hasServerCollect) {
          const cRender = colRender || formatNothing;
          const val = this.getDataIndexValue(summaryData, indexStr);
          let renderVal;
          try {
            renderVal = cRender(val, summaryData, dataList.length + 2);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(e);
          }
          domRender(renderVal, bodyTd);
        } else if (collect) {
          const setting = collectDataRow.$settings[indexStr];
          // 计算出来直接是可用值，不需要再放大缩小倍数
          const render = setting.moneyFmt ? fixedMoney : formatNothing;
          const collectRender = typeof collect === 'function' ? collect : render;
          const val = this.getDataIndexValue(collectDataRow, indexStr);
          domRender(collectRender(val), bodyTd);
        }
      }
      bodyTr.appendChild(bodyTd);
    }
    tbody.appendChild(bodyTr);

    if (hasServerCollect) {
      // 滚到底部
      setTimeout(() => {
        body.scrollTop = Number.MAX_SAFE_INTEGER;
      }, 0);
    }
  };

  fetch = (params, searchFn, specUrl) => {
    const { formValues: newFormValues, pagination: newPagination, orders: newOrders } = params || {};
    const {
      formSearch,
      url,
      dataList,
      onLoadData,
      pagination: propPagination = {},
      dataSourceRender,
      onBeforeLoadData,
      onTableLoadingStateChange = () => {},
    } = this.props;

    this.handleSelectedChange();
    let onSearch = searchFn;
    if (onSearch == null) {
      onSearch = () => {};
      // externalUsed表单外置的话，会直接调用到onSearch上，这里不能覆盖会二次触发
      const { onSearch: sh, externalUsed } = formSearch || {};
      if (sh && externalUsed !== true) {
        onSearch = sh;
      }
    }
    const userUrl = specUrl || url;
    const propPaginationIsPlainObject = isPlainObject(propPagination);
    const { formValues: stateFormValues, orders: stateOrders } = this.state;
    const pagination = this.getPagination(newPagination);
    const formValues = newFormValues || stateFormValues; // 表单条件全覆盖
    const orders = newOrders === null ? stateOrders : newOrders;
    this.setState({
      tempParams: params,
      formValues: {
        ...formValues,
      },
      pagination,
      orders,
    });
    onSearch(formValues);
    if (this.isStaticUsed()) {
      if (propPaginationIsPlainObject) {
        const start = pagination.pageSize * (pagination.current - 1);
        const end = start + pagination.pageSize;
        this.setState(
          () => ({
            // loading: false,
            dataList: dataList.slice(start, end),
            pagination: {
              ...pagination,
              total: dataList.length,
            },
          }),
          this.afterFlushData
        );
        return;
      }

      onBeforeLoadData?.(); // 不放最前 是因为动态Table才需要
      this.setState(
        () => ({
          // loading: false,
          dataList,
          pagination,
        }),
        this.afterFlushData
      );
      return;
    }

    onBeforeLoadData?.(); // 不放最前 是因为动态Table才需要
    this.setState({ loading: true });
    onTableLoadingStateChange(true);
    const pg = propPaginationIsPlainObject
      ? {
          page: pagination.current,
          rows: pagination.pageSize,
        }
      : {};
    get(userUrl, {
      ...pg,
      orders,
      ...this.searchFieldRender(formValues),
    })
      .then(data => {
        // fetch和Promise不可取消
        if (this.isUnmounted) {
          return;
        }
        const result = data || (propPaginationIsPlainObject ? {} : []);
        const originArray = propPaginationIsPlainObject ? result.rows || [] : result;
        const usePagination = propPaginationIsPlainObject
          ? {
              ...pagination,
              current: result.page, // 以服务器返回的页码覆盖当前来反馈页码状态到页面
              total: result.total,
            }
          : pagination;
        let list = originArray;
        if (typeof dataSourceRender === 'function') {
          const renderResult = dataSourceRender(result);
          // 不分页时dataSourceRender直接返回数组
          // 分页时如果也直接返回数组，表示接口本身是标准分页接口的输出字段，按标准取页码和总条数
          if (Array.isArray(renderResult)) {
            list = renderResult;
          }
          // 如果是分页的并且返回的是对象，按分页结果解析后从内部获取数据列表、页码和总条数
          else if (propPaginationIsPlainObject && isPlainObject(renderResult)) {
            const { rows, page, total } = renderResult;
            list = rows;
            Object.assign(usePagination, {
              current: page, // 以服务器返回的页码覆盖当前来反馈页码状态到页面
              total,
            });
          }
        }
        this.setState(
          () => ({
            loading: false,
            dataList: list,
            pagination: usePagination,
          }),
          this.afterFlushData
        );
        onTableLoadingStateChange(false);
        onLoadData?.(list, result);
      })
      .catch(e => {
        this.setState({ loading: false });
        onTableLoadingStateChange(false);
        // throw e;
        // eslint-disable-next-line no-console
        console.error(e);
      });
  };

  // 重新填充数据之后
  afterFlushData = () => {
    this.calcBodyHeight();
  };

  // 独立为导出服务的查询方法
  fetchForExport = async (id, formValues, tablePaginationIsPlainObject, config, p = 1) => {
    // 要求接口的搜索条件和默认导出、表格查询的搜索条件一致
    const { ignoreSelectedRow, url: useUrl } = config || {};
    const pagination = {
      page: p,
      rows: 20_000, // 服务端允许的max,
    };
    if (!ignoreSelectedRow) {
      const selectedRows = this.getSelectedRows();
      // 如果有勾选，直接使用勾选的数据
      if (selectedRows && selectedRows.length > 0) {
        return selectedRows;
      }
    }
    // 分页
    if (tablePaginationIsPlainObject) {
      const { url, todoNotices, dataSourceRender } = this.props;
      // todoNotices的数据异步，第一页查询通常是插入notice的同一动作
      if (pagination.page > 1 && !todoNotices.some(item => item.id === id)) {
        throw new ExportCancelError();
      }
      // 后台要求按x个每页并且不串行查询
      const result = await get(useUrl || url, {
        ...formValues,
        ...pagination,
      });
      let rows = result?.rows;
      let total = result?.total || 0;
      let page = result?.page;
      if (typeof dataSourceRender === 'function') {
        const renderResult = dataSourceRender(result);
        // 不分页时dataSourceRender直接返回数组
        // 分页时如果也直接返回数组，表示接口本身是标准分页接口的输出字段，按标准取页码和总条数
        if (Array.isArray(renderResult)) {
          rows = renderResult;
        }
        // 如果是分页的并且返回的是对象，按分页结果解析后从内部获取数据列表、页码和总条数
        else if (isPlainObject(renderResult)) {
          ({ rows, page, total } = renderResult);
        }
      }
      this.updateExportTaskNotice(id, {
        percent: div(Math.min(pagination.rows * page, total), total),
      });
      if (pagination.rows * page >= total) {
        return rows;
      }
      const nextRows = await this.fetchForExport(
        id,
        formValues,
        tablePaginationIsPlainObject,
        config,
        page + 1 // 以服务器返回的页码覆盖当前来反馈页码状态到页面
      );
      return [...(rows || []), ...nextRows];
    }
    // 不是分页直接全部使用查询结果（存到state里已经被dataSourceRender处理过了）
    const { dataList } = this.state;
    return dataList;
  };

  reduceColumnsForExport = (columns, record, rowIndex, target, columnSettings, parentCollect) => {
    const settings = columnSettings;
    if (Array.isArray(columns)) {
      const { convertNodeToString } = this.context;
      const item = target;
      columns.forEach(column => {
        const { dataIndex, key, render, collect, children, noRowSpan } = column;
        if (Array.isArray(children) && children.length > 0) {
          this.reduceColumnsForExport(children, record, rowIndex, target, settings, collect);
          return;
        }
        // 保存原始值
        item.$_originValues = item.$_originValues || {};
        // eslint-disable-next-line no-underscore-dangle
        if (record._sp) {
          item.$_sp = true;
          return;
        }
        // value是各种方式转换来的字符串
        const originValue = this.getDataIndexValue(record, dataIndex); //  遵循antd，原始取值不使用key
        const indexStr = dataIndex || key;

        item.$_originValues[indexStr] = originValue;

        settings[indexStr] = settings[indexStr] || {};
        const setting = settings[indexStr];
        setting.noRowSpan = noRowSpan;

        let value = originValue;
        const useRender = setting.render || render;
        if (typeof useRender === 'function') {
          const rdValue = useRender(value, record, rowIndex);
          value = convertNodeToString(rdValue);
        }
        const useCollect = 'collect' in column ? collect : parentCollect;
        if (
          (originValue == null || isNumber(originValue)) &&
          ((typeof value === 'string' && value.length > 0 && +value === Number(value)) || isNumber(value))
        ) {
          if (typeof value === 'string' && value.indexOf('.') > 0) {
            setting.numFmt = '0.00';
          }
          item[indexStr] = +value; // 按数字回填，方便excel识别number类型来求和
          if (useCollect) {
            setting.collect = true;
          }
          return;
        }
        item[indexStr] = value;
      });
    }
  };

  // 获取所有分页合计
  handleAllSummary = () => {
    // 默认不显示汇总行 点击后获取数据填充 变换条件查询后汇总置空 等待下次点击再获取
    const { summaryUrl } = this.props;
    const { formValues } = this.state;
    this.setState({
      summaryLoading: true,
    });
    get(summaryUrl, { ...formValues })
      .then(res => {
        this.setState({
          summaryData: { ...res, isTotalRow: true },
          summaryLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          summaryLoading: false,
        });
      });
  };

  /**
   * 导出按钮被点击
   * @param {Event} e 按钮event对象
   * @param {Object} config 按钮单独指定的配置
   */
  handleRowsExport = (e, config) => {
    const { writeFile, getTableNavPath } = this.context;
    const {
      operation = {},
      formSearch,
      tableId,
      datatable: { tablePersonalizationMapping },
      rowSpanByValue,
    } = this.props;
    const { columns = [], formValues, orders, resizeWidths: stateResizeWidths } = this.state;
    const tablePagination = this.getPagination();
    const tablePaginationIsPlainObject = isPlainObject(tablePagination);

    const { fields = [] } = formSearch || {};
    // 常规表格查询导出功能支持的配置字段
    const {
      params, // 覆盖的搜索条件
      fileName = getTableNavPath(this.table) || '文件', // 文件名称
      sheetName, // excel sheet name
      settings, // 导出时对字段的单独设置，以dataIndex(or key?)为key配置的, 目前支持render、validations(添加验证数据，目前只用到dropdown)
      columnsInsert, // 导出文件时额外插入一些列，可以考虑优化为插入任何位置以及替换为不同的columns
      ignoreSelectedRow, // 忽略[只导出选中行]
      dataSourceAllFetchDoneRender, // 查询完毕后
      ...restProps
    } = config?.export || operation.export || {};

    let useColumns = config?.columns || columns;
    if (columnsInsert?.insertKey && columnsInsert?.columns?.length > 0) {
      const idx = useColumns.findIndex(({ dataIndex, key }) => (dataIndex || key) === columnsInsert.insertKey);
      if (idx >= 0) {
        useColumns = [...useColumns];
        useColumns.splice(idx + 1, 0, ...columnsInsert.columns);
      }
    }

    const duration = 1000 * 1.5;
    this.parabolicJump(e, duration);

    setTimeout(async () => {
      // 显示的搜索条件
      const displayedFieldsStrList = fields.reduce(
        (strList, field, i, list) => [...strList, ...this.getSearchFormDisplay(field, i, list)],
        []
      );

      // 这一时刻的导出查询条件，由于是异步操作，查询时(主要是分页查询，用户可能修改查询条件，必须不受用户操作影响导出筛选结果)
      const formValuesAtMoment = this.searchFieldRender({
        ...formValues,
        orders,
        ...(params || {}),
      });

      const id = uuid();
      const startTime = Date.now();
      this.updateExportTaskNotice(id, {
        startTime,
        fileName,
        sheetName: sheetName || fileName,
        displayedFieldsStrList,
        percent: tablePaginationIsPlainObject ? 0 : false,
      });

      let exportList;
      try {
        exportList = await this.fetchForExport(id, formValuesAtMoment, tablePaginationIsPlainObject, {
          ignoreSelectedRow,
          url: config?.url,
        });
      } catch (err) {
        if (err.name === 'ExportCancel') {
          return;
        }
        // TODO: 可以优化清理一下，或者显示异常到待办
        // this.updateExportTaskNotice(id, {
        //   error: err,
        // });
        throw err;
      }

      if (typeof dataSourceAllFetchDoneRender === 'function') {
        exportList = dataSourceAllFetchDoneRender(exportList);
      }
      // 兼容dataSourceAllFetchDoneRender可能是async/await方法
      Promise.resolve(exportList).then(useExportList => {
        const endTime = Date.now();

        const storeSettings = tablePersonalizationMapping[tableId] || {};
        const columnSettings = {
          ...settings,
        };
        const resizeWidths = tableId == null ? stateResizeWidths : storeSettings.resizeWidths;
        // 放置宽度设置
        if (resizeWidths) {
          Object.keys(resizeWidths).forEach(key => {
            columnSettings[key] = {
              ...columnSettings[key],
              width: resizeWidths[key],
            };
          });
        }
        const doRowSpan = typeof rowSpanByValue === 'function';
        const options = {
          columns: useColumns,
          columnSettings,
          doRowSpan,
          ...restProps,
        };
        const dataList = [];
        (useExportList || []).forEach((record, rowIndex) => {
          const item = {};
          this.reduceColumnsForExport(useColumns, record, rowIndex, item, columnSettings);
          Object.assign(item, {
            $_ignoreSum: record.exportIgnoreSum,
            // ...
          });
          if (doRowSpan) {
            item.$_rsValue = rowSpanByValue(record);
            const prevItem = dataList[rowIndex - 1];
            if (prevItem && prevItem.$_rsValue === item.$_rsValue) {
              item.$_rowSpan = true;
            }
          }
          dataList.push(item);
        });
        this.updateExportTaskNotice(id, {
          // 数据转换好
          data: dataList,
          endTime,
          options,
        });
        writeFile(id);
      });
    }, duration);
  };

  /**
   * 更新store
   */
  updateExportTaskNotice = (id, payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/updateExportTask',
      payload: {
        id,
        ...payload,
      },
    });
  };

  // 调用getSearchFormDisplay前已经过滤过没有值的表单项了
  getSearchFormDisplay = (...args) => {
    const [field] = args;
    if (Array.isArray(field)) {
      return field.reduce(
        (subStrList, ...subArgs) => [...subStrList, ...this.getSearchFormDisplay(...subArgs, true)],
        []
      );
    }
    const { label } = field;
    const text = this.getSearchFormValueDisplay(...args);
    if (text == null) {
      return [];
    }
    return [`${label}：${text}`];
  };

  getSearchFormValueDisplay = (field, i, list, isCompose) => {
    const { venue } = this.props;
    const { formValues } = this.state;
    const { type, name, options, optionAll = true } = field || {};
    // 忽略的类型
    if (type === ItemTypes.DateTypeSelect || type === ItemTypes.DatePickerRangePreset) {
      return null;
    }
    const value = formValues[name];
    if (value == null) {
      return null;
    }
    const { listAndOther, itemListCache, platformListMapping, serviceUserListMapping } = venue;
    // 前置追加
    const prefix = optionAll
      ? [
          {
            key: '',
            text: '全部',
          },
        ]
      : [];
    switch (type) {
      case ItemTypes.Select:
        return ((options || []).find(item => item.key === value) || {}).text;
      case ItemTypes.DatePicker:
      case ItemTypes.DatePickerRangeStart:
        return formatDate(value);
      case ItemTypes.DatePickerRangeEnd:
        // 结束日期在查询表单时都加了一天
        return formatDate(moment(value).subtract(1, 'days'));
      case ItemTypes.TimePickerRangeStart:
      case ItemTypes.TimePickerRangeEnd:
      case ItemTypes.TimePickerRangeStart2:
      case ItemTypes.TimePickerRangeEnd2:
        return formatHMS(value);
      // 集联目前只支持三个
      case ItemTypes.CascaderLevels[0]:
        // return ((options || []).map(optionsMapper).find(item => item.key === value) || {}).text;
        return ((this.getCascaderLevelOptions(list, formValues, 0) || []).find(item => item.key === value) || {}).text;
      case ItemTypes.CascaderLevels[1]:
        if (isCompose) {
          // const parentField = list.find(f => f.type === ItemTypes.CascaderLevels[0]);
          // const parentSelectedItem = (parentField.options || [])
          //   .map(parentField.optionsMapper)
          //   .find(item => item.key === formValues[parentField.name]);
          // return ((parentSelectedItem.subOptions || []).map(optionsMapper).find(item => item.key === value) || {}).text;
          return ((this.getCascaderLevelOptions(list, formValues, 1) || []).find(item => item.key === value) || {})
            .text;
        }
        return value;
      case ItemTypes.CascaderLevels[2]:
        if (isCompose) {
          // const parentParentField = list.find(f => f.type === ItemTypes.CascaderLevels[0]);
          // const parentParentSelectedItem = (parentParentField.options || [])
          //   .map(parentParentField.optionsMapper)
          //   .find(item => item.key === formValues[parentParentField.name]);
          // const parentField = list.find(f => f.type === ItemTypes.CascaderLevels[1]);
          // const parentSelectedItem = (parentParentSelectedItem.subOptions || [])
          //   .map(parentField.optionsMapper)
          //   .find(item => item.key === formValues[parentField.name]);
          // return ((parentSelectedItem.subOptions || []).map(optionsMapper).find(item => item.key === value) || {}).text;
          return ((this.getCascaderLevelOptions(list, formValues, 2) || []).find(item => item.key === value) || {})
            .text;
        }
        return value;
      case ItemTypes.CascaderVenue:
        return this.getCascaderOther(
          field,
          (listAndOther || []).map(item => ({
            key: item.id,
            text: item.salesName,
          })),
          prefix,
          value
        );
      case ItemTypes.CascaderProfessional:
        return this.getCascaderOther(
          field,
          Object.values(itemListCache)
            .reduce((prev, current) => [...prev, ...(current || [])], [])
            .map(item => ({
              key: item.itemId,
              text: item.itemIdValue,
            })),
          prefix,
          value
        );
      case ItemTypes.CascaderPlatform:
        return this.getCascaderOther(
          field,
          Object.values(platformListMapping)
            .reduce((prev, current) => [...prev, ...(current || [])], [])
            .map(item => ({
              key: item.id,
              text: `${item.parentPlatformName || ''}${item.parentPlatformName ? '-' : ''}${item.platformName}`,
            })),
          prefix,
          value
        );
      case ItemTypes.CascaderServiceUser:
        return this.getCascaderOther(
          field,
          Object.values(serviceUserListMapping)
            .reduce((prev, current) => [...prev, ...(current || [])], [])
            .map(item => ({
              key: item.platformUserId,
              text: item.realName,
            })),
          prefix,
          value
        );
      default:
        return value;
    }
  };

  getCascaderOther = ({ mode, optionsMapper = item => item }, optinos, prefix, value) => {
    const tempOptions = [...(mode === 'multiple' ? [] : prefix), ...optinos].map(optionsMapper);
    return (mode === 'multiple' ? value : [value])
      .map(key => {
        return tempOptions.find(item => item.key === key).text;
      })
      .join(', ');
  };

  /**
   * 获取集联当前层级options数据
   */
  getCascaderLevelOptions = (composeFields, formValues, level = 0) => {
    if (level < ItemTypes.CascaderLevels.length) {
      const field = composeFields.find(f => f.type === ItemTypes.CascaderLevels[level]);
      if (field == null) {
        return null;
      }
      // 集联的数据在第一级上
      let { options } = field;
      const { optionsMapper } = field;
      if (level > 0) {
        const parentOptions = this.getCascaderLevelOptions(composeFields, formValues, level - 1);
        const parentField = composeFields.find(f => f.type === ItemTypes.CascaderLevels[level - 1]);
        const parentSelectedItem = (parentOptions || []).find(item => item.key === formValues[parentField.name]);
        options = parentSelectedItem.subOptions || [];
      }
      return (options || []).map(optionsMapper || (item => item));
    }
    return null;
  };

  /**
   * 添加导出任务时的动画
   */
  parabolicJump = (e, duration) => {
    const dom = document.createElement('div');
    domRender(
      <div
        className={styles.parabolic}
        style={{
          left: e.pageX,
          top: e.pageY,
        }}
      >
        <Icon type="download" />
      </div>,
      dom
    );
    document.body.appendChild(dom);
    this.animationJump(dom, duration);
  };

  animationJump = (parent, duration) => {
    const dom = parent.children[0];
    const noticeBtn = document.querySelector('.notice-btn');
    if (noticeBtn == null) {
      return;
    }
    const rect = dom.getBoundingClientRect();
    const btnRect = noticeBtn.getBoundingClientRect();
    // const fn = () => {
    //   const { left, top } = dom.getBoundingClientRect();
    //   if (left > 0 && top > 0) {
    //     dom.style.left = `${left - 1}px`;
    //     dom.style.top = `${top - 1}px`;
    //     window.requestAnimationFrame(fn);
    //   }
    // };
    // window.requestAnimationFrame(fn);
    const ani = dom.animate(
      [
        { transform: 'translate(0,0)', opacity: 1 },
        {
          transform: `translate(${((btnRect.left - rect.left) / 5) * 3}px, ${-((rect.top - btnRect.top) / 2)}px)`,
          opacity: 1,
        },
        {
          transform: `translate(${btnRect.left - rect.left + btnRect.width / 4}px, ${
            -rect.top + btnRect.height / 4
          }px)`,
          opacity: 1,
          offset: 0.8,
        },
        {
          transform: `translate(${btnRect.left - rect.left + btnRect.width / 4}px, ${
            -rect.top + btnRect.height / 4
          }px)`,
          display: 'none',
          opacity: 0,
        },
      ],
      {
        duration,
        // The number of times the animation should repeat. Defaults to 1, and can also take a value of Infinity to make it repeat for as long as the element exists.
        // iterations: Infinity,
        fill: 'forwards',
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        // easing: 'cubic-bezier(.6,.49,.96,.64)',
      }
    );
    ani.onfinish = function aniDone() {
      // 可能触发多次
      if (document.body.contains(parent)) {
        document.body.removeChild(parent);
      }
    };
  };

  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    const { filters: stateFilters } = this.state;
    if (!isEqual(stateFilters, filters)) {
      // 只支持静态过滤
      this.setState({
        filters: {
          ...filters,
        },
      });
      return;
    }
    const { pagination: propPagination = {} } = this.props;
    const propPaginationIsPlainObject = isPlainObject(propPagination);
    const params = {
      pagination: propPaginationIsPlainObject
        ? {
            current: pagination.current,
            pageSize: pagination.pageSize,
          }
        : {},
    };
    if (sorter.field && sorter.order) {
      // descend ascend
      params.orders = `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }
    // 不触发onSearch
    this.fetch(params, () => {});
  };

  handleFormSearch = formValues => {
    this.setState({
      summaryData: null,
    });
    const { pagination: propPagination = {} } = this.props;
    const propPaginationIsPlainObject = isPlainObject(propPagination);
    this.fetch({
      formValues,
      pagination: propPaginationIsPlainObject
        ? {
            current: 1,
          }
        : {},
      // orders: '',
    });
  };

  handleOnRow = record => ({
    onClick: () => {
      const { select, content, rowSelection = {}, selectHolder = () => true } = this.props;
      const { isTotalRow } = record;
      // http://git.ydmap.cn/ydmap/ydmap-web-cloud/commit/7e07f183e006dfe5059fd15d4aab68434fbafbf8
      if (content != null || isTotalRow || select == null) {
        // disabled
        return;
      }
      const checkDisable =
        typeof rowSelection.checkboxShouldBeDisable === 'function' ? rowSelection.checkboxShouldBeDisable : () => false;
      if (checkDisable(record)) {
        return;
      }
      // http://git.ydmap.cn/ydmap/ydmap-web-cloud/commit/7e07f183e006dfe5059fd15d4aab68434fbafbf8
      if (select === 'single') {
        if (selectHolder([record])) {
          this.handleSelectedChange([record]);
        }
        return;
      }
      if (select === 'multi') {
        const selectedRows = this.getSelectedRows();
        const key = this.getRowKey(record);
        const idx = (selectedRows || []).findIndex(item => this.getRowKey(item) === key);
        if (idx >= 0) {
          const list = [...selectedRows];
          list.splice(idx, 1);
          if (selectHolder(list)) {
            this.handleSelectedChange(list);
          }
          return;
        }
        if (selectHolder([record])) {
          this.handleSelectedChange([record]);
        }
      }
    },
  });

  hasCollectList = (list = []) => {
    return list.some(item => item.collect);
  };

  setDataIndexValue = (record, dataIndex, value) => {
    if (record == null || dataIndex == null) {
      return;
    }
    // dataIndex没有函数的
    if (typeof dataIndex === 'string') {
      lodashSet(record, dataIndex, value);
    }
  };

  getDataIndexValue = (record, dataIndex) => {
    if (record == null || dataIndex == null) {
      return null;
    }
    // dataIndex没有函数的
    if (typeof dataIndex === 'string') {
      return lodashGet(record, dataIndex);
    }
    return null;
  };

  // 这里的逻辑与表格导出的逻辑要一致，修改这里那边也要修改
  buildColumns = (list, hasCollect) => {
    let columns = [...list];
    const { dataList } = this.state;
    const { rowSpanByValue } = this.props;
    if (dataList && dataList.length > 0 && typeof rowSpanByValue === 'function') {
      // 列索引数组保存不同值的计数
      const valueCounter = {};
      columns = columns.map(col => {
        const { noRowSpan, children: subColumns, dataIndex, render } = col;
        // collect的列不支持rowSpanByValue
        if (dataIndex == null || noRowSpan || (Array.isArray(subColumns) && subColumns.length > 0)) {
          return col;
        }
        valueCounter[dataIndex] = valueCounter[dataIndex] || [];
        dataList.forEach((row, idx) => {
          if (idx === 0) {
            valueCounter[dataIndex][idx] = 1;
            return;
          }
          const value = this.getDataIndexValue(row, dataIndex);
          const rsValue = rowSpanByValue(row);
          // 往回找某个值第一次出现的位置
          for (let m = idx - 1; m < dataList.length && m >= 0; m -= 1) {
            if (valueCounter[dataIndex][m] > 0) {
              // 之前的某行
              const upRow = dataList[m];
              const upValue = this.getDataIndexValue(upRow, dataIndex);
              const upRsValue = rowSpanByValue(upRow);
              if (upValue === value && upRsValue === rsValue) {
                // 值相同
                valueCounter[dataIndex][idx] = 0;
                valueCounter[dataIndex][m] += 1;
                return;
              }
              break;
            }
          }
          valueCounter[dataIndex][idx] = 1;
        });
        return {
          ...col,
          render: (text, row, index) => {
            // 值相同时的计数，不同后重置
            const children = typeof render === 'function' ? render(text, row, index) : text;
            return {
              children,
              props: {
                rowSpan: valueCounter[dataIndex][index],
              },
            };
          },
        };
      });
    }
    if (hasCollect) {
      const colSpan = this.reduceColumns(columns).length;
      return this.getCollectCols(
        columns,
        Array.isArray(columns[0].children) && columns[0].children.length > 0 ? columns[0].children[0] : columns[0],
        colSpan
      );
    }
    return columns;
  };

  onHeaderCell = ({ width, dataIndex, key }) => ({
    width,
    onResize: (e, { size }) => {
      this.setState(({ resizeWidths }) => ({
        resizeWidths: {
          ...resizeWidths,
          [dataIndex || key]: size.width,
        },
      }));
    },
    onResizeStart: () => {
      this.setState({
        resizeHoldOn: true,
      });
    },
    onResizeStop: async (e, { size }) => {
      const {
        tableId,
        datatable: { tablePersonalizationMapping },
      } = this.props;
      const config = tablePersonalizationMapping[tableId] || {};
      const resizeWidths = {
        ...config.resizeWidths,
        [dataIndex || key]: size.width,
      };
      await this.saveTablePersonalization({
        resizeWidths,
      });
      this.setState({
        resizeWidths,
        resizeHoldOn: false,
      });
    },
  });

  resizableWrapColumns = columns => {
    if (Array.isArray(columns) && columns.length > 0) {
      const {
        tableId,
        personalization,
        datatable: { tablePersonalizationMapping },
      } = this.props;
      if (!personalization) {
        return columns;
      }
      const storeSettings = tablePersonalizationMapping[tableId] || {};
      const { resizeHoldOn, resizeWidths: stateResizeWidths } = this.state;
      const resizeWidths =
        tableId == null
          ? stateResizeWidths
          : {
              ...storeSettings.resizeWidths,
              ...(resizeHoldOn ? stateResizeWidths : {}),
            };
      return columns.map(column => ({
        ...column,
        width: resizeWidths[column.dataIndex || column.key] || column.width,
        onHeaderCell: this.onHeaderCell,
        children: this.resizableWrapColumns(column.children),
      }));
    }
    return null;
  };

  formContainerRender = (searchForm, getContainer) => {
    if (this.formContainerRenderTimer) {
      clearTimeout(this.formContainerRenderTimer);
    }
    const formContainer = getContainer();
    if (formContainer instanceof Element) {
      setTimeout(() => {
        domRender(<Provider store={store}>{searchForm}</Provider>, formContainer);
      }, 0);
      return;
    }
    this.formContainerRenderTimer = setTimeout(() => {
      this.formContainerRender(searchForm, getContainer);
    }, 50);
  };

  reduceColumnsWidth = columns => {
    return (columns || []).reduce((prev, col) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        return prev + this.reduceColumnsWidth(col.children);
      }
      return prev + (col.width > 0 ? col.width : 0);
    }, 0);
  };

  handleComposeStateChange = (obj, compose) => {
    if (compose == null) {
      return;
    }
    // 使用函数方式setState, 兼容初始化值并发修改
    this.setState(({ composeStateMapping }) => ({
      composeStateMapping: {
        ...composeStateMapping,
        [compose]: {
          ...composeStateMapping[compose],
          ...obj,
        },
      },
    }));
  };

  hasCollect() {
    const { columns = [] } = this.state;
    const has = list =>
      this.hasCollectList(list) ||
      list.some(item => {
        if (Array.isArray(item.children) && item.children.length > 0) {
          return has(item.children);
        }
        return false;
      });
    return has(columns);
  }

  buildCollectData() {
    const { rowKey } = this.props;
    const { columns = [] } = this.state;
    const collectObj = {
      isTotalRow: true,
    };
    // rowKey是函数的情况在顶部connect的mergeProps里处理了
    if (typeof rowKey === 'string') {
      this.setDataIndexValue(collectObj, rowKey, collectBodyRowKey);
    }
    this.calcCollectColumnData(columns, collectObj);
    return collectObj;
  }

  calcCollectColumnData(columns = [], collectObj, parentCollect) {
    // 表格显示的汇总行设置附加在record对象上
    this.setDataIndexValue(collectObj, '$settings', collectObj.$settings || {});
    const settings = collectObj.$settings;

    const { convertNodeToString } = this.context;
    const { dataList } = this.state;
    const records = dataList || [];
    const { rowSpanByValue } = this.props;
    const doRowSpan = typeof rowSpanByValue === 'function';
    columns.forEach(column => {
      const { dataIndex, key, collect, noRowSpan, children, render } = column;
      const indexStr = dataIndex || key;
      if (Array.isArray(children) && children.length > 0) {
        this.calcCollectColumnData(children || [], collectObj, collect);
        return;
      }
      const useCollect = 'collect' in column ? collect : parentCollect;
      if (!useCollect) {
        return;
      }
      settings[indexStr] = settings[indexStr] || {};
      const setting = settings[indexStr];
      // 默认视为数字相加
      const value = records.reduce((prev, record, rowIndex) => {
        if (record.exportIgnoreSum) {
          return prev;
        }
        if (doRowSpan && !noRowSpan) {
          const rsValue = rowSpanByValue(record);
          const prevItem = dataList[rowIndex - 1];
          if (prevItem && rowSpanByValue(prevItem) === rsValue) {
            return prev;
          }
        }
        const originValue = this.getDataIndexValue(record, indexStr);
        let val = originValue;
        if (typeof render === 'function') {
          const rdValue = render(val, record, rowIndex);
          val = convertNodeToString(rdValue);
        }
        // 原始值是数字，且转换后是字符串的才可能需要金额处理
        if ((originValue == null || isNumber(originValue)) && typeof val === 'string' && val.length > 0) {
          const numValue = +val;
          // 能够转换为等值数字（避免非字面数值的字符串）
          if (numValue === Number(val)) {
            // // 但凡没设置过，遇到需要设置，则设置它为需要金额格式化
            if (!setting.moneyFmt && val.indexOf('.') > 0) {
              setting.moneyFmt = true;
            }
            val = numValue; // 按数字回填，方便number类型来求和
          }
        }
        return add(prev, Number.isFinite(val) ? val : 0);
      }, 0);
      this.setDataIndexValue(collectObj, indexStr, value);
    });
  }

  isStaticUsed() {
    const { dataList } = this.props;
    return dataList != null;
  }

  buildRowSelection() {
    const { select, content, rowSelection = {}, selectHolder = () => true } = this.props;
    if (select === 'single' || select === 'multi') {
      const selectedRows = this.getSelectedRows();
      const isSingle = select === 'single';
      // 如果传递了rowSelection.selectedRows则使用来做control, 否则使用自己的state存储值
      // antd的api设计的是rowSelection.selectedRowKeys来做control，这里对外改为selectedRows
      const selectedRowKeys = (selectedRows || []).map(item => this.getRowKey(item));
      const checkDisable =
        typeof rowSelection.checkboxShouldBeDisable === 'function' ? rowSelection.checkboxShouldBeDisable : () => false;
      return {
        ...rowSelection,
        type: isSingle ? 'radio' : 'checkbox',
        selectedRowKeys,
        onChange: (_, sRows) => {
          if (selectHolder(sRows)) {
            this.handleSelectedChange(sRows);
          }
        },
        getCheckboxProps: record => ({
          // eslint-disable-next-line no-underscore-dangle
          disabled: content != null || record.isTotalRow || checkDisable(record),
        }),
      };
    }
    return null;
  }

  searchFieldRender(formValues) {
    const formData = formValues || {};
    const { formSearch } = this.props;
    const formValuesOverrideRendered = {};
    const { fields } = formSearch || {};
    (fields || []).forEach(({ name, searchFieldRender, type, parentName }) => {
      if (typeof searchFieldRender === 'function') {
        formValuesOverrideRendered[name] = searchFieldRender(formData[name], formData);
        return;
      }
      if (type === ItemTypes.DateTypePicker) {
        switch (formData[parentName]) {
          case 0:
            formValuesOverrideRendered[name] = formatDate(formData[name]);
            break;
          case 1:
            formValuesOverrideRendered[name] = formatMonth(formData[name]);
            break;
          default:
        }
      }
    });
    return {
      ...formData,
      ...formValuesOverrideRendered,
    };
  }

  render() {
    const {
      columns: propColumns,
      formSearch,
      operation = {},
      rowKey,
      scroll,
      content,
      tableId,
      personalization,
      hideSelectAll,
      summaryUrl,
      ...restProps
    } = this.props;
    const {
      dataList,
      loading,
      summaryLoading,
      bodyHeight,
      composeStateMapping,
      columns = [],
      noCheckedKeys,
      frozenCheckedKeys,
    } = this.state;

    const selectedRows = this.getSelectedRows();

    const pagination = this.getPagination();
    const { isMobile } = this.context;

    const tbScroll = {
      ...scroll,
    };

    tbScroll.y = tbScroll.y || bodyHeight || undefined;

    // 如果每个列都设置了宽度就去掉x
    // if ((columns || []).every(col => col.width > 0)) {
    //   tbScroll.x = undefined;
    // } else {
    //   // eslint-disable-next-line no-console
    //   console.warn('页面仅有单个表格时支持锁定列头滚动需要依赖列宽，请为每一列配置固定列宽。')
    // }

    const allConfigWidth = this.reduceColumnsWidth(columns);

    if (tbScroll.x == null || tbScroll.x < allConfigWidth) {
      tbScroll.x = allConfigWidth;
    }

    const rowSelection = this.buildRowSelection();

    const { getContainer, externalUsed, ...formSearchRestProps } = formSearch || {};

    const formSearchCp = {
      ...formSearchRestProps,
      externalUsed: !externalUsed, // 如果datatable提供表单，外置表单就不产生，反之一样，只保有一个表单
      onSearch: this.handleFormSearch,
    };

    const searchForm = <SearchForm config={formSearchCp} tableLoading={loading} onFormInit={this.onFormInit} />;

    const formContainerOk = typeof getContainer === 'function';
    if (formContainerOk) {
      this.formContainerRender(searchForm, getContainer);
    }

    const hasCollect = this.hasCollect();

    const operationRestProps = {
      tableId,
      showHeader: restProps.showHeader,
      columns,
      allColumns: propColumns,
      tableLoading: loading,
      selectedRows,
      dataList,
      onExport: this.handleRowsExport,
      summary: !!summaryUrl,
      summaryLoading,
      onTotal: this.handleAllSummary,
      personalization,
      noCheckedKeys,
      onColumnsCheck: this.handleColumnsCheck,
      frozenCheckedKeys,
      onFrozenCheck: this.handleColumnsFrozenCheck,
      onPersonalizationReset: this.handlePersonalizationReset,
      getTableWrapper: this.getTableWrapper,
    };

    const tablePaginationIsPlainObject = isPlainObject(pagination);

    return (
      <div
        className="datatable no-print"
        ref={node => {
          this.datatableNode = node;
        }}
      >
        {!formContainerOk && searchForm}
        {content ? (
          Children.map(content, child =>
            cloneElement(child, {
              operation,
              ...operationRestProps,
              composeStateMapping,
              handleComposeStateChange: this.handleComposeStateChange,
            })
          )
        ) : (
          <Operation config={operation} {...operationRestProps} />
        )}
        <Table
          bordered
          {...restProps}
          components={personalization ? this.components : undefined}
          ref={node => {
            this.table = node;
          }}
          className={classNames({
            [styles.frameless]: isMobile,
            // 4.x有属性直接支持
            [styles.hideSelectAll]: hideSelectAll,
          })}
          scroll={tbScroll}
          rowKey={rowKey}
          loading={loading}
          rowSelection={rowSelection}
          // collect 在分页的情况下，补充的两行会被干掉, 没必要追加数据, 用别的方式追加显示出来
          // https://github.com/ant-design/ant-design/blob/master/components/table/Table.tsx#L408
          dataSource={dataList}
          pagination={
            tablePaginationIsPlainObject
              ? {
                  ...pagination,
                  size: isMobile ? 'small' : pagination.size,
                }
              : pagination
          }
          onRow={this.handleOnRow}
          onChange={this.handleTableChange}
          columns={this.resizableWrapColumns(this.buildColumns(columns, hasCollect))}
        />
      </div>
    );
  }
}

export default Datatable;

export { RenderTypes };

const WrapperImg = ({ imgComponent }) => {
  return (
    <div
      onClick={() => {
        if (imgComponent.props.src) {
          Modal.info({
            title: '图片预览',
            width: 800,
            content: <img src={imgComponent.props.src.split('@')[0]} width="100%" alt="" />,
            okText: '确认',
          });
        }
      }}
    >
      {imgComponent}
    </div>
  );
};

/**
 * 用dynamicHeaderPlaceType匹配好动态列头, 返回新列头
 * @param {*} columns
 * @param {*} dynamicHeaderList
 */
export function matchDynamicHeader(
  columns,
  dynamicHeaderList,
  matchRender = renderType => {
    switch (renderType) {
      case RenderTypes.Money.key:
        return formatMoneyLen2;
      case RenderTypes.Date.key:
        return value => formatDate(+value);
      case RenderTypes.DateTime.key:
        return value => formatDateTime(+value);
      case RenderTypes.Img.key:
        // eslint-disable-next-line react/destructuring-assignment
        return value => (value == null ? null : <WrapperImg imgComponent={formatFaceImgInTable(value.url)} />);
      case RenderTypes.File.key:
        return value => {
          if (value == null) {
            return null;
          }
          const { fileName, url } = value;
          return (
            <a href={url} target="_blank" rel="noopener noreferrer">
              {fileName || url}
            </a>
          );
        };
      default:
    }
  }
) {
  return columns?.reduce((prev, current) => {
    const column = { ...current };
    const { dynamicHeaderPlaceType, render, width, children } = column;
    if (dynamicHeaderPlaceType) {
      const headerList = dynamicHeaderList?.filter(item => item.groupKey === dynamicHeaderPlaceType);
      // 没匹配上丢弃
      if (headerList == null || headerList.length === 0) {
        return prev;
      }
      // 匹配上，不支持动态的列头还继续处理children
      return [
        ...prev,
        ...headerList.map(header => {
          const r = render || matchRender(header.render);
          return {
            ...omit(column, ['dynamicHeaderPlaceType']),
            title: header.name,
            key: `${dynamicHeaderPlaceType}-${header.fieldName}`,
            dataIndex: header.fieldName,
            render: r
              ? (...args) => {
                  return r(...args, header);
                }
              : undefined,
            width: width || 110,
          };
        }),
      ];
    }
    // 本身自己有合法的children
    if (Array.isArray(children) && children.length > 0) {
      const newChildren = matchDynamicHeader(children, dynamicHeaderList, matchRender);
      // 变没了
      if (!(newChildren?.length > 0)) {
        return prev;
      }
      // 还有，可能别过滤了，覆盖
      column.children = newChildren;
    }
    return [...prev, column];
  }, []);
}
