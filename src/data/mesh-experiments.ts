// Mesh Generation Research Lab — 공통 벤치마크와 실험 계획
//
// - 모든 알고리즘은 가능한 범위에서 같은 테스트 형상과 지표로 비교한다.
//   단, 서로 다른 문제를 푸는 알고리즘에 부적절한 같은 기준을 강요하지 않는다(실험별로 지표를 고른다).
// - status: planned → running → completed. completed는 결과 보고서 페이지(report)가 있어야 한다(빌드 검사).
// - 실험값이 없으면 수치를 만들지 않는다. 결과는 실제 실행 결과만 보고서에 싣는다.
import type { ExperimentDef, GeometryDef, MetricDef } from '../lib/research';

export const meshGeometries: GeometryDef[] = [
  { id: 'square', name: 'Square', purpose: '가장 단순한 기준 형상. 알고리즘 기본 동작 확인' },
  { id: 'circle', name: 'Circle', purpose: '곡선 경계의 다각형 근사와 경계 절점 분포' },
  { id: 'l-shape', name: 'L-shaped Domain', purpose: '오목한 모서리(재진입 코너) 처리' },
  { id: 'annulus', name: 'Annulus', purpose: '내부 구멍과 다중 경계' },
  { id: 'narrow-channel', name: 'Narrow Channel', purpose: '좁은 영역에서 요소 크기와 품질의 충돌' },
  { id: 'concave-polygon', name: 'Concave Polygon', purpose: '복잡한 오목 경계의 보존' },
  { id: 'variable-size', name: 'Variable Size Field', purpose: '위치에 따라 바뀌는 목표 요소 크기' },
  { id: 'degenerate', name: 'Degenerate Geometry', purpose: '공선점·공원점, 매우 작은 각 등 수치적으로 어려운 입력' },
];

export const meshMetrics: MetricDef[] = [
  { id: 'nodes', name: 'Number of Nodes', description: '생성된 절점 수' },
  { id: 'elements', name: 'Number of Elements', description: '생성된 삼각형 요소 수' },
  { id: 'min-angle', name: 'Minimum Angle', description: '모든 요소 내각 중 최솟값 (클수록 좋음)' },
  { id: 'max-angle', name: 'Maximum Angle', description: '모든 요소 내각 중 최댓값 (작을수록 좋음)' },
  { id: 'aspect-ratio', name: 'Aspect Ratio', description: '요소의 길쭉한 정도 (정의는 실험 보고서에 명시)' },
  { id: 'radius-ratio', name: 'Radius Ratio', description: '내접원 반지름과 외접원 반지름의 비 (정삼각형에서 최대)' },
  { id: 'boundary-conformity', name: 'Boundary Conformity', description: '입력 경계 선분이 메시 변으로 보존되었는지 여부' },
  { id: 'time', name: 'Execution Time', description: '같은 환경에서 측정한 실행 시간' },
  { id: 'memory', name: 'Memory Usage', description: '최대 메모리 사용량' },
  { id: 'failure-rate', name: 'Failure Rate', description: '테스트 입력 중 실패(비정상 종료·잘못된 메시) 비율' },
  { id: 'fem-error', name: 'FEM Error', description: '같은 문제를 FEM으로 풀었을 때의 해석 오차', optional: true },
];

export const meshExperiments: ExperimentDef[] = [
  {
    id: 'delaunay-algorithms',
    title: 'Delaunay 삼각분할 알고리즘 비교',
    stage: 'classical',
    goal: '같은 점 집합에서 결과가 동일한 Delaunay 삼각분할인지 확인하고, 점 수에 따른 실행 시간과 메모리를 비교한다.',
    algorithmIds: ['lawson-flip', 'bowyer-watson', 'divide-conquer-delaunay', 'sweepline-delaunay'],
    geometryIds: ['square', 'circle', 'degenerate'],
    metricIds: ['nodes', 'elements', 'time', 'memory', 'failure-rate'],
  },
  {
    id: 'boundary-conformity',
    title: '경계 보존 메시 생성 비교',
    stage: 'boundary',
    goal: '복잡한 경계와 구멍이 있는 영역에서 경계 보존과 실패 사례를 비교한다.',
    algorithmIds: ['advancing-front', 'constrained-delaunay'],
    geometryIds: ['l-shape', 'annulus', 'narrow-channel', 'concave-polygon'],
    metricIds: ['boundary-conformity', 'min-angle', 'elements', 'failure-rate'],
  },
  {
    id: 'quality-meshing',
    title: '품질 보장 메시 생성 비교',
    stage: 'quality',
    goal: 'Refinement 계열과 물리 기반 점 배치의 요소 품질 분포와 요소 수를 비교한다.',
    algorithmIds: ['chew-refinement', 'ruppert-refinement', 'bubble-mesh'],
    geometryIds: ['square', 'l-shape', 'annulus', 'narrow-channel'],
    metricIds: ['min-angle', 'max-angle', 'radius-ratio', 'nodes', 'elements', 'time'],
  },
  {
    id: 'optimization-hybrid',
    title: '메시 최적화·하이브리드 기법 비교',
    stage: 'optimization',
    goal: 'Smoothing과 하이브리드 기법이 초기 메시의 품질을 얼마나 개선하는지 비교한다.',
    algorithmIds: ['laplacian-smoothing', 'frontal-delaunay', 'distmesh'],
    geometryIds: ['circle', 'l-shape', 'variable-size'],
    metricIds: ['min-angle', 'radius-ratio', 'aspect-ratio', 'time'],
  },
  {
    id: 'robustness',
    title: '기하 술어의 강건성 실험',
    stage: 'robust',
    goal: '퇴화 입력에서 단순 부동소수점 판정과 강건한 판정의 실패율을 비교한다.',
    algorithmIds: ['geometry-kernel', 'robust-predicates', 'bowyer-watson'],
    geometryIds: ['degenerate'],
    metricIds: ['failure-rate', 'time'],
  },
];
