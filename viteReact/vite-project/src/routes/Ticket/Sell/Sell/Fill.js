import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import OrderContactFill from '@/components/OrderContactFill';

function CourseContactFill(props, { getNextStepPath }) {
  const dispatch = useDispatch();
  const { RelTypes } = useSelector(state => state.global);
  const { dealInfo } = useSelector(state => state.orderprocessing);

  const { dataId, salesNum } = dealInfo?.dealTicketList?.[0] || {};
  return (
    <OrderContactFill
      dataId={dataId}
      bookingNum={salesNum}
      relType={RelTypes.EXERCISELIST.key}
      canSummary
      onFillNext={(payload, summary) => {
        dispatch({
          type: 'ticketselling/fillNextStep',
          payload,
          summary,
        }).then(id => {
          if (summary) {
            if (id) {
              dispatch(
                push({
                  pathname: './summary',
                  search: `id=${id}`,
                })
              );
            }
            return;
          }
          dispatch(push(getNextStepPath()));
        });
      }}
    />
  );
}

CourseContactFill.contextTypes = {
  getNextStepPath: PropTypes.func,
  selectPubStudy: PropTypes.bool,
};

export default CourseContactFill;
