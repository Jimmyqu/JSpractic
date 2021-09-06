import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import OrderContactFill from '@/components/OrderContactFill';

function BookingContactFill() {
  const dispatch = useDispatch();
  const { dealInfo } = useSelector(state => state.orderprocessing);
  const { RelTypes } = useSelector(state => state.global);

  const { dealPlatformList, dealSportPlatformTicketList } = dealInfo || {};
  const { salesItemId } = dealPlatformList?.[0] || dealSportPlatformTicketList?.[0] || {};
  return (
    <OrderContactFill
      bookingNum={
        dealSportPlatformTicketList?.length > 0
          ? dealSportPlatformTicketList.reduce((prev, item) => {
              if (item.selectPubStudy) {
                return prev + item.salesNum;
              }
              return prev;
            }, 0)
          : 1
      } // 体育票务数量是salesNum， 体育定场是1
      dataId={salesItemId}
      relType={RelTypes.SALESITEM.key}
      onFillNext={payload => {
        dispatch({
          type: 'booking/fillNextStep',
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

export default BookingContactFill;
