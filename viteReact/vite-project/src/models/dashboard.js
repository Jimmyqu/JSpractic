import { fetchOverView } from '@/services/dashboard';

export default {
  // 实时概况
  namespace: 'dashboard',

  state: {
    overView: undefined,
  },

  effects: {
    fetchView: [
      function* fetchView({ payload }, { call }) {
        return yield call(fetchOverView, payload);
      },
      {
        type: 'takeLatest',
      },
    ],
  },
};
