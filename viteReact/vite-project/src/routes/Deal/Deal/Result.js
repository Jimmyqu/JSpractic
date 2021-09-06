import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import OrderPayResult from '@/components/OrderPayResult';

export default props => (
  <PageHeaderLayout>
    <OrderPayResult {...props} />
  </PageHeaderLayout>
);
