import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import MovieCard from '../components/MovieCard';
import useArrowNavigation from '../hooks/useArrowNavigation';

const SearchPage = ({ openMovieDetails }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [, setSelected] = useState(null);
  const selectedIndex = useArrowNavigation(results, setSelected);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      axios
        .request({
          method: 'GET',
          url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
          },
        })
        .then((res) => {
          setResults((prev) =>
            page === 1 ? res.data.results : [...prev, ...res.data.results]
          );
          setLoading(false);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [query, page]);

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
    <div className='px-4 py-6 max-w-6xl mx-auto'>
      <input
        type='text'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        placeholder='Search movies...'
        className='w-full md:w-1/2 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 shadow focus:outline-none focus:ring-2 focus:ring-yellow-500 transition'
      />
      {results.length === 0 && query && (
        <h2 className='text-center text-gray-300 mt-8 text-xl'>
          No results found
        </h2>
      )}
      {loading && <p className='text-center text-gray-400 mt-4'>Loading...</p>}

      {results.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6'>
          {results.map((movie, index) => (
            <div
              key={movie.id}
              tabIndex={-1}
              className={`transition transform ${
                index === selectedIndex
                  ? 'scale-105 ring-2 ring-yellow-500'
                  : ''
              }`}
            >
              <MovieCard
                movieId={movie.id.toString()}
                title={movie.title}
                posterURL={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                rating={movie.vote_average}
                openMovieDetails={openMovieDetails}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

SearchPage.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default SearchPage;
