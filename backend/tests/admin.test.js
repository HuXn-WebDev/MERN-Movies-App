/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';
import Genre from '../models/Genre.js';
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

describe('Admin Authorization', () => {
  it('should allow admin to create genre', async () => {
    const { agent } = await createLoggedInAdminAgent();

    const res = await agent.post('/api/v1/genre').send({
      name: 'Admin Genre',
    });

    expect([200, 201]).toContain(res.statusCode);

    const genre = await Genre.findOne({ name: 'Admin Genre' });
    expect(genre).not.toBeNull();
  });

  it('should reject normal user from creating genre', async () => {
    const { agent } = await createLoggedInUserAgent();

    const res = await agent.post('/api/v1/genre').send({
      name: 'User Genre',
    });

    expect([401, 403]).toContain(res.statusCode);

    const genre = await Genre.findOne({ name: 'User Genre' });
    expect(genre).toBeNull();
  });

  it('should reject guest from creating movie', async () => {
    const genre = await createTestGenre();

    const res = await request(app)
      .post('/api/v1/movies/create-movie')
      .send({
        name: 'Guest Movie',
        image: '/uploads/guest.jpg',
        year: 2024,
        genre: genre._id,
        detail: 'Guest should not create movie.',
        cast: ['Guest Actor'],
      });

    expect([401, 403]).toContain(res.statusCode);

    const movie = await Movie.findOne({ name: 'Guest Movie' });
    expect(movie).toBeNull();
  });

  it('should allow admin to delete movie', async () => {
    const movie = await createTestMovie({ name: 'Admin Delete Movie' });
    const { agent } = await createLoggedInAdminAgent();

    const res = await agent.delete(`/api/v1/movies/delete-movie/${movie._id}`);

    expect([200, 204]).toContain(res.statusCode);

    const movieInDB = await Movie.findById(movie._id);
    expect(movieInDB).toBeNull();
  });

  it('should reject normal user from deleting movie', async () => {
    const movie = await createTestMovie({ name: 'Protected Movie' });
    const { agent } = await createLoggedInUserAgent();

    const res = await agent.delete(`/api/v1/movies/delete-movie/${movie._id}`);

    expect([401, 403]).toContain(res.statusCode);

    const movieInDB = await Movie.findById(movie._id);
    expect(movieInDB).not.toBeNull();
  });
});
