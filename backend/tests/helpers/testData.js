import request from 'supertest';
import app from '../../app.js';
import User from '../../models/User.js';
import Genre from '../../models/Genre.js';
import Movie from '../../models/Movie.js';
import bcrypt from 'bcryptjs';

export const createTestUser = async ({
  username = 'Test User',
  email = 'user@test.com',
  password = 'password123',
  isAdmin = false,
} = {}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: username,
    username,
    email,
    password: hashedPassword,
    isAdmin,
  });

  return {
    user,
    plainPassword: password,
  };
};

export const createTestAdmin = async () => {
  return createTestUser({
    username: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    isAdmin: true,
  });
};

export const loginAsUser = async ({ email = 'user@test.com', password = 'password123' } = {}) => {
  const agent = request.agent(app);

  const res = await agent.post('/api/v1/users/auth').send({
    email,
    password,
  });

  return {
    agent,
    response: res,
  };
};

export const createLoggedInUserAgent = async () => {
  const { user, plainPassword } = await createTestUser();

  const { agent, response } = await loginAsUser({
    email: user.email,
    password: plainPassword,
  });

  return {
    user,
    agent,
    loginResponse: response,
  };
};

export const createLoggedInAdminAgent = async () => {
  const { user, plainPassword } = await createTestAdmin();

  const { agent, response } = await loginAsUser({
    email: user.email,
    password: plainPassword,
  });

  return {
    admin: user,
    agent,
    loginResponse: response,
  };
};

export const createTestGenre = async ({ name } = {}) => {
  const genreName = name || `A${Math.floor(Math.random() * 1000000)}`;
  return Genre.create({ name: genreName });
};

export const createTestMovie = async ({
  name = 'Test Movie',
  image = '/uploads/test-image.jpg',
  year = 2024,
  genre,
  detail = 'This is a test movie detail.',
  cast = ['Actor One', 'Actor Two'],
  rating = 4.5,
  numReviews = 0,
  reviews = [],
} = {}) => {
  const selectedGenre = genre || (await createTestGenre());

  return Movie.create({
    name,
    image,
    year,
    genre: selectedGenre._id,
    detail,
    cast,
    rating,
    numReviews,
    reviews,
  });
};
