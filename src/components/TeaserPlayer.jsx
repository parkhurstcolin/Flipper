import { useState } from "react";
import PropTypes from "prop-types";
import Youtube from "react-youtube";

const TeaserPlayer = ({ videoKey }) => {
  const [playing, setPlaying] = useState(false);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: videoKey,
      fs: 0,
      disablekb: 1,
      iv_load_policy: 3,
      playsinline: 1,
    },
  };

  return (
    <div
      className={`teaser-bg transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      <Youtube videoId={videoKey} opts={opts} onPlay={() => setPlaying(true)} />
    </div>
  );
};

TeaserPlayer.propTypes = {
  videoKey: PropTypes.string,
};

export default TeaserPlayer;
