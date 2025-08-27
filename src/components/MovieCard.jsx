//import axios from 'axios';
import PropTypes from 'prop-types';

const MovieCard = ({ movieId, title, posterURL, rating, openMovieDetails }) => {
  return (
    <div className='bg-gray-800 rounded-lg shadow w-60 cursor-pointer hover:scale-105 transition transform duration-200'>
      <img
        src={posterURL}
        alt={title}
        className='w-full h-64 object-cover rounded-t-lg'
      />
      <div className='p-2 text-center'>
        <span className='text-yellow-400 text-md'>
          ⭐ {rating?.toFixed(1)} / 10
        </span>
        <p className='text-gray-100 text-2xl mt-1 truncate font-light'>
          {title}
        </p>
        <button
          className='mt-2 px-3 py-1 bg-yellow-500 text-gray-900 font-semibold rounded hover:bg-yellow-600 transition'
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
