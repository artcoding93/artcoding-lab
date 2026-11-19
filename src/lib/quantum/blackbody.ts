// 흑체복사 계산 (빌드 시점·브라우저 공용). 모든 계산은 SI 단위로 한다.
//
// 플랑크 법칙:        B_λ(λ, T) = (2hc² / λ⁵) · 1 / (exp(hc / (λ k_B T)) − 1)
// 레일리–진스 법칙:   B_λ(λ, T) = 2c k_B T / λ⁴
// 빈의 변위 법칙:     λ_max = b / T  (플랑크 곡선이 최대가 되는 파장)
//
// B_λ는 파장당 분광 복사휘도이며 SI 단위는 W·sr⁻¹·m⁻³(= W·sr⁻¹·m⁻²·m⁻¹)이다.
// 그래프에는 kW·sr⁻¹·m⁻²·nm⁻¹로 바꿔 표시한다(toDisplayRadiance).

/** 플랑크 상수 h [J·s] (SI 정의값) */
export const PLANCK_H = 6.62607015e-34;
/** 진공에서의 빛의 속력 c [m/s] (SI 정의값) */
export const LIGHT_C = 299792458;
/** 볼츠만 상수 k_B [J/K] (SI 정의값) */
export const BOLTZMANN_K = 1.380649e-23;
/** 빈의 변위 상수 b [m·K] (CODATA 2018) */
export const WIEN_B = 2.897771955e-3;

/** 파장 1 nm [m] */
export const NM = 1e-9;

function assertInputs(wavelength: number, temperature: number) {
  if (!(wavelength > 0) || !Number.isFinite(wavelength)) throw new Error(`파장은 0보다 큰 유한한 값이어야 합니다: ${wavelength}`);
  if (!(temperature > 0) || !Number.isFinite(temperature)) throw new Error(`온도는 0보다 큰 유한한 값이어야 합니다: ${temperature}`);
}

/**
 * 플랑크 법칙의 파장당 분광 복사휘도 [W·sr⁻¹·m⁻³].
 * - 지수 항은 expm1로 계산해 긴 파장(x가 작을 때)의 정밀도 손실을 막는다.
 * - 짧은 파장에서 x가 매우 크면 expm1이 Infinity가 되어 결과는 0으로 수렴한다(NaN이 생기지 않음).
 */
export function planckRadiance(wavelength: number, temperature: number): number {
  assertInputs(wavelength, temperature);
  const x = (PLANCK_H * LIGHT_C) / (wavelength * BOLTZMANN_K * temperature);
  const prefactor = (2 * PLANCK_H * LIGHT_C * LIGHT_C) / wavelength ** 5;
  return prefactor / Math.expm1(x);
}

/** 레일리–진스 법칙의 파장당 분광 복사휘도 [W·sr⁻¹·m⁻³]. 파장이 짧아질수록 λ⁻⁴로 제한 없이 커진다. */
export function rayleighJeansRadiance(wavelength: number, temperature: number): number {
  assertInputs(wavelength, temperature);
  return (2 * LIGHT_C * BOLTZMANN_K * temperature) / wavelength ** 4;
}

/** 빈의 변위 법칙으로 구한 최대 복사 파장 [m] */
export function wienPeakWavelength(temperature: number): number {
  assertInputs(1, temperature);
  return WIEN_B / temperature;
}

/** W·sr⁻¹·m⁻³ → kW·sr⁻¹·m⁻²·nm⁻¹ (1 m⁻¹ = 10⁻⁹ nm⁻¹, 1 W = 10⁻³ kW) */
export const toDisplayRadiance = (siValue: number) => siValue * 1e-12;
