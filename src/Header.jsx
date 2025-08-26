const Header = ({ setCurrentPage }) => {
  return (
    <div className='fixed top-0 right-0 left-0 z-60 flex w-full items-center justify-between gap-4 bg-transparent py-4 pr-4 md:pr-8 lg:pr-16'>
      <a href='/' className='flex' title='Dashboard'>
        <img src='src/images/flipper.png' width='200' height='40'></img>
      </a>
      <div className='flex flex-row items-center gap-4 md:gap-8 h-8'>
        <button title='Catalog' onClick={() => setCurrentPage('catalog')}>
          Feed
        </button>
        <button title='Search' onClick={() => setCurrentPage('search')}>
          Search
        </button>
        <button title='Account' onClick={() => setCurrentPage('account')}>
          Account
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  setCurrentPage: () => {},
};

export default Header;
