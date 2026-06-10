import axios from "axios";

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
  params: { language: 'en-US' },
});

export const fetchMovie = async (movieId: string) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}`);
    return res.data;
  } catch (err) {
    throw new Error('Failed to find movie', { cause: err });
  }
};

export const searchMovies = async (query: string, page: number) => {
  try {
    const res = await tmdb.get('/search/movie', {
      params: { query, include_adult: false, page },
    });
    return res.data.results;
  } catch (err) {
    throw new Error('No results found', { cause: err });
  }
};

export const fetchMovieTeaser = async (movieId: string) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/videos`);
    const youtube = res.data.results.filter(
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
  try {
    const res = await tmdb.get('/movie/popular', { params: { page } });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMoviesGenre = async () => {
  try {
    const res = await tmdb.get('/genre/movie/list');
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchSimilarMovies = async (movieId: string) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/similar`);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMovieCredits = async (movieId: string) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/credits`);
    return res.data;
  } catch (err) {
    console.error(err);
    return { cast: [], crew: [] };
  }
};

export const fetchWatchProviders = async (movieId: string) => {
  try {
    const res = await tmdb.get(`/movie/${movieId}/watch/providers`);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const fetchTrendingMovies = async (timeWindow = 'week') => {
  try {
    const res = await tmdb.get(`/trending/movie/${timeWindow}`);
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchTopRatedMovies = async (page = 1) => {
  try {
    const res = await tmdb.get('/movie/top_rated', { params: { page } });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const res = await tmdb.get('/movie/now_playing', { params: { page } });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number, page = 1) => {
  try {
    const res = await tmdb.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        include_adult: false,
        page,
      },
    });
    return res.data.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};
