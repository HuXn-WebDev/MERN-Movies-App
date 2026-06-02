/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';

describe('Backend API health check', () => {
  it('should return status ok from /api/v1/health', async () => {
    const response = await request(app).get('/api/v1/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ status: 'ok' }));
  });
});
