import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Flow from './Flow';

export default props => {
  return (
    <PageHeaderLayout>
      <Flow {...props} />
    </PageHeaderLayout>
  );
};
