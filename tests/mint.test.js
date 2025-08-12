const request = require('supertest');
const app = require('../server');
const { accessToken } = require('./auth.test');

let mintedAssetId;

describe('Mint Endpoint', () => {
  test('Mint a new asset', async () => {
    const res = await request(app)
      .post('/api/mint')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test Asset',
        description: 'A valuable token',
        valuation: 1000
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('assetId');
    mintedAssetId = res.body.assetId;
  });

  module.exports = { mintedAssetId };
});
