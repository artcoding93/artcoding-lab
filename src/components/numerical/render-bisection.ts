// BisectionExplorer의 그래프·수치 생성 (서버 첫 렌더링과 브라우저 갱신이 같은 함수를 쓴다).
import { bisectionSteps, type BisectionStep } from '../../lib/numerical/bisection';
import { getFunction } from '../../lib/numerical/functions';
import { axesMarkup, createScale, curvePath, fmt, type PlotFrame } from '../../lib/plot/svg';

export interface BisectionConfig {
  fn: string;
  a: number;
  b: number;
  iterations: number;
  /** 전체 보기의 그래프 범위 */
  view: { xMin: number; xMax: number; yMin: number; yMax: number };
  clipId: string;
}

export type BisectionView = 'full' | 'zoom';

export const BISECTION_VIEW = { width: 480, height: 320 };
const PADDING = { top: 14, right: 14, bottom: 50, left: 58 };

/** 기준값(참값)으로 쓸 근: 같은 이분법을 배정밀도 한계까지 반복한 결과 */
const REFERENCE_ITERATIONS = 60;

export function bisectionData(config: BisectionConfig) {
  const f = getFunction(config.fn).f;
  const steps = bisectionSteps(f, config.a, config.b, config.iterations);
  const reference = bisectionSteps(f, config.a, config.b, REFERENCE_ITERATIONS).at(-1)!;
  return { steps, root: reference.m };
}

function frameFor(config: BisectionConfig, step: BisectionStep, view: BisectionView): PlotFrame {
  if (view === 'full') return { ...BISECTION_VIEW, padding: PADDING, ...config.view };
  // 확대 보기: 현재 구간 [a, b] 양쪽에 구간 폭의 30%씩 여유를 둔다
  const f = getFunction(config.fn).f;
  const w = step.b - step.a;
  const xMin = step.a - 0.3 * w;
  const xMax = step.b + 0.3 * w;
  let lo = 0;
  let hi = 0;
  for (let i = 0; i <= 60; i++) {
    const y = f(xMin + ((xMax - xMin) * i) / 60);
    lo = Math.min(lo, y);
    hi = Math.max(hi, y);
  }
  const pad = (hi - lo) * 0.12 || 1;
  return { ...BISECTION_VIEW, padding: PADDING, xMin, xMax, yMin: lo - pad, yMax: hi + pad };
}

/** SVG 내부 마크업 (축 · 현재 구간 · 곡선 · 끝점 · 중점 · 기준 근) */
export function bisectionSvg(config: BisectionConfig, step: BisectionStep, root: number, view: BisectionView): string {
  const f = getFunction(config.fn).f;
  const frame = frameFor(config, step, view);
  const scale = createScale(frame);
  const { sx, sy, top, bottom, left, right } = scale;
  const out: string[] = [];
  out.push(
    `<defs><clipPath id="${config.clipId}"><rect x="${fmt(left)}" y="${fmt(top)}" width="${fmt(right - left)}" height="${fmt(bottom - top)}"/></clipPath></defs>`,
  );
  out.push(axesMarkup(scale, { xLabels: view === 'full' }));

  // 현재 구간 [a, b]
  const xa = sx(step.a);
  const xb = sx(step.b);
  out.push(`<rect class="bis-interval" x="${fmt(xa)}" y="${fmt(top)}" width="${fmt(Math.max(xb - xa, 1.5))}" height="${fmt(bottom - top)}"/>`);
  out.push(`<line class="bis-edge" x1="${fmt(xa)}" x2="${fmt(xa)}" y1="${fmt(top)}" y2="${fmt(bottom)}"/>`);
  out.push(`<line class="bis-edge" x1="${fmt(xb)}" x2="${fmt(xb)}" y1="${fmt(top)}" y2="${fmt(bottom)}"/>`);

  out.push(`<path class="plot-curve" clip-path="url(#${config.clipId})" d="${curvePath(f, scale)}"/>`);

  // x축 위치 (보이지 않으면 아래쪽 경계)
  const axisY = frame.yMin <= 0 && frame.yMax >= 0 ? sy(0) : bottom;

  // 기준 근 x* (참값)
  if (root >= frame.xMin && root <= frame.xMax) {
    const xr = sx(root);
    out.push(`<path class="bis-root" d="M${fmt(xr)},${fmt(axisY - 6)}L${fmt(xr + 6)},${fmt(axisY)}L${fmt(xr)},${fmt(axisY + 6)}L${fmt(xr - 6)},${fmt(axisY)}Z"/>`);
  }

  // 끝점 (a, f(a)), (b, f(b)): 함수값의 부호로 색 구분
  for (const x of [step.a, step.b]) {
    const y = f(x);
    if (y >= frame.yMin && y <= frame.yMax) {
      out.push(`<circle class="${y < 0 ? 'bis-neg' : 'bis-pos'}" cx="${fmt(sx(x))}" cy="${fmt(sy(y))}" r="4.5"/>`);
    }
  }

  // 중점 m과 f(m)
  const xm = sx(step.m);
  const ym = sy(step.fm);
  out.push(`<line class="bis-mid-line" x1="${fmt(xm)}" x2="${fmt(xm)}" y1="${fmt(axisY)}" y2="${fmt(ym)}"/>`);
  out.push(`<circle class="bis-mid-axis" cx="${fmt(xm)}" cy="${fmt(axisY)}" r="3.5"/>`);
  out.push(`<circle class="bis-mid" cx="${fmt(xm)}" cy="${fmt(ym)}" r="6"/>`);

  // 아래쪽 라벨: a, m, b (화면에서 너무 가까우면 하나로 합친다)
  const labelY = fmt(bottom + (view === 'full' ? 40 : 24));
  if (xb - xa < 34) {
    out.push(`<text class="plot-label" x="${fmt(xm)}" y="${labelY}" text-anchor="middle">a·m·b</text>`);
  } else {
    out.push(`<text class="plot-label" x="${fmt(xa)}" y="${labelY}" text-anchor="middle">a</text>`);
    out.push(`<text class="plot-label bis-mid-label" x="${fmt(xm)}" y="${labelY}" text-anchor="middle">m</text>`);
    out.push(`<text class="plot-label" x="${fmt(xb)}" y="${labelY}" text-anchor="middle">b</text>`);
  }
  return out.join('');
}

/** 표시용 숫자 형식 */
export const formatX = (v: number) => v.toFixed(10);
export const formatF = (v: number) => (v !== 0 && Math.abs(v) < 1e-3 ? v.toExponential(3) : v.toFixed(6));
export const formatE = (v: number) => v.toExponential(3);

/** 이 단계의 구간 선택 설명 (Python 코드의 if fa * fm < 0 분기와 같다) */
export function decisionText(f: (x: number) => number, step: BisectionStep): string {
  if (step.fm === 0) return 'f(m) = 0 → m이 정확한 근';
  const keepLeft = f(step.a) * step.fm < 0;
  return keepLeft
    ? `f(a)·f(m) < 0 → 근은 [a, m]에 있음 → b = m`
    : `f(a)·f(m) > 0 → 근은 [m, b]에 있음 → a = m`;
}

/** 확대 보기의 x 범위 설명 */
export function rangeText(config: BisectionConfig, step: BisectionStep, view: BisectionView): string {
  const frame = frameFor(config, step, view);
  return view === 'full'
    ? `전체 보기: x ∈ [${frame.xMin}, ${frame.xMax}]`
    : `확대 보기: x ∈ [${formatX(frame.xMin)}, ${formatX(frame.xMax)}] (현재 구간 폭의 1.6배)`;
}
