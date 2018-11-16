import http from 'common/http';

export function query() {
  return http.get('/api/users');
}
