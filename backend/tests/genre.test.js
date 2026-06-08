import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';

let mongoServer;

// for In-Memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  await mongoose.connect(mongoUri);
});

// turn off database
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the data
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

describe('Genre API Endpoints', () => {
  
  it('Status 200 dan list genre kosong pada awalnya', async () => {
    const res = await request(app).get('/api/v1/genre/genres');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

});