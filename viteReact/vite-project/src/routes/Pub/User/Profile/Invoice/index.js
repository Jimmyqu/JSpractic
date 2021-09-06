import LevelView from '@/components/LevelView';
import Uninvoiced from './Uninvoiced';

export default props => {
  const {
    match: { params },
  } = props;
  const { id: pubAccountId } = params || {};
  return (
    <LevelView>
      <Uninvoiced pubAccountId={pubAccountId} />
    </LevelView>
  );
};
