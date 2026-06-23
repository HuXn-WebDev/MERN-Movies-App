/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';
import Movie from '../models/Movie.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import {
  createLoggedInAdminAgent,
  createLoggedInUserAgent,
  createTestGenre,
  createTestMovie,
} from './helpers/testData.js';

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe('Movie API', () => {
  describe('GET /api/v1/movies/all-movies', () => {
    it('should return all movies', async () => {
      await createTestMovie({ name: 'Movie One' });
      await createTestMovie({ name: 'Movie Two' });

      const res = await request(app).get('/api/v1/movies/all-movies');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('GET /api/v1/movies/specific-movie/:id', () => {
    it('should return specific movie by valid id', async () => {
      const movie = await createTestMovie({ name: 'Specific Movie' });

      const res = await request(app).get(`/api/v1/movies/specific-movie/${movie._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', movie._id.toString());
      expect(res.body).toHaveProperty('name', 'Specific Movie');
    });

    it('should return error when movie does not exist', async () => {
      const fakeId = '64b7f8b4d2f9c3a123456789';

      const res = await request(app).get(`/api/v1/movies/specific-movie/${fakeId}`);

      expect([400, 404]).toContain(res.statusCode);
    });
  });

  describe('GET /api/v1/movies/new-movies', () => {
    it('should return new movies', async () => {
      await createTestMovie({ name: 'Old Movie', year: 2020 });
      await createTestMovie({ name: 'New Movie', year: 2024 });

      const res = await request(app).get('/api/v1/movies/new-movies');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/v1/movies/top-movies', () => {
    it('should return top movies', async () => {
      await createTestMovie({ name: 'Low Rated Movie', rating: 2 });
      await createTestMovie({ name: 'High Rated Movie', rating: 5 });

      const res = await request(app).get('/api/v1/movies/top-movies');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/v1/movies/random-movies', () => {
    it('should return random movies', async () => {
      await createTestMovie({ name: 'Random Movie One' });
      await createTestMovie({ name: 'Random Movie Two' });

      const res = await request(app).get('/api/v1/movies/random-movies');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/v1/movies/create-movie', () => {
    it('should reject movie creation when not logged in', async () => {
      const genre = await createTestGenre();

      const res = await request(app)
        .post('/api/v1/movies/create-movie')
        .send({
          name: 'Unauthorized Movie',
          image: '/uploads/movie.jpg',
          year: 2024,
          genre: genre._id,
          detail: 'Movie created by guest.',
          cast: ['Actor One'],
        });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject movie creation from non-admin user', async () => {
      const genre = await createTestGenre();
      const { agent } = await createLoggedInUserAgent();

      const res = await agent.post('/api/v1/movies/create-movie').send({
        name: 'User Movie',
        image: '/uploads/movie.jpg',
        year: 2024,
        genre: genre._id,
        detail: 'Movie created by normal user.',
        cast: ['Actor One'],
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should allow admin to create movie', async () => {
      const genre = await createTestGenre({ name: 'Adventure' });
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.post('/api/v1/movies/create-movie').send({
        name: 'Admin Movie',
        image: '/uploads/admin-movie.jpg',
        year: 2024,
        genre: genre._id,
        detail: 'Movie created by admin.',
        cast: ['Actor One', 'Actor Two'],
      });

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('name', 'Admin Movie');

      const movieInDB = await Movie.findOne({ name: 'Admin Movie' });
      expect(movieInDB).not.toBeNull();
    });
  });

  describe('PUT /api/v1/movies/update-movie/:id', () => {
    it('should allow admin to update movie', async () => {
      const genre = await createTestGenre({ name: 'Drama' });
      const movie = await createTestMovie({ name: 'Old Movie', genre });
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.put(`/api/v1/movies/update-movie/${movie._id}`).send({
        name: 'Updated Movie',
        image: '/uploads/updated.jpg',
        year: 2025,
        genre: genre._id,
        detail: 'Updated detail.',
        cast: ['Updated Actor'],
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated Movie');

      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.name).toBe('Updated Movie');
    });

    it('should reject update movie when not logged in', async () => {
      const movie = await createTestMovie({ name: 'Protected Movie' });

      const res = await request(app).put(`/api/v1/movies/update-movie/${movie._id}`).send({
        name: 'Illegal Update',
      });

      expect([401, 403]).toContain(res.statusCode);
    });
  });

  describe('DELETE /api/v1/movies/delete-movie/:id', () => {
    it('should allow admin to delete movie', async () => {
      const movie = await createTestMovie({ name: 'Movie To Delete' });
      const { agent } = await createLoggedInAdminAgent();

      const res = await agent.delete(`/api/v1/movies/delete-movie/${movie._id}`);

      expect([200, 204]).toContain(res.statusCode);

      const deletedMovie = await Movie.findById(movie._id);
      expect(deletedMovie).toBeNull();
    });

    it('should reject delete movie when not logged in', async () => {
      const movie = await createTestMovie({ name: 'Protected Delete Movie' });

      const res = await request(app).delete(`/api/v1/movies/delete-movie/${movie._id}`);

      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
