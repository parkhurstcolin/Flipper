import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Youtube from 'react-youtube';
import ScrollRow from '../components/ScrollRow';
import MoviePoster from '../components/MoviePoster';
import Loading from '../components/Loading';
import {
  fetchMovie,
  fetchMovieCredits,
  fetchMovieTeaser,
  fetchSimilarMovies,
  fetchWatchProviders,
} from '../api/tmdb';

const MovieDetailPage = ({
  movieId,
  openMovieDetails,
  previousPage,
  loading,
  setLoading,
}) => {
  const [movie, setMovie] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [providers, setProviders] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovieData() {
      setLoading(true);
      try {
        const [movieData, similar, credits, regionProviders, teasers] =
          await Promise.all([
            fetchMovie(movieId),
            fetchSimilarMovies(movieId),
            fetchMovieCredits(movieId),
            fetchWatchProviders(movieId),
            fetchMovieTeaser(movieId),
          ]);
        if (cancelled) return;

        setMovie(movieData);
        setSimilarMovies(similar);
        setCast(credits.cast?.slice(0, 12) ?? []);
        setProviders(regionProviders?.US ?? null);
        setTrailerKey(teasers.length ? teasers[0].key : null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovieData();

    return () => {
      cancelled = true;
    };
  }, [movieId, setLoading]);

  if (loading) return <Loading />;

  const year = movie.release_date?.split('-')[0];
  const backLabel = previousPage === 'search' ? 'Back to Search' : 'Back to Feed';

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <div className='relative'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900' />

        <div className='relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-12'>
          <button
            onClick={() => openMovieDetails(previousPage)}
            className='mb-8 inline-flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-200 ease-out'
          >
            <span aria-hidden>←</span> {backLabel}
          </button>

          <div className='flex flex-col md:flex-row gap-8'>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className='w-full md:w-1/3 rounded-2xl shadow-2xl'
            />
            <div className='flex-1'>
              <h1 className='text-3xl md:text-4xl font-bold [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]'>
                {movie.title}
                {year && (
                  <span className='font-normal text-gray-400'> ({year})</span>
                )}
              </h1>

              {movie.tagline && (
                <p className='mt-2 italic text-gray-300'>{movie.tagline}</p>
              )}

              <div className='mt-4 flex flex-wrap items-center gap-4 text-gray-200'>
                <span className='inline-flex items-center gap-1 font-semibold text-accent-light'>
                  ⭐ {movie.vote_average?.toFixed(1)}
                  <span className='font-normal text-gray-400'>/ 10</span>
                </span>
                {movie.runtime > 0 && (
                  <span>
                    ⏱ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                )}
              </div>

              {movie.genres?.length > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className='rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200'
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className='mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-semibold text-gray-900 hover:bg-accent-dark transition-colors duration-200 ease-out'
                >
                  <span aria-hidden>▶</span> Watch Trailer
                </button>
              )}

              <p className='mt-6 text-lg leading-relaxed text-gray-200'>
                {movie.overview}
              </p>

              {providers?.flatrate?.length > 0 && (
                <div className='mt-6'>
                  <p className='mb-2 text-sm text-gray-400'>Available on</p>
                  <div className='flex flex-wrap gap-3'>
                    {providers.flatrate.map((p) => (
                      <img
                        key={p.provider_id}
                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                        alt={p.provider_name}
                        title={p.provider_name}
                        className='h-10 w-10 rounded-lg'
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 pt-8 pb-20 space-y-12'>
        {cast.length > 0 && (
          <section>
            <h2 className='mb-4 text-2xl font-semibold'>Cast</h2>
            <ScrollRow>
              {cast.map((person) => (
                <div key={person.id} className='w-24 shrink-0 text-center'>
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                      alt={person.name}
                      className='h-32 w-24 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='flex h-32 w-24 items-center justify-center rounded-lg bg-gray-800 text-2xl text-gray-500'>
                      ?
                    </div>
                  )}
                  <p className='mt-2 text-sm font-medium'>{person.name}</p>
                  <p className='text-xs text-gray-400'>{person.character}</p>
                </div>
              ))}
            </ScrollRow>
          </section>
        )}

        {similarMovies.length > 0 && (
          <section>
            <h2 className='mb-4 text-2xl font-semibold'>Similar Movies</h2>
            <ScrollRow>
              {similarMovies.map((m) => (
                <MoviePoster
                  key={m.id}
                  movie={m}
                  onClick={() => openMovieDetails(`movie/${m.id}`)}
                />
              ))}
            </ScrollRow>
          </section>
        )}
      </div>

      {showTrailer && trailerKey && (
        <div
          className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4'
          onClick={() => setShowTrailer(false)}
        >
          <div
            className='relative aspect-video w-full max-w-4xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className='absolute -top-10 right-0 text-2xl text-white hover:text-accent'
              aria-label='Close trailer'
            >
              ✕
            </button>
            <Youtube
              videoId={trailerKey}
              className='h-full w-full'
              opts={{
                width: '100%',
                height: '100%',
                playerVars: { autoplay: 1 },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

MovieDetailPage.propTypes = {
  movieId: PropTypes.string,
  openMovieDetails: PropTypes.func,
  previousPage: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default MovieDetailPage;
