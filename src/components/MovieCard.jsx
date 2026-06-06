import PropTypes from 'prop-types';

const MovieCard = ({ title, posterURL, rating }) => {
  return (
    <div className='group cursor-pointer'>
      <div className='relative overflow-hidden rounded-lg bg-gray-800 shadow'>
        <img
          src={posterURL}
          alt={title}
          className='aspect-[2/3] w-full object-cover transition duration-200 ease-out group-hover:brightness-110'
        />
        {rating > 0 && (
          <span className='absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-accent-light backdrop-blur-sm'>
            ⭐ {rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className='mt-2 line-clamp-2 h-10 text-sm font-medium text-gray-200'>
        {title}
      </p>
    </div>
  );
};

MovieCard.propTypes = {
  title: PropTypes.string,
  posterURL: PropTypes.string,
  rating: PropTypes.number,
};

export default MovieCard;
