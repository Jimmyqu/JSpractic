import request from '../../../utils/request';

export function getPages({ page = 1 }) {
  return request(`/api/users?_page=${page}&_limit=5`);
}
