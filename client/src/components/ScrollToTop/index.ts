import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Scrolls to the top on navigation, or to the element a `#hash` names. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
