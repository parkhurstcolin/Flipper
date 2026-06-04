import { useState } from "react";
import PropTypes from "prop-types";
import Youtube from "react-youtube";

const TeaserPlayer = ({ videoKey }) => {
  const [playing, setPlaying] = useState(false);

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 1, // muted autoplay is allowed; videos loop and never pause
      controls: 0,
      mute: 1,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      playlist: videoKey, // required for `loop` to work on a single video
      fs: 0, // no fullscreen button
      disablekb: 1, // ignore keyboard input (arrow keys drive the scroller)
      iv_load_policy: 3, // hide video annotations
      playsinline: 1,
    },
  };

  // Reveal the video once it actually starts playing (a frame is ready); until
  // then the slide's backdrop shows through. This is NOT tied to whether the
  // slide is the active one — a prefetched neighbour fades in off-screen, so by
  // the time you scroll to it the video is already on top (no backdrop flash).
  return (
    <div
      className={`teaser-bg transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
    >
      <Youtube
        videoId={videoKey}
        opts={opts}
        onPlay={() => setPlaying(true)}
      />
    </div>
  );
};

TeaserPlayer.propTypes = {
  videoKey: PropTypes.string,
};

export default TeaserPlayer;
