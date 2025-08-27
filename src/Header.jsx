const Header = ({ setCurrentPage }) => {
  return (
    <div className='fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between gap-4 bg-gray-900 bg-opacity-80 py-4 pr-4 md:pr-8 lg:pr-16 backdrop-blur-md'>
      <a href='/Flipper/' className='flex' title='Dashboard'>
        <img src='./docs/assets/flipper.png' width='64' />
      </a>
      <div className='flex flex-row items-center gap-4 md:gap-8 h-8'>
        <button title='catalog' onClick={() => setCurrentPage('catalog')}>
          Feed
        </button>
        <button title='search' onClick={() => setCurrentPage('search')}>
          Search
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  setCurrentPage: () => {},
};

export default Header;
