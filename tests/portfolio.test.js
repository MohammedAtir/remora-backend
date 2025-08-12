const request = require('supertest');
const app = require('../server');
const { accessToken } = require('./auth.test');

describe('Portfolio Endpoint', () => {
  test('Get portfolio', async () => {
    const res = await request(app)
      .get('/api/portfolio')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.assets)).toBe(true);
  });
});
