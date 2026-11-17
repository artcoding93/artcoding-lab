// RiemannSumExplorer의 그래프·수치 생성 (서버 첫 렌더링과 브라우저 갱신이 같은 함수를 쓴다).
import { getFunction } from '../../lib/numerical/functions';
import { rightRiemannSum, type RiemannResult } from '../../lib/numerical/riemann';
import { axesMarkup, createScale, curvePath, fmt, type PlotFrame } from '../../lib/plot/svg';

export interface RiemannConfig {
  fn: string;
  a: number;
  b: number;
  /** 정확한 면적 (그래프 아래 실제 적분값) */
  exact: number;
  clipId: string;
}

export const RIEMANN_VIEW = { width: 480, height: 300 };

function frameFor(config: RiemannConfig): PlotFrame {
  const f = getFunction(config.fn).f;
  // 구간 위의 함수 최대값으로 y 범위를 정한다 (이 강의의 함수는 구간에서 0 이상)
  let yMax = 0;
  for (let i = 0; i <= 100; i++) yMax = Math.max(yMax, f(config.a + ((config.b - config.a) * i) / 100));
  return {
    ...RIEMANN_VIEW,
    padding: { top: 14, right: 14, bottom: 30, left: 44 },
    xMin: config.a,
    xMax: config.b,
    yMin: 0,
    yMax: yMax * 1.1 || 1,
  };
}

export function riemannState(config: RiemannConfig, n: number) {
  const result: RiemannResult = rightRiemannSum(getFunction(config.fn).f, config.a, config.b, n);
  return { result, error: result.area - config.exact };
}

/** SVG 내부 마크업 (축 · 직사각형 · 곡선) */
export function riemannSvg(config: RiemannConfig, n: number): string {
  const f = getFunction(config.fn).f;
  const scale = createScale(frameFor(config));
  const { result } = riemannState(config, n);
  const y0 = scale.sy(0);
  const rects = result.rects
    .map((r) => {
      const x = scale.sx(r.x0);
      const top = scale.sy(r.height);
      return `<rect class="riemann-rect" x="${fmt(x)}" y="${fmt(top)}" width="${fmt(scale.sx(r.x1) - x)}" height="${fmt(y0 - top)}"/>`;
    })
    .join('');
  // 높이를 재는 오른쪽 끝점 (점이 너무 촘촘하면 생략)
  const dots =
    n <= 20
      ? result.rects.map((r) => `<circle class="riemann-dot" cx="${fmt(scale.sx(r.x1))}" cy="${fmt(scale.sy(r.height))}" r="3"/>`).join('')
      : '';
  // 곡선 위쪽 왼편 빈 공간에 함수식 라벨
  const labelX = config.a + (config.b - config.a) * 0.22;
  const labelY = scale.frame.yMax * 0.72;
  return (
    `<defs><clipPath id="${config.clipId}"><rect x="${fmt(scale.left)}" y="${fmt(scale.top)}" width="${fmt(scale.right - scale.left)}" height="${fmt(scale.bottom - scale.top)}"/></clipPath></defs>` +
    axesMarkup(scale) +
    rects +
    `<path class="plot-curve" clip-path="url(#${config.clipId})" d="${curvePath(f, scale)}"/>` +
    dots +
    `<text class="plot-label" x="${fmt(scale.sx(labelX))}" y="${fmt(scale.sy(labelY))}" text-anchor="middle">y = ${getFunction(config.fn).label}</text>`
  );
}

/** 표시용 숫자 형식 */
export const formatArea = (v: number) => v.toFixed(8);
export const formatSigned = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(8)}`;
