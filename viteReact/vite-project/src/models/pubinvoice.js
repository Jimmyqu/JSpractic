import {
  postCompanyCreateOrEdit,
  postCompanyDelete,
  getAllCompany,
  invoice,
  cancelInvoice,
  queryInvoicedDetail,
  postAuditInvoice,
  postUpdateAuditInvoice,
  revokeInvoice,
} from '@/services/pubinvoice';
import { InvoiceModel } from '@/commons/lib/models';

export default {
  // 发票
  namespace: 'pubinvoice',

  state: {
    ...InvoiceModel,

    companyList: [],
  },

  effects: {
    *save({ payload }, { call }) {
      return yield call(postCompanyCreateOrEdit, payload);
    },
    *delete({ payload }, { call }) {
      yield call(postCompanyDelete, {
        ids: payload,
      });
    },
    *fetchAllCompany({ payload }, { call, put }) {
      const list = yield call(getAllCompany, payload);
      yield put({
        type: 'saveCompany',
        payload: {
          list: list || [],
          replaceAll: true,
        },
      });
    },
    *invoice({ payload }, { call }) {
      return yield call(invoice, payload);
    },
    *cancelInvoice({ payload }, { call }) {
      yield call(cancelInvoice, payload);
    },
    *revokeInvoice({ payload }, { call }) {
      yield call(revokeInvoice, payload);
    },
    *fetchInvoicedDetail({ payload }, { call }) {
      if (payload == null) {
        return null;
      }
      return yield call(queryInvoicedDetail, {
        invoiceListId: payload,
      });
    },
    *auditInvoice({ payload }, { call }) {
      yield call(postAuditInvoice, payload);
    },
    *updateInvoice({ payload }, { call }) {
      yield call(postUpdateAuditInvoice, payload);
    },
  },

  reducers: {
    saveCompany(state, { payload }) {
      const { list, replaceAll } = payload || {};
      if (replaceAll) {
        return {
          ...state,
          companyList: list,
        };
      }
      // 不仅仅是去重，还要新的替换旧的
      const newList = [...list];
      state.companyList.forEach(item => {
        if (newList.some(it => it.id === item.id)) {
          return;
        }
        newList.push(item);
      });
      return {
        ...state,
        companyList: newList,
      };
    },
    clean(state) {
      return {
        ...state,
        companyList: [],
      };
    },
  },
};
