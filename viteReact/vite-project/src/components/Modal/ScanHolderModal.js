import { Row, Col } from 'antd';
import { CDN_STATIC_HOST } from '@/utils/utils';
import Modal from '.';
import styles from './scan-holder.less';
import MarginBar from '../MarginBar';

export default ({ ...restProps }) => {
  return (
    <Modal
      {...restProps}
      maskClosable={false}
      closable={false}
      keyboard={false}
      footer={null}
      transparent
      width={300}
      transitionName="none"
      maskTransitionName="none"
    >
      <Row type="flex" justify="center" className={styles.holder}>
        <Col>
          <img className="img-max" src={`${CDN_STATIC_HOST}/images/cloud/scan-holder/c64.gif`} alt="holder img" />
        </Col>
        <Col>
          <MarginBar top={20}>请将扫描仪对准二维码/条形码</MarginBar>
        </Col>
      </Row>
    </Modal>
  );
};
