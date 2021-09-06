import Flow from '../../PubService/Flow/Flow';

export default props => {
  const {
    match: { params },
  } = props;
  const { id } = params || {};

  return <Flow {...props} usePubAccountId={id} />;
};
