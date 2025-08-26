const StarRating = ({ rating }) => {
  return (
    <div className='flex relative'>
      <img className='absolute' style={{ width: `${((rating / 10) * 100).toFixed(2)}%` }} src='src/images/fullStars.png' />
      <img className='absolute' src='src/images/emptyStars.png' />
    </div>
  )
}

StarRating.propTypes = {
  rating: Number
}
export default StarRating;