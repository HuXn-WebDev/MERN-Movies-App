/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';
import Genre from '../models/Genre.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import {
  createLoggedInAdminAgent,
  createLoggedInUserAgent,
  createTestGenre,
} from './helpers/testData.js';

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe('Genre API', () => {
  describe('GET /api/v1/genre/genres', () => {
    it('should return all genres', async () => {
      await createTestGenre({ name: 'Action' });
      await createTestGenre({ name: 'Drama' });

      const res = await request(app).get('/api/v1/genre/genres');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /api/v1/genre/:id', () => {
    it('should return genre detail by valid id', async () => {
      const genre = await createTestGenre({ name: 'Comedy' });

      const res = await request(app).get(`/api/v1/genre/${genre._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', genre._id.toString());
      expect(res.body).toHaveProperty('name', 'Comedy');
    });

    it('should return error when genre id does not exist', async () => {
      const fakeId = '64b7f8b4d2f9c3a123456789';

      const res = await request(app).get(`/api/v1/genre/${fakeId}`);

      expect([400, 404]).toContain(res.statusCode);
    });
  });

  describe('POST /api/v1/genre', () => {
    it('should reject genre creation when user is not logged in', async () => {
      const res = await request(app).post('/api/v1/genre').send({
        name: 'Thriller',
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject genre creation from non-admin user', async () => {
      const { agent } = await createLoggedInUserAgent();

      const res = await agent.post('/api/v1/genre').send({
        name: 'Horror',
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should allow admin to create genre', async () => {
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.post('/api/v1/genre').send({
        name: 'Sci-Fi',
      });

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('name', 'Sci-Fi');

      const genreInDB = await Genre.findOne({ name: 'Sci-Fi' });
      expect(genreInDB).not.toBeNull();
    });
  });

  describe('PUT /api/v1/genre/:id', () => {
    it('should allow admin to update genre', async () => {
      const genre = await createTestGenre({ name: 'Old Genre' });
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.put(`/api/v1/genre/${genre._id}`).send({
        name: 'Updated Genre',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Genre');

      const updatedGenre = await Genre.findById(genre._id);
      expect(updatedGenre.name).toBe('Updated Genre');
    });

    it('should reject update genre when not logged in', async () => {
      const genre = await createTestGenre({ name: 'Action' });

      const res = await request(app).put(`/api/v1/genre/${genre._id}`).send({
        name: 'Updated Action',
      });

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('DELETE /api/v1/genre/:id', () => {
    it('should allow admin to delete genre', async () => {
      const genre = await createTestGenre({ name: 'Temporary Genre' });
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.delete(`/api/v1/genre/${genre._id}`);

      expect([200, 204]).toContain(res.statusCode);

      const deletedGenre = await Genre.findById(genre._id);
      expect(deletedGenre).toBeNull();
    });

    it('should reject delete genre when not logged in', async () => {
      const genre = await createTestGenre({ name: 'Protected Genre' });

      const res = await request(app).delete(`/api/v1/genre/${genre._id}`);

      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
