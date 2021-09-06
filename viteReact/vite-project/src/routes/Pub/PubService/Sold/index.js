import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Sold from './Sold';

export default props => {
  return (
    <PageHeaderLayout>
      <Sold {...props} />
    </PageHeaderLayout>
  );
};
