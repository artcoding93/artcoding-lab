// SVG 그래프 공통 도구 (빌드 시점·브라우저 공용). 좌표 변환과 곡선 path 생성만 담당한다.

export interface PlotFrame {
  /** viewBox 크기 */
  width: number;
  height: number;
  /** 그림 영역 여백 (축 라벨 공간) */
  padding: { top: number; right: number; bottom: number; left: number };
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlotScale {
  frame: PlotFrame;
  /** 데이터 좌표 → SVG 좌표 */
  sx: (x: number) => number;
  sy: (y: number) => number;
  /** 그림 영역 (SVG 좌표) */
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function createScale(frame: PlotFrame): PlotScale {
  const { width, height, padding, xMin, xMax, yMin, yMax } = frame;
  const left = padding.left;
  const right = width - padding.right;
  const top = padding.top;
  const bottom = height - padding.bottom;
  return {
    frame,
    left,
    right,
    top,
    bottom,
    sx: (x) => left + ((x - xMin) / (xMax - xMin)) * (right - left),
    sy: (y) => bottom - ((y - yMin) / (yMax - yMin)) * (bottom - top),
  };
}

/** 소수점 둘째 자리까지 반올림한 SVG 좌표 문자열 */
export const fmt = (v: number) => (Math.round(v * 100) / 100).toString();

/** f를 [xMin, xMax]에서 samples개 구간으로 나누어 그린 path의 d 속성. 그림 영역 밖 값은 clipPath로 자른다. */
export function curvePath(f: (x: number) => number, scale: PlotScale, samples = 240): string {
  const { xMin, xMax } = scale.frame;
  const parts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    // 아주 큰 값은 SVG 좌표가 과도해지지 않도록 그림 영역 근처로 제한한다 (clipPath가 잘라 낸다)
    const py = Math.max(-1e4, Math.min(1e4, scale.sy(y)));
    parts.push(`${parts.length ? 'L' : 'M'}${fmt(scale.sx(x))},${fmt(py)}`);
  }
  return parts.join('');
}

/** 눈금 라벨: 아주 작은 값은 지수 표기, 그 밖에는 유효숫자 6자리 */
export function tickLabel(v: number): string {
  if (v === 0) return '0';
  if (Math.abs(v) < 1e-3) return v.toExponential(1);
  return Number(v.toPrecision(6)).toString();
}

export interface AxesOptions {
  /** x 눈금 라벨 표시 여부 (확대 보기 등에서 라벨이 길어지면 끈다) */
  xLabels?: boolean;
  xTarget?: number;
  yTarget?: number;
}

/** 격자·눈금·x축(y = 0) SVG 문자열. 클래스: plot-grid, plot-axis, plot-tick */
export function axesMarkup(scale: PlotScale, options: AxesOptions = {}): string {
  const { xLabels = true, xTarget = 6, yTarget = 5 } = options;
  const { xMin, xMax, yMin, yMax } = scale.frame;
  const { left, right, top, bottom, sx, sy } = scale;
  const out: string[] = [];
  for (const x of niceTicks(xMin, xMax, xTarget)) {
    const px = fmt(sx(x));
    out.push(`<line class="plot-grid" x1="${px}" x2="${px}" y1="${fmt(top)}" y2="${fmt(bottom)}"/>`);
    if (xLabels) out.push(`<text class="plot-tick" x="${px}" y="${fmt(bottom + 16)}" text-anchor="middle">${tickLabel(x)}</text>`);
  }
  for (const y of niceTicks(yMin, yMax, yTarget)) {
    const py = fmt(sy(y));
    out.push(`<line class="plot-grid" x1="${fmt(left)}" x2="${fmt(right)}" y1="${py}" y2="${py}"/>`);
    out.push(`<text class="plot-tick" x="${fmt(left - 6)}" y="${py}" dy="0.32em" text-anchor="end">${tickLabel(y)}</text>`);
  }
  out.push(`<rect class="plot-frame" x="${fmt(left)}" y="${fmt(top)}" width="${fmt(right - left)}" height="${fmt(bottom - top)}"/>`);
  if (yMin <= 0 && yMax >= 0) {
    const py = fmt(sy(0));
    out.push(`<line class="plot-axis" x1="${fmt(left)}" x2="${fmt(right)}" y1="${py}" y2="${py}"/>`);
  }
  return out.join('');
}

/** [min, max] 범위의 보기 좋은 눈금 값 (1·2·5 × 10^k 간격) */
export function niceTicks(min: number, max: number, target = 5): number[] {
  const span = max - min;
  if (!(span > 0)) return [min];
  const raw = span / target;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((s) => s * power).find((s) => s >= raw) ?? 10 * power;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-9; v += step) {
    ticks.push(Math.abs(v) < step * 1e-9 ? 0 : Number(v.toPrecision(12)));
  }
  return ticks;
}
