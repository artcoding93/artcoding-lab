// 유한요소법(FEM) 학습 로드맵 데이터 (10 Part · 70강)
//
// 작성 규칙은 numerical-roadmap.ts와 같다.
// - 강의 번호는 배열 순서로 자동 계산된다. URL은 slug로 고정된다(/fem/<slug>/).
// - status를 생략하면 'planned'. 실제 강의 페이지를 작성한 뒤에만 status: 'published'를 추가한다.
// - 강의 id는 솔버 프로젝트(fem-solver-project.ts)에서 Phase와 강의를 연결하는 키다. 한 번 정하면 바꾸지 않는다.
import { defineRoadmap } from '../lib/roadmap';

export const femRoadmap = defineRoadmap({
  id: 'fem',
  basePath: 'fem',
  title: '유한요소법',
  levelLabels: { research: '연구' },
  searchExamples: ['희소행렬', 'MPI'],
  parts: [
    {
      id: 'intuition',
      title: 'FEM을 직관적으로 이해하기',
      level: 'intro',
      lectures: [
        { id: 'what-fem-solves', title: 'FEM은 어떤 문제를 해결하는가?', en: 'What Problems Does FEM Solve?', slug: 'intuition/what-fem-solves', keywords: ['유한요소법', 'finite element method'], status: 'published' },
        { id: 'discretization', title: '연속적인 세계를 이산화한다는 의미', en: 'What It Means to Discretize a Continuum', slug: 'intuition/discretization', keywords: ['이산화'] },
        { id: 'why-mesh', title: '메시(Mesh)는 왜 필요한가?', en: 'Why Do We Need a Mesh?', slug: 'intuition/why-mesh', keywords: ['격자'] },
        { id: 'nodes-elements', title: '절점(Node)과 요소(Element)의 관계', en: 'Nodes and Elements', slug: 'intuition/nodes-elements', keywords: ['노드'] },
        { id: 'boundary-conditions-concept', title: '경계조건은 무엇을 의미하는가?', en: 'What Do Boundary Conditions Mean?', slug: 'intuition/boundary-conditions', keywords: ['boundary condition'] },
        { id: 'fem-workflow', title: 'FEM 전체 계산 과정 살펴보기', en: 'The Complete FEM Workflow', slug: 'intuition/fem-workflow', keywords: ['pipeline', '파이프라인'] },
        { id: 'first-simulation', title: '첫 번째 FEM 시뮬레이션 체험', en: 'Your First FEM Simulation', slug: 'intuition/first-simulation' },
      ],
    },
    {
      id: 'mesh',
      title: '메시와 기하학적 모델링',
      level: 'basic',
      lectures: [
        { id: 'element-dimensions', title: '1D·2D·3D 요소의 차이', en: '1D, 2D, and 3D Elements', slug: 'mesh/element-dimensions' },
        { id: 'element-types', title: '삼각형·사각형·사면체 요소', en: 'Triangular, Quadrilateral, and Tetrahedral Elements', slug: 'mesh/element-types', keywords: ['triangle', 'quad', 'tetrahedron'] },
        { id: 'connectivity', title: '절점 번호와 요소 연결 정보', en: 'Node Numbering and Element Connectivity', slug: 'mesh/connectivity', keywords: ['connectivity', '연결성'] },
        { id: 'python-2d-mesh', title: 'Python으로 2D 메시 생성하기', en: 'Generating a 2D Mesh in Python', slug: 'mesh/python-2d-mesh', keywords: ['mesh generation'] },
        { id: 'delaunay', title: 'Delaunay 삼각분할의 직관', en: 'Intuition Behind Delaunay Triangulation', slug: 'mesh/delaunay', keywords: ['들로네', 'triangulation'] },
        { id: 'mesh-quality', title: '메시 품질과 왜곡된 요소', en: 'Mesh Quality and Distorted Elements', slug: 'mesh/mesh-quality', keywords: ['aspect ratio', '종횡비'] },
        { id: 'mesh-refinement', title: '메시 세분화와 계산 정확도', en: 'Mesh Refinement and Accuracy', slug: 'mesh/mesh-refinement', keywords: ['h-refinement'] },
      ],
    },
    {
      id: 'formulation',
      title: 'FEM의 핵심 수학을 그림으로 이해하기',
      level: 'basic',
      lectures: [
        { id: 'governing-equations', title: '물리 법칙과 지배방정식', en: 'Physical Laws and Governing Equations', slug: 'formulation/governing-equations', keywords: ['PDE', '편미분방정식'] },
        { id: 'weak-form', title: '미분방정식에서 약형식으로', en: 'From Differential Equations to the Weak Form', slug: 'formulation/weak-form', keywords: ['약형식', 'Galerkin', '갤러킨', 'variational'] },
        { id: 'shape-functions', title: '형상함수는 무엇을 근사하는가?', en: 'What Do Shape Functions Approximate?', slug: 'formulation/shape-functions', keywords: ['shape function', '보간함수'] },
        { id: 'linear-triangle', title: '선형 삼각형 요소의 형상함수', en: 'Shape Functions of the Linear Triangle', slug: 'formulation/linear-triangle', keywords: ['CST', 'P1'] },
        { id: 'element-stiffness', title: '요소 강성행렬의 물리적 의미', en: 'Physical Meaning of the Element Stiffness Matrix', slug: 'formulation/element-stiffness', keywords: ['stiffness matrix', '강성행렬'] },
        { id: 'gauss-quadrature', title: '가우스 적분의 역할', en: 'The Role of Gaussian Quadrature', slug: 'formulation/gauss-quadrature', keywords: ['가우스 구적법', 'numerical integration'] },
        { id: 'element-python', title: '요소 계산을 Python으로 구현하기', en: 'Implementing Element Computations in Python', slug: 'formulation/element-python' },
      ],
    },
    {
      id: 'assembly',
      title: '전역 시스템 조립과 솔버',
      level: 'intermediate',
      lectures: [
        { id: 'global-assembly', title: '요소 행렬을 전체 행렬로 조립하기', en: 'Assembling Element Matrices into the Global Matrix', slug: 'assembly/global-assembly', keywords: ['assembly', '조립'] },
        { id: 'local-to-global', title: 'Local-to-Global 인덱싱', en: 'Local-to-Global Indexing', slug: 'assembly/local-to-global', keywords: ['DOF map', '자유도'] },
        { id: 'sparse-matrices', title: '희소행렬은 왜 발생하는가?', en: 'Why Are FEM Matrices Sparse?', slug: 'assembly/sparse-matrices', keywords: ['sparse', 'sparsity'] },
        { id: 'dirichlet-neumann', title: 'Dirichlet·Neumann 경계조건', en: 'Dirichlet and Neumann Boundary Conditions', slug: 'assembly/dirichlet-neumann', keywords: ['디리클레', '노이만', '경계조건'] },
        { id: 'linear-system', title: '선형 시스템 Ax=b의 의미', en: 'The Meaning of the Linear System Ax = b', slug: 'assembly/linear-system', keywords: ['연립방정식'] },
        { id: 'direct-iterative-solvers', title: '직접 솔버와 반복 솔버', en: 'Direct and Iterative Solvers', slug: 'assembly/direct-iterative-solvers', keywords: ['LU', 'CG', 'conjugate gradient'] },
        { id: 'first-2d-solver', title: '첫 번째 2D FEM 솔버 완성', en: 'Completing Your First 2D FEM Solver', slug: 'assembly/first-2d-solver' },
      ],
    },
    {
      id: 'applications',
      title: '물리 문제를 직접 풀어보기',
      level: 'intermediate',
      lectures: [
        { id: '1d-bar', title: '1D 막대의 변형', en: 'Deformation of a 1D Bar', slug: 'applications/1d-bar', keywords: ['axial bar', '봉'] },
        { id: '2d-heat-conduction', title: '2D 열전도 문제', en: '2D Heat Conduction', slug: 'applications/2d-heat-conduction', keywords: ['heat', 'temperature', '온도'] },
        { id: 'poisson-potential', title: 'Poisson 방정식과 전위 분포', en: "Poisson's Equation and Electric Potential", slug: 'applications/poisson-potential', keywords: ['푸아송', 'electrostatics'] },
        { id: '2d-linear-elasticity', title: '2D 선형 탄성체와 응력', en: '2D Linear Elasticity and Stress', slug: 'applications/2d-linear-elasticity', keywords: ['elasticity', '구조해석'] },
        { id: 'plane-stress-strain', title: '평면응력과 평면변형률', en: 'Plane Stress and Plane Strain', slug: 'applications/plane-stress-strain' },
        { id: 'steady-transient', title: '정상상태와 시간의존 문제', en: 'Steady-State and Time-Dependent Problems', slug: 'applications/steady-transient', keywords: ['transient', '과도'] },
        { id: 'physical-conditions', title: '실제 물리 조건을 모델에 반영하기', en: 'Modeling Real Physical Conditions', slug: 'applications/physical-conditions' },
      ],
    },
    {
      id: 'post-processing',
      title: '후처리와 시각화',
      level: 'intermediate',
      lectures: [
        { id: 'nodal-element-values', title: '절점 해와 요소 해의 차이', en: 'Nodal vs. Element Solutions', slug: 'post-processing/nodal-element-values' },
        { id: 'colormaps-contours', title: '컬러맵과 등고선 표현', en: 'Colormaps and Contour Plots', slug: 'post-processing/colormaps-contours', keywords: ['contour'] },
        { id: 'deformed-shape', title: '변형 형상 시각화', en: 'Visualizing Deformed Shapes', slug: 'post-processing/deformed-shape' },
        { id: 'stress-strain-output', title: '응력·변형률 계산 및 표현', en: 'Computing and Displaying Stress and Strain', slug: 'post-processing/stress-strain', keywords: ['von Mises', '폰 미세스'] },
        { id: 'error-convergence', title: '오차와 수렴성 검증', en: 'Error and Convergence Verification', slug: 'post-processing/error-convergence', keywords: ['verification', '검증'] },
        { id: 'pyvista-3d', title: 'VTK·PyVista 기반 3D 시각화', en: '3D Visualization with VTK and PyVista', slug: 'post-processing/pyvista-3d', keywords: ['ParaView'] },
        { id: 'web-viewer', title: '웹 기반 FEM 결과 뷰어', en: 'Web-Based FEM Result Viewer', slug: 'post-processing/web-viewer', keywords: ['WebGL', 'browser'] },
      ],
    },
    {
      id: 'advanced',
      title: '고급 FEM과 수치적 안정성',
      level: 'advanced',
      lectures: [
        { id: 'higher-order-elements', title: '고차 요소와 정확도 향상', en: 'Higher-Order Elements and Accuracy', slug: 'advanced/higher-order-elements', keywords: ['p-refinement', 'quadratic'] },
        { id: 'isoparametric', title: '등매개변수 요소와 좌표 변환', en: 'Isoparametric Elements and Coordinate Mapping', slug: 'advanced/isoparametric', keywords: ['Jacobian', '야코비안'] },
        { id: 'integration-locking', title: '적분 차수와 수치적 잠김(Locking)', en: 'Integration Order and Numerical Locking', slug: 'advanced/integration-locking', keywords: ['shear locking', 'reduced integration', '저감적분'] },
        { id: 'adaptive-refinement', title: '적응형 메시 세분화', en: 'Adaptive Mesh Refinement', slug: 'advanced/adaptive-refinement', keywords: ['AMR', 'error estimator'] },
        { id: 'nonlinear-materials', title: '비선형 재료와 뉴턴 반복', en: 'Nonlinear Materials and Newton Iteration', slug: 'advanced/nonlinear-materials', keywords: ['Newton-Raphson', 'plasticity', '소성'] },
        { id: 'contact', title: '접촉 문제의 기본 원리', en: 'Fundamentals of Contact Problems', slug: 'advanced/contact', keywords: ['penalty', 'Lagrange multiplier'] },
        { id: 'dynamics', title: '동적 FEM과 시간적분', en: 'Dynamic FEM and Time Integration', slug: 'advanced/dynamics', keywords: ['Newmark', '뉴마크'] },
      ],
    },
    {
      id: 'architecture',
      title: 'FEM 소프트웨어 아키텍처',
      level: 'advanced',
      lectures: [
        { id: 'solver-structure', title: 'FEM 솔버의 전체 소프트웨어 구조', en: 'Overall Software Structure of an FEM Solver', slug: 'architecture/solver-structure' },
        { id: 'object-design', title: 'Mesh·Element·Material 객체 설계', en: 'Designing Mesh, Element, and Material Objects', slug: 'architecture/object-design', keywords: ['OOP', 'class'] },
        { id: 'kernel-assembly-separation', title: '요소 커널과 전역 조립의 분리', en: 'Separating Element Kernels from Global Assembly', slug: 'architecture/kernel-assembly', keywords: ['kernel'] },
        { id: 'csr-coo', title: '희소행렬 자료구조 CSR·COO', en: 'Sparse Matrix Formats: CSR and COO', slug: 'architecture/csr-coo', keywords: ['sparse format'] },
        { id: 'profiling', title: '성능 프로파일링과 병목 분석', en: 'Performance Profiling and Bottleneck Analysis', slug: 'architecture/profiling', keywords: ['cProfile'] },
        { id: 'numpy-scipy-optimization', title: 'NumPy·SciPy 기반 솔버 최적화', en: 'Optimizing Solvers with NumPy and SciPy', slug: 'architecture/numpy-scipy-optimization', keywords: ['vectorization', '벡터화'] },
        { id: 'python-fem-library', title: '재사용 가능한 Python FEM 라이브러리', en: 'A Reusable Python FEM Library', slug: 'architecture/python-library', keywords: ['package', 'API'] },
      ],
    },
    {
      id: 'parallel',
      title: '병렬·분산 FEM 컴퓨팅',
      level: 'expert',
      lectures: [
        { id: 'why-parallel', title: 'FEM 계산에서 병렬화가 필요한 이유', en: 'Why FEM Needs Parallel Computing', slug: 'parallel/why-parallel', keywords: ['HPC'] },
        { id: 'element-parallelism', title: '요소 단위 병렬 계산', en: 'Element-Level Parallelism', slug: 'parallel/element-parallelism' },
        { id: 'domain-decomposition', title: '도메인 분할과 파티셔닝', en: 'Domain Decomposition and Partitioning', slug: 'parallel/domain-decomposition', keywords: ['METIS', 'partitioning'] },
        { id: 'mpi', title: 'MPI와 프로세스 간 통신', en: 'MPI and Inter-Process Communication', slug: 'parallel/mpi', keywords: ['mpi4py'] },
        { id: 'ghost-nodes', title: 'Ghost Node와 경계 데이터 교환', en: 'Ghost Nodes and Halo Exchange', slug: 'parallel/ghost-nodes', keywords: ['halo', '고스트'] },
        { id: 'parallel-assembly-solvers', title: '병렬 희소행렬 조립과 솔버', en: 'Parallel Sparse Assembly and Solvers', slug: 'parallel/parallel-assembly-solvers', keywords: ['PETSc'] },
        { id: 'gpu-acceleration', title: 'GPU 가속과 CPU·GPU 성능 비교', en: 'GPU Acceleration and CPU vs. GPU Performance', slug: 'parallel/gpu-acceleration', keywords: ['CUDA', 'CuPy'] },
        { id: 'scalability', title: '대규모 FEM의 확장성 평가', en: 'Scalability of Large-Scale FEM', slug: 'parallel/scalability', keywords: ['strong scaling', 'weak scaling'] },
      ],
    },
    {
      id: 'research',
      title: '현대 FEM과 최신 연구',
      level: 'research',
      lectures: [
        { id: 'modern-frameworks', title: 'FEniCSx·deal.II 등 현대 FEM 프레임워크', en: 'Modern FEM Frameworks: FEniCSx, deal.II, and More', slug: 'research/modern-frameworks', keywords: ['FEniCS', 'Firedrake'] },
        { id: 'differentiable-fem', title: '자동미분과 미분 가능한 FEM', en: 'Automatic Differentiation and Differentiable FEM', slug: 'research/differentiable-fem', keywords: ['JAX', 'autodiff'] },
        { id: 'rom-digital-twin', title: 'Reduced-Order Modeling과 디지털 트윈', en: 'Reduced-Order Modeling and Digital Twins', slug: 'research/rom-digital-twin', keywords: ['ROM', 'POD', '축소 모델'] },
        { id: 'fem-ml', title: 'FEM과 PINNs·Neural Operators의 결합', en: 'Combining FEM with PINNs and Neural Operators', slug: 'research/fem-ml', keywords: ['PINN', 'machine learning', '머신러닝'] },
        { id: 'multiphysics', title: '다중물리(Multiphysics) 해석', en: 'Multiphysics Analysis', slug: 'research/multiphysics', keywords: ['coupled', '연성'] },
        { id: 'capstone', title: '적응형·병렬 FEM 통합 프로젝트', en: 'Capstone: Adaptive and Parallel FEM', slug: 'research/capstone', keywords: ['통합 프로젝트', 'final project'] },
      ],
    },
  ],
});
