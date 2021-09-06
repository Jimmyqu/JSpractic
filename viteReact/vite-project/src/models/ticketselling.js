import { queryConfirmTicketInfo } from '@/services/ticket';

export default {
  // 票务销售
  namespace: 'ticketselling',

  state: {},

  effects: {
    *ticketsellingNextStep({ payload }, { put }) {
      yield put({
        type: 'orderprocessing/newOrder',
        payload: {
          dealTicketList: payload,
        },
      });
    },
    *userNextStep({ payload }, { put }) {
      yield put({
        type: 'orderprocessing/updateUser',
        payload,
      });
    },
    *sellNextStep({ payload, summary, pushSeat }, { putResolve, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const ticket = (dealInfo.dealTicketList || [])[0];
      yield putResolve({
        type: 'orderprocessing/flushOrder',
        payload: {
          deal: {
            ...dealInfo.deal,
            pushSeat,
          },
          dealTicketList: [
            {
              ...ticket,
              ...payload,
            },
          ],
        },
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    // 可直接覆盖
    *fillNextStep({ payload, summary }, { putResolve, select }) {
      const dealTicketStudyList = payload;
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const dealTicket = dealInfo.dealTicketList[0];
      yield putResolve({
        type: 'orderprocessing/updateAnythingExceptUser',
        payload: {
          dealTicketList: [
            {
              ...dealTicket,
              dealTicketStudyList,
            },
          ],
        },
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    // 可直接覆盖
    *seatNextStep({ payload }, { putResolve, select }) {
      const seatDataList = payload || [];
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const dealTicket = dealInfo.dealTicketList[0];
      yield putResolve({
        type: 'orderprocessing/updateAnythingExceptUser',
        payload: {
          dealTicketList: [
            {
              ...dealTicket,
              dealTicketStudyList: seatDataList.map(seat => {
                const study = seat.pubStudyId
                  ? (dealTicket.dealTicketStudyList || []).find(item => seat.pubStudyId === item.pubStudyId)
                  : {};
                return {
                  seatDataId: seat.seatInfo.id,
                  ...study,
                };
              }),
            },
          ],
        },
      });
      return yield putResolve({
        type: 'saveOrder',
      });
    },
    *fetchConfirmTicketInfo({ payload }, { call }) {
      const ticketId = payload;
      if (ticketId == null) {
        return null;
      }
      return yield call(queryConfirmTicketInfo, {
        ticketId,
      });
    },
    *saveOrder(_, { putResolve }) {
      return yield putResolve({
        type: 'orderprocessing/saveOrder',
      });
    },
    *clearOrder(_, { put }) {
      yield put({
        type: 'orderprocessing/clearOrder',
      });
    },
  },

  reducers: {},
};
