import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import CertContent from './CertContent';

export default () => {
  return (
    <PageHeaderLayout>
      <LevelView>
        <CertContent />
      </LevelView>
    </PageHeaderLayout>
  );
};
