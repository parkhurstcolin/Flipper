import { useState } from 'react';
import Header from './Header';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import LandingPage from './pages/LandingPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [previousPage, setPreviousPage] = useState('search');
  const [loading, setLoading] = useState(false);

  const navigate = (page) => {
    if (page.startsWith('movie/') && !currentPage.startsWith('movie/')) {
      setPreviousPage(currentPage === 'landing' ? 'search' : currentPage);
    }
    setCurrentPage(page);
  };

  function renderPage() {
    if (currentPage.startsWith('movie/')) {
      const movieId = currentPage.split('/');
      return (
        <MovieDetailPage
          movieId={movieId[1]}
          openMovieDetails={navigate}
          previousPage={previousPage}
          loading={loading}
          setLoading={setLoading}
        />
      );
    } else if (currentPage === 'search') {
      return <SearchPage openMovieDetails={navigate} />;
    } else {
      return <LandingPage />;
    }
  }

  const isPadded = currentPage === 'search';

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <Header currentPage={currentPage} setCurrentPage={navigate} />
      <div className={isPadded ? 'pt-28 px-4' : ''}>{renderPage()}</div>
    </div>
  );
};

export default App;
