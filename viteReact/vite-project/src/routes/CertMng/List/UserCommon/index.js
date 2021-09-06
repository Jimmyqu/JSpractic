import LevelView from '@/components/LevelView';
import List from './List';

export default props => {
  return (
    <LevelView>
      <List {...props} />
    </LevelView>
  );
};
