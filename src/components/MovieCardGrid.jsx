import { useEffect, useState } from "react";
import PropTypes from "prop-types"
import MovieCard from "./MovieCard"
import Loading from "./Loading";
import useArrowNavigation from '../hooks/useArrowNavigation';

const MovieCardGrid = ({ movies, openMovieDetails, loading, setPage}) => {
    const [, setSelected] = useState(null);
  
    const handleSelect = (movie, type) => {
      if (type === 'confirm') {
        openMovieDetails(`movie/${movie.id}`);
      } else {
        setSelected(movie);
      }
    };
    const selectedIndex = useArrowNavigation(movies, handleSelect);

    useEffect(() => {
      let timer;
      const handleScroll = () => {
        if (
          !loading &&
          window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 150
        ) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            setPage((prev) => prev + 1);
          }, 100);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }, [loading, setPage]);

    return (
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 content-center'>
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            tabIndex={-1}
            className={`p-2 transition-transform duration-200 ease-out hover:scale-[1.03] ${
              index === selectedIndex
                ? 'scale-[1.03] ring-2 ring-accent rounded-md'
                : ''
            }`}
            onClick={() => handleSelect(movie, 'confirm')}
          >
            <MovieCard
              movieId={movie.id}
              title={movie.title}
              posterURL={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              rating={movie.vote_average}
              openMovieDetails={openMovieDetails}
            />
          </div>
        ))}
        {loading && (
          <div className='col-span-full'>
            <Loading inline />
          </div>
        )}
      </div>
    );
}

MovieCardGrid.propTypes = {
  openMovieDetails: PropTypes.func,
  movies: PropTypes.array,
  loading: PropTypes.bool,
  setPage: PropTypes.func
  
}

export default MovieCardGrid