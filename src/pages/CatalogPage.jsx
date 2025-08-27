import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCardGrid from '../components/MovieCardGrid';
import PropTypes from 'prop-types';

const CatalogPage = ({ openMovieDetails }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    };
    axios
      .request(options)
      .then((res) => {
        setMovies((prev) => {
          const newMovies = res.data.results.filter(
            (m) => !prev.some((p) => p.id === m.id)
          );
          return [...prev, ...newMovies];
        });
        setLoading(false);
      })
      .catch((err) => {
        throw new Error(err);
      });

    return () => {};
  }, [page]);

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
  openMovieDetails: PropTypes.func,
};
export default CatalogPage;
