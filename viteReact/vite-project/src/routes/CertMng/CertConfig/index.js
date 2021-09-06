import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import CertConfig from './CertConfig';

export default props => (
  <PageHeaderLayout>
    <LevelView>
      <CertConfig {...props} />
    </LevelView>
  </PageHeaderLayout>
);
