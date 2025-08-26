import { useCallback, useEffect, useState } from 'react';

function getColumns(width) {
  if (width >= 1024) return 6;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
}
export default function useArrowNavigation(items, onSelect) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [columns, setColumns] = useState(getColumns(window.innerWidth));

  useEffect(() => {
    const handleResize = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const handleKeyDown = useCallback(
    (e) => {
      if (!items.length) return;
      setSelectedIndex((prev = 0) => {
        let newIndex = prev;
        if (e.key === 'Enter' || e.key === ' ') {
          if (prev != null && items[prev]) {
            onSelect(items[prev], 'confirm');
          }
        } else {
          if (e.key === 'ArrowDown') {
            newIndex = Math.min(prev + columns, items.length - 1);
          } else if (e.key === 'ArrowUp') {
            newIndex = Math.max(prev - columns, 0);
          } else if (e.key === 'ArrowLeft') {
            newIndex = Math.max(prev - 1, 0);
          } else if (e.key === 'ArrowRight') {
            newIndex = Math.min(prev + 1, items.length - 1);
          }

          onSelect(newIndex);
          return newIndex;
        }
      });
    },
    [columns, items, onSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return selectedIndex;
}
