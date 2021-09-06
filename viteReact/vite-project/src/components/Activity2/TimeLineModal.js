import { Timeline, Icon } from 'antd';
import Modal from '@/components/Modal';
import { formatDateTime } from '@/utils/format';
import style from './index.less';

function TimeLineModal({ visible, log, ...restProps }) {
  const { logs, loading } = log;
  return (
    <Modal title="审核日志" visible={visible} {...restProps} loading={loading}>
      {!loading && (
        <Timeline>
          {logs?.map(item => (
            <Timeline.Item key={item.id}>
              <h3>
                {item.nodeName}
                <span className={style.time}>
                  <Icon type="clock-circle" theme="outlined" />
                  {formatDateTime(item.gmtCreate)}
                </span>
              </h3>
              <div>
                {item.companyName} {item.createRealName}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </Modal>
  );
}

export default TimeLineModal;
