const request = require('supertest');

const connectServer = request.agent('http://localhost:8000');
const server = require('../api/server');
const users = require('../data/users.json');
const { API_MAIN_ROUTE } = require('../utils/utils');

describe('Test server', () => {
  test('/users: It should return users on request', async () => {
    const response = await request(server).get(`${API_MAIN_ROUTE}/users`);
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
    // Expect to receive users
    expect(response.body).toEqual(users);
  });

  test('/tokens: It should return refresh tokens on request', async () => {
    const response = await request(server).get(`${API_MAIN_ROUTE}/tokens`);
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
  });

  test('/register: It should create a new user', async () => {
    const response = await request(server)
      .post(`${API_MAIN_ROUTE}/register`)
      .type('application/json')
      .send({ name: 'Testare', email: 't@t.ro', password: 'tested' });
    // Expect 201: Created
    expect(response.statusCode).toBe(201);
  });

  test('/deleteUser: It should send Unauthorized on trying to delete a user without authorization', async () => {
    const response = await request(server)
      .delete(`${API_MAIN_ROUTE}/deleteUser`)
      .type('application/json')
      .send({ email: 't@t.ro' });
    // Expect 401: Unauthorized
    expect(response.statusCode).toBe(401);
  });

  test('/resetUserPassword: It should reset Test user password', async () => {
    const response = await request(server)
      .post(`${API_MAIN_ROUTE}/resetUserPassword`)
      .type('application/json')
      .send({ email: 't@t.t' });
    // Expect 200: OK
    expect(response.statusCode).toBe(200);
  });

  test('/data: It should return Unauthorized status on data request', async () => {
    const response = await request(server).get(`${API_MAIN_ROUTE}/data`);
    // Expect 401: Unauthorized
    expect(response.statusCode).toBe(401);
  });

  test('/data: It should return Forbidden status on data request with wrong token', async () => {
    const response = await request(server)
      .get(`${API_MAIN_ROUTE}/data`)
      .auth('wrong token', { type: 'bearer' });
    // Expect 403: Forbidden
    expect(response.statusCode).toBe(403);
  });

  test('/login: It should log in on correct username and password and return tokens', async () => {
    await connectServer
      .post(`${API_MAIN_ROUTE}/login`)
      .type('application/json')
      .send({ email: 't@t.t', password: 'test' })
      .accept('application/json')
      .then((res) => {
        // Expect 200: OK
        expect(res.statusCode).toBe(200);
        // Expect to receive object of tokens
        expect(res.body.keys()).toBe(['accessToken', 'refreshToken']);
      })
      .catch((err) => err);
  });
});
