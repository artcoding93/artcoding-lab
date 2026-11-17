// 오른쪽 끝점 직사각형 근사(Right Riemann Sum). 브라우저·빌드 공용 순수 함수.
//
//   R_N = h · Σ_{i=1}^{N} f(x_i),   h = (b − a) / N,   x_i = a + (b − a)·i / N
//
// [0, 1]에서는 x_i = i / N, h = 1 / N 이므로 강의의 식 R_N = (1/N) Σ (i/N)² 과 같다.

export interface RiemannRect {
  /** 직사각형 왼쪽·오른쪽 x (오른쪽 끝점 x_i에서 높이를 잰다) */
  x0: number;
  x1: number;
  /** 높이 f(x_i) */
  height: number;
}

export interface RiemannResult {
  n: number;
  width: number;
  rects: RiemannRect[];
  /** 근사 면적 R_N */
  area: number;
}

/** 직사각형 개수 상한 (브라우저 렌더링 보호) */
export const MAX_RIEMANN_RECTS = 1000;

/**
 * 구간 [a, b]를 n등분한 오른쪽 끝점 직사각형 근사.
 * - 예외: 잘못된 구간, n이 1~MAX_RIEMANN_RECTS 범위의 정수가 아님
 */
export function rightRiemannSum(f: (x: number) => number, a: number, b: number, n: number): RiemannResult {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !(a < b)) throw new Error(`직사각형 근사: 잘못된 구간 [${a}, ${b}]`);
  if (!Number.isInteger(n) || n < 1 || n > MAX_RIEMANN_RECTS) {
    throw new Error(`직사각형 근사: N은 1~${MAX_RIEMANN_RECTS} 사이의 정수여야 합니다 (${n})`);
  }
  const width = (b - a) / n;
  const rects: RiemannRect[] = [];
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    const x0 = a + ((b - a) * (i - 1)) / n;
    const x1 = a + ((b - a) * i) / n;
    const height = f(x1);
    sum += height;
    rects.push({ x0, x1, height });
  }
  return { n, width, rects, area: width * sum };
}
