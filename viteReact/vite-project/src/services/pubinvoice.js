import { postJSON, get } from '@/utils/request';

export async function postCompanyCreateOrEdit(params) {
  return postJSON('/invoiceInfo/save.do', params);
}

export async function postCompanyDelete(params) {
  return postJSON('/invoiceInfo/delete.do', params);
}

export async function invoice(params) {
  return postJSON('/invoice/addInvoice.do', params);
}

export async function getAllCompany(params) {
  return get('/invoiceInfo/queryByAll.do', params);
}

export async function cancelInvoice(params) {
  return postJSON('/invoice/cancelInvoice.do', params);
}

export async function revokeInvoice(params) {
  return postJSON('/invoice/revokeApplyInvoice.do', params);
}

export async function queryInvoicedDetail(params) {
  return get('/invoice/queryInvoiceDetail.do', params);
}

export async function postAuditInvoice(params) {
  return postJSON('/invoice/auditInvoice.do', params);
}

export async function postUpdateAuditInvoice(params) {
  return postJSON('/invoice/updateInvoice.do', params);
}
