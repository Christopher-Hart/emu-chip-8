import { useCallback, useEffect, useState } from "react";

export type chip_8_keyboard = {
  [key: string]: boolean;
  0x0: boolean;
  0x1: boolean;
  0x2: boolean;
  0x3: boolean;
  0x4: boolean;
  0x5: boolean;
  0x6: boolean;
  0x7: boolean;
  0x8: boolean;
  0x9: boolean;
  0xa: boolean;
  0xb: boolean;
  0xc: boolean;
  0xd: boolean;
  0xe: boolean;
  0xf: boolean;
};

type Hash = {
  [key: string]: number;
};

const keyMap: Hash = {
  1: 0x1,
  2: 0x2,
  3: 0x3,
  4: 0xC,
  q: 0x4,
  w: 0x5,
  e: 0x6,
  r: 0xD,
  a: 0x7,
  s: 0x8,
  d: 0x9,
  f: 0xE,
  z: 0xA,
  x: 0x0,
  c: 0xB,
  v: 0xF,
};

export function useKeyboard() {
  const [keys, setKeys] = useState<chip_8_keyboard>({
    0x1: false,
    0x2: false,
    0x3: false,
    0xC: false,
    0x4: false,
    0x5: false,
    0x6: false,
    0xD: false,
    0x7: false,
    0x8: false,
    0x9: false,
    0xE: false,
    0xA: false,
    0x0: false,
    0xB: false,
    0xF: false,
  });

  function forceUp() {
    setKeys({
      0x1: false,
      0x2: false,
      0x3: false,
      0xC: false,
      0x4: false,
      0x5: false,
      0x6: false,
      0xD: false,
      0x7: false,
      0x8: false,
      0x9: false,
      0xE: false,
      0xA: false,
      0x0: false,
      0xB: false,
      0xF: false,
    })
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const action = keyMap[event.key];
    if (action) {
      setKeys((current) => {
        return { ...current, [action]: true };
      });
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const action = keyMap[event.key];
    if (action) {
      setKeys((current) => {
        return { ...current, [action]: false };
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown',handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown',handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  },[handleKeyDown, handleKeyUp])

  return {keys,forceUp}
}
