import { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import IconFont from '@/components/Icon';
import style from './index.less';

@connect(({ activity }) => ({
  activity,
}))
class ActivityViewHeader extends Component {
  render() {
    const {
      auditState,
      children,
      activity: { AuditStates },
    } = this.props;
    return (
      <div className={style.viewHeader}>
        {(() => {
          switch (auditState) {
            case AuditStates.Yes.key:
              return <Icon type="check-circle" theme="filled" className={style.completeColor} />;
            case AuditStates.No.key:
              return <Icon type="exclamation-circle" theme="filled" className={style.warningColor} />;
            default:
              return <IconFont type="ellipsis-filled" className="primary-color" />;
          }
        })()}
        &nbsp;
        {children}
      </div>
    );
  }
}

export default ActivityViewHeader;
