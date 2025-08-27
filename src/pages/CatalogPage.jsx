import { useState, useEffect } from 'react';
import MovieCardGrid from '../components/MovieCardGrid';
import PropTypes from 'prop-types';
import { fetchPopularMovies } from '../api/tmdb';

const CatalogPage = ({ openMovieDetails, loading, setLoading }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    async function fetchMovies() {
      const fetchedMovies = await fetchPopularMovies(page);

      setMovies((prev) => {
        const newMovies = fetchedMovies.filter(
          (m) => !prev.some((p) => p.id === m.id)
        );
        return [...prev, ...newMovies];
      });
    }

    fetchMovies();

    setLoading(false);

    return () => {};
  }, [page, setLoading]);

  return (
    <div className='w-full max-w-6xl mx-auto px-4'>
      {loading && <p className='text-center text-gray-400 mt-4'>Loading...</p>}
      {movies.length > 0 && (
        <MovieCardGrid
          openMovieDetails={openMovieDetails}
          movies={movies}
          loading={loading}
          setPage={setPage}
        />
      )}
    </div>
  );
};

CatalogPage.propTypes = {
  loading: PropTypes.bool,
  openMovieDetails: PropTypes.func,
  setLoading: PropTypes.func,
};
export default CatalogPage;
