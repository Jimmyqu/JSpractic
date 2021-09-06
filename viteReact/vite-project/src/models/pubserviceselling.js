export default {
  // 商城商品销售
  namespace: 'pubserviceselling',

  state: {},

  effects: {
    *pubServiceNextStep({ payload }, { put, select }) {
      const { deal } = yield select(state => state.orderprocessing.dealInfo || {});
      const { list, sellerMessage } = payload;
      yield put({
        type: 'orderprocessing/newOrder',
        payload: {
          deal: {
            ...deal,
            sellerMessage,
          },
          dealServicePubList: list,
        },
      });
    },
    *userNextStep({ payload, summary }, { put, select, putResolve }) {
      const { deal } = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'orderprocessing/updateUser',
        payload: {
          ...payload,
          sellerMessage: deal.sellerMessage,
        },
      });
      if (summary) {
        return yield putResolve({
          type: 'saveOrder',
        });
      }
    },
    *fillNextStep({ payload }, { put, select, putResolve }) {
      const dealPlatformStudyList = payload || [];
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      yield put({
        type: 'orderprocessing/flushOrder',
        payload: {
          ...dealInfo,
          dealServicePubStudyList: (dealPlatformStudyList || []).map(item => ({
            pubStudyId: item.pubStudyId,
          })),
        },
      });
      return yield putResolve({
        type: 'saveOrder',
      });
    },
    // 从外部页面跳入流程页面会受execClear影响
    // *dealedit({ payload }, { put }) {
    //   const { dealServicePubList } = payload;
    //   yield putResolve({
    //     type: 'orderprocessing/switchEnv',
    //     payload: {
    //       salesId: dealServicePubList[0].salesId,
    //     },
    //   });
    //   yield put({
    //     type: 'orderprocessing/fillback',
    //     payload: {
    //       dealInfo: payload,
    //     },
    //   });
    //   yield put(push(`/basic/pub/pubservice/${dealServicePubList[0].serviceId}/sell`));
    // },
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
