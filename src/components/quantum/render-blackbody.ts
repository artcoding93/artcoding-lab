// BlackbodyExplorer의 그래프·수치 생성 (서버 첫 렌더링과 브라우저 갱신이 같은 함수를 쓴다).
// 계산은 src/lib/quantum/blackbody.ts (SI 단위)에서 하고, 여기서는 표시 단위로 바꿔 그리기만 한다.
import {
  NM,
  planckRadiance,
  rayleighJeansRadiance,
  toDisplayRadiance,
  wienPeakWavelength,
} from '../../lib/quantum/blackbody';
import { axesMarkup, createScale, fmt, type PlotScale } from '../../lib/plot/svg';

export type BlackbodyView = 'linear' | 'log';

export const BLACKBODY_VIEW = { width: 520, height: 330 };
const PADDING = { top: 14, right: 26, bottom: 46, left: 64 };

/** 선형 보기: 파장 100~3000 nm, 세로축은 온도마다 플랑크 최대값에 맞춘다 */
export const LINEAR_RANGE = { min: 100, max: 3000 };
/** 로그 보기: 파장 100 nm~100 μm, 세로축 10⁻⁷~10⁶ kW·sr⁻¹·m⁻²·nm⁻¹ (모든 온도에서 같은 범위) */
export const LOG_RANGE = { xMin: 2, xMax: 5, yMin: -7, yMax: 6 };

/** 비교용 파장 [nm]: 짧은 파장과 긴 파장 */
export const SHORT_COMPARE_NM = 300;
export const LONG_COMPARE_NM = 100_000;

const SAMPLES = 320;

/** 표시 단위(kW·sr⁻¹·m⁻²·nm⁻¹)의 복사휘도 */
export const planckDisplay = (nm: number, T: number) => toDisplayRadiance(planckRadiance(nm * NM, T));
export const rjDisplay = (nm: number, T: number) => toDisplayRadiance(rayleighJeansRadiance(nm * NM, T));

export function blackbodyState(T: number) {
  const peakNm = wienPeakWavelength(T) / NM;
  return {
    peakNm,
    peakValue: planckDisplay(peakNm, T),
    /** 레일리–진스 ÷ 플랑크 (같은 파장) */
    shortRatio: rjDisplay(SHORT_COMPARE_NM, T) / planckDisplay(SHORT_COMPARE_NM, T),
    longRatio: rjDisplay(LONG_COMPARE_NM, T) / planckDisplay(LONG_COMPARE_NM, T),
  };
}

/** 선형 보기의 세로축 최대값: 플랑크 최대값의 1.3배를 보기 좋은 수로 올림 */
function linearYMax(peakValue: number): number {
  const raw = peakValue * 1.3;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((s) => s * power).find((s) => s >= raw) ?? 10 * power;
  return step;
}

/** 점 목록 → path (화면 밖 값은 그림 영역 근처로 제한하고 clipPath로 자른다) */
function pathOf(points: [number, number][]): string {
  return points
    .map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)},${fmt(Math.max(-1e4, Math.min(1e4, y)))}`)
    .join('');
}

const sup = (n: number) => `10<tspan dy="-0.45em" font-size="0.75em">${n}</tspan>`;
const wavelengthLabel = (exp: number) => ({ 2: '100 nm', 3: '1 μm', 4: '10 μm', 5: '100 μm' })[exp] ?? `10^${exp} nm`;

/** SVG 내부 마크업 */
export function blackbodySvg(T: number, view: BlackbodyView, clipId: string): string {
  const { peakNm, peakValue } = blackbodyState(T);
  const out: string[] = [];
  let sx: (nm: number) => number;
  let sy: (value: number) => number;
  let left: number, right: number, top: number, bottom: number;

  if (view === 'linear') {
    const yMax = linearYMax(peakValue);
    const scale: PlotScale = createScale({
      ...BLACKBODY_VIEW,
      padding: PADDING,
      xMin: LINEAR_RANGE.min,
      xMax: LINEAR_RANGE.max,
      yMin: 0,
      yMax,
    });
    ({ left, right, top, bottom } = scale);
    sx = scale.sx;
    sy = scale.sy;
    out.push(axesMarkup(scale, { xTarget: 6, yTarget: 5 }));
  } else {
    const { xMin, xMax, yMin, yMax } = LOG_RANGE;
    left = PADDING.left;
    right = BLACKBODY_VIEW.width - PADDING.right;
    top = PADDING.top;
    bottom = BLACKBODY_VIEW.height - PADDING.bottom;
    sx = (nm) => left + ((Math.log10(nm) - xMin) / (xMax - xMin)) * (right - left);
    // 0(지수 항 넘침으로 사라진 값)은 그림 아래로 보낸다
    sy = (v) => (v > 0 ? bottom - ((Math.log10(v) - yMin) / (yMax - yMin)) * (bottom - top) : bottom + 1e3);
    for (let e = xMin; e <= xMax; e++) {
      const px = fmt(sx(10 ** e));
      out.push(`<line class="plot-grid" x1="${px}" x2="${px}" y1="${fmt(top)}" y2="${fmt(bottom)}"/>`);
      // 마지막 눈금은 오른쪽 끝에 맞춰 좁은 화면에서도 잘리지 않게 한다
      out.push(`<text class="plot-tick" x="${px}" y="${fmt(bottom + 16)}" text-anchor="${e === xMax ? 'end' : 'middle'}">${wavelengthLabel(e)}</text>`);
    }
    for (let e = yMin + 1; e <= yMax; e += 2) {
      const py = fmt(sy(10 ** e));
      out.push(`<line class="plot-grid" x1="${fmt(left)}" x2="${fmt(right)}" y1="${py}" y2="${py}"/>`);
      out.push(`<text class="plot-tick" x="${fmt(left - 6)}" y="${py}" dy="0.32em" text-anchor="end">${sup(e)}</text>`);
    }
    out.push(`<rect class="plot-frame" x="${fmt(left)}" y="${fmt(top)}" width="${fmt(right - left)}" height="${fmt(bottom - top)}"/>`);
  }

  out.push(
    `<defs><clipPath id="${clipId}"><rect x="${fmt(left)}" y="${fmt(top)}" width="${fmt(right - left)}" height="${fmt(bottom - top)}"/></clipPath></defs>`,
  );

  // 곡선 표본 파장 (선형 보기는 균등, 로그 보기는 로그 균등)
  const lambdas: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    lambdas.push(
      view === 'linear'
        ? LINEAR_RANGE.min + (LINEAR_RANGE.max - LINEAR_RANGE.min) * t
        : 10 ** (LOG_RANGE.xMin + (LOG_RANGE.xMax - LOG_RANGE.xMin) * t),
    );
  }
  const rj = pathOf(lambdas.map((nm) => [sx(nm), sy(rjDisplay(nm, T))]));
  const planck = pathOf(lambdas.map((nm) => [sx(nm), sy(planckDisplay(nm, T))]));

  // 빈의 변위 법칙: 최대 복사 파장
  const px = sx(peakNm);
  out.push(`<line class="bb-peak" x1="${fmt(px)}" x2="${fmt(px)}" y1="${fmt(top)}" y2="${fmt(bottom)}"/>`);
  out.push(`<g clip-path="url(#${clipId})"><path class="bb-rj" d="${rj}"/><path class="bb-planck" d="${planck}"/></g>`);
  out.push(`<circle class="bb-peak-dot" cx="${fmt(px)}" cy="${fmt(sy(peakValue))}" r="4.5"/>`);
  const peakLabelRight = px < (left + right) / 2;
  out.push(
    `<text class="plot-label bb-peak-label" x="${fmt(px + (peakLabelRight ? 7 : -7))}" y="${fmt(Math.max(top + 14, sy(peakValue) - 10))}" text-anchor="${peakLabelRight ? 'start' : 'end'}">λ<tspan dy="0.3em" font-size="0.75em">max</tspan><tspan dy="-0.3em"> ≈ ${Math.round(peakNm)} nm</tspan></text>`,
  );

  // 선형 보기: 레일리–진스 곡선이 위로 벗어나는 위치에 '계속 증가' 표시
  if (view === 'linear') {
    const yMaxValue = linearYMax(peakValue);
    // RJ(λ) = yMax인 파장: λ = (2ckT / yMax)^(1/4)
    const crossNm = (rjDisplay(1, T) / yMaxValue) ** 0.25;
    if (crossNm > LINEAR_RANGE.min && crossNm < LINEAR_RANGE.max) {
      const cx = sx(crossNm);
      out.push(`<path class="bb-rj-arrow" d="M${fmt(cx)},${fmt(top + 30)}L${fmt(cx)},${fmt(top + 6)}M${fmt(cx - 4)},${fmt(top + 12)}L${fmt(cx)},${fmt(top + 6)}L${fmt(cx + 4)},${fmt(top + 12)}"/>`);
      out.push(`<text class="plot-label bb-rj-label" x="${fmt(cx + 8)}" y="${fmt(top + 22)}">레일리–진스: 계속 증가</text>`);
    }
  }

  // 축 제목
  out.push(`<text class="plot-label bb-axis" x="${fmt((left + right) / 2)}" y="${fmt(BLACKBODY_VIEW.height - 6)}" text-anchor="middle">파장 λ (${view === 'linear' ? 'nm' : '로그 눈금'})</text>`);
  out.push(
    `<text class="plot-label bb-axis" transform="translate(14 ${fmt((top + bottom) / 2)}) rotate(-90)" text-anchor="middle">B<tspan dy="0.3em" font-size="0.75em">λ</tspan><tspan dy="-0.3em"> (kW·sr⁻¹·m⁻²·nm⁻¹${view === 'log' ? ', 로그' : ''})</tspan></text>`,
  );
  return out.join('');
}

/** 화면 낭독기용 설명 */
export function blackbodyDescription(T: number, view: BlackbodyView): string {
  const { peakNm, shortRatio, longRatio } = blackbodyState(T);
  return (
    `온도 ${T} K에서 플랑크 법칙과 레일리–진스 법칙의 파장별 분광 복사휘도를 ${view === 'linear' ? '선형' : '양쪽 로그'} 눈금으로 비교한 그래프. ` +
    `플랑크 곡선은 약 ${Math.round(peakNm)} nm에서 최대가 된다. ` +
    `${SHORT_COMPARE_NM} nm에서 레일리–진스 값은 플랑크 값의 ${formatRatio(shortRatio)}배이고, 100 μm에서는 ${formatRatio(longRatio)}배로 거의 같다.`
  );
}

/** 표시용 숫자 형식 */
export function formatRatio(r: number): string {
  if (!Number.isFinite(r)) return '∞';
  if (r >= 1e4) {
    const [m, e] = r.toExponential(1).split('e');
    const superscript = String(Number(e)).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
    return `${m} × 10${superscript}`;
  }
  return r >= 100 ? Math.round(r).toLocaleString('en-US') : r.toFixed(3);
}
export const formatRadiance = (v: number) => (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2));
