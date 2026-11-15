// FEM Solver Project 데이터 — Python 2D FEM 솔버를 단계별로 구현하고 병렬·분산 계산까지 확장한다.
//
// 작성 규칙
// - Phase 번호는 배열 순서로 자동 계산된다.
// - 강의 연결은 fem-roadmap.ts의 강의 id로 지정한다(번호·URL과 무관).
// - status 기본값은 'planned'. 실제 코드·페이지가 생기면 결과물에 page/file을 지정하고 상태를 올린다.
//   Phase를 'completed'로 바꾸려면 모든 결과물(과 마일스톤)이 completed여야 하며, 위반 시 빌드가 실패한다.
// - 현재(2026-11) 저장소에는 솔버 코드가 없으므로 모든 단계가 'planned'다.
import { defineProject } from '../lib/project';

export const femSolverProject = defineProject({
  id: 'fem-solver',
  title: 'FEM Solver Project',
  phases: [
    {
      id: 'mesh-generation',
      name: 'Mesh Generation',
      title: '메시 생성',
      goal: '2D 삼각형 메시를 생성하고, 절점·요소 데이터 구조와 메시 품질을 이해한다.',
      topics: ['절점 좌표', '요소 연결 정보', '삼각형 분할', '메시 품질', '메시 시각화'],
      deliverables: [
        { id: 'mesh-code', title: 'Python 메시 생성 코드' },
        { id: 'mesh-plot', title: '2D 메시 시각화' },
      ],
      lectureIds: [
        'why-mesh', 'nodes-elements',
        'element-dimensions', 'element-types', 'connectivity', 'python-2d-mesh', 'delaunay', 'mesh-quality', 'mesh-refinement',
      ],
    },
    {
      id: 'element-computation',
      name: 'Element Computation',
      title: '요소 계산',
      goal: '선형 삼각형 요소의 형상함수와 요소 강성행렬(열전도 행렬)을 계산한다.',
      topics: ['형상함수', '좌표 변환', '요소별 행렬', '재료 물성', '요소 계산 루틴'],
      deliverables: [
        { id: 'element-stiffness-fn', title: '요소 강성행렬 계산 함수' },
        { id: 'element-plot', title: '요소별 계산 결과 시각화' },
      ],
      lectureIds: [
        'governing-equations', 'weak-form', 'shape-functions', 'linear-triangle', 'element-stiffness', 'gauss-quadrature', 'element-python',
      ],
    },
    {
      id: 'global-assembly',
      name: 'Global Assembly',
      title: '전역 행렬 조립',
      goal: '요소 행렬을 Local-to-Global 매핑으로 전역 희소행렬에 조립한다.',
      topics: ['Local-to-Global 매핑', '희소행렬', '요소 연결 관계', '전역 강성행렬 조립'],
      deliverables: [
        { id: 'assembly-code', title: '전역 행렬 조립 코드' },
        { id: 'sparsity-plot', title: '행렬 Sparsity Pattern 시각화' },
      ],
      lectureIds: ['global-assembly', 'local-to-global', 'sparse-matrices'],
    },
    {
      id: 'bc-solver',
      name: 'Boundary Conditions & Solver',
      title: '경계조건과 솔버',
      goal: '경계조건을 적용하고 선형 시스템을 풀어 정상상태 2D 열전도 문제의 해를 구한다.',
      topics: ['Dirichlet 경계조건', 'Neumann 경계조건', '선형 시스템', '직접 솔버', '반복 솔버'],
      deliverables: [
        { id: 'heat-solver', title: '정상상태 2D 열전도 FEM 솔버' },
        { id: 'bc-experiments', title: '경계조건 변경 실험' },
      ],
      lectureIds: [
        'dirichlet-neumann', 'linear-system', 'direct-iterative-solvers', 'first-2d-solver', '1d-bar', '2d-heat-conduction',
      ],
    },
    {
      id: 'post-processing',
      name: 'Post-processing & Visualization',
      title: '후처리와 시각화',
      goal: '온도 분포를 시각화하고, 메시 해상도별 오차 비교로 2D 열전도 솔버의 정확성을 검증한다.',
      topics: ['절점 온도', '온도 분포', '컬러맵', '등고선', '메시 해상도별 오차 비교', '해석 결과 검증'],
      deliverables: [
        { id: 'temperature-plot', title: '온도 분포 시각화' },
        { id: 'web-result-viewer', title: '웹 기반 FEM 결과 뷰어' },
      ],
      lectureIds: [
        'poisson-potential', 'physical-conditions',
        'nodal-element-values', 'colormaps-contours', 'deformed-shape', 'stress-strain-output', 'error-convergence', 'pyvista-3d', 'web-viewer',
      ],
    },
    {
      id: 'advanced-parallel',
      name: 'Advanced Solver & Parallel Computing',
      title: '고급 솔버와 병렬 계산',
      goal: '솔버를 재사용 가능한 구조로 고도화하고, 도메인 분할·MPI·GPU로 병렬·분산 계산까지 확장한다.',
      topics: [
        '솔버 아키텍처', '희소행렬 최적화', '성능 프로파일링', '도메인 분할', 'MPI 기반 통신',
        'Ghost Node', '병렬 행렬 조립', 'GPU 가속', '확장성 분석',
      ],
      deliverables: [
        { id: 'reusable-solver', title: '재사용 가능한 Python FEM 솔버' },
        { id: 'mpi-practice', title: 'MPI 기반 분산 계산 실습' },
        { id: 'cpu-gpu-benchmark', title: 'CPU·GPU 성능 비교 실험' },
        { id: 'scaling-report', title: '대규모 FEM 성능 분석 보고서' },
      ],
      milestones: [
        {
          id: 'advanced-elements',
          title: '6-1. 고급 요소와 비선형 해석',
          lectureIds: ['higher-order-elements', 'isoparametric', 'integration-locking', 'adaptive-refinement', 'nonlinear-materials', 'contact', 'dynamics'],
        },
        {
          id: 'architecture',
          title: '6-2. 솔버 아키텍처와 성능 최적화',
          lectureIds: ['solver-structure', 'object-design', 'kernel-assembly-separation', 'csr-coo', 'profiling', 'numpy-scipy-optimization', 'python-fem-library'],
        },
        {
          id: 'distributed',
          title: '6-3. 도메인 분할과 MPI 분산 계산',
          lectureIds: ['why-parallel', 'element-parallelism', 'domain-decomposition', 'mpi', 'ghost-nodes', 'parallel-assembly-solvers'],
        },
        {
          id: 'gpu-scaling',
          title: '6-4. GPU 가속과 확장성 분석',
          lectureIds: ['gpu-acceleration', 'scalability'],
        },
        {
          id: 'capstone',
          title: '6-5. 적응형·병렬 FEM 통합 프로젝트',
          lectureIds: ['capstone'],
        },
      ],
    },
  ],
  checkpoints: [
    {
      id: 'structural-extension',
      afterPhase: 'post-processing',
      title: '구조해석 확장: 2D 선형 탄성체',
      description:
        '2D 열전도 솔버(스칼라장: 온도)를 완성한 뒤, 같은 계산 구조를 절점당 2개의 자유도(변위 u, v)를 갖는 선형 탄성 문제로 확장한다.',
      lectureIds: ['1d-bar', '2d-linear-elasticity', 'plane-stress-strain', 'deformed-shape', 'stress-strain-output'],
    },
  ],
  components: [
    { name: 'MeshViewer', role: '절점·요소 번호와 메시 품질을 확대·선택하며 살펴보는 2D 메시 뷰어', phase: 'mesh-generation' },
    { name: 'ElementExplorer', role: '삼각형 꼭짓점을 움직이며 형상함수와 요소 행렬의 변화를 관찰', phase: 'element-computation' },
    { name: 'AssemblyVisualizer', role: '요소 행렬이 전역 행렬의 어느 위치에 더해지는지 단계별로 표시', phase: 'global-assembly' },
    { name: 'FEMSolverDemo', role: '경계조건과 메시 크기를 바꿔 브라우저에서 2D 열전도 해를 계산', phase: 'bc-solver' },
    { name: 'FieldViewer', role: '온도장 컬러맵·등고선과 메시 해상도별 오차 비교', phase: 'post-processing' },
    { name: 'DomainPartitionViewer', role: '도메인 분할, 프로세스별 영역과 Ghost Node를 색으로 구분해 표시', phase: 'advanced-parallel' },
  ],
});
