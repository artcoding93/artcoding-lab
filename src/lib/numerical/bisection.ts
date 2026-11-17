// 이분법(Bisection Method)의 반복 단계를 계산한다. 브라우저·빌드 공용 순수 함수.
//
// 강의 Python 코드(public/code/numerical/fundamentals/introduction-bisection.py)와 같은 순서로 계산한다.
//   m = (a + b) / 2,  fm = f(m)
//   fa * fm < 0 이면 b = m,  아니면 a = m, fa = fm
//
// 단계의 정의: k번째 단계에는 k번째 중점을 평가하기 '직전'의 구간 [a, b]와
// 그 구간의 중점 m, f(m), 오차 상한 (b − a) / 2를 기록한다.
// Python 코드는 허용오차(tol)에 도달하면 멈추지만, 이 함수는 시각화를 위해 정해진 횟수만큼 반복한다.
// (같은 횟수까지의 a, b, m, f(m) 값은 Python 계산과 같다.)

export interface BisectionStep {
  /** 반복 번호 (1부터) */
  iteration: number;
  /** 중점을 평가하기 직전의 구간 */
  a: number;
  b: number;
  /** 중점 m = (a + b) / 2 */
  m: number;
  /** f(m) */
  fm: number;
  /** 중점을 근사해로 쓸 때의 오차 상한 (b − a) / 2 */
  errorBound: number;
  /** 이 단계 뒤에 남는 근의 구간 (f(m) = 0이면 [m, m]) */
  nextA: number;
  nextB: number;
}

/** 무한 루프·과도한 계산을 막기 위한 상한 */
export const MAX_BISECTION_ITERATIONS = 100;

/**
 * 이분법 반복 단계를 최대 maxIterations개 계산한다.
 * - 입력: 연속함수 f, 초기 구간 [a, b] (a < b), 반복 횟수
 * - 예외: f(a)·f(b) > 0(부호 조건 위반), 잘못된 구간·반복 횟수
 * - f(m) = 0이면 정확한 근을 찾은 것이므로 그 단계에서 멈춘다(반환 배열이 짧아질 수 있다).
 */
export function bisectionSteps(f: (x: number) => number, a: number, b: number, maxIterations: number): BisectionStep[] {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !(a < b)) {
    throw new Error(`이분법: 잘못된 구간 [${a}, ${b}]`);
  }
  if (!Number.isInteger(maxIterations) || maxIterations < 1 || maxIterations > MAX_BISECTION_ITERATIONS) {
    throw new Error(`이분법: 반복 횟수는 1~${MAX_BISECTION_ITERATIONS} 사이의 정수여야 합니다 (${maxIterations})`);
  }
  let fa = f(a);
  const fb = f(b);
  if (fa * fb > 0) throw new Error('이분법: 양 끝점의 함수값은 부호가 달라야 합니다.');

  const steps: BisectionStep[] = [];
  for (let i = 1; i <= maxIterations; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    const step: BisectionStep = { iteration: i, a, b, m, fm, errorBound: (b - a) / 2, nextA: a, nextB: b };
    if (fm === 0) {
      step.nextA = m;
      step.nextB = m;
      steps.push(step);
      break;
    }
    if (fa * fm < 0) {
      b = m;
    } else {
      a = m;
      fa = fm;
    }
    step.nextA = a;
    step.nextB = b;
    steps.push(step);
  }
  return steps;
}
