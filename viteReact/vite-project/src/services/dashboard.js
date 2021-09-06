/* eslint-disable import/prefer-default-export */
import { get } from '@/utils/request';

export async function fetchOverView(params) {
  return get('/analysis/overview/details.do', params);
}
