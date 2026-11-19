// 광전효과 판정 (빌드 시점·브라우저 공용). 에너지 단위는 eV.
//
// 광자 하나의 에너지 E = hf, 금속의 일함수 φ, 방출 전자의 최대 운동에너지 K_max = hf − φ.
// - hf < φ : 단일 광자 과정에서 전자가 방출되지 않는다 (K_max를 0으로 표시하지 않는다)
// - hf = φ : 문턱 조건. 최대 운동에너지 0
// - hf > φ : 전자 방출, K_max = hf − φ
// 빛의 세기(단위 시간당 광자 수)는 방출 전자 수에 영향을 주지만 K_max를 바꾸지 않는다.
//
// 슬라이더 값은 0.1 eV 단위이므로, 부동소수점 오차를 피하기 위해 0.01 eV 단위 정수로 비교한다.

export type PhotoelectricRegime = 'none' | 'threshold' | 'emission';

export interface PhotoelectricResult {
  regime: PhotoelectricRegime;
  /** 방출 전자의 최대 운동에너지 [eV]. 방출이 없으면 null */
  kMax: number | null;
}

/** eV → J */
export const EV = 1.602176634e-19;
/** 플랑크 상수 [J·s] */
const PLANCK_H = 6.62607015e-34;

export function photoelectric(photonEnergyEv: number, workFunctionEv: number): PhotoelectricResult {
  if (!Number.isFinite(photonEnergyEv) || photonEnergyEv <= 0) throw new Error(`광자 에너지는 0보다 커야 합니다: ${photonEnergyEv}`);
  if (!Number.isFinite(workFunctionEv) || workFunctionEv <= 0) throw new Error(`일함수는 0보다 커야 합니다: ${workFunctionEv}`);
  const e = Math.round(photonEnergyEv * 100);
  const w = Math.round(workFunctionEv * 100);
  if (e < w) return { regime: 'none', kMax: null };
  if (e === w) return { regime: 'threshold', kMax: 0 };
  return { regime: 'emission', kMax: (e - w) / 100 };
}

/** 광자 에너지 [eV]에 해당하는 진동수 f = E / h [Hz] */
export const frequencyFromEnergy = (energyEv: number) => (energyEv * EV) / PLANCK_H;
