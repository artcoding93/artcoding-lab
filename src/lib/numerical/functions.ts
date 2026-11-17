// 강의·인터랙티브 컴포넌트가 함께 쓰는 함수 목록.
//
// - 컴포넌트에는 함수 자체가 아니라 키(예: 'cubic')를 props로 넘긴다.
//   빌드 시점(서버 렌더링)과 브라우저 <script>가 같은 정의를 import하므로 계산 결과가 같다.
// - 계산식은 강의의 Python 코드와 같은 연산(`x**3 - x - 2` 등)으로 작성한다.
// - 새 강의에서 필요한 함수만 추가한다.

export interface NumericFunction {
  /** 화면 표시용 식 (일반 텍스트) */
  label: string;
  f: (x: number) => number;
}

export const FUNCTIONS = {
  /** f(x) = x² — 수치해석 1강 직사각형 근사 */
  square: { label: 'x²', f: (x: number) => x ** 2 },
  /** f(x) = x³ − x − 2 — 수치해석 1강 이분법 */
  cubic: { label: 'x³ − x − 2', f: (x: number) => x ** 3 - x - 2 },
} satisfies Record<string, NumericFunction>;

export type FunctionKey = keyof typeof FUNCTIONS;

export function getFunction(key: string): NumericFunction {
  const entry = (FUNCTIONS as Record<string, NumericFunction>)[key];
  if (!entry) throw new Error(`알 수 없는 함수 키: '${key}' (src/lib/numerical/functions.ts에 등록하세요)`);
  return entry;
}
