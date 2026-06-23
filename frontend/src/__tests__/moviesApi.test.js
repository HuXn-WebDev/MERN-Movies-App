import { describe, expect, it } from 'vitest';
import { buildAllMoviesQuery } from '../redux/api/movies';

describe('movies API query wiring', () => {
  it('should build all-movies query strings from active filters', async () => {
    const url = buildAllMoviesQuery({
      search: 'matrix',
      genre: 'genre-1',
      year: '1999',
      rating: '8',
    });

    expect(url).toContain('/api/v1/movies/all-movies');
    expect(url).toContain('search=matrix');
    expect(url).toContain('genre=genre-1');
    expect(url).toContain('year=1999');
    expect(url).toContain('rating=8');
  });

  it('should omit the query string when no filters are active', () => {
    expect(buildAllMoviesQuery()).toBe('/api/v1/movies/all-movies');
  });
});
