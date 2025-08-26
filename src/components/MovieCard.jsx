//import axios from 'axios';
import StarRating from './StarRating';

const MovieCard = ({ movieId, title, posterURL, rating, openDetails }) => {
  return (
    <div>
      <img title='poster' src={posterURL} />
      <StarRating rating={rating} />
      <p title='title'>{title}</p>
      <button title='details' onClick={() => openDetails(movieId)}>
        Open Details
      </button>
    </div>
  );
};

MovieCard.propTypes = {
  movieId: String,
  title: String,
  posterURL: String,
  rating: Number,
  openDetails: () => {},
};

export default MovieCard;
