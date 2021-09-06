export default {
  // 课程销售
  namespace: 'courseselling',

  state: {},

  effects: {
    *pickNextStep({ payload }, { putResolve }) {
      const { dealCourseList } = payload;
      yield putResolve({
        type: 'orderprocessing/newOrder',
        payload: {
          dealCourseList,
        },
      });
    },
    *userNextStep({ payload }, { put }) {
      yield put({
        type: 'orderprocessing/updateUser',
        payload,
      });
    },
    *sellNextStep({ payload }, { put, select }) {
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const dealCourse = dealInfo.dealCourseList[0];
      yield put({
        type: 'orderprocessing/updateAnythingExceptUser',
        payload: {
          dealCourseList: [
            {
              ...dealCourse,
              ...payload,
            },
          ],
        },
      });
    },
    // 可直接覆盖
    *fillNextStep({ payload }, { putResolve, select }) {
      const dealCourseStudyList = payload;
      const dealInfo = yield select(state => state.orderprocessing.dealInfo || {});
      const dealCourse = dealInfo.dealCourseList[0];
      yield putResolve({
        type: 'orderprocessing/updateAnythingExceptUser',
        payload: {
          dealCourseList: [
            {
              ...dealCourse,
              dealCourseStudyList,
            },
          ],
        },
      });
      return yield putResolve({
        type: 'saveOrder',
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
