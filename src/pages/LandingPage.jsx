import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieTeaser, fetchPopularMovies } from "../api/tmdb";
import TeaserPlayer from "../components/TeaserPlayer";

const BATCH = 5; // trailers fetched per batch
const LIVE = 5; // keep players mounted/live this many slides on either side

// videoKey on a slide: undefined = not fetched yet, null = no teaser, string = key
const LandingPage = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesRef = useRef([]); // current slides, for the async fetch queue
  const sectionRefs = useRef([]);
  const pageRef = useRef(1); // next popular page to fetch
  const cursorRef = useRef(0); // next slide index whose trailer needs fetching
  const targetRef = useRef(0); // fetch trailer keys up to this index (monotonic)
  const loadingMoviesRef = useRef(false);
  const fetchingRef = useRef(false);

  // Append the next page of popular movies (no trailers yet).
  const loadMovies = useCallback(async () => {
    if (loadingMoviesRef.current) return;
    loadingMoviesRef.current = true;
    try {
      const movies = await fetchPopularMovies(pageRef.current);
      setSlides((prev) => {
        const ids = new Set(prev.map((s) => s.movie.id));
        const fresh = movies
          .filter((m) => !ids.has(m.id))
          .map((movie) => ({ movie, videoKey: undefined }));
        const next = [...prev, ...fresh];
        slidesRef.current = next;
        return next;
      });
      pageRef.current += 1;
    } finally {
      loadingMoviesRef.current = false;
    }
  }, []);

  // Forward-running fetch queue: pull trailer keys in batches of BATCH until the
  // cursor is FETCH_AHEAD past the active slide. The cursor and target only move
  // forward, so scrolling back never refetches anything.
  const fillTrailerQueue = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      while (cursorRef.current < targetRef.current) {
        const start = cursorRef.current;
        if (start + BATCH > slidesRef.current.length) {
          await loadMovies();
          if (start + BATCH > slidesRef.current.length) break; // out of movies
        }
        const batch = slidesRef.current.slice(start, start + BATCH);
        if (batch.length === 0) break;

        const results = await Promise.all(
          batch.map(async ({ movie }) => {
            const teasers = await fetchMovieTeaser(movie.id);
            return [movie.id, teasers.length ? teasers[0].key : null];
          })
        );
        const keyById = new Map(results);
        setSlides((prev) => {
          const next = prev.map((s) =>
            keyById.has(s.movie.id)
              ? { ...s, videoKey: keyById.get(s.movie.id) }
              : s
          );
          slidesRef.current = next;
          return next;
        });
        cursorRef.current = start + batch.length;
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [loadMovies]);

  // Block-based topping up: keep the active slide's block of 5 plus the next
  // block fetched (~5–10 ahead). Crossing into a new block bumps the target by
  // one block, which pulls the next batch of 5. The target only grows, so
  // scrolling up never triggers fetching.
  useEffect(() => {
    const target = (Math.floor(activeIndex / BATCH) + 2) * BATCH;
    if (target > targetRef.current) targetRef.current = target;
    fillTrailerQueue();
  }, [activeIndex, fillTrailerQueue]);

  // Track the in-view slide via IntersectionObserver.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.6 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  return (
    <div className="feed h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {slides.map(({ movie, videoKey }, i) => (
        <section
          key={movie.id}
          data-index={i}
          ref={(el) => (sectionRefs.current[i] = el)}
          className="relative h-screen w-full snap-start snap-always overflow-hidden"
        >
          {/* Persistent base: the movie's backdrop, shown from the moment the
              slide exists. Falls back to a dark fill if there's no artwork. */}
          <div
            className="absolute inset-0 z-0 bg-gray-900 bg-cover bg-center"
            style={
              movie.backdrop_path
                ? {
                    backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                  }
                : undefined
            }
          />

          {/* Video overlay: keep players mounted/live for LIVE slides either side
              of the active one. It shows over the backdrop once its own video is
              playing (which has usually happened off-screen by the time you
              reach it). */}
          {Math.abs(i - activeIndex) <= LIVE && videoKey && (
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <TeaserPlayer videoKey={videoKey} />
            </div>
          )}

          {/* Scrim: darken the bottom so the caption stays readable */}
          <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 z-10 text-left max-w-2xl px-8 md:px-16 pb-16 md:pb-24">
            <h1 className="text-3xl md:text-4xl font-bold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              {movie.title}
            </h1>
            <p className="mt-2 text-gray-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
              {movie.overview}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default LandingPage;
