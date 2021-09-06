import { postJSON } from '@/utils/request';

export async function postCompanyAudit(params) {
  return postJSON('/sysCompany/companyAudit.do', params);
}

export async function postCompanyEdit(params) {
  return postJSON('/sysCompany/save.do', params);
}
