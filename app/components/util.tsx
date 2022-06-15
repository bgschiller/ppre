import { useEffect, useState } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

// Partially taken from: https://usehooks.com/useWindowSize/
export function useWindowSize(): WindowSize {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

// Taken from: https://github.com/bryc/code/blob/master/jshash/hashes/murmurhash3.js
// This is used to generate unique aria IDs. Do not use it for anything security related (use official APIs instead)
export function MurmurHash3(key: any, seed: number = 0): number {
  var k,
    p1 = 3432918353,
    p2 = 461845907,
    h = seed | 0;

  for (var i = 0, b = key.length & -4; i < b; i += 4) {
    k = (key[i + 3] << 24) | (key[i + 2] << 16) | (key[i + 1] << 8) | key[i];
    k = Math.imul(k, p1);
    k = (k << 15) | (k >>> 17);
    h ^= Math.imul(k, p2);
    h = (h << 13) | (h >>> 19);
    h = (Math.imul(h, 5) + 3864292196) | 0; // |0 = prevent float
  }

  k = 0;
  switch (key.length & 3) {
    case 3:
      k ^= key[i + 2] << 16;
    case 2:
      k ^= key[i + 1] << 8;
    case 1:
      k ^= key[i];
      k = Math.imul(k, p1);
      k = (k << 15) | (k >>> 17);
      h ^= Math.imul(k, p2);
  }

  h ^= key.length;

  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;

  return h >>> 0;
}
