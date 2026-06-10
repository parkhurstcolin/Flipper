import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MovieCardGrid from '../components/MovieCardGrid';
import Feed from '../components/Feed';
import Loading from '../components/Loading';
import { searchMovies } from '../api/tmdb';

const SearchIcon = ({ className }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={2}
    stroke='currentColor'
    className={className}
    aria-hidden
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
    />
  </svg>
);

SearchIcon.propTypes = { className: PropTypes.string };

const SearchPage = ({ openMovieDetails }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    let cancelled = false;

    const timer = setTimeout(() => {
      async function run() {
        try {
          const found = await searchMovies(q, page);
          if (cancelled) return;
          setResults((prev) => (page === 1 ? found : [...prev, ...found]));
        } finally {
          if (!cancelled) setSearching(false);
        }
      }
      run();
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, page]);

  useEffect(() => {
    let timer;
    const handleScroll = () => {
      if (
        !searching &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 150
      ) {
        clearTimeout(timer);
        timer = setTimeout(() => setPage((prev) => prev + 1), 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [searching]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className='page-container py-6'>
      <div className='relative w-full'>
        <span className='pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400'>
          <SearchIcon className='h-5 w-5' />
        </span>
        <input
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder='Search movies...'
          className='w-full rounded-lg bg-gray-800 py-3 pl-10 pr-10 text-white placeholder-gray-400 shadow transition-shadow duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent'
        />
        {hasQuery && (
          <button
            onClick={() => {
              setQuery('');
              setPage(1);
            }}
            aria-label='Clear search'
            className='absolute inset-y-0 right-3 flex items-center text-gray-400 transition-colors hover:text-white'
          >
            ✕
          </button>
        )}
      </div>

      {!hasQuery && (
        <div className='mt-8'>
          <Feed openMovieDetails={openMovieDetails} />
        </div>
      )}

      {hasQuery && searching && results.length === 0 && <Loading inline />}

      {hasQuery && !searching && results.length === 0 && (
        <p className='mt-20 text-center text-gray-400'>
          No results for “{query.trim()}”.
        </p>
      )}

      {results.length > 0 && (
        <MovieCardGrid
          openMovieDetails={openMovieDetails}
          movies={results}
          loading={searching}
        />
      )}
    </div>
  );
};

SearchPage.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default SearchPage;
