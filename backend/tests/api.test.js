// tests/api.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const { startServer } = require('../server');

let server;
let investorAccessToken;
let investorRefreshToken;
let businessOwnerAccessToken;
let businessOwnerRefreshToken;
let businessId;

const investorUser = {
  name: 'Test Investor',
  email: `investor_${Date.now()}@test.com`,
  password: 'password123',
  role: 'investor'
};

const businessOwnerUser = {
  name: 'Test Business Owner',
  email: `businessowner_${Date.now()}@test.com`,
  password: 'password123',
  role: 'business_owner'
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  server = app.listen(4001, () => {
    console.log('✅ Test server started on port 4001');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
  console.log('✅ Test server closed and MongoDB connection closed.');
});

// --- Auth Endpoints Test Suite ---
describe('Auth Endpoints', () => {
  test('Register investor user', async () => {
    const res = await request(server).post('/api/auth/register').send(investorUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('user');
    investorAccessToken = res.body.accessToken;
    investorRefreshToken = res.body.refreshToken;
  });

  test('Login investor user', async () => {
    const res = await request(server).post('/api/auth/login').send(investorUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('role', 'investor');
    investorAccessToken = res.body.accessToken;
  });

  test('Refresh token for investor user', async () => {
    const res = await request(server).post('/api/auth/refresh');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});

// --- Business Endpoints Test Suite ---
describe('Business Endpoints', () => {
  beforeAll(async () => {
    // Register and login a business owner to pass role-based middleware
    await request(server).post('/api/auth/register').send(businessOwnerUser);
    const res = await request(server).post('/api/auth/login').send(businessOwnerUser);
    businessOwnerAccessToken = res.body.accessToken;
    businessOwnerRefreshToken = res.body.refreshToken;
  });

  test('Create a new business', async () => {
    const res = await request(server)
      .post('/api/business/create')
      .set('Authorization', `Bearer ${businessOwnerAccessToken}`)
      .send({
        name: 'Test Business',
        sector: 'Finance',
        constitution: 'Private Limited Company',
        revenue: '1Crore to 5cr',
        companySize: '11-50 Employees'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('businessId');
    businessId = res.body.businessId;
  });
});

// --- Mint Endpoint Test Suite ---
describe('Mint Endpoint', () => {
  test('Mint a new asset', async () => {
    const res = await request(server)
      .post('/api/business/mint')
      .set('Authorization', `Bearer ${businessOwnerAccessToken}`)
      .send({
        businessId: businessId,
        valuation: 1000
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('assetId');
  });
});

// --- Trade Endpoint Test Suite ---
describe('Trade Endpoint', () => {
  test('Execute trade (buy)', async () => {
    const res = await request(server)
      .post('/api/transaction/trade')
      .set('Authorization', `Bearer ${investorAccessToken}`)
      .send({
        businessId: businessId,
        type: 'buy',
        quantity: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('transactionId');
  });
});

// --- Portfolio Endpoint Test Suite ---
describe('Portfolio Endpoint', () => {
  test('Get portfolio', async () => {
    const res = await request(server)
      .get('/api/investor/portfolio')
      .set('Authorization', `Bearer ${investorAccessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('assets');
    expect(Array.isArray(res.body.assets)).toBe(true);
  });
});