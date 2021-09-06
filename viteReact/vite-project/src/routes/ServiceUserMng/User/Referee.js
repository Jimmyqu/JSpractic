import { useSelector } from 'react-redux';
import UserCommon from './UserCommon';

export default props => {
  const { Careers } = useSelector(state => state.venue);
  return <UserCommon {...props} careerId={Careers.SPORTS_TRAINER.key} />;
};
