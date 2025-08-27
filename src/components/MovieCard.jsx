import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const MovieCard = ({ movieId, title, posterURL, rating, openMovieDetails }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // mobile < 640px
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='bg-gray-800 rounded-lg shadow w-full sm:w-56 cursor-pointer hover:scale-105 transition transform duration-200'>
      <img
        src={posterURL}
        alt={title}
        className='w-full h-48 sm:h-64 object-cover rounded-t-lg'
      />
      <div className='p-3 text-center'>
        <span className='text-yellow-400 text-sm sm:text-md font-semibold'>
          ⭐ {rating?.toFixed(1)} / 10
        </span>
        <p className='text-gray-100 text-md sm:text-lg mt-2 font-normal leading-snug'>
          {title}
        </p>
        {!isMobile && (
          <button
            className='mt-3 px-4 py-2 bg-yellow-500 text-gray-900 font-semibold rounded hover:bg-yellow-600 transition text-sm sm:text-base'
            onClick={() => openMovieDetails(`movie/${movieId}`)}
          >
            Open Details
          </button>
        )}
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
