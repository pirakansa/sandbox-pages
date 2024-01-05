import { useLayoutEffect, useState } from 'react';
import UAParser from 'ua-parser-js';

const isMobile = () => {

  const ua = new UAParser();

  return 'mobile' === ua.getDevice().type;
};

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
