import PropTypes from 'prop-types';

const Header = ({ currentPage, setCurrentPage }) => {
  const navClass = (page) =>
    `text-xl font-medium transition-colors duration-200 ease-out ${
      currentPage === page ? 'text-accent' : 'text-white hover:text-accent'
    }`;

  return (
    <header className='fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between gap-4 bg-gray-900/80 px-4 py-4 md:px-8 lg:px-16 backdrop-blur-md'>
      <button onClick={() => setCurrentPage('landing')} className='flex' title='Home'>
        <img
          src='https://raw.githubusercontent.com/parkhurstcolin/Flipper/refs/heads/main/docs/assets/flipper.png'
          alt='Flipper'
          width='96'
        />
      </button>
      <nav className='flex flex-row items-center gap-4 md:gap-8'>
        <button
          title='Feed'
          onClick={() => setCurrentPage('catalog')}
          className={navClass('catalog')}
        >
          Feed
        </button>
        <button
          title='Search'
          onClick={() => setCurrentPage('search')}
          className={navClass('search')}
        >
          Search
        </button>
      </nav>
    </header>
  );
};

Header.propTypes = {
  currentPage: PropTypes.string,
  setCurrentPage: PropTypes.func,
};

export default Header;
