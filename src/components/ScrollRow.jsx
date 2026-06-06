import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ScrollRow = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [fade, setFade] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const left = scrollLeft > 0;
    const right = scrollLeft + clientWidth < scrollWidth - 1;
    setFade((prev) =>
      prev.left === left && prev.right === right ? prev : { left, right }
    );
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, children]);

  const scrollByPage = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className='relative'>
      <div
        ref={ref}
        onScroll={update}
        className={`flex gap-4 overflow-x-auto no-scrollbar ${className}`}
      >
        {children}
      </div>

      <button
        type='button'
        onClick={() => scrollByPage(-1)}
        aria-label='Scroll left'
        tabIndex={fade.left ? 0 : -1}
        className={`group absolute inset-y-0 left-0 flex w-14 items-center justify-center bg-gradient-to-r from-gray-900 to-transparent transition-opacity duration-200 ${
          fade.left ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className='flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition group-hover:bg-black/80'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.5}
            stroke='currentColor'
            className='h-5 w-5'
            aria-hidden
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 19.5 8.25 12l7.5-7.5'
            />
          </svg>
        </span>
      </button>

      <button
        type='button'
        onClick={() => scrollByPage(1)}
        aria-label='Scroll right'
        tabIndex={fade.right ? 0 : -1}
        className={`group absolute inset-y-0 right-0 flex w-14 items-center justify-center bg-gradient-to-l from-gray-900 to-transparent transition-opacity duration-200 ${
          fade.right ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <span className='flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition group-hover:bg-black/80'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.5}
            stroke='currentColor'
            className='h-5 w-5'
            aria-hidden
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='m8.25 4.5 7.5 7.5-7.5 7.5'
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

ScrollRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ScrollRow;
