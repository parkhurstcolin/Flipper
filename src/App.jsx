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
      return <MovieDetailPage movieId={movieId[1]} />;
    } else if (currentPage === 'search') {
      return <SearchPage />;
    } else {
      return <CatalogPage openMovieDetails={setCurrentPage} />;
    }
  }
  return (
    <>
      <Header setCurrentPage={setCurrentPage} />
      {renderPage()}
    </>
  );
};

export default App;
