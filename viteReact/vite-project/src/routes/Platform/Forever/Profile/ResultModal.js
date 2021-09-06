import { Button } from 'antd';
import Modal from '@/components/Modal';
import { formatDate, formatHM } from '@/utils/format';

export default ({ data, ...restProps }) => {
  return (
    <Modal title="设置结果" {...restProps} footer={<Button link="ok" />}>
      <ul>
        {data == null || data.length === 0
          ? '无数据'
          : data.map(
              ({ dealId, orderDate, startTime, endTime, platformName, platformParentName, success, errorMsg }, i) => (
                <li key={`${dealId + i}`}>
                  {formatDate(orderDate)} {formatHM(startTime)}-{formatHM(endTime)}&nbsp;
                  {platformParentName}
                  {platformParentName ? '-' : ''}
                  {platformName}
                  &nbsp;设置
                  {success ? '成功' : <span className="red">失败{errorMsg ? `(${errorMsg})` : null}</span>}
                </li>
              )
            )}
      </ul>
    </Modal>
  );
};
