/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';
import Movie from '../models/Movie.js';
import { connectTestDB, clearTestDB, closeTestDB } from './setup.js';
import {
  createLoggedInAdminAgent,
  createLoggedInUserAgent,
  createTestMovie,
} from './helpers/testData.js';

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(closeTestDB);

describe('Review API', () => {
  describe('POST /api/v1/movies/:id/reviews', () => {
    it('should allow logged in user to add review', async () => {
      const movie = await createTestMovie({ name: 'Reviewable Movie' });
      const { agent } = await createLoggedInUserAgent();

      const res = await agent.post(`/api/v1/movies/${movie._id}/reviews`).send({
        rating: 5,
        comment: 'Great movie!',
      });

      expect([200, 201]).toContain(res.statusCode);

      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.reviews.length).toBe(1);
      expect(updatedMovie.reviews[0].comment).toBe('Great movie!');
    });

    it('should reject review when user is not logged in', async () => {
      const movie = await createTestMovie({ name: 'Unauthorized Review Movie' });

      const res = await request(app).post(`/api/v1/movies/${movie._id}/reviews`).send({
        rating: 4,
        comment: 'Should not be accepted.',
      });

      expect([401, 403]).toContain(res.statusCode);
    });

    it('should reject duplicate review from same user', async () => {
      const movie = await createTestMovie({ name: 'Duplicate Review Movie' });
      const { agent } = await createLoggedInUserAgent();

      await agent.post(`/api/v1/movies/${movie._id}/reviews`).send({
        rating: 5,
        comment: 'First review.',
      });

      const res = await agent.post(`/api/v1/movies/${movie._id}/reviews`).send({
        rating: 4,
        comment: 'Second review.',
      });

      expect([400, 409]).toContain(res.statusCode);

      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.reviews.length).toBe(1);
    });
  });

  describe('DELETE /api/v1/movies/delete-comment', () => {
    it('should allow admin to delete review comment', async () => {
      const { user, agent: userAgent } = await createLoggedInUserAgent();
      const movie = await createTestMovie({ name: 'Movie With Comment' });

      const addReviewRes = await userAgent.post(`/api/v1/movies/${movie._id}/reviews`).send({
        rating: 5,
        comment: 'Comment to delete.',
      });

      expect([200, 201]).toContain(addReviewRes.statusCode);

      const movieWithReview = await Movie.findById(movie._id);

      expect(movieWithReview).not.toBeNull();
      expect(movieWithReview.reviews.length).toBe(1);

      const reviewId = movieWithReview.reviews[0]._id;

      const { agent: adminAgent } = await createLoggedInAdminAgent();

      const res = await adminAgent.delete('/api/v1/movies/delete-comment').send({
        movieId: movie._id,
        reviewId,
        userId: user._id,
      });

      expect([200, 204]).toContain(res.statusCode);

      const updatedMovie = await Movie.findById(movie._id);
      expect(updatedMovie.reviews.length).toBe(0);
    });

    it('should reject delete comment when not logged in', async () => {
      const movie = await createTestMovie({ name: 'Protected Comment Movie' });

      const res = await request(app).delete('/api/v1/movies/delete-comment').send({
        movieId: movie._id,
        reviewId: '64b7f8b4d2f9c3a123456789',
      });

      expect([401, 403]).toContain(res.statusCode);
    });
  });
});
