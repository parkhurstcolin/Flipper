import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieTeaser, fetchPopularMovies } from "../api/tmdb";
import TeaserPlayer from "../components/TeaserPlayer";

const SET_SIZE = 3; // keep 3 sets in memory (prev / current / next) = 9 videos

const LandingPage = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesRef = useRef([]);
  const sectionRefs = useRef([]);
  const pageRef = useRef(1);
  const loadingMoviesRef = useRef(false);
  const fetchedTeasers = useRef(new Set());

  const currentSet = Math.floor(activeIndex / SET_SIZE);

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

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    if (slides.length > 0 && activeIndex >= slides.length - SET_SIZE * 2) {
      loadMovies();
    }
  }, [activeIndex, slides.length, loadMovies]);

  useEffect(() => {
    const all = slidesRef.current;
    const first = Math.max(0, (currentSet - 1) * SET_SIZE);
    const last = (currentSet + 2) * SET_SIZE - 1;
    for (let i = first; i <= last && i < all.length; i++) {
      const slide = all[i];
      if (!slide || fetchedTeasers.current.has(slide.movie.id)) continue;
      const { id } = slide.movie;
      fetchedTeasers.current.add(id);
      fetchMovieTeaser(id)
        .then((teasers) => {
          const videoKey = teasers.length ? teasers[0].key : null;
          setSlides((prev) =>
            prev.map((s) => (s.movie.id === id ? { ...s, videoKey } : s))
          );
        })
        .catch(() => fetchedTeasers.current.delete(id));
    }
  }, [currentSet, slides.length]);

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
      {slides.map(({ movie, videoKey }, i) => {
        const inWindow = Math.abs(Math.floor(i / SET_SIZE) - currentSet) <= 1;
        return (
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

            {inWindow && videoKey && (
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
        );
      })}
    </div>
  );
};

export default LandingPage;
