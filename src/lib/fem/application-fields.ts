// FEM 제1강 그림 2(적용 분야 개념도)에 쓰는 해석해 모델과 SVG 도형 생성 (빌드 시점에만 실행).
// 그림은 FEM 계산 결과가 아니라, 잘 알려진 해석해로 각 분야의 대표 물리량 분포를 그린 개념도이다.
//
// - 구조역학: 끝에 집중하중 P를 받는 외팔보(오일러–베르누이 보), 처짐 v(x)/v_tip = (x/L)²(3 − x/L)/2
// - 열전달: 직사각형 판의 정상상태 열전도(라플라스 방정식), 윗변 T₁·나머지 세 변 T₀, 푸리에 급수해
// - 전자기학: 같은 크기의 양·음 점전하 한 쌍(전기 쌍극자)이 만드는 전위 φ ∝ 1/r₊ − 1/r₋ 와 전기장선
// - 유체역학: 균일 흐름 속 원기둥 주위의 비점성·비압축성 퍼텐셜 유동, 유선 함수 ψ = U(r − a²/r)sinθ

export type Point = [number, number];

/** 사각 격자 위의 스칼라장 (x, y는 물리 좌표, values[j][i]는 (xs[i], ys[j])의 값) */
export interface ScalarGrid {
  xs: number[];
  ys: number[];
  values: number[][];
}

export function sampleGrid(
  f: (x: number, y: number) => number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  nx: number,
  ny: number,
): ScalarGrid {
  const xs = Array.from({ length: nx + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / nx);
  const ys = Array.from({ length: ny + 1 }, (_, j) => yMin + ((yMax - yMin) * j) / ny);
  return { xs, ys, values: ys.map((y) => xs.map((x) => f(x, y))) };
}

// ── 해석해 모델 ─────────────────────────────────────────────

/** 외팔보 끝 집중하중의 처짐, 끝단 처짐으로 정규화 (0 ≤ s = x/L ≤ 1) */
export const cantileverDeflection = (s: number) => (s * s * (3 - s)) / 2;

/**
 * 직사각형 판 [0, W] × [0, H]의 정상상태 온도, θ = (T − T₀)/(T₁ − T₀).
 * 윗변(y = H)이 T₁, 나머지 세 변이 T₀일 때의 푸리에 급수해:
 *   θ(x, y) = Σ_{n 홀수} 4/(nπ) · sin(nπx/W) · sinh(nπy/W) / sinh(nπH/W)
 */
export function plateTemperature(x: number, y: number, W: number, H: number, terms = 201): number {
  let sum = 0;
  for (let n = 1; n <= terms; n += 2) {
    const k = (n * Math.PI) / W;
    // sinh(ky)/sinh(kH)를 넘침 없이 계산: e^{k(y−H)} · (1 − e^{−2ky}) / (1 − e^{−2kH})
    const ratio = (Math.exp(k * (y - H)) * (1 - Math.exp(-2 * k * y))) / (1 - Math.exp(-2 * k * H));
    sum += (4 / (n * Math.PI)) * Math.sin(k * x) * ratio;
  }
  return sum;
}

/** 전기 쌍극자: (−d, 0)에 +q, (d, 0)에 −q. 상수를 뺀 전위 1/r₊ − 1/r₋ (r₊, r₋: 각 전하까지의 거리) */
export function dipolePotential(x: number, y: number, d: number): number {
  const rPlus = Math.hypot(x + d, y);
  const rMinus = Math.hypot(x - d, y);
  return 1 / rPlus - 1 / rMinus;
}

/** 쌍극자 전기장 E = −∇φ (상수를 뺀 값) */
export function dipoleField(x: number, y: number, d: number): Point {
  const field = (cx: number, sign: number): Point => {
    const dx = x - cx;
    const r3 = Math.hypot(dx, y) ** 3;
    return [(sign * dx) / r3, (sign * y) / r3];
  };
  const a = field(-d, 1);
  const b = field(d, -1);
  return [a[0] + b[0], a[1] + b[1]];
}

/** 원기둥(반지름 a) 주위 퍼텐셜 유동의 유선 함수 ψ/U. 원기둥 내부는 0으로 둔다(유체가 없음) */
export function cylinderStream(x: number, y: number, a: number): number {
  const r2 = x * x + y * y;
  if (r2 <= a * a) return 0;
  return y * (1 - (a * a) / r2);
}

/** 원기둥 주위 유속 크기 |u|/U = √(1 + a⁴/r⁴ − 2(a²/r²)cos2θ). 원기둥 내부는 NaN */
export function cylinderSpeed(x: number, y: number, a: number): number {
  const r2 = x * x + y * y;
  if (r2 <= a * a) return Number.NaN;
  const q = (a * a) / r2;
  const cos2t = (x * x - y * y) / r2;
  return Math.sqrt(Math.max(0, 1 + q * q - 2 * q * cos2t));
}

// ── 그림 생성 도구 ──────────────────────────────────────────

export interface View {
  sx: (x: number) => number;
  sy: (y: number) => number;
}

const f2 = (v: number) => (Math.round(v * 100) / 100).toString();

/** 값이 속한 구간 번호 (thresholds는 오름차순 경계값, 결과는 0 … thresholds.length) */
export function bandOf(value: number, thresholds: number[]): number {
  let k = 0;
  while (k < thresholds.length && value >= thresholds[k]) k++;
  return k;
}

/**
 * 구간별 채움: 격자 칸 중심값의 구간 번호가 같은 칸을 가로로 이어 붙여 <rect>로 만든다.
 * 반환값은 구간 번호 → rect 마크업 문자열 목록 (CSS 클래스로 색을 입힌다).
 */
export function bandRects(
  f: (x: number, y: number) => number,
  box: { xMin: number; xMax: number; yMin: number; yMax: number },
  nx: number,
  ny: number,
  thresholds: number[],
  view: View,
): Map<number, string[]> {
  const out = new Map<number, string[]>();
  const dx = (box.xMax - box.xMin) / nx;
  const dy = (box.yMax - box.yMin) / ny;
  for (let j = 0; j < ny; j++) {
    const y0 = box.yMin + j * dy;
    const yc = y0 + dy / 2;
    let runStart = 0;
    let runBand = -1;
    const flush = (end: number) => {
      if (runBand < 0) return;
      const x0 = view.sx(box.xMin + runStart * dx);
      const x1 = view.sx(box.xMin + end * dx);
      const top = Math.min(view.sy(y0), view.sy(y0 + dy));
      const h = Math.abs(view.sy(y0) - view.sy(y0 + dy));
      // 칸 사이에 가는 틈이 보이지 않도록 0.5px씩 겹친다
      const rect = `<rect x="${f2(x0)}" y="${f2(top - 0.25)}" width="${f2(x1 - x0 + 0.5)}" height="${f2(h + 0.5)}"/>`;
      if (!out.has(runBand)) out.set(runBand, []);
      out.get(runBand)!.push(rect);
    };
    for (let i = 0; i < nx; i++) {
      const value = f(box.xMin + (i + 0.5) * dx, yc);
      const band = Number.isFinite(value) ? bandOf(value, thresholds) : -1;
      if (band !== runBand) {
        flush(i);
        runStart = i;
        runBand = band;
      }
    }
    flush(nx);
  }
  return out;
}

/** 등치선 (marching squares). 지정한 높이 level의 선분들을 path의 d 문자열로 반환한다 */
export function contourPath(grid: ScalarGrid, level: number, view: View): string {
  const { xs, ys, values } = grid;
  const parts: string[] = [];
  const lerp = (p: Point, q: Point, vp: number, vq: number): Point => {
    const t = (level - vp) / (vq - vp);
    return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
  };
  for (let j = 0; j < ys.length - 1; j++) {
    for (let i = 0; i < xs.length - 1; i++) {
      const corners: Point[] = [
        [xs[i], ys[j]],
        [xs[i + 1], ys[j]],
        [xs[i + 1], ys[j + 1]],
        [xs[i], ys[j + 1]],
      ];
      const v = [values[j][i], values[j][i + 1], values[j + 1][i + 1], values[j + 1][i]];
      if (v.some((value) => !Number.isFinite(value))) continue;
      // 네 변 중 등치선이 지나는 변의 교점
      const crossings: Point[] = [];
      for (let e = 0; e < 4; e++) {
        const a = v[e];
        const b = v[(e + 1) % 4];
        if ((a < level && b >= level) || (a >= level && b < level)) {
          crossings.push(lerp(corners[e], corners[(e + 1) % 4], a, b));
        }
      }
      if (crossings.length === 2) {
        parts.push(`M${f2(view.sx(crossings[0][0]))},${f2(view.sy(crossings[0][1]))}L${f2(view.sx(crossings[1][0]))},${f2(view.sy(crossings[1][1]))}`);
      } else if (crossings.length === 4) {
        // 안장점 칸: 칸 중심값이 꼭짓점 0과 같은 쪽이면 0–2 대각선이 이어져 있으므로
        // 꼭짓점 1과 3을 각각 잘라 내는 선분을 만든다
        const center = (v[0] + v[1] + v[2] + v[3]) / 4;
        const [p0, p1, p2, p3] = crossings;
        const pairs: [Point, Point][] = (center >= level) === (v[0] >= level) ? [[p0, p1], [p2, p3]] : [[p0, p3], [p1, p2]];
        for (const [p, q] of pairs) {
          parts.push(`M${f2(view.sx(p[0]))},${f2(view.sy(p[1]))}L${f2(view.sx(q[0]))},${f2(view.sy(q[1]))}`);
        }
      }
    }
  }
  return parts.join('');
}

/**
 * 쌍극자 전기장선: +q 주위의 시작점에서 전기장 방향으로 따라간다(4차 룽게–쿠타, 고정 보폭).
 * −q에 가까워지거나 영역을 벗어나거나 최대 단계에 이르면 멈춘다.
 */
export function dipoleFieldLine(
  start: Point,
  d: number,
  box: { xMin: number; xMax: number; yMin: number; yMax: number },
  step = 0.01,
  maxSteps = 3000,
): Point[] {
  const dir = (p: Point): Point => {
    const [ex, ey] = dipoleField(p[0], p[1], d);
    const n = Math.hypot(ex, ey) || 1;
    return [ex / n, ey / n];
  };
  const pts: Point[] = [start];
  let p = start;
  for (let s = 0; s < maxSteps; s++) {
    const k1 = dir(p);
    const k2 = dir([p[0] + (step / 2) * k1[0], p[1] + (step / 2) * k1[1]]);
    const k3 = dir([p[0] + (step / 2) * k2[0], p[1] + (step / 2) * k2[1]]);
    const k4 = dir([p[0] + step * k3[0], p[1] + step * k3[1]]);
    p = [p[0] + (step / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), p[1] + (step / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1])];
    pts.push(p);
    if (Math.hypot(p[0] - d, p[1]) < 0.06) break;
    if (p[0] < box.xMin || p[0] > box.xMax || p[1] < box.yMin || p[1] > box.yMax) break;
  }
  return pts;
}

/** 점 목록 → path d (영역 밖 점은 그림의 clipPath가 잘라 낸다) */
export function polylinePath(pts: Point[], view: View): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'}${f2(view.sx(p[0]))},${f2(view.sy(p[1]))}`).join('');
}

/** 선 위의 비율 t 위치에 진행 방향을 가리키는 작은 화살촉 */
export function arrowHead(pts: Point[], t: number, view: View, size = 5): string {
  const screen = pts.map((p): Point => [view.sx(p[0]), view.sy(p[1])]);
  // 화면 길이 기준으로 위치를 찾는다
  const lengths = [0];
  for (let i = 1; i < screen.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(screen[i][0] - screen[i - 1][0], screen[i][1] - screen[i - 1][1]));
  }
  const target = lengths.at(-1)! * t;
  let i = 1;
  while (i < screen.length - 1 && lengths[i] < target) i++;
  const [x0, y0] = screen[i - 1];
  const [x1, y1] = screen[i];
  const ang = Math.atan2(y1 - y0, x1 - x0);
  const tip: Point = [x1, y1];
  const left: Point = [x1 - size * Math.cos(ang - 0.45), y1 - size * Math.sin(ang - 0.45)];
  const right: Point = [x1 - size * Math.cos(ang + 0.45), y1 - size * Math.sin(ang + 0.45)];
  return `M${f2(tip[0])},${f2(tip[1])}L${f2(left[0])},${f2(left[1])}L${f2(right[0])},${f2(right[1])}Z`;
}
