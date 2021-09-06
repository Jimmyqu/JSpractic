import { Button } from 'antd';
import { useSelector } from 'react-redux';
import Modal from '@/components/Modal';
import MarginBar from '@/components/MarginBar';

function MobileFailModal({ data, onVisibleChange, ...restProps }) {
  const mobileLoading = useSelector(state => state.loading.effects['message/mobileLoad']);
  const excelLoading = useSelector(state => state.loading.effects['message/excelLoad']);

  return (
    <Modal
      title="手机号码不正确"
      width={500}
      onVisibleChange={onVisibleChange}
      {...restProps}
      footer={[
        <Button key="cancel" link="cancel">
          取消导入
        </Button>,
        data.data && (
          <Button key="ok" link="ok" disabled={mobileLoading || excelLoading}>
            确认导入
          </Button>
        ),
      ]}
      onOk={arg => {
        arg.deepCallOk(() => {
          return data.onConfirm();
        });
        return false;
      }}
    >
      <MarginBar bottom className="red">
        请注意：系统只识别导入正确的手机号，错误的手机号将被拦截，可查看文件详情！
      </MarginBar>
      <MarginBar top bottom>
        {(() => {
          switch (data.tips) {
            case 104_005:
              return '手机号不正确';
            case 104_006:
              return '手机号重复';
            case 104_007:
              return '部分手机号导入失败，原因：非平台手机号或未获取到微信openid，微信未授权或未关注！';
            default:
          }
        })()}
      </MarginBar>
      <MarginBar top>
        <a href={data.data} target="_blank" rel="noopener noreferrer">
          查看文件
        </a>
      </MarginBar>
    </Modal>
  );
}

export default MobileFailModal;
