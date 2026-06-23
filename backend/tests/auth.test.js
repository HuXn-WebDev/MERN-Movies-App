/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import { createLoggedInAdminAgent, createTestUser } from './helpers/testData.js';

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe('Auth / User API', () => {
  describe('POST /api/v1/users', () => {
    it('should register a new user with valid data', async () => {
      const res = await request(app).post('/api/v1/users').send({
        username: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
      });

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('email', 'newuser@test.com');

      const userInDB = await User.findOne({ email: 'newuser@test.com' });
      expect(userInDB).not.toBeNull();
    });

    it('should reject duplicate email registration', async () => {
      await createTestUser({
        username: 'Existing User',
        email: 'duplicate@test.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/v1/users').send({
        username: 'Duplicate User',
        email: 'duplicate@test.com',
        password: 'password123',
      });

      expect([400, 409]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/users/auth', () => {
    it('should login with valid email and password', async () => {
      await createTestUser({
        username: 'Login User',
        email: 'login@test.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/v1/users/auth').send({
        email: 'login@test.com',
        password: 'password123',
      });

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('email', 'login@test.com');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      await createTestUser({
        username: 'Login User',
        email: 'wrongpass@test.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/v1/users/auth').send({
        email: 'wrongpass@test.com',
        password: 'wrong-password',
      });

      expect([400, 401]).toContain(res.statusCode);
    });

    it('should reject login with unknown email', async () => {
      const res = await request(app).post('/api/v1/users/auth').send({
        email: 'unknown@test.com',
        password: 'password123',
      });

      expect([400, 401]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/users/logout', () => {
    it('should logout user and clear cookie', async () => {
      await createTestUser({
        username: 'Logout User',
        email: 'logout@test.com',
        password: 'password123',
      });

      const agent = request.agent(app);

      await agent.post('/api/v1/users/auth').send({
        email: 'logout@test.com',
        password: 'password123',
      });

      const res = await agent.post('/api/v1/users/logout');

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should return profile when user is logged in', async () => {
      await createTestUser({
        username: 'Profile User',
        email: 'profile@test.com',
        password: 'password123',
      });

      const agent = request.agent(app);

      await agent.post('/api/v1/users/auth').send({
        email: 'profile@test.com',
        password: 'password123',
      });

      const res = await agent.get('/api/v1/users/profile');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('email', 'profile@test.com');
    });

    it('should reject profile access when user is not logged in', async () => {
      const res = await request(app).get('/api/v1/users/profile');

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('PUT /api/v1/users/profile', () => {
    it('should update user profile when logged in', async () => {
      await createTestUser({
        username: 'Old Username',
        email: 'updateprofile@test.com',
        password: 'password123',
      });

      const agent = request.agent(app);

      await agent.post('/api/v1/users/auth').send({
        email: 'updateprofile@test.com',
        password: 'password123',
      });

      const res = await agent.put('/api/v1/users/profile').send({
        username: 'Updated Username',
        email: 'updatedprofile@test.com',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('username', 'Updated Username');
      expect(res.body).toHaveProperty('email', 'updatedprofile@test.com');
    });
  });

  describe('GET /api/v1/users', () => {
    it('should allow admin to get all users', async () => {
      await createTestUser({
        username: 'Regular User',
        email: 'regular@test.com',
        password: 'password123',
      });

      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.get('/api/v1/users');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject get all users when not logged in', async () => {
      const res = await request(app).get('/api/v1/users');

      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
