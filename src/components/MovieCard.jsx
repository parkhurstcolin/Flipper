//import axios from 'axios';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const MovieCard = ({ movieId, title, posterURL, rating, openDetails }) => {
  return (
    <div className='w-48 h-auto'>
      <img title='poster' src={posterURL} />
      <div>
        <StarRating rating={Math.ceil(rating / 2)} />
      </div>
      <p title='title'>{title}</p>
      <button title='details' onClick={() => openDetails(movieId)}>
        Open Details
      </button>
    </div>
  );
};

MovieCard.propTypes = {
  movieId: PropTypes.string,
  title: PropTypes.string,
  posterURL: PropTypes.string,
  rating: PropTypes.number,
  openDetails: PropTypes.func,
};

export default MovieCard;
