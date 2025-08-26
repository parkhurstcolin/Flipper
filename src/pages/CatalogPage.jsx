import PropTypes from 'prop-types';
import MovieList from '../components/MovieList';

const CatalogPage = ({ openMovieDetails }) => {
  return <MovieList openMovieDetails={openMovieDetails} />;
};

CatalogPage.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default CatalogPage;
