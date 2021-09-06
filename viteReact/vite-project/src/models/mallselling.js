export default {
  // 商城商品销售
  namespace: 'mallselling',

  state: {},

  effects: {
    *mallNextStep({ payload, summary }, { put, putResolve }) {
      const { list, ids = [] } = payload;
      yield put({
        type: 'orderprocessing/newOrder',
        payload: {
          dealItemList: list,
          dealMarketingMemberList: ids.map(id => ({
            marketingTeamMemberId: id,
          })),
        },
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *userNextStep({ payload, summary }, { put, putResolve }) {
      if (!summary) {
        yield put({
          type: 'orderprocessing/updateUser',
          payload,
        });
      }
      return yield putResolve({
        type: 'saveOrder',
      });
    },
    *fastSaveOrder({ payload }, { putResolve }) {
      const { list, ids, ...rest } = payload;
      return yield putResolve({
        type: 'orderprocessing/genericFastSaveOrder',
        payload: {
          dealItemList: list,
          dealMarketingMemberList: ids.map(id => ({
            marketingTeamMemberId: id,
          })),
          ...rest,
        },
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
