import * as usersService from '../services/users';


export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page:null
  },
  reducers: {
    save(state, { payload: { data: list, total,page} }) {
      return { ...state, list, total ,page};
    },
  },
  effects: {
    *fetch({ payload: { page=1 } }, { call, put }) {
      const data = yield call(usersService.getPages, { page });
      yield put({ type: 'save', payload: { 
        data, 
        total: parseInt(data.data_count) ,
        page : parseInt(page) ,
      } });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(usersService.remove, id);
      const state = yield select();  //select 获取state  可以通过select(state=>state.users.page)直接获取需要字段
      yield put({ type: 'fetch', payload: { page:state.users.page }});
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        console.log(`query`,query)
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};