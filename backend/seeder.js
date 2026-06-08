import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";
import Genre from "./models/Genre.js";
import Movie from "./models/Movie.js";

dotenv.config();

// CONNECT DB
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");

// CLEAR DATA
await User.deleteMany();
await Genre.deleteMany();
await Movie.deleteMany();

console.log("Old data removed");

// =========================
// USERS
// =========================

const users = await User.insertMany([
  {
    username: "admin",
    email: "admin@mail.com",
    password: "123456",
    isAdmin: true,
  },
  {
    username: "user1",
    email: "user1@mail.com",
    password: "123456",
  },
]);

console.log("Users seeded");

// =========================
// GENRES
// =========================

const genres = await Genre.insertMany([
  { name: "Action" },
  { name: "Drama" },
  { name: "Comedy" },
]);

console.log("Genres seeded");

// =========================
// MOVIES
// =========================

const movies = [
  {
    name: "Avengers",
    image: "https://via.placeholder.com/300",
    year: 2019,
    genre: genres[0]._id,
    detail: "Superhero movie",
    cast: ["Iron Man", "Captain America"],
    reviews: [
      {
        name: "admin",
        rating: 5,
        comment: "Amazing movie!",
        user: users[0]._id,
      },
    ],
    numReviews: 1,
  },
  {
    name: "The Godfather",
    image: "https://via.placeholder.com/300",
    year: 1972,
    genre: genres[1]._id,
    detail: "Classic mafia movie",
    cast: ["Al Pacino"],
    reviews: [],
    numReviews: 0,
  },
];

await Movie.insertMany(movies);

console.log("Movies seeded");

// DONE
process.exit();