import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import LevelView from '@/components/LevelView';
import List from './List';

export default () => {
  return (
    <PageHeaderLayout>
      <LevelView>
        <List />
      </LevelView>
    </PageHeaderLayout>
  );
};
