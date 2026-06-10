import { useCallback, useEffect, useState } from 'react';

function getColumns(width) {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 640) return 4;
  return 3;
}

export default function useArrowNavigation(items, handleSelect) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [columns, setColumns] = useState(() => getColumns(window.innerWidth));

  useEffect(() => {
    const handleResize = () => setColumns(getColumns(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!items.length) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      if (e.key === 'Enter' || e.key === ' ') {
        if (selectedIndex != null && items[selectedIndex]) {
          e.preventDefault();
          handleSelect(items[selectedIndex], 'confirm');
        }
        return;
      }

      const moves = {
        ArrowDown: (i) => Math.min(i + columns, items.length - 1),
        ArrowUp: (i) => Math.max(i - columns, 0),
        ArrowLeft: (i) => Math.max(i - 1, 0),
        ArrowRight: (i) => Math.min(i + 1, items.length - 1),
      };
      const move = moves[e.key];
      if (!move) return;

      e.preventDefault();
      const next = move(selectedIndex ?? 0);
      setSelectedIndex(next);
      handleSelect(items[next]);
    },
    [columns, items, handleSelect, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return selectedIndex;
}
