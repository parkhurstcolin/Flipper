import { useRef } from "react";
import PropTypes from "prop-types";
import Youtube from "react-youtube";

const TeaserPlayer = ({ videoKey, onReady }) => {
  const playerRef = useRef(null);

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
    },
  };

  return (
    <div className="w-full h-full">
      <Youtube
        videoId={videoKey}
        opts={opts}
        className="w-full h-full object-cover"
        onReady={(event) => {
          playerRef.current = event.target;
          if (onReady) onReady(event.target);
        }}
      />
    </div>
  );
};

TeaserPlayer.propTypes = {
  videoKey: PropTypes.string,
  onReady: PropTypes.any,
};

export default TeaserPlayer;
