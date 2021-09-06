import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import AuditConfig from './AuditConfig';

export default props => (
  <PageHeaderLayout>
    <LevelView>
      <AuditConfig {...props} />
    </LevelView>
  </PageHeaderLayout>
);
