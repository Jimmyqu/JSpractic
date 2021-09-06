import { useSelector } from 'react-redux';
import { Card, Row, Col } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import OrderPrint from '@/components/OrderPrint';
import styles from './index.less';

export default function ({ match: { params } }) {
  const fetching = useSelector(state => state.loading.effects['deal/fetch']);

  return (
    <PageHeaderLayout title="打印订单">
      <OrderPrint id={params.id} />
      <Card bordered={false} loading={fetching} className={styles.descr}>
        <Row>
          <Col md={6} />
          <Col md={12}>
            <article>
              <div className={styles.tipTitle}>一、关于设置打印机属性说明：</div>
              <ul>
                <li>1、成功安装打印机驱动程序；</li>
                <li>
                  2、在打印机和传真中找到打印机，右键点击打印机图标，选择(打印机属性)-&lt;(设备设置)-&lt;(上层纸盒)，选择Gprinter
                  58(48) x 210 mm；
                </li>
              </ul>
            </article>
            <article>
              <div className={styles.tipTitle}>二、关于浏览器设置设置打印机参数的说明：</div>
              <ul>
                <li>1、Microsoft Edge：&lt;待补充&gt;</li>
                <li>2、谷歌浏览器：Ctrl+P组合键进入打印设置。设置参数：布局(纵向)、边距(无)；</li>
                <li>
                  3、火狐浏览器：打开菜单-&lt;打印-&lt;页面设置。设置参数：纵向、比例(100%)、缩放以适应页面宽度、页边距(顶：0.5.底：0.5.左：0.0.右：0.0)、页脚页眉(空白)；
                </li>
              </ul>
            </article>
          </Col>
          <Col md={6} />
        </Row>
      </Card>
    </PageHeaderLayout>
  );
}
