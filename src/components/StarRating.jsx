import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  return (
    <div className='flex'>
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-xl ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
};
export default StarRating;
