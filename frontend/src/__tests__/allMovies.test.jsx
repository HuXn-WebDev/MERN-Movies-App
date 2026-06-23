import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import moviesReducer from '../redux/features/movies/moviesSlice';
import AllMovies from '../pages/Movies/AllMovies';

const moviesMocks = vi.hoisted(() => ({
  useGetAllMoviesQuery: vi.fn(),
  useGetNewMoviesQuery: vi.fn(),
  useGetTopMoviesQuery: vi.fn(),
  useGetRandomMoviesQuery: vi.fn(),
  useFetchGenresQuery: vi.fn(),
}));

vi.mock('../redux/api/movies', () => ({
  useGetAllMoviesQuery: moviesMocks.useGetAllMoviesQuery,
  useGetNewMoviesQuery: moviesMocks.useGetNewMoviesQuery,
  useGetTopMoviesQuery: moviesMocks.useGetTopMoviesQuery,
  useGetRandomMoviesQuery: moviesMocks.useGetRandomMoviesQuery,
}));

vi.mock('../redux/api/genre', () => ({
  useFetchGenresQuery: moviesMocks.useFetchGenresQuery,
}));

vi.mock('../pages/Movies/MovieCard', () => ({
  default: ({ movie }) => <article>{movie.name}</article>,
}));

const movieData = [
  { _id: 'm1', name: 'The Matrix', year: 1999 },
  { _id: 'm2', name: 'Interstellar', year: 2014 },
];

const renderAllMovies = () => {
  const store = configureStore({
    reducer: {
      movies: moviesReducer,
    },
  });

  render(
    <Provider store={store}>
      <AllMovies />
    </Provider>
  );

  return store;
};

describe('AllMovies page', () => {
  beforeEach(() => {
    moviesMocks.useGetAllMoviesQuery.mockReturnValue({ data: movieData });
    moviesMocks.useGetNewMoviesQuery.mockReturnValue({ data: [{ _id: 'm3', name: 'Newest' }] });
    moviesMocks.useGetTopMoviesQuery.mockReturnValue({ data: [{ _id: 'm4', name: 'Top Rated' }] });
    moviesMocks.useGetRandomMoviesQuery.mockReturnValue({
      data: [{ _id: 'm5', name: 'Random Pick' }],
    });
    moviesMocks.useFetchGenresQuery.mockReturnValue({
      data: [{ _id: 'g1', name: 'Sci-Fi' }],
    });
  });

  it('should render fetched movies and update search/filter state', async () => {
    const user = userEvent.setup();
    const store = renderAllMovies();

    expect(await screen.findByText('The Matrix')).toBeInTheDocument();
    expect(screen.getByText('Interstellar')).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/search movie/i), 'matrix');
    const selects = screen.getAllByRole('combobox');

    await user.selectOptions(selects[0], 'g1');
    await user.selectOptions(selects[1], '1999');
    await user.selectOptions(selects[2], '8');

    await waitFor(() => {
      expect(store.getState().movies.moviesFilter).toMatchObject({
        searchTerm: 'matrix',
        selectedGenre: 'g1',
        selectedYear: '1999',
        selectedRating: '8',
      });
    });
  });

  it('should switch displayed movies when sort options are selected', async () => {
    const user = userEvent.setup();
    renderAllMovies();

    const sortSelect = screen.getAllByRole('combobox')[3];

    await user.selectOptions(sortSelect, 'new');
    expect(await screen.findByText('Newest')).toBeInTheDocument();

    await user.selectOptions(sortSelect, 'top');
    expect(await screen.findByText('Top Rated')).toBeInTheDocument();

    await user.selectOptions(sortSelect, 'random');
    expect(await screen.findByText('Random Pick')).toBeInTheDocument();
  });
});
