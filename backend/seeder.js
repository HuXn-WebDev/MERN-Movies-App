import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';

import User from './models/User.js';
import Genre from './models/Genre.js';
import Movie from './models/Movie.js';

dotenv.config();

const placeholder = (title) =>
  `https://placehold.co/300x450/111827/FFFFFF?text=${encodeURIComponent(title)}`;

try {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing');
  }

  await connectDB();

  await User.deleteMany();
  await Genre.deleteMany();
  await Movie.deleteMany();
  console.log('Old data removed');

  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = await User.insertMany([
    {
      username: 'admin',
      email: 'admin@mail.com',
      password: hashedPassword,
      isAdmin: true,
    },
    {
      username: 'hizkia',
      email: 'hizkia@mail.com',
      password: hashedPassword,
      isAdmin: false,
    },
    {
      username: 'movie_lover',
      email: 'movie@mail.com',
      password: hashedPassword,
      isAdmin: false,
    },
  ]);

  console.log('Users seeded');

  const genres = await Genre.insertMany([
    { name: 'Action' },
    { name: 'Drama' },
    { name: 'Comedy' },
    { name: 'Sci-Fi' },
    { name: 'Thriller' },
    { name: 'Fantasy' },
    { name: 'Animation' },
    { name: 'Romance' },
    { name: 'Crime' },
    { name: 'Adventure' },
  ]);

  console.log('Genres seeded');

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.name] = genre._id;
    return acc;
  }, {});

  const movies = [
    {
      name: 'Avengers: Endgame',
      image: placeholder('Avengers Endgame'),
      year: 2019,
      genre: genreMap['Action'],
      detail:
        "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions.",
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
      reviews: [
        {
          name: 'admin',
          rating: 5,
          comment: 'Epic conclusion for the Avengers saga.',
          user: users[0]._id,
        },
      ],
      numReviews: 1,
    },
    {
      name: 'The Godfather',
      image: placeholder('The Godfather'),
      year: 1972,
      genre: genreMap['Crime'],
      detail:
        'The aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.',
      cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
      reviews: [
        {
          name: 'hizkia',
          rating: 5,
          comment: 'Classic, slow, but extremely powerful.',
          user: users[1]._id,
        },
      ],
      numReviews: 1,
    },
    {
      name: 'Interstellar',
      image: placeholder('Interstellar'),
      year: 2014,
      genre: genreMap['Sci-Fi'],
      detail:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
      reviews: [
        {
          name: 'movie_lover',
          rating: 5,
          comment: 'Emotional and intellectually satisfying.',
          user: users[2]._id,
        },
      ],
      numReviews: 1,
    },
    {
      name: 'Inception',
      image: placeholder('Inception'),
      year: 2010,
      genre: genreMap['Sci-Fi'],
      detail:
        'A thief who steals corporate secrets through dream-sharing technology is given a chance to erase his criminal history.',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'The Dark Knight',
      image: placeholder('The Dark Knight'),
      year: 2008,
      genre: genreMap['Action'],
      detail: 'Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos.',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      reviews: [
        {
          name: 'admin',
          rating: 5,
          comment: 'One of the best superhero movies ever made.',
          user: users[0]._id,
        },
      ],
      numReviews: 1,
    },
    {
      name: 'La La Land',
      image: placeholder('La La Land'),
      year: 2016,
      genre: genreMap['Romance'],
      detail:
        'A pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles.',
      cast: ['Ryan Gosling', 'Emma Stone'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'Toy Story',
      image: placeholder('Toy Story'),
      year: 1995,
      genre: genreMap['Animation'],
      detail:
        "A cowboy doll feels threatened when a new spaceman action figure becomes his owner's favorite toy.",
      cast: ['Tom Hanks', 'Tim Allen'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'The Matrix',
      image: placeholder('The Matrix'),
      year: 1999,
      genre: genreMap['Sci-Fi'],
      detail: 'A hacker discovers that reality is a simulated world controlled by machines.',
      cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'Joker',
      image: placeholder('Joker'),
      year: 2019,
      genre: genreMap['Drama'],
      detail:
        'A failed comedian descends into madness and becomes a symbol of chaos in Gotham City.',
      cast: ['Joaquin Phoenix', 'Robert De Niro'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'Spider-Man: No Way Home',
      image: placeholder('Spider Man'),
      year: 2021,
      genre: genreMap['Adventure'],
      detail: 'Peter Parker seeks help from Doctor Strange, causing the multiverse to break open.',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'Parasite',
      image: placeholder('Parasite'),
      year: 2019,
      genre: genreMap['Thriller'],
      detail:
        'A poor family schemes to become employed by a wealthy household, leading to unexpected consequences.',
      cast: ['Song Kang-ho', 'Choi Woo-shik', 'Park So-dam'],
      reviews: [],
      numReviews: 0,
    },
    {
      name: 'The Grand Budapest Hotel',
      image: placeholder('Grand Budapest'),
      year: 2014,
      genre: genreMap['Comedy'],
      detail:
        'A hotel concierge and his lobby boy become involved in a story of theft, family fortune, and murder.',
      cast: ['Ralph Fiennes', 'Tony Revolori'],
      reviews: [],
      numReviews: 0,
    },
  ];

  await Movie.insertMany(movies);
  console.log('Movies seeded');

  console.log('Seeder completed successfully');
  process.exit(0);
} catch (error) {
  console.error('Seeder failed:');
  console.error(error);
  process.exit(1);
}
