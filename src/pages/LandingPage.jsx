import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieTeaser, fetchPopularMovies } from "../api/tmdb";
import TeaserPlayer from "../components/TeaserPlayer";

const BATCH = 5;
const LIVE = 5;

const LandingPage = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesRef = useRef([]);
  const sectionRefs = useRef([]);
  const pageRef = useRef(1);
  const cursorRef = useRef(0);
  const targetRef = useRef(0);
  const loadingMoviesRef = useRef(false);
  const fetchingRef = useRef(false);

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

  const fillTrailerQueue = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      while (cursorRef.current < targetRef.current) {
        const start = cursorRef.current;
        if (start + BATCH > slidesRef.current.length) {
          await loadMovies();
          if (start + BATCH > slidesRef.current.length) break;
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

  useEffect(() => {
    const target = (Math.floor(activeIndex / BATCH) + 2) * BATCH;
    if (target > targetRef.current) targetRef.current = target;
    fillTrailerQueue();
  }, [activeIndex, fillTrailerQueue]);

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
    <div className="no-scrollbar h-screen w-full overflow-y-scroll snap-y snap-mandatory">
      {slides.map(({ movie, videoKey }, i) => (
        <section
          key={movie.id}
          data-index={i}
          ref={(el) => (sectionRefs.current[i] = el)}
          className="relative h-screen w-full snap-start snap-always overflow-hidden"
        >
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

          {Math.abs(i - activeIndex) <= LIVE && videoKey && (
            <div className="absolute inset-0 z-[1] pointer-events-none">
              <TeaserPlayer videoKey={videoKey} />
            </div>
          )}

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
