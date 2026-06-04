import { useState } from 'react';
import Header from './Header';
import CatalogPage from './pages/CatalogPage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import LandingPage from './pages/LandingPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing'); // default to landing
  const [loading, setLoading] = useState(false);

  function renderPage() {
    if (currentPage.startsWith('movie/')) {
      const movieId = currentPage.split('/');
      return (
        <MovieDetailPage
          movieId={movieId[1]}
          openMovieDetails={setCurrentPage}
          loading={loading}
          setLoading={setLoading}
        />
      );
    } else if (currentPage === 'search') {
      return (
        <SearchPage
          openMovieDetails={setCurrentPage}
          loading={loading}
          setLoading={setLoading}
        />
      );
    } else if (currentPage === 'catalog') {
      return (
        <CatalogPage
          openMovieDetails={setCurrentPage}
          loading={loading}
          setLoading={setLoading}
        />
      );
    } else {
      return <LandingPage loading={loading} setLoading={setLoading} />; // added return
    }
  }

  // The LandingPage is a full-viewport fullpage.js scroller and must own the
  // entire screen from y=0. The other pages need top padding to clear the
  // fixed header. Applying that padding to the landing page offsets fullpage's
  // sections, which makes every scroll rest between two movies.
  const isLanding = !(
    currentPage.startsWith('movie/') ||
    currentPage === 'search' ||
    currentPage === 'catalog'
  );

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <Header setCurrentPage={setCurrentPage} />
      <div className={isLanding ? '' : 'pt-20 px-4'}>{renderPage()}</div>
    </div>
  );
};

export default App;
