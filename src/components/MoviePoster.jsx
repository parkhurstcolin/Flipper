import PropTypes from 'prop-types';

const MoviePoster = ({ movie, onClick }) => {
  return (
    <button onClick={onClick} className='group w-32 shrink-0 text-left'>
      <div className='relative overflow-hidden rounded-lg bg-gray-800 shadow'>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
            alt={movie.title}
            className='aspect-[2/3] w-full object-cover transition duration-200 ease-out group-hover:brightness-110'
          />
        ) : (
          <div className='flex aspect-[2/3] w-full items-center justify-center p-2 text-center text-xs text-gray-500'>
            {movie.title}
          </div>
        )}
        {movie.vote_average > 0 && (
          <span className='absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-accent-light backdrop-blur-sm'>
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <p className='mt-2 line-clamp-2 h-10 text-sm font-medium text-gray-200'>
        {movie.title}
      </p>
    </button>
  );
};

MoviePoster.propTypes = {
  movie: PropTypes.object,
  onClick: PropTypes.func,
};

export default MoviePoster;
