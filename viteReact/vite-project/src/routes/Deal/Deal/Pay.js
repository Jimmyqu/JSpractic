import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import OrderPay from '@/components/OrderPay';

export default props => (
  <PageHeaderLayout>
    <OrderPay {...props} />
  </PageHeaderLayout>
);
