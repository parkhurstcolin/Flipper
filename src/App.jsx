import { useState } from 'react';
import Header from './Header';
import CatalogPage from './pages/CatalogPage';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('catalog');
  function renderPage() {
    if (currentPage.startsWith('movie/')) {
      const movieId = currentPage.split('/');
      return (
        <MovieDetailPage
          movieId={movieId[1]}
          openMovieDetails={setCurrentPage}
        />
      );
    } else if (currentPage === 'search') {
      return <SearchPage openMovieDetails={setCurrentPage} />;
    } else {
      return <CatalogPage openMovieDetails={setCurrentPage} />;
    }
  }
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      <Header setCurrentPage={setCurrentPage} />
      <div className='pt-20 px-4'>{renderPage()}</div>
    </div>
  );
};

export default App;
