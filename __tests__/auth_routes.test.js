const request = require('supertest');

const connectServer = request.agent('http://localhost:8000');
const data = require('../data/data.json');
const { API_MAIN_ROUTE } = require('../utils/utils');

let accessToken;

// Test routes only ONCE when server is RUNNING, after the tests the Admin user will be deleted
const login = async () => {
  const tokens = await connectServer
    .post(`${API_MAIN_ROUTE}/login`)
    .send({ email: 't@t.t', password: 'test' })
    .then((res) => res.body)
    .catch((err) => err);
  return tokens.accessToken;
};

describe('Test authentication routes', () => {
  beforeAll(async () => {
    accessToken = await login();
  });

  test('/data: It should return data for user Test on request when Test user is logged', async () => {
    const response = await connectServer
      .get(`${API_MAIN_ROUTE}/data`)
      .auth(accessToken, { type: 'bearer' });
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
    // Expect to receive data for user logged
    expect(response.body).toEqual(data.filter((dataObj) => dataObj.name === 'Test'));
  });

  test('/dataId: It should return data by id 1 on request', async () => {
    const response = await connectServer
      .post(`${API_MAIN_ROUTE}/dataId`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ id: 1 });
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
    // Expect to receive data for id
    expect(response.body).toEqual(data.filter((dataObj) => dataObj.id === 1));
  });

  test('/deleteUser: It should send Not Found when email is wrong', async () => {
    const response = await connectServer
      .delete(`${API_MAIN_ROUTE}/deleteUser`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ email: 'admin' });
    // Expect 404: Not found
    expect(response.statusCode).toBe(404);
  });

  test('/deleteUser: It should send Bad Request when email is wrong', async () => {
    const response = await connectServer
      .delete(`${API_MAIN_ROUTE}/deleteUser`)
      .auth(accessToken, { type: 'bearer' });
    // Expect 400: Bad Request
    expect(response.statusCode).toBe(400);
  });

  test('/updateUserPassword: It should send Not found when email is wrong', async () => {
    const response = await connectServer
      .post(`${API_MAIN_ROUTE}/updateUserPassword`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ email: 'admin', newPassword: 'changed password test' });
    // Expect 404: Not found
    expect(response.statusCode).toBe(404);
  });

  test('/updateUserPassword: It should send Bad Request when email is not defined', async () => {
    const response = await connectServer
      .post(`${API_MAIN_ROUTE}/updateUserPassword`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ newPassword: 'changed password test' });
    // Expect 400: Bad Request
    expect(response.statusCode).toBe(400);
  });
  test('/updateUserPassword: It should send Bad Request when newPassword is not defined', async () => {
    const response = await connectServer
      .post(`${API_MAIN_ROUTE}/updateUserPassword`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ email: 'a@a.a' });
    // Expect 400: Bad Request
    expect(response.statusCode).toBe(400);
  });

  test('/updateUserPassword: It should update password for Admin user', async () => {
    const response = await connectServer
      .post(`${API_MAIN_ROUTE}/updateUserPassword`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ email: 'a@a.a', newPassword: 'changed password test' });
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
  });

  test('/deleteUser: It should delete Admin user', async () => {
    const response = await connectServer
      .delete(`${API_MAIN_ROUTE}/deleteUser`)
      .auth(accessToken, { type: 'bearer' })
      .type('application/json')
      .send({ email: 'a@a.a' });
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
  });
});
