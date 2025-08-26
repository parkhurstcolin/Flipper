const Header = () => {
  function accountVerification() {
    window.location.href = '/account'
  }

  return (
    <div className='fixed top-0 right-0 left-0 z-60 flex w-full items-center justify-between gap-4 bg-transparent py-4 pr-4 md:pr-8 lg:pr-16'>
      <a href='/' className='flex' title='Dashboard'>
        <img src='src/images/flipper.png' width='200' height='40'></img>
      </a>
      <div className='flex flex-row items-center gap-4 md:gap-8 h-8'>
        <a href='/feed' title='Feed'>
          <button>Feed</button>
        </a>
        <a href='/search' title='Search'>
          <button>Search</button>
        </a>
        <button onClick={accountVerification} title='Account'>Account</button>
      </div>
    </div>
  );
};

export default Header;
