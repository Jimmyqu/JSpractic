import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import OrderSummary from '@/components/OrderSummary';

export default props => (
  <PageHeaderLayout>
    <OrderSummary {...props} />
  </PageHeaderLayout>
);
