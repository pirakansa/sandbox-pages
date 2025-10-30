// Utilities for responding to window size and device form factor.
import { useLayoutEffect, useState } from 'react';
import {UAParser} from 'ua-parser-js';

// Detect whether current device user agent reports as mobile.
const isMobile = () => {

  const ua = new UAParser();

  return 'mobile' === ua.getDevice().type;
};

// Track the current viewport dimensions via a React hook.
const useWindowSize = () => {

  const [size, setSize] = useState({
    width: 1920,
    height: 1080,
  });

  useLayoutEffect(() => {

    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
};

export { useWindowSize, isMobile };
