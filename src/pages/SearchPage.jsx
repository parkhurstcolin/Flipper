import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import MovieCardGrid from '../components/MovieCardGrid';

const SearchPage = ({ openMovieDetails, loading, setLoading }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

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
  }, [query, page, setLoading]);

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
        <div className='w-full max-w-6xl mx-auto px-4'>
          <MovieCardGrid
            openMovieDetails={openMovieDetails}
            movies={results}
            loading={loading}
            setPage={setPage}
          />
        </div>
      )}
    </div>
  );
};

SearchPage.propTypes = {
  openMovieDetails: PropTypes.func,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default SearchPage;
