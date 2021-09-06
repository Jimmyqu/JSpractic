import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import debounce from 'lodash/debounce';
import { triggerEvent, DEFAULT_USER_AVATAR_PIC_PATH } from '@/utils/utils';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

@connect(({ global = {} }) => ({
  NoticeTypes: global.NoticeTypes,
  notices: global.notices,
}))
class GlobalHeader extends PureComponent {
  static contextTypes = {
    writeFile: PropTypes.func,
  };

  triggerResizeEvent = debounce(() => {
    triggerEvent(window, 'resize');
  }, 600);

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices == null || notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.createTime) {
        newNotice.datetime = moment(notice.createTime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.tag) {
        newNotice.extra = (
          <Tag color={newNotice.tag} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const { writeFile } = this.context;
    const {
      dispatch,
      currentUser = {},
      collapsed,
      receivingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      noticeVisible,
      NoticeTypes = {},
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item disabled>
          <Icon type="mobile" />
          {(currentUser.sysUser || {}).mobile}
        </Menu.Item>
        {/* <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item> */}
        {/* <Menu.Item key="triggerError">
          <Icon type="close-circle" />触发报错
        </Menu.Item> */}
        <Menu.Item key="changepwd">
          <Icon type="setting" />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {/* {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]} */}
        <Icon className={styles.trigger} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
        <div className={styles.right}>
          <Tooltip title="使用文档">
            <a target="_blank" href="//help.ydmap.cn" rel="noopener noreferrer" className={styles.action}>
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <NoticeIcon
            noticeData={noticeData}
            popupVisible={noticeVisible}
            className={styles.action}
            count={currentUser.notifyCount}
            onItemClick={({ id, type }) => {
              if (type === NoticeTypes.Todo.key) {
                //  用上次的数据重新导出一次文件
                writeFile(id);
                return;
              }
              dispatch({
                type: 'global/clearOneNotice',
                payload: +id,
              });
              dispatch(
                push({
                  pathname: '/basic/msgmanage/notice/system',
                  search: `id=${id}`,
                })
              );
              onNoticeVisibleChange(false);
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={receivingNotices}
            popupAlign={{ offset: [20, -16] }}
            tabs={[
              {
                typeObj: NoticeTypes.Message,
                emptyText: '您已读完所有消息',
                emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
              },
              {
                typeObj: NoticeTypes.Todo,
                emptyText: '你已完成所有待办',
                emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
              },
              // {
              //   typeObj: NoticeTypes.Notification,
              //   emptyText: '你已查看所有通知',
              //   emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
              // },
            ]}
          />
          {currentUser.sysUser ? (
            <Dropdown overlay={menu} trigger={['click']}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar
                  size="small"
                  className={styles.avatar}
                  src={currentUser.sysUser.picPath || `${DEFAULT_USER_AVATAR_PIC_PATH}/60X60.jpg`}
                />
                <span className={styles.name}>{currentUser.sysUser.realName}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}

export default GlobalHeader;
