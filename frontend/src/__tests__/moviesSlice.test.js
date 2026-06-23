import { describe, expect, it } from 'vitest';
import moviesReducer, {
  setFilteredMovies,
  setMovieYears,
  setMoviesFilter,
  setUniqueYears,
} from '../redux/features/movies/moviesSlice';

describe('moviesSlice', () => {
  it('should merge movie filters without dropping existing filter state', () => {
    const initialState = moviesReducer(undefined, { type: 'unknown' });

    const state = moviesReducer(
      initialState,
      setMoviesFilter({ searchTerm: 'matrix', selectedYear: '1999' })
    );

    expect(state.moviesFilter).toEqual({
      searchTerm: 'matrix',
      selectedGenre: '',
      selectedYear: '1999',
      selectedRating: '',
      selectedSort: '',
    });
  });

  it('should store filtered movies and year options', () => {
    let state = moviesReducer(undefined, setFilteredMovies([{ _id: 'm1', name: 'Inception' }]));

    state = moviesReducer(state, setMovieYears([2010, 2014, 2010]));
    state = moviesReducer(state, setUniqueYears([2010, 2014]));

    expect(state.filteredMovies).toHaveLength(1);
    expect(state.movieYears).toEqual([2010, 2014, 2010]);
    expect(state.uniqueYear).toEqual([2010, 2014]);
  });
});
