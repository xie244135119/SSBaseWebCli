import request from '../request';

export function testGet() {
  return request.get('/api/get');
}

export function testPost() {
  return request.post('/api/get', { a: 1 });
}

export function testPut() {
  return request.put('/api/put');
}

export function testDelete() {
  return request.delete('/api/delete');
}
