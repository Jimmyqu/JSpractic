import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Popover, Tabs, Badge, Spin, Row, Col } from 'antd';
import classNames from 'classnames';
import IconFont from '@/components/Icon';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(({ global = {} }) => ({
  mute: global.mute,
  NoticeTypes: global.NoticeTypes,
}))
class NoticeIcon extends PureComponent {
  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    locale: {
      emptyText: '暂无数据',
      clear: '清空',
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };

  static Tab = TabPane;

  constructor(props) {
    super(props);
    this.state = {};
    if (props.tabs && props.tabs[0]) {
      this.state.tabType = props.tabs[0].typeObj.key;
    }
  }

  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    onItemClick(item, tabProps);
  };

  onTabChange = tabType => {
    this.setState({ tabType });
    const { onTabChange } = this.props;
    onTabChange(tabType);
  };

  muteAction = () => {
    const { dispatch, onPopupVisibleChange } = this.props;
    dispatch({
      type: 'global/switchVoice',
    });
    onPopupVisibleChange(false);
  };

  navAction = () => {
    const { dispatch, onPopupVisibleChange } = this.props;
    dispatch(push('/basic/msgmanage/notice'));
    onPopupVisibleChange(false);
  };

  render() {
    const {
      className,
      count,
      popupAlign,
      onPopupVisibleChange,
      popupVisible,
      mute,
      tabs,
      loading,
      onClear,
      locale,
      noticeData,
      NoticeTypes = {},
    } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton, 'notice-btn');
    const trigger = (
      <span className={noticeButtonClass} title={`消息${mute ? '-已静音' : ''}`}>
        <Badge count={count} className={styles.badge}>
          {mute ? (
            <IconFont type="mute" className={classNames(styles.icon, styles.mute)} />
          ) : (
            <IconFont type="voice" className={styles.icon} />
          )}
        </Badge>
      </span>
    );
    if (tabs == null || tabs.length === 0) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = popupVisible;
    }
    return (
      <Popover
        placement="bottomRight"
        content={
          <Spin spinning={loading} delay={0}>
            <Tabs className={styles.tabs} onChange={this.onTabChange}>
              {tabs.map(tab => {
                const { typeObj = {} } = tab;
                const list = noticeData[typeObj.key];
                const ptitle = typeObj.value;
                const title = list && list.length > 0 ? `${ptitle} (${list.length})` : ptitle;
                return (
                  <TabPane tab={title} key={typeObj.key}>
                    <List
                      {...tab}
                      NoticeTypes={NoticeTypes}
                      data={list}
                      onClick={item => this.onItemClick(item, tab)}
                      onClear={() => onClear(typeObj.key)}
                      title={ptitle}
                      locale={locale}
                    />
                    {typeObj === NoticeTypes.Message && (
                      <Row>
                        <Col span={12} className={styles.actionCol}>
                          <div className={styles.actionItem} onClick={this.muteAction}>
                            {`${mute ? '打开' : '关闭'}铃声`}
                          </div>
                        </Col>
                        <Col span={12} className={styles.actionCol}>
                          <div className={styles.actionItem} onClick={this.navAction}>
                            查看所有通知
                          </div>
                        </Col>
                      </Row>
                    )}
                  </TabPane>
                );
              })}
            </Tabs>
          </Spin>
        }
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </Popover>
    );
  }
}

export default NoticeIcon;
