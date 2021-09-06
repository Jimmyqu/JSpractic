import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import OrderContactFill from '@/components/OrderContactFill';

function PubServiceContactFill() {
  const dispatch = useDispatch();
  return (
    <OrderContactFill
      bookingNum={1}
      onFillNext={payload => {
        dispatch({
          type: 'pubserviceselling/fillNextStep',
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

export default PubServiceContactFill;
