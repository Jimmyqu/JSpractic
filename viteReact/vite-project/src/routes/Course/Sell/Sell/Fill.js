import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import OrderContactFill from '@/components/OrderContactFill';

function CourseContactFill() {
  const dispatch = useDispatch();
  const { RelTypes } = useSelector(state => state.global);
  const { dealInfo } = useSelector(state => state.orderprocessing);

  const { courseId, bookingNum } = dealInfo?.dealCourseList?.[0] || {};
  return (
    <OrderContactFill
      dataId={courseId}
      bookingNum={bookingNum}
      relType={RelTypes.COURSE.key}
      onFillNext={payload => {
        dispatch({
          type: 'courseselling/fillNextStep',
          payload,
        }).then(id => {
          if (id) {
            dispatch(
              push({
                pathname: './summary',
                search: `id=${id}`,
              })
            );
          }
        });
      }}
    />
  );
}

export default CourseContactFill;
