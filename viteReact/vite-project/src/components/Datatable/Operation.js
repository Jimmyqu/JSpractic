import { Component, createRef } from 'react';
import { Button, Dropdown, Menu, Icon, Popover, Tree, message } from 'antd';
import PropTypes from 'prop-types';
import IconFont from '@/components/Icon';
import { screenfullIsEnabled, screenfullRequest } from '@/commons/lib/media';
import styles from './operation.less';
import MarginBar from '../MarginBar';

export const ButtonTypes = {
  Export: 1,
  SummaryTotal: 2,
};

class Operation extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool,
    isAuthorized: PropTypes.func,
  };

  state = {
    allKeys: [],
    // tabKey: 'shown',
  };

  ref = createRef();

  componentDidMount() {
    this.setDate();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setDate(nextProps);
  }

  handleMenuClick = (e, buttons = []) => {
    const btn = buttons[Number(e.key)]; // 存的循环下标
    if (btn == null) {
      return;
    }
    if (typeof btn.action === 'function') {
      btn.action(e);
    }
    // dropdown的只支持action
  };

  mapColumns = (allColumns, level = 0) => {
    if (Array.isArray(allColumns) && allColumns.length > 0) {
      return allColumns.map(({ title, dataIndex, key, children }, idx) => ({
        title,
        key: dataIndex || key || `${level}-${idx}`,
        children: this.mapColumns(children, level + 1),
      }));
    }
    return null;
  };

  mapKeys = (allColumns, list) => {
    if (Array.isArray(allColumns) && allColumns.length > 0) {
      allColumns.forEach(({ key, children }) => {
        list.push(key);
        this.mapKeys(children, list);
      });
    }
  };

  setDate = props => {
    const { allColumns } = props || this.props;
    const allData = this.mapColumns(allColumns);
    const allKeys = [];
    this.mapKeys(allData, allKeys);
    this.setState({
      allData,
      allKeys,
    });
  };

  handleShownCheck = checkedKeys => {
    const { onColumnsCheck } = this.props;
    const { allKeys } = this.state;
    const noCheckedKeys = allKeys.filter(key => !checkedKeys.includes(key));
    if (typeof onColumnsCheck === 'function') {
      onColumnsCheck(noCheckedKeys);
    }
  };

  handleFrozenCheck = checkedKeys => {
    if (checkedKeys.length > 5) {
      message.info('最多同时可冻结5项');
      return;
    }
    const { onFrozenCheck } = this.props;
    if (typeof onFrozenCheck === 'function') {
      onFrozenCheck(checkedKeys);
    }
  };

  renderTreeNodes = data =>
    (data || []).map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key} {...item} />;
    });

  // 函数版  BtnAvailable
  isBtnAvailable = ({ forRow, auth }) => {
    const { selectedRows } = this.props;
    const rows = selectedRows || [];
    const selectedLength = rows.length;
    if ((forRow === 'single' && selectedLength !== 1) || (forRow === 'multi' && selectedLength === 0)) {
      return false;
    }
    if (typeof forRow === 'function' && forRow(rows) !== true) {
      return false;
    }
    const { isAuthorized } = this.context;
    return isAuthorized(auth);
  };

  // onTabChange = tabKey => {
  //   this.setState({
  //     tabKey,
  //   });
  // };

  render() {
    const {
      // columns,
      config = {},
      tableLoading,
      summaryLoading,
      dataList, // 当前页数据
      onExport,
      personalization,
      noCheckedKeys: pslNoCheckedKeys,
      // frozenCheckedKeys: pslFrozenKeys,
      onPersonalizationReset,
      showHeader = true,
      getTableWrapper,
      onTotal,
      summary,
    } = this.props;

    const {
      allData,
      allKeys,
      //  tabKey
    } = this.state;
    const { buttons = [], extContentRender } = config;
    const { isMobile } = this.context;
    const usePersonalization = showHeader && personalization;
    if (buttons.length === 0 && !(extContentRender || usePersonalization)) {
      return null;
    }
    const tableNode = getTableWrapper();
    const showFullscreenBtn = screenfullIsEnabled() && tableNode != null && !isMobile;

    const checkedKeys =
      pslNoCheckedKeys == null || pslNoCheckedKeys.length === 0
        ? allKeys
        : allKeys.filter(key => !pslNoCheckedKeys.includes(key));

    const isNoData = dataList.length === 0;
    return (
      <div className={styles.operation} ref={this.ref}>
        <div>
          {buttons.map((btn, idx) => {
            if (!this.isBtnAvailable(btn)) {
              return null;
            }
            if (Array.isArray(btn.buttons) && btn.buttons.length > 0) {
              // 提前计算，避免没权限中间的变量都做了无用执行
              // 子按钮中正在loading的那个
              let subBtnInLoading;
              // 子按钮有效的那些做mapping
              const buttonsWithKey = [];
              btn.buttons.forEach(subBtn => {
                if (!this.isBtnAvailable(subBtn)) {
                  return;
                }
                const {
                  text,
                  icon,
                  btnType,
                  // 只有 ButtonTypes.Export 的按钮才额外支持下面的属性
                  url,
                  columns,
                  export: exp,
                } = subBtn;
                const nb = {
                  ...subBtn,
                };
                switch (btnType) {
                  case ButtonTypes.Export:
                    if (isNoData) {
                      // 跳过此按钮
                      return;
                    }
                    nb.action = e =>
                      onExport(
                        e,
                        // 单独指定的配置
                        {
                          url, // 要求接口的搜索条件和默认导出、表格查询的搜索条件一致
                          columns,
                          export: exp,
                        }
                      );
                    nb.text = text || '导出';
                    nb.icon = icon || <IconFont type="export" />;
                    break;
                  case ButtonTypes.SummaryTotal:
                    if (isNoData || !summary) {
                      return;
                    }
                    nb.loading = summaryLoading;
                    nb.action = onTotal;
                    nb.text = text || '获取当前条件汇总';
                    break;
                  default:
                }
                // 存的循环下标
                nb.key = buttonsWithKey.length;
                buttonsWithKey.push(nb);
                if (subBtnInLoading == null && nb.loading) {
                  subBtnInLoading = nb;
                }
              });
              if (buttonsWithKey.length === 0) {
                return null;
              }
              let { icon } = btn;
              const { text, disabled, loading, type } = btn;
              if (typeof icon === 'string') {
                icon = <Icon type={icon} />;
              }
              return (
                <BtnWrapper key={text}>
                  <Dropdown
                    // Dropdown.Button 的click
                    // onClick={}
                    overlay={
                      <Menu onClick={e => this.handleMenuClick(e, buttonsWithKey)}>
                        {buttonsWithKey.map(subBtn => {
                          // menu和menu.item不支持loading
                          return (
                            <Menu.Item key={subBtn.key} disabled={subBtn.disabled || subBtn.loading}>
                              {typeof subBtn.icon === 'string' ? <Icon type={subBtn.icon} /> : subBtn.icon}
                              {subBtn.text}
                            </Menu.Item>
                          );
                        })}
                      </Menu>
                    }
                  >
                    <Button
                      type={type}
                      disabled={disabled || tableLoading}
                      loading={loading || subBtnInLoading != null}
                    >
                      {icon}
                      {text}
                      <Icon type="down" />
                    </Button>
                  </Dropdown>
                </BtnWrapper>
              );
            }
            return (
              <OperationButton
                key={`${btn.text || idx}-${btn.btnType || idx}`}
                size={isMobile ? 'large' : 'default'}
                btn={btn}
                disabled={btn.disabled || tableLoading}
                loading={btn.loading}
                summary={summary}
                summaryLoading={summaryLoading}
                onExport={onExport}
                isNoData={isNoData}
                onTotal={onTotal}
              />
            );
          })}
        </div>

        <div>
          {extContentRender && <BtnWrapper>{extContentRender()}</BtnWrapper>}
          {showFullscreenBtn && (
            <BtnWrapper>
              <Button title="表格全屏化" onClick={() => screenfullRequest(tableNode)}>
                <IconFont type="fullscreen-2" />
              </Button>
            </BtnWrapper>
          )}
          {usePersonalization && (
            <BtnWrapper>
              <Popover
                placement="bottomRight"
                title={
                  <div className={styles.popoverTitle}>
                    <span>显示列</span>
                    <Button size="small" onClick={onPersonalizationReset}>
                      重置
                    </Button>
                  </div>
                }
                trigger="click"
                overlayClassName={styles.popover}
                content={
                  // <Tabs defaultActiveKey={tabKey} activeKey={tabKey} onChange={this.onTabChange}>
                  //   <Tabs.TabPane tab="显示列" key="shown">
                  <Tree checkable blockNode onCheck={this.handleShownCheck} checkedKeys={checkedKeys}>
                    {this.renderTreeNodes(allData)}
                  </Tree>
                  //   </Tabs.TabPane>
                  //   <Tabs.TabPane tab="冻结列" key="freeze">
                  //     <Tree checkable blockNode onCheck={this.handleFrozenCheck} checkedKeys={pslFrozenKeys}>
                  //       {this.renderTreeNodes(this.mapColumns(columns))}
                  //     </Tree>
                  //   </Tabs.TabPane>
                  // </Tabs>
                }
              >
                <Button title="表格个性化">
                  <Icon type="setting" />
                </Button>
              </Popover>
            </BtnWrapper>
          )}
        </div>
      </div>
    );
  }
}

const OperationButton = ({
  btn = {},
  loading,
  summaryLoading,
  disabled,
  onExport,
  onTotal,
  size,
  summary,
  isNoData,
}) => {
  const {
    type,
    icon,
    action,
    text,
    btnType,
    // 只有 ButtonTypes.Export 的按钮才额外支持下面的属性
    url,
    columns,
    export: exp,
  } = btn;
  const btnProps = {
    size,
    type,
    loading,
    disabled,
    onClick: e => {
      if (typeof action === 'function') {
        btn.action(e);
      }
    },
  };
  let letUseText = text;
  let useIcon = icon;
  switch (btnType) {
    case ButtonTypes.Export:
      if (isNoData) {
        return null;
      }
      Object.assign(btnProps, {
        onClick: e =>
          onExport(
            e,
            // 单独指定的配置
            {
              url, // 要求接口的搜索条件和默认导出、表格查询的搜索条件一致
              columns,
              export: exp,
            }
          ),
      });
      letUseText = letUseText || '导出';
      if (useIcon == null) {
        useIcon = <IconFont type="export" />;
      }
      break;
    case ButtonTypes.SummaryTotal:
      if (isNoData || !summary) {
        return null;
      }
      Object.assign(btnProps, {
        loading: summaryLoading,
        onClick: onTotal,
      });
      letUseText = letUseText || '获取当前条件汇总';
      break;
    default:
  }
  if (typeof useIcon === 'string') {
    btnProps.icon = useIcon;
  }
  return (
    <BtnWrapper>
      <Button {...btnProps}>
        {!btnProps.icon && useIcon}
        {letUseText}
      </Button>
    </BtnWrapper>
  );
};

const BtnWrapper = ({ children }) => {
  return (
    <MarginBar inline left top>
      {children}
    </MarginBar>
  );
};

export default Operation;
