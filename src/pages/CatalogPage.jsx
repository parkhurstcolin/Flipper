import { useState, useEffect } from 'react';
import MovieCardGrid from '../components/MovieCardGrid';
import Loading from '../components/Loading';
import PropTypes from 'prop-types';
import { fetchPopularMovies } from '../api/tmdb';

const CatalogPage = ({ openMovieDetails, loading, setLoading }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovies() {
      setLoading(true);
      try {
        const fetchedMovies = await fetchPopularMovies(page);
        if (cancelled) return;

        setMovies((prev) => {
          const newMovies = fetchedMovies.filter(
            (m) => !prev.some((p) => p.id === m.id)
          );
          return [...prev, ...newMovies];
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovies();

    return () => {
      cancelled = true;
    };
  }, [page, setLoading]);

  return (
    <div className='page-container'>
      {loading && <Loading inline />}
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
