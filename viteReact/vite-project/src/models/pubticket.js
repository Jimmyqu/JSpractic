import { PubTicketModel } from '@/commons/lib/models';
import {
  queryTicketDetail,
  postEditSeat,
  postEditSeatsBatch,
  postNewOrEditSeatCategory,
  postSeatsList,
  postSeatAreaDataList,
  postSeatAreaImg,
  queryAllSeat,
  querySeatAreaDataList,
  querySeatCategoryList,
  removeSeatByIds,
  removeSeatCategoryByIds,
  sortShowIndex,
  cleanShowIndex,
  postReplaceSeat,
} from '@/services/ticket';

export default {
  // 场地
  namespace: 'pubticket',

  state: {
    ...PubTicketModel,
  },

  effects: {
    // *check({ payload }, { call }) {
    //   const dealTicketId = payload;
    //   yield call(checkTicket, {
    //     dealTicketId,
    //   });
    // },
    // /ticket/{ticketId}.do
    *fetchTicket({ payload }, { call }) {
      const ticketId = payload;
      if (ticketId == null) {
        return null;
      }
      return yield call(queryTicketDetail, {
        ticketId,
      });
    },
    *newOrEditSeatCategory({ payload }, { call }) {
      yield call(postNewOrEditSeatCategory, payload);
    },
    *delSeatCategoryByIds({ payload }, { call }) {
      yield call(removeSeatCategoryByIds, {
        ids: payload,
      });
    },
    *fetchSeatCategory({ payload }, { call }) {
      return yield call(querySeatCategoryList, payload);
    },
    *delSeatByIds({ payload }, { call }) {
      yield call(removeSeatByIds, {
        ids: payload,
      });
    },
    *fetchAllSeats({ payload }, { call }) {
      return yield call(queryAllSeat, payload);
    },
    *batchSaveSeats({ payload }, { call }) {
      return yield call(postSeatsList, payload);
    },
    *fetchAreaData({ payload }, { call }) {
      return yield call(querySeatAreaDataList, payload);
    },
    *batchEditSeats({ payload }, { call }) {
      yield call(postEditSeatsBatch, payload);
    },
    *editSeat({ payload }, { call }) {
      yield call(postEditSeat, payload);
    },
    *updateSeatAreaImg({ payload }, { call }) {
      yield call(postSeatAreaImg, payload);
    },
    *updateSeatAreaData({ payload }, { call }) {
      yield call(postSeatAreaDataList, payload);
    },
    *saveSortShowIndex({ payload }, { call }) {
      return yield call(sortShowIndex, payload);
    },
    *cleanSortShowIndex({ payload }, { call }) {
      return yield call(cleanShowIndex, payload);
    },
    *saveReplaceSeat({ payload }, { call }) {
      yield call(postReplaceSeat, payload);
    },
  },

  reducers: {},
};
