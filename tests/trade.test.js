const request = require('supertest');
const app = require('../server');
const { accessToken } = require('./auth.test');
const { mintedAssetId } = require('./mint.test');

describe('Trade Endpoint', () => {
  test('Execute trade (buy)', async () => {
    const res = await request(app)
      .post('/api/trade')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        assetId: mintedAssetId,
        type: 'buy',
        quantity: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('transactionId');
  });
});
