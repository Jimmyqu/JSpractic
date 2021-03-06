import request from '../../../utils/request';

export function getPages({ page}) {
  return request(`/api/users?_page=${page}&_limit=5`);
}

export function remove(id) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}