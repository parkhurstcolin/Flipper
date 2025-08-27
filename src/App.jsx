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

  return (
    <div className='min-h-screen bg-gray-900 text-white font-bold'>
      <Header setCurrentPage={setCurrentPage} />
      <div className='pt-20 px-4'>{renderPage()}</div>
    </div>
  );
};

export default App;
