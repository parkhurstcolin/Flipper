import axios from 'axios';
import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ openDetails }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.TMDB_API_KEY}`,
      },
    };
    axios
      .request(options)
      .then((res) => {
        setMovies((prev) => [...prev, ...res.data.results]);
        setLoading(false);
      })
      .catch((err) => {
        throw new Error(err);
      });

    return () => {};
  }, [page]);

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
  }, [loading]);

  function renderMovies() {
    return movies.map(({ id, title, poster_path, vote_average }) => {
      return (
        <MovieCard
          key={id.toString()}
          movieId={id.toString()}
          title={title}
          posterUrl={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          rating={vote_average}
          openDetails={openDetails}
        />
      );
    });
  }

  return (
    <>
      {renderMovies()}
      {loading && <div>Loading...</div>}
    </>
  );
};

MovieList.propTypes = {
  openDetails: () => {},
};

export default MovieList;
