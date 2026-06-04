import PropTypes from 'prop-types';

const MovieCard = ({ movieId, title, posterURL, rating, openMovieDetails }) => {
  return (
    <div className='bg-gray-800 rounded-lg shadow w-full sm:w-56 cursor-pointer'>
      <img
        src={posterURL}
        alt={title}
        className='w-full h-48 sm:h-64 object-cover rounded-t-lg'
      />
      <div className='p-3 text-center'>
        <span className='text-accent-light text-sm sm:text-md font-semibold'>
          ⭐ {rating?.toFixed(1)} / 10
        </span>
        <p className='text-gray-100 text-md sm:text-lg mt-2 leading-snug'>
          {title}
        </p>
        {/* Hidden on mobile: the whole card is tappable there */}
        <button
          className='mt-3 hidden sm:inline-block px-4 py-2 bg-accent text-gray-900 font-semibold rounded hover:bg-accent-dark transition-colors duration-200 ease-out text-sm sm:text-base'
          onClick={() => openMovieDetails(`movie/${movieId}`)}
        >
          Open Details
        </button>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movieId: PropTypes.string,
  title: PropTypes.string,
  posterURL: PropTypes.string,
  rating: PropTypes.number,
  openMovieDetails: PropTypes.func,
};

export default MovieCard;
