import axios from "axios";
const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    };

export const fetchMovie = async (movieId: string) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    headers,
  };

  try {
    const fetchedMovie = await axios.request(options);
    return fetchedMovie.data;
  } catch (err) {
    throw new Error('Failed to find movie', { cause: err });
  }
};

export const searchMovies = async (query: string, page: number) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
    headers,
  };

  try {
    const searchResults = await axios.request(options);
    return searchResults.data.results;
  } catch (err) {
    throw new Error('No results found', { cause: err });
  }
};

export const fetchMovieTeaser = async (movieId: string) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
    headers,
  };

  try {
    const searchResults = await axios.request(options);
    const youtube = searchResults.data.results.filter(
      (video: { site: string }) => video.site === 'YouTube'
    );
    const teasers = youtube.filter(
      (video: { type: string }) => video.type === 'Teaser'
    );
    return teasers.length > 0
      ? teasers
      : youtube.filter((video: { type: string }) => video.type === 'Trailer');
  } catch (err) {
    throw new Error('No results found', { cause: err });
  }
};

export const fetchPopularMovies = async (page = 1) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
    headers,
  };

  try {
    const popularMovies = await axios.request(options);
    return popularMovies.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMoviesGenre = async () => {
  const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/genre/movie/list?language=en',
    headers,
  };
  try {
    const genredMovieList = await axios.request(options);
    return genredMovieList.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchSimilarMovies = async (movieId: string) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US`,
    headers,
  };
  try {
    const fetchedMovies = await axios.request(options);
    return fetchedMovies.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMovieCredits = async (movieId: string) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
    headers,
  };
  try {
    const credits = await axios.request(options);
    return credits.data;
  } catch (err) {
    console.error(err);
    return { cast: [], crew: [] };
  }
};

export const fetchWatchProviders = async (movieId: string) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    headers,
  };
  try {
    const providers = await axios.request(options);
    return providers.data.results;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const fetchTrendingMovies = async (timeWindow = 'week') => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/trending/movie/${timeWindow}?language=en-US`,
    headers,
  };
  try {
    const res = await axios.request(options);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
    headers,
  };
  try {
    const res = await axios.request(options);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`,
    headers,
  };
  try {
    const res = await axios.request(options);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number, page = 1) => {
  const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&language=en-US&page=${page}`,
    headers,
  };
  try {
    const res = await axios.request(options);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};
