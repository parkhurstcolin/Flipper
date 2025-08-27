import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import MovieCardGrid from '../components/MovieCardGrid';

const MovieDetailPage = ({ movieId, openMovieDetails }) => {
  const [movie, setMovie] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    };
    const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      headers: headers,
    };
    axios
      .request(options)
      .then((res) => {
        setMovie(res.data);

        const similarOptions = {
          method: 'GET',
          url: `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US`,
          headers: headers,
        };
        axios
          .request(similarOptions)
          .then((res) => {
            setSimilarMovies(res.data.results);
          })
          .catch((err) => {
            console.warn('Similar movies fetch failed:', err);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        throw new Error('No Movie Was Found');
      });
  }, [movieId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className='relative min-h-screen bg-gray-900 text-white'>
      <div
        className='absolute inset-0 bg-cover bg-center brightness-50'
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
        }}
      />
      <div className='relative max-w-5xl mx-auto px-6 py-20'>
        <div className='flex flex-col md:flex-row gap-8'>
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className='w-full md:w-1/3 rounded-2xl shadow-lg z-10'
          />
          <div className='flex-1 z-10'>
            <h1 className='text-3xl font-bold'>
              {movie.title}{' '}
              <span className='text-gray-300'>
                ({movie.release_date?.split('-')[0]})
              </span>
            </h1>
            {movie.tagline && (
              <p className='italic text-gray-300 mt-1'>{movie.tagline}</p>
            )}
            <p className='mt-4 text-lg leading-relaxed'>{movie.overview}</p>
            <div className='mt-6 flex flex-wrap gap-4 text-sm text-gray-300'>
              <span>⭐ {movie.vote_average?.toFixed(1)} / 10</span>
              <span>
                ⏱ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
              <span>{movie.genres?.map((g) => g.name).join(', ')}</span>
            </div>
          </div>
        </div>

        <h2 className='text-2xl font-semibold mt-12 mb-4 z-10 relative'>
          Similar Movies
        </h2>

        {loading && (
          <p className='text-center text-gray-400 mt-4'>Loading...</p>
        )}

        {similarMovies.length > 0 && (
          <MovieCardGrid
            openMovieDetails={openMovieDetails}
            movies={similarMovies}
            loading={loading}
          />
        )}
        {/* <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
          {similarMovies.map((m) => (
            <MovieCard
              key={m.id}
              movieId={m.id.toString()}
              title={m.title}
              posterURL={`https://image.tmdb.org/t/p/w500/${m.poster_path}`}
              rating={m.vote_average}
              openMovieDetails={openMovieDetails}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

MovieDetailPage.propTypes = {
  movieId: PropTypes.string,
  openMovieDetails: PropTypes.func,
};

export default MovieDetailPage;
