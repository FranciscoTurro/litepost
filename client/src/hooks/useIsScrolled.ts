import { useEffect, useState } from 'react';

export const useIsScrolled = (): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.pageYOffset > 700) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrolled;
};
