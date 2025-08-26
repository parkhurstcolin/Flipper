import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import useArrowNavigation from '../hooks/useArrowNavigation';

const CatalogPage = ({ openMovieDetails }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [, setSelected] = useState(null);

  const selectedIndex = useArrowNavigation(movies, setSelected);

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

  useEffect(() => {
    let timer;
    const handleScroll = () => {
      if (
        !loading &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 150
      ) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setPage((prev) => prev + 1);
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [loading]);

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6'>
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          tabIndex={-1}
          className={`transition transform ${
            index === selectedIndex ? 'scale-105 ring-2 ring-yellow-500' : ''
          }`}
        >
          <MovieCard
            movieId={movie.id}
            title={movie.title}
            posterURL={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            rating={movie.vote_average}
            openMovieDetails={openMovieDetails}
          />
        </div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
};

CatalogPage.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default CatalogPage;
