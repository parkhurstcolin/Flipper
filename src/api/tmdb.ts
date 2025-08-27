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
      const fetchedMovie = await axios.request(options)
      return fetchedMovie.data;
  } catch (err) {
      throw new Error('Failed to find movie', err)
  }
}
export const searchMovies = () => {
 
}
export const fetchMovieTrailer = () => {

}
export const fetchPopularMovies = () => {

}
export const fetchMoviesGenre = () => {
  
}
export const fetchSimilarMovies = async (movieId: string) => {
  const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US`,
      headers,
    };
  try {
    const fetchedMovies = await axios.request(options)
    return fetchedMovies.data.results;
  } catch (err) {
    console.error(err)
  }
}
