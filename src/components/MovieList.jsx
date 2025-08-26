import axios from 'axios';
import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import PropTypes from 'prop-types';

const MovieList = ({ openMovieDetails }) => {
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
    <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id.toString()}
          movieId={movie.id.toString()}
          title={movie.title}
          posterURL={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          rating={movie.vote_average}
          openMovieDetails={openMovieDetails}
        />
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
};

MovieList.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default MovieList;
