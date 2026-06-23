/* eslint-env jest */
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import app from '../app.js';

const uploadsDir = path.resolve('uploads');
const imageFixture = path.resolve('backend/tests/fixtures/test-image.png');
const textFixture = path.resolve('backend/tests/fixtures/test.txt');

beforeAll(() => {
  fs.mkdirSync(uploadsDir, { recursive: true });
});

afterEach(() => {
  for (const file of fs.readdirSync(uploadsDir)) {
    fs.rmSync(path.join(uploadsDir, file), { force: true });
  }
});

describe('Upload API', () => {
  it('should upload a valid image file', async () => {
    const res = await request(app).post('/api/v1/upload').attach('image', imageFixture);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Image uploaded successfully');
    expect(res.body.image).toMatch(/^\/uploads[\\/]/);
  });

  it('should reject upload without a file', async () => {
    const res = await request(app).post('/api/v1/upload');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'No image file provided');
  });

  it('should reject non-image files', async () => {
    const res = await request(app).post('/api/v1/upload').attach('image', textFixture);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Images only');
  });
});
