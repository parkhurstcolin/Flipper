import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ScrollRow from './ScrollRow';
import MoviePoster from './MoviePoster';

const MovieRow = ({ title, fetcher, openMovieDetails }) => {
  const [movies, setMovies] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetcher().then((data) => {
      if (cancelled) return;
      setMovies(Array.isArray(data) ? data : []);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  if (loaded && movies.length === 0) return null;

  return (
    <section>
      <h2 className='mb-3 text-xl font-semibold'>{title}</h2>
      <ScrollRow>
        {loaded
          ? movies.map((m) => (
              <MoviePoster
                key={m.id}
                movie={m}
                onClick={() => openMovieDetails(`movie/${m.id}`)}
              />
            ))
          : Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='w-32 shrink-0'>
                <div className='aspect-[2/3] w-full animate-pulse rounded-lg bg-gray-800' />
                <div className='mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-800' />
              </div>
            ))}
      </ScrollRow>
    </section>
  );
};

MovieRow.propTypes = {
  title: PropTypes.string,
  fetcher: PropTypes.func,
  openMovieDetails: PropTypes.func,
};

export default MovieRow;
