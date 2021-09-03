import { useEffect, useRef } from 'react';

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    var id = null;
    if (delay !== null) {
      id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      clearInterval(id);
    }
  }, [delay]);
};
