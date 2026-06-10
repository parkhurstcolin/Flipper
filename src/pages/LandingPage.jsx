import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMovieTeaser, fetchPopularMovies } from "../api/tmdb";
import TeaserPlayer from "../components/TeaserPlayer";

const PLAY_RADIUS = 6; // sliding window of mounted, playing videos; active slide is the middle
const FETCH_RADIUS = 11; // wider centered window where teaser keys are prefetched
const SCROLL_MS = 650; // wheel-driven slide animation duration
const UNLOCK_DELAY_MS = 150; // cooldown after a slide lands before the next flick registers

const LandingPage = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesRef = useRef([]);
  const sectionRefs = useRef([]);
  const containerRef = useRef(null);
  const pageRef = useRef(1);
  const loadingMoviesRef = useRef(false);
  const fetchedTeasers = useRef(new Set());
  const animatingRef = useRef(false);
  const targetIndexRef = useRef(0);
  const lastWheelRef = useRef({ time: 0, delta: 0 });

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
    if (slides.length > 0 && activeIndex >= slides.length - FETCH_RADIUS) {
      loadMovies();
    }
  }, [activeIndex, slides.length, loadMovies]);

  useEffect(() => {
    const all = slidesRef.current;
    const first = Math.max(0, activeIndex - FETCH_RADIUS);
    const last = activeIndex + FETCH_RADIUS;
    for (let i = first; i <= last && i < all.length; i++) {
      const slide = all[i];
      if (!slide || fetchedTeasers.current.has(slide.movie.id)) continue;
      const { id } = slide.movie;
      fetchedTeasers.current.add(id);
      fetchMovieTeaser(id)
        .then((teasers) => {
          const videoKey = teasers.length ? teasers[0].key : null;
          setSlides((prev) =>
            prev.map((s) => (s.movie.id === id ? { ...s, videoKey } : s)),
          );
        })
        .catch(() => fetchedTeasers.current.delete(id));
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (!animatingRef.current) targetIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let unlockTimer;
    let rafId;
    const settle = () => {
      animatingRef.current = false;
    };

    const onScrollEnd = () => {
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(settle, UNLOCK_DELAY_MS);
    };

    const animateTo = (top) => {
      cancelAnimationFrame(rafId);
      el.style.scrollSnapType = "none";
      const from = el.scrollTop;
      const change = top - from;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / SCROLL_MS, 1);
        el.scrollTop = from + change * (1 - Math.pow(1 - t, 3));
        if (t < 1) rafId = requestAnimationFrame(step);
        else el.style.scrollSnapType = "";
      };
      rafId = requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      e.preventDefault();

      const now = performance.now();
      const { time, delta } = lastWheelRef.current;
      lastWheelRef.current = { time: now, delta: e.deltaY };

      if (animatingRef.current) return;
      if (Math.abs(e.deltaY) < 4) return;

      const isNewGesture =
        now - time > 150 || Math.abs(e.deltaY) > Math.abs(delta) + 1;
      if (!isNewGesture) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.min(
        Math.max(targetIndexRef.current + dir, 0),
        slidesRef.current.length - 1,
      );
      if (next === targetIndexRef.current) return;

      targetIndexRef.current = next;
      animatingRef.current = true;
      const section = sectionRefs.current[next];
      animateTo(section ? section.offsetTop : next * el.clientHeight);
      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(settle, SCROLL_MS + 400);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scrollend", onScrollEnd);
      clearTimeout(unlockTimer);
      cancelAnimationFrame(rafId);
      el.style.scrollSnapType = "";
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.6 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  return (
    <div
      ref={containerRef}
      className="no-scrollbar h-screen w-full overflow-y-scroll snap-y snap-mandatory"
    >
      {slides.map(({ movie, videoKey }, i) => {
        const inWindow = Math.abs(i - activeIndex) <= PLAY_RADIUS;

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
