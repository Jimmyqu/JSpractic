import Sold from '../../../PubService/Sold/Sold';

export default props => {
  const {
    match: { params },
  } = props;
  const { id } = params || {};

  return <Sold {...props} usePubAccountId={id} />;
};
