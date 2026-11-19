// PhotoelectricExplorer의 그림·수치 생성 (서버 첫 렌더링과 브라우저 갱신이 같은 함수를 쓴다).
// 교육용 단순화: 광자 하나가 흡수되면 전자 하나가 방출되는 경우만 그린다.
import { photoelectric, frequencyFromEnergy, type PhotoelectricResult } from '../../lib/quantum/photoelectric';
import { fmt } from '../../lib/plot/svg';

export interface PhotoelectricState {
  /** 광자 하나의 에너지 hf [eV] */
  energy: number;
  /** 일함수 φ [eV] */
  workFunction: number;
  /** 빛의 세기 (그림에 그리는 광자 수, 1~5) */
  intensity: number;
}

export const PHOTO_VIEW = { width: 520, height: 270 };
/** 에너지 그림의 세로축 최대값 [eV] (슬라이더 최대값과 같다) */
export const ENERGY_AXIS_MAX = 5;

export function photoResult(state: PhotoelectricState): PhotoelectricResult {
  return photoelectric(state.energy, state.workFunction);
}

const f1 = (v: number) => v.toFixed(1);
/** SVG 안의 K_max (아래첨자). 뒤따르는 문구는 기준선을 되돌린 tspan 안에 넣는다 */
const kMaxSvg = (rest = '') =>
  `K<tspan dy="0.3em" font-size="0.75em">max</tspan>${rest ? `<tspan dy="-0.3em">${rest}</tspan>` : ''}`;

/** 파동 모양 화살표(광자): 시작점에서 끝점까지 사인파로 진동하는 선 */
function wavyArrow(x0: number, y0: number, x1: number, y1: number): string {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const ux = (x1 - x0) / len;
  const uy = (y1 - y0) / len;
  const nx = -uy;
  const ny = ux;
  const pts: string[] = [];
  const steps = 48;
  const bodyLen = len - 9;
  for (let i = 0; i <= steps; i++) {
    const s = (bodyLen * i) / steps;
    const a = 4.5 * Math.sin((s / 11) * 2 * Math.PI);
    pts.push(`${i ? 'L' : 'M'}${fmt(x0 + ux * s + nx * a)},${fmt(y0 + uy * s + ny * a)}`);
  }
  const hx = x0 + ux * bodyLen;
  const hy = y0 + uy * bodyLen;
  const head = `M${fmt(x1)},${fmt(y1)}L${fmt(hx + nx * 5)},${fmt(hy + ny * 5)}L${fmt(hx - nx * 5)},${fmt(hy - ny * 5)}Z`;
  return `<path class="pe-photon" d="${pts.join('')}"/><path class="pe-photon-head" d="${head}"/>`;
}

export function photoSvg(state: PhotoelectricState): string {
  const result = photoResult(state);
  const out: string[] = [];

  // ── 왼쪽: 금속 표면과 광자·전자 ─────────────────────
  const surfaceY = 182;
  const sceneLeft = 14;
  const sceneRight = 300;
  out.push(`<rect class="pe-metal" x="${sceneLeft}" y="${surfaceY}" width="${sceneRight - sceneLeft}" height="62" rx="4"/>`);
  out.push(`<text class="pe-text pe-metal-label" x="${(sceneLeft + sceneRight) / 2}" y="${surfaceY + 26}" text-anchor="middle">금속</text>`);
  out.push(`<text class="pe-small pe-metal-label" x="${(sceneLeft + sceneRight) / 2}" y="${surfaceY + 46}" text-anchor="middle">일함수 φ = ${f1(state.workFunction)} eV</text>`);

  const n = Math.max(1, Math.min(5, Math.round(state.intensity)));
  const spacing = 46;
  const firstX = (sceneLeft + sceneRight) / 2 - ((n - 1) * spacing) / 2 + 14;
  for (let i = 0; i < n; i++) {
    const hitX = firstX + i * spacing;
    out.push(wavyArrow(hitX - 58, 26, hitX, surfaceY - 3));
    if (result.regime === 'emission') {
      // 방출 전자: 화살표 길이가 K_max에 비례 (모든 전자에 같은 최대값을 그린다)
      const len = 18 + (result.kMax! / ENERGY_AXIS_MAX) * 95;
      const ex = hitX + 12;
      const ey = surfaceY - 14;
      const tx = ex + len * 0.42;
      const ty = ey - len * 0.9;
      out.push(`<line class="pe-electron-path" x1="${fmt(ex)}" y1="${fmt(ey)}" x2="${fmt(tx)}" y2="${fmt(ty)}"/>`);
      out.push(`<path class="pe-electron-head" d="M${fmt(tx)},${fmt(ty)}L${fmt(tx - 8)},${fmt(ty + 4)}L${fmt(tx - 2)},${fmt(ty + 9)}Z"/>`);
      out.push(`<circle class="pe-electron" cx="${fmt(ex)}" cy="${fmt(ey)}" r="7"/><text class="pe-e" x="${fmt(ex)}" y="${fmt(ey + 3.5)}" text-anchor="middle">e⁻</text>`);
    } else if (result.regime === 'threshold') {
      // 문턱 조건: 전자가 표면에서 겨우 떨어져 나오는 경계 (운동에너지 0)
      const ex = hitX + 12;
      const ey = surfaceY - 9;
      out.push(`<circle class="pe-electron" cx="${fmt(ex)}" cy="${fmt(ey)}" r="7"/><text class="pe-e" x="${fmt(ex)}" y="${fmt(ey + 3.5)}" text-anchor="middle">e⁻</text>`);
    }
  }
  out.push(`<text class="pe-small" x="${sceneLeft}" y="16">광자 ${n}개 · hf = ${f1(state.energy)} eV</text>`);
  const status =
    result.regime === 'none'
      ? '전자 방출 없음 (hf < φ)'
      : result.regime === 'threshold'
        ? `문턱 조건 (hf = φ): ${kMaxSvg(' = 0')}`
        : `전자 방출: ${kMaxSvg(` = ${f1(result.kMax!)} eV`)}`;
  out.push(`<text class="pe-status pe-status--${result.regime}" x="${sceneLeft}" y="${surfaceY + 82}">${status}</text>`);

  // ── 오른쪽: 에너지 막대 (hf = φ + K_max) ────────────
  const axisX = 362;
  const barX = 392;
  const barW = 54;
  const top = 34;
  const bottom = surfaceY + 62;
  const ey = (e: number) => bottom - (e / ENERGY_AXIS_MAX) * (bottom - top);
  out.push(`<line class="pe-axis" x1="${axisX}" x2="${axisX}" y1="${top - 6}" y2="${bottom}"/>`);
  for (let e = 0; e <= ENERGY_AXIS_MAX; e++) {
    out.push(`<line class="pe-axis" x1="${axisX - 4}" x2="${axisX}" y1="${fmt(ey(e))}" y2="${fmt(ey(e))}"/>`);
    out.push(`<text class="pe-tick" x="${axisX - 8}" y="${fmt(ey(e) + 4)}" text-anchor="end">${e}</text>`);
  }
  out.push(`<text class="pe-small" x="${axisX - 26}" y="${top - 14}">에너지 (eV)</text>`);
  // 광자 에너지 막대: 일함수까지의 부분과 남는 부분(K_max)을 나눠 칠한다
  const used = Math.min(state.energy, state.workFunction);
  out.push(`<rect class="pe-bar-used" x="${barX}" y="${fmt(ey(used))}" width="${barW}" height="${fmt(ey(0) - ey(used))}"/>`);
  if (result.regime === 'emission') {
    out.push(`<rect class="pe-bar-kmax" x="${barX}" y="${fmt(ey(state.energy))}" width="${barW}" height="${fmt(ey(state.workFunction) - ey(state.energy))}"/>`);
    const mid = (ey(state.energy) + ey(state.workFunction)) / 2;
    out.push(`<text class="pe-small pe-kmax-label" x="${barX + barW + 6}" y="${fmt(mid + 4)}">${kMaxSvg()}</text>`);
  }
  out.push(`<rect class="pe-bar-frame" x="${barX}" y="${fmt(ey(state.energy))}" width="${barW}" height="${fmt(ey(0) - ey(state.energy))}"/>`);
  out.push(`<text class="pe-small" x="${barX + barW / 2}" y="${fmt(ey(state.energy) - 6)}" text-anchor="middle">hf</text>`);
  // 일함수 선
  out.push(`<line class="pe-phi" x1="${axisX}" x2="${barX + barW + 46}" y1="${fmt(ey(state.workFunction))}" y2="${fmt(ey(state.workFunction))}"/>`);
  out.push(`<text class="pe-small pe-phi-label" x="${barX + barW + 6}" y="${fmt(ey(state.workFunction) + (result.regime === 'emission' ? 14 : -5))}">φ</text>`);
  return out.join('');
}

export function photoDescription(state: PhotoelectricState): string {
  const r = photoResult(state);
  const base = `광자 에너지 ${f1(state.energy)} eV, 일함수 ${f1(state.workFunction)} eV, 광자 ${Math.round(state.intensity)}개. `;
  if (r.regime === 'none') return base + '광자 하나의 에너지가 일함수보다 작아 전자가 방출되지 않는다.';
  if (r.regime === 'threshold') return base + '광자 에너지가 일함수와 같은 문턱 조건으로, 최대 운동에너지는 0이다.';
  return base + `전자가 방출되며 최대 운동에너지는 ${f1(r.kMax!)} eV이다.`;
}

/** 결과 문구 (HTML: 고정 문구와 숫자만 들어간다) */
export function resultHtml(r: PhotoelectricResult): string {
  if (r.regime === 'none') return '전자 방출 없음';
  if (r.regime === 'threshold') return '문턱 조건 · K<sub>max</sub> = 0 eV';
  return `전자 방출 · K<sub>max</sub> = ${f1(r.kMax!)} eV`;
}

/** 방출 전자 수 (교육용 단순화: 광자 하나 → 전자 하나) */
export function electronCount(state: PhotoelectricState): number {
  return photoResult(state).regime === 'none' ? 0 : Math.round(state.intensity);
}

/** 진동수 표시: 예) 7.25 × 10¹⁴ Hz */
export function formatFrequency(energyEv: number): string {
  const f = frequencyFromEnergy(energyEv);
  const exp = Math.floor(Math.log10(f));
  const superscript = String(exp).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
  return `${(f / 10 ** exp).toFixed(2)} × 10${superscript} Hz`;
}
