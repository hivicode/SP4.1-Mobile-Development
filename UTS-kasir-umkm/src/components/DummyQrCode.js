import { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../theme/design';

const FINDER = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const ALIGNMENT_5 = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
];

function seededRand(seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (Math.imul(31, h) + seedStr.charCodeAt(i)) >>> 0;
  }
  return () => {
    h = Math.imul(48271, h) % 2147483647;
    return h / 2147483647;
  };
}

function inFinder(innerR, innerC, innerN) {
  if (innerR < 7 && innerC < 7) return true;
  if (innerR < 7 && innerC >= innerN - 7) return true;
  if (innerR >= innerN - 7 && innerC < 7) return true;
  return false;
}

function buildDummyMatrix(seedStr, quiet = 4, innerN = 33) {
  const N = innerN + quiet * 2;
  const m = Array.from({ length: N }, () => Array(N).fill(false));
  const Q = quiet;
  const rand = seededRand(seedStr || 'kasir_dummy');

  const set = (gr, gc, v) => {
    m[gr][gc] = v;
  };

  const placeFinder = (ir, ic) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (FINDER[r][c]) set(Q + ir + r, Q + ic + c, true);
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, innerN - 7);
  placeFinder(innerN - 7, 0);

  const reserved = Array.from({ length: N }, () => Array(N).fill(false));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (m[r][c]) reserved[r][c] = true;
    }
  }

  const markReserved = (r, c) => {
    reserved[r][c] = true;
  };

  const cross = Q + 8;
  if (!inFinder(8, 8, innerN)) {
    set(cross, cross, true);
    markReserved(cross, cross);
  }
  for (let ic = 9; ic < innerN - 8; ic++) {
    const gr = cross;
    const gc = Q + ic;
    if (!inFinder(8, ic, innerN)) {
      set(gr, gc, ic % 2 === 0);
      markReserved(gr, gc);
    }
  }
  for (let ir = 9; ir < innerN - 8; ir++) {
    const gr = Q + ir;
    const gc = cross;
    if (!inFinder(ir, 8, innerN)) {
      set(gr, gc, ir % 2 === 0);
      markReserved(gr, gc);
    }
  }

  const ar0 = innerN - 11;
  const ac0 = innerN - 11;
  for (let dr = 0; dr < 5; dr++) {
    for (let dc = 0; dc < 5; dc++) {
      if (!ALIGNMENT_5[dr][dc]) continue;
      const gr = Q + ar0 + dr;
      const gc = Q + ac0 + dc;
      if (!inFinder(ar0 + dr, ac0 + dc, innerN)) {
        set(gr, gc, true);
        markReserved(gr, gc);
      }
    }
  }

  for (let ir = 0; ir < innerN; ir++) {
    for (let ic = 0; ic < innerN; ic++) {
      if (inFinder(ir, ic, innerN)) continue;
      const gr = Q + ir;
      const gc = Q + ic;
      if (reserved[gr][gc]) continue;

      let p = 0.48;
      if (ir > 0 && m[Q + ir - 1][gc]) p += 0.12;
      if (ic > 0 && m[gr][Q + ic - 1]) p += 0.1;
      p = Math.min(0.72, p);
      if (rand() < p) {
        set(gr, gc, true);
      }
    }
  }

  return { m, N };
}

export default function DummyQrCode({
  size = 240,
  seed = '',
  backgroundColor = colors.white,
  moduleColor = '#0a0a0a',
}) {
  const { m, N } = useMemo(() => buildDummyMatrix(seed), [seed]);

  const cells = [];
  const gutter = 0.1;
  const moduleSize = 1 - gutter;
  const inset = gutter / 2;
  const cornerR = 0.2;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (m[r][c]) {
        cells.push(
          <Rect
            key={`${r}_${c}`}
            x={c + inset}
            y={r + inset}
            width={moduleSize}
            height={moduleSize}
            rx={cornerR}
            ry={cornerR}
            fill={moduleColor}
          />
        );
      }
    }
  }

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${N} ${N}`}
      accessibilityLabel="Contoh pola QR"
      accessibilityIgnoresInvertColors={true}
    >
      <Rect x={0} y={0} width={N} height={N} fill={backgroundColor} />
      {cells}
    </Svg>
  );
}
