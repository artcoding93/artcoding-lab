// Mesh Generation Research Lab — 연구 로드맵 (9 Stage)
//
// - 강의 로드맵과 달리 Stage별 세부 항목 수를 고정하지 않는다. 논문·알고리즘·실험은 각 데이터 파일에서
//   stage ID로 연결되며, 로드맵 페이지에 자동으로 모인다.
// - Stage 8·9는 openEnded: 주제 목록은 탐색 후보이며, 연구 진행에 따라 확정한다.
import type { ResearchAreaDef, StageDef } from '../lib/research';

export const meshStages: StageDef[] = [
  {
    id: 'foundations',
    title: 'Foundations of Triangulation',
    ko: '삼각분할의 기초',
    era: '1930s–1980s',
    topics: ['Delaunay Triangulation', 'Voronoi Diagram', 'Orientation Test', 'InCircle Test', 'Edge Flipping', 'Geometric Predicates'],
    question: '좋은 삼각분할이란 무엇이며, 이를 수학적으로 어떻게 정의하고 검증할 수 있는가?',
    deliverables: ['Geometry Kernel', 'Edge Flip Explorer', 'Delaunay Condition Visualizer'],
  },
  {
    id: 'classical',
    title: 'Classical Triangulation Algorithms',
    ko: '고전 삼각분할 알고리즘',
    era: '1970s–1980s',
    topics: ["Lawson's Algorithm", 'Bowyer–Watson Algorithm', 'Incremental Point Insertion', 'Divide and Conquer', 'Sweep Line'],
    question: '동일한 Delaunay 삼각분할을 서로 다른 알고리즘으로 생성하는 이유는 무엇인가?',
    deliverables: ['Python Delaunay Triangulator', '단계별 점 삽입 시각화', '알고리즘별 성능 비교'],
  },
  {
    id: 'boundary',
    title: 'Boundary-based Mesh Generation',
    ko: '경계 기반 메시 생성',
    era: '1980s',
    topics: ['Advancing Front', 'Boundary Conformity', 'Planar Straight Line Graph', 'Constrained Delaunay Triangulation', '복잡한 영역 및 내부 구멍 처리'],
    question: '임의의 복잡한 기하 영역에서 경계를 보존하면서 삼각형 메시를 생성하려면 어떻게 해야 하는가?',
    deliverables: ['Boundary-aware Mesh Generator', 'Advancing Front Visualizer'],
  },
  {
    id: 'quality',
    title: 'Physically-based & Quality Mesh Generation',
    ko: '물리 기반·품질 보장 메시 생성',
    era: '1989–2000s',
    topics: ["Shimada's Bubble Mesh", 'Physically-based Point Distribution', "Chew's Delaunay Refinement", "Ruppert's Delaunay Refinement", 'Quality Constraints', 'Steiner Point Insertion'],
    comparisonTopics: ['Paving', '대표적인 사각형 메시 생성 접근'],
    question: '삼각형을 생성하는 것과 품질이 좋은 삼각형 메시를 생성하는 것은 어떻게 다른가?',
    deliverables: ['Bubble Mesh Reproduction', 'Delaunay Refinement Engine', 'Mesh Quality Analyzer'],
  },
  {
    id: 'optimization',
    title: 'Mesh Optimization & Hybrid Methods',
    ko: '메시 최적화와 하이브리드 기법',
    era: '1980s–2000s',
    topics: ['Laplacian Smoothing', 'Optimization-based Smoothing', 'Edge Swap', 'Node Relocation', 'DistMesh', 'Frontal-Delaunay', 'Hybrid Meshing Strategies'],
    question: '점 배치, 요소 연결, 국소 최적화를 어떻게 결합하면 메시 품질을 개선할 수 있는가?',
    deliverables: ['Mesh Optimization Engine', 'Hybrid Algorithm Experiments'],
  },
  {
    id: 'adaptive',
    title: 'Adaptive & Anisotropic Mesh Generation',
    ko: '적응형·이방성 메시 생성',
    era: '1980s–현재',
    topics: ['Adaptive Refinement', 'Mesh Size Field', 'Metric Tensor', 'Anisotropic Triangulation', 'Error-driven Meshing', 'Local Remeshing'],
    question: '전체 영역에 균일한 메시를 생성하는 대신 필요한 위치에 적절한 크기와 방향의 요소를 생성하려면 어떻게 해야 하는가?',
    deliverables: ['Adaptive Mesh Generator', 'Anisotropic Mesh Experiments'],
  },
  {
    id: 'robust',
    title: 'Robust & High-performance Meshing',
    ko: '강건성과 고성능 메시 생성',
    era: '1990s–현재',
    topics: ['Robust Geometric Predicates', 'Floating-point Errors', 'Degenerate Geometry', 'Efficient Data Structures', 'Algorithm Complexity', 'Parallelization', 'Performance Optimization'],
    question: '이론적으로 올바른 알고리즘이 실제 계산에서 실패하는 이유는 무엇이며, 어떻게 강건하고 효율적으로 구현할 수 있는가?',
    deliverables: ['Robust Geometry Kernel', 'Performance Benchmark Suite', 'Optimized Computational Core'],
  },
  {
    id: 'ai',
    title: 'AI-driven Mesh Generation',
    ko: 'AI 기반 메시 생성',
    era: '최신 연구',
    openEnded: true,
    topics: [
      'Learning-based Mesh Generation', 'Neural Mesh Generation', 'Reinforcement Learning for Meshing', 'AI-guided Point Insertion',
      'Mesh Quality Prediction', 'Learning-guided Refinement', 'Graph Neural Networks', 'Hybrid Physics/Geometry/AI Approaches',
    ],
    question: 'AI는 기존 메시 생성 알고리즘의 어떤 부분을 개선할 수 있으며, 기존 기하학적 방법보다 실제로 우수한가?',
    deliverables: ['최신 논문 조사 후 연구자와 논의해 확정'],
    note: '주제 목록은 탐색 후보이며 모두 구현한다는 의미가 아니다. 서베이에서 출발해 개별 원 논문을 확인한 뒤 재현 대상을 정한다.',
  },
  {
    id: 'novel',
    title: 'Novel Mesh Generation Research',
    ko: '새로운 메시 생성 알고리즘 연구',
    era: '연구 목표',
    openEnded: true,
    topics: ['기존 알고리즘의 한계 분석', '연구 문제 정의', '새로운 메시 생성 방법 설계', '제안 알고리즘 구현', '기존 알고리즘과 비교', 'Ablation Study', '성능 및 강건성 검증', '논문 작성'],
    question: '기존 메시 생성 방법으로 충분히 해결되지 않은 문제는 무엇이며, 이를 개선할 새로운 알고리즘을 제안할 수 있는가?',
    deliverables: ['Stage 1–8의 연구 결과를 바탕으로 결정'],
    note: '새 알고리즘의 이름과 구조는 아직 정하지 않았다. 연구 노트의 한계 분석·가설·실험을 근거로 방향을 정한다.',
  },
];

/** Paper Library 연구 분야 필터 */
export const meshAreas: ResearchAreaDef[] = [
  { id: 'delaunay', label: 'Delaunay 삼각분할' },
  { id: 'constrained', label: '경계·제약 조건' },
  { id: 'advancing-front', label: 'Advancing Front' },
  { id: 'quality-refinement', label: '품질·Refinement' },
  { id: 'physically-based', label: '물리 기반 점 배치' },
  { id: 'optimization', label: '메시 최적화' },
  { id: 'adaptive', label: '적응형·이방성' },
  { id: 'robustness', label: '강건성·성능' },
  { id: 'quadrilateral', label: '사각형 메시(비교)' },
  { id: 'ai', label: 'AI 기반' },
  { id: 'survey', label: '서베이' },
];
