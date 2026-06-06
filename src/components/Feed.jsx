import PropTypes from 'prop-types';
import MovieRow from './MovieRow';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchMoviesByGenre,
} from '../api/tmdb';

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Science Fiction' },
  { id: 16, name: 'Animation' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 9648, name: 'Mystery' },
];

const FEED_ROWS = [
  { title: 'Trending This Week', fetcher: () => fetchTrendingMovies('week') },
  { title: 'Popular', fetcher: () => fetchPopularMovies() },
  { title: 'Top Rated', fetcher: () => fetchTopRatedMovies() },
  { title: 'Now Playing', fetcher: () => fetchNowPlayingMovies() },
  ...GENRES.map((g) => ({
    title: g.name,
    fetcher: () => fetchMoviesByGenre(g.id),
  })),
];

const Feed = ({ openMovieDetails }) => {
  return (
    <div className='space-y-8'>
      {FEED_ROWS.map((row) => (
        <MovieRow
          key={row.title}
          title={row.title}
          fetcher={row.fetcher}
          openMovieDetails={openMovieDetails}
        />
      ))}
    </div>
  );
};

Feed.propTypes = {
  openMovieDetails: PropTypes.func,
};

export default Feed;
