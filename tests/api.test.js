const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

let server; // Will hold the running app
let authToken; // Store JWT for authenticated routes
let createdBusinessId;
let createdInvestorId;
let createdTransactionId;

beforeAll(async () => {
  // Import the app AFTER setting env vars
  server = require('../server');
  // Ensure DB is connected before tests
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Integration Tests', () => {
  // ----------- AUTH ROUTES -----------
  test('POST /api/auth/register should create a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `testuser_${Date.now()}@mail.com`,
        password: 'Password123!',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login should return a JWT', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token;
  });

  // ----------- BUSINESS ROUTES -----------
  test('POST /api/business should create a business', async () => {
    const res = await request(server)
      .post('/api/business')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Business',
        description: 'A sample test business',
        sector: 'Tech',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    createdBusinessId = res.body._id;
  });

  test('GET /api/business should list businesses', async () => {
    const res = await request(server)
      .get('/api/business')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ----------- INVESTOR ROUTES -----------
  test('POST /api/investor should create an investor', async () => {
    const res = await request(server)
      .post('/api/investor')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Investor',
        type: 'Angel',
        fundsAvailable: 100000,
      });

    expect(res.statusCode).toBe(201);
    createdInvestorId = res.body._id;
  });

  test('GET /api/investor should list investors', async () => {
    const res = await request(server)
      .get('/api/investor')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ----------- TRANSACTION ROUTES -----------
  test('POST /api/transaction should create a transaction', async () => {
    const res = await request(server)
      .post('/api/transaction')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        businessId: createdBusinessId,
        investorId: createdInvestorId,
        amount: 50000,
        date: new Date(),
      });

    expect(res.statusCode).toBe(201);
    createdTransactionId = res.body._id;
  });

  test('GET /api/transaction should list transactions', async () => {
    const res = await request(server)
      .get('/api/transaction')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
