import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import FullPage from "@fullpage/react-fullpage";
import { fetchMovieTeaser, fetchPopularMovies } from "../api/tmdb";
import TeaserPlayer from "../components/TeaserPlayer";

const LandingPage = ({ loading, setLoading }) => {
  const [moviesList, setMoviesList] = useState([]);
  const [teasersList, setTeasersList] = useState([]);
  const playerRefs = useRef([]); // <-- useRef for persistent array

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const popularList = await fetchPopularMovies(1);
      setMoviesList(popularList);

      const allTeasers = await Promise.all(
        popularList.map(async (movie) => {
          const teasers = await fetchMovieTeaser(movie.id);
          return teasers.length ? teasers[0].key : null;
        })
      );
      setTeasersList(allTeasers);

      setLoading(false);
    }

    fetchData();
  }, [setLoading]);

  if (loading || moviesList.length === 0 || teasersList.length !== moviesList.length) {
    return <p className="text-white mt-20 text-center">Loading...</p>;
  }

  return (
    <FullPage
      scrollingSpeed={700}
      loopTop
      loopBottom
      navigation
      controlArrows={false}
      afterLoad={(origin, destination) => {
        const index = destination.index;
        const player = playerRefs.current[index];
        if (player && player.playVideo) player.playVideo();
      }}
      render={() => (
        <>
          {moviesList.map((movie, i) => (
            <div
              className="section h-screen relative flex flex-col justify-center items-center"
              key={movie.id}
            >
              <div className="absolute inset-0 z-0 pointer-events-none">
                {teasersList[i] && (
                  <TeaserPlayer
                    videoKey={teasersList[i]}
                    onReady={(player) => (playerRefs.current[i] = player)}
                  />
                )}
              </div>

              <div className="relative z-10 text-center mt-4 max-w-2xl px-4">
                <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
                <p className="mt-2 text-gray-300">{movie.overview}</p>
              </div>
            </div>
          ))}
        </>
      )}
    />
  );
};

LandingPage.propTypes = {
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
};

export default LandingPage;
