import { Component } from 'react';
import { connect } from 'react-redux';
import { Timeline, Icon } from 'antd';
import Modal from '@/components/Modal';
import { formatDateTime } from '@/utils/format';
import style from './index.less';

@connect(({ activity, loading }) => ({
  activity,
  logFetching: loading.effects['activity/fetchLog'],
}))
class TimeLineModal extends Component {
  state = {
    logs: undefined,
  };

  // eslint-disable-next-line camelcase
  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { visible: nextVisible, dataInfo } = nextProps;
    const { visible, dispatch } = this.props;
    if (nextVisible && !visible) {
      const { id } = dataInfo || {};
      const result = await dispatch({
        type: 'activity/fetchLog',
        payload: id,
      });
      this.setState({
        logs: result,
      });
    }
  }

  render() {
    const { dataInfo, dispatch, activity, logFetching: loading, ...restProps } = this.props;
    // const { id } = dataInfo || {};
    const { logs } = this.state;
    return (
      <Modal title="审核日志" {...restProps} loading={loading}>
        {!loading && (
          <Timeline>
            {(logs || []).map(item => (
              <Timeline.Item key={item.id}>
                <h3>
                  {item.nodeName}
                  <span className={style.time}>
                    <Icon type="clock-circle" theme="outlined" />
                    {formatDateTime(item.gmtModified)}
                  </span>
                </h3>
                <div>
                  {item.createdUserCompanyName} {item.createdUserName}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Modal>
    );
  }
}

export default TimeLineModal;
