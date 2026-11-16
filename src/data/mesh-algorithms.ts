// Mesh Generation Research Lab — 재현 대상 알고리즘과 계획된 인터랙티브 Explorer
//
// - status: planned → in-progress → reproduced. reproduced는 public/ 아래 재현 코드(code)가 있어야 한다(빌드 검사).
// - scope: 'reproduction'(원 논문 알고리즘 재현) / 'simplified'(교육·연구용 단순화 구현)를 구분한다.
// - 외부 메시 라이브러리로 결과를 만든 것은 재현으로 인정하지 않는다(검증·비교용으로만 사용).
// - 재현 코드는 public/code/mesh-generation/ 아래에 둔다.
import type { AlgorithmDef, ExplorerDef } from '../lib/research';

export const meshAlgorithms: AlgorithmDef[] = [
  { id: 'geometry-kernel', name: 'Geometry Kernel (orient2d · incircle)', stage: 'foundations', paperIds: ['guibas-stolfi-1985'], scope: 'simplified', summary: '방향 판정과 외접원 판정 등 삼각분할 알고리즘이 공통으로 쓰는 기하 술어.' },
  { id: 'lawson-flip', name: "Lawson's Edge Flip", stage: 'classical', paperIds: ['lawson-1972', 'lawson-1977'], scope: 'reproduction', summary: 'Delaunay 조건을 위반하는 변을 뒤집기(flip)를 반복해 Delaunay 삼각분할로 만든다.' },
  { id: 'bowyer-watson', name: 'Bowyer–Watson', stage: 'classical', paperIds: ['bowyer-1981', 'watson-1981'], scope: 'reproduction', summary: '새 점의 cavity(외접원이 점을 포함하는 삼각형들)를 제거하고 경계를 새 점과 다시 연결한다.' },
  { id: 'divide-conquer-delaunay', name: 'Divide-and-Conquer Delaunay', stage: 'classical', paperIds: ['guibas-stolfi-1985'], scope: 'reproduction', summary: '점 집합을 나누어 각각 삼각분할한 뒤 병합한다. Quad-edge 자료구조 사용.' },
  { id: 'sweepline-delaunay', name: 'Sweepline (Fortune)', stage: 'classical', paperIds: ['fortune-1987'], scope: 'reproduction', summary: '평면을 쓸어 가며 Voronoi 다이어그램과 그 쌍대인 Delaunay 삼각분할을 구한다.' },
  { id: 'advancing-front', name: 'Advancing Front', stage: 'boundary', paperIds: ['lo-1985', 'peraire-1987'], scope: 'reproduction', summary: '경계를 초기 front로 두고 요소를 하나씩 만들며 front를 안쪽으로 전진시킨다.' },
  { id: 'constrained-delaunay', name: 'Constrained Delaunay Triangulation', stage: 'boundary', paperIds: ['lee-lin-1986', 'chew-1989-cdt'], scope: 'reproduction', summary: 'PSLG의 선분을 보존하면서 가능한 한 Delaunay 성질을 유지하는 삼각분할.' },
  { id: 'bubble-mesh', name: 'Bubble Mesh', stage: 'quality', paperIds: ['shimada-gossard-1995'], scope: 'reproduction', summary: '버블 사이 힘의 평형으로 점을 배치한 뒤 연결해 고른 삼각형 메시를 만든다.' },
  { id: 'chew-refinement', name: "Chew's Delaunay Refinement", stage: 'quality', paperIds: ['chew-1989-quality'], scope: 'reproduction', summary: '제약 Delaunay 삼각분할에 점을 삽입해 각의 범위를 보장한다.' },
  { id: 'ruppert-refinement', name: "Ruppert's Delaunay Refinement", stage: 'quality', paperIds: ['ruppert-1995', 'shewchuk-2002'], scope: 'reproduction', summary: '나쁜 삼각형의 외접원 중심 삽입과 침범된 선분 분할을 반복해 최소각을 보장한다.' },
  { id: 'paving', name: 'Paving (비교 연구)', stage: 'quality', paperIds: ['blacker-stephenson-1991'], scope: 'simplified', comparison: true, summary: '사각형 메시 생성의 대표 접근. 삼각형 메시 방법과의 비교 대상.' },
  { id: 'laplacian-smoothing', name: 'Laplacian Smoothing', stage: 'optimization', paperIds: ['field-1988'], scope: 'reproduction', summary: '내부 절점을 이웃 절점의 평균 위치로 옮겨 요소 모양을 개선한다.' },
  { id: 'frontal-delaunay', name: 'Frontal-Delaunay', stage: 'optimization', paperIds: ['rebay-1993'], scope: 'reproduction', summary: '전진 방식으로 점 위치를 정하고 Bowyer–Watson으로 삽입하는 하이브리드.' },
  { id: 'distmesh', name: 'DistMesh', stage: 'optimization', paperIds: ['persson-strang-2004'], scope: 'reproduction', summary: '부호 거리 함수와 스프링 힘 평형, Delaunay 재삼각분할을 반복한다.' },
  { id: 'size-field-meshing', name: 'Size-field Adaptive Meshing', stage: 'adaptive', paperIds: ['peraire-1987'], scope: 'simplified', summary: '배경 메시·크기 함수로 위치별 요소 크기와 방향을 제어한다.' },
  { id: 'robust-predicates', name: 'Adaptive-precision Robust Predicates', stage: 'robust', paperIds: ['shewchuk-1997'], scope: 'reproduction', summary: '부동소수점 오차에도 올바른 부호를 내는 orient2d·incircle 판정.' },
];

export const meshExplorers: ExplorerDef[] = [
  {
    name: 'DelaunayExplorer',
    algorithmIds: ['geometry-kernel', 'lawson-flip'],
    features: ['2D 평면에 점 추가', '삼각형 생성', '외접원 표시', 'Delaunay 조건 검사', 'Edge Flip 과정 표시'],
  },
  {
    name: 'BowyerWatsonExplorer',
    algorithmIds: ['bowyer-watson'],
    features: ['점 삽입', 'Cavity 검출', '기존 삼각형 제거', '새로운 삼각형 연결', '단계별 실행'],
  },
  {
    name: 'AdvancingFrontExplorer',
    algorithmIds: ['advancing-front'],
    features: ['초기 경계 설정', 'Front 선택', '새로운 요소 생성', 'Front 갱신', '충돌 및 실패 사례 표시'],
  },
  {
    name: 'BubbleMeshExplorer',
    algorithmIds: ['bubble-mesh'],
    features: ['초기 Bubble 배치', '힘 벡터 표시', '반복 계산', '평형 상태 확인', '삼각분할 생성'],
  },
  {
    name: 'RuppertRefinementExplorer',
    algorithmIds: ['ruppert-refinement'],
    features: ['품질이 낮은 삼각형 검출', '외접원 중심 표시', 'Encroached Segment 확인', '점 삽입', 'Refinement 반복'],
  },
];
