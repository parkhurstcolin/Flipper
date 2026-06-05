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

  return (
    <div className='relative'>
      <div
        ref={ref}
        onScroll={update}
        className={`flex gap-4 overflow-x-auto no-scrollbar ${className}`}
      >
        {children}
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-900 to-transparent transition-opacity duration-200 ${
          fade.left ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-900 to-transparent transition-opacity duration-200 ${
          fade.right ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

ScrollRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ScrollRow;
