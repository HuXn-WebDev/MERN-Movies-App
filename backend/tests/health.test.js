/* eslint-env jest */
import request from 'supertest';
import app from '../app.js';

describe('Health API', () => {
  it('should return backend health status', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('backend');
    expect(res.body.timestamp).toBeDefined();
  });

  it('should allow configured frontend origins through CORS', async () => {
    const res = await request(app).get('/api/v1/health').set('Origin', 'http://localhost:5173');

    expect(res.statusCode).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should reject unknown browser origins through CORS', async () => {
    const res = await request(app)
      .get('/api/v1/health')
      .set('Origin', 'https://not-the-frontend.example');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Not allowed by CORS');
  });

  it('should expose Prometheus metrics', async () => {
    await request(app).get('/api/v1/health');

    const res = await request(app).get('/metrics');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toContain('http_requests_total');
  });
});
