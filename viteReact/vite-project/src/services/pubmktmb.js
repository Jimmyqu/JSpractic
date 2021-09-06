/* eslint-disable import/prefer-default-export */
import { postJSON } from '@/utils/request';

export async function savePerformanceReport(params) {
  return postJSON('/marketingPerformanceReport/save.do', params);
}
