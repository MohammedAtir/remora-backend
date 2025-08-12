const request = require('supertest');
const app = require('../server'); // Path to your Express app

let accessToken;
let refreshToken;

describe('Auth Endpoints', () => {
  const user = { email: 'test@example.com', password: 'password123' };

  test('Register user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  test('Login user', async () => {
    const res = await request(app).post('/api/auth/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  test('Refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  module.exports = { accessToken, refreshToken };
});
