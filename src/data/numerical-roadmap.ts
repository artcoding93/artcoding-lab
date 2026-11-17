// 수치해석 학습 로드맵 데이터 (12 Part · 80강)
//
// 작성 규칙
// - 강의 번호는 배열 순서로 자동 계산된다. 순서를 바꾸거나 강의를 끼워 넣어도 URL은 바뀌지 않는다.
// - slug는 /numerical/ 아래 경로이다. 제목·번호와 무관하며, 공개 후에는 바꾸지 않는다.
// - status를 생략하면 'planned'(준비 중)이다.
//   강의 페이지(src/content/docs/numerical/<slug>.mdx)를 실제로 작성한 뒤에만 status: 'published'를 추가한다.
//   published인데 페이지가 없으면 빌드가 실패한다.
// - level을 생략하면 Part의 난이도를 따른다.
import { defineRoadmap } from '../lib/roadmap';

export const numericalRoadmap = defineRoadmap({
  id: 'numerical',
  basePath: 'numerical',
  title: '수치해석',
  parts: [
    {
      id: 'fundamentals',
      title: '수치해석의 기초',
      level: 'basic',
      lectures: [
        { id: 'what-is-numerical-analysis', title: '수치해석이란 무엇인가?', en: 'What Is Numerical Analysis?', slug: 'fundamentals/introduction', status: 'published' },
        { id: 'floating-point', title: '컴퓨터의 부동소수점 표현', en: 'Floating-Point Representation', slug: 'fundamentals/floating-point', keywords: ['IEEE 754', 'machine epsilon'] },
        { id: 'absolute-relative-error', title: '절대오차와 상대오차', en: 'Absolute and Relative Error', slug: 'fundamentals/absolute-relative-error' },
        { id: 'roundoff-truncation-error', title: '반올림오차와 절단오차', en: 'Round-off and Truncation Error', slug: 'fundamentals/roundoff-truncation-error' },
        { id: 'convergence-stability-conditioning', title: '수렴성·안정성·조건수', en: 'Convergence, Stability, and Conditioning', slug: 'fundamentals/convergence-stability-conditioning', keywords: ['condition number'] },
        { id: 'complexity-cost', title: '알고리즘 복잡도와 계산 비용', en: 'Algorithmic Complexity and Computational Cost', slug: 'fundamentals/complexity-cost', keywords: ['Big-O', 'FLOPs'] },
      ],
    },
    {
      id: 'root-finding',
      title: '비선형 방정식의 해',
      level: 'basic',
      lectures: [
        { id: 'root-finding-ivt', title: '근 찾기 문제와 사잇값 정리', en: 'Root-Finding and the Intermediate Value Theorem', slug: 'root-finding/intermediate-value-theorem' },
        // 이전 URL /numerical/bisection/ → astro.config.mjs의 redirects로 이 경로에 연결
        { id: 'bisection', title: '이분법(Bisection Method)', en: 'Bisection Method', slug: 'root-finding/bisection' },
        { id: 'false-position', title: '가위치법과 변형 가위치법', en: 'False Position and Modified False Position', slug: 'root-finding/false-position', keywords: ['regula falsi', 'Illinois'] },
        { id: 'fixed-point-iteration', title: '고정점 반복법', en: 'Fixed-Point Iteration', slug: 'root-finding/fixed-point-iteration' },
        // 이전 URL /numerical/newton-raphson/ → astro.config.mjs의 redirects로 이 경로에 연결
        { id: 'newton-raphson', title: '뉴턴-랩슨 방법', en: 'Newton-Raphson Method', slug: 'root-finding/newton-raphson' },
        { id: 'secant-brent', title: '할선법과 브렌트 방법', en: "Secant Method and Brent's Method", slug: 'root-finding/secant-brent' },
        { id: 'nonlinear-systems-newton', title: '비선형 연립방정식과 뉴턴법', en: "Nonlinear Systems and Newton's Method", slug: 'root-finding/nonlinear-systems', keywords: ['Jacobian', '야코비안'] },
      ],
    },
    {
      id: 'interpolation',
      title: '보간법과 함수 근사',
      level: 'basic',
      lectures: [
        { id: 'polynomial-interpolation', title: '다항식 보간의 기본 원리', en: 'Principles of Polynomial Interpolation', slug: 'interpolation/polynomial-interpolation', keywords: ['Vandermonde', '방데르몽드'] },
        { id: 'lagrange-interpolation', title: '라그랑주 보간법', en: 'Lagrange Interpolation', slug: 'interpolation/lagrange' },
        { id: 'newton-divided-differences', title: '뉴턴 분할차분 보간법', en: 'Newton Divided-Difference Interpolation', slug: 'interpolation/newton-divided-differences' },
        { id: 'interpolation-error-runge', title: '보간오차와 룽게 현상', en: "Interpolation Error and Runge's Phenomenon", slug: 'interpolation/error-runge-phenomenon' },
        { id: 'spline-interpolation', title: '스플라인 보간법', en: 'Spline Interpolation', slug: 'interpolation/splines', keywords: ['cubic spline', '3차 스플라인'] },
        { id: 'least-squares-regression', title: '최소제곱법과 회귀', en: 'Least Squares and Regression', slug: 'interpolation/least-squares' },
        { id: 'chebyshev-approximation', title: '직교다항식과 체비쇼프 근사', en: 'Orthogonal Polynomials and Chebyshev Approximation', slug: 'interpolation/chebyshev-approximation', keywords: ['Legendre', '르장드르'] },
      ],
    },
    {
      id: 'differentiation-integration',
      title: '수치미분과 수치적분',
      level: 'basic',
      lectures: [
        { id: 'finite-difference-differentiation', title: '유한차분과 수치미분', en: 'Finite Differences and Numerical Differentiation', slug: 'differentiation-integration/finite-differences' },
        { id: 'richardson-extrapolation', title: '고차 정확도와 리처드슨 외삽', en: 'Higher-Order Accuracy and Richardson Extrapolation', slug: 'differentiation-integration/richardson-extrapolation' },
        { id: 'trapezoidal-simpson', title: '사다리꼴 공식과 심프슨 공식', en: "Trapezoidal Rule and Simpson's Rule", slug: 'differentiation-integration/trapezoidal-simpson', keywords: ['Newton-Cotes', '뉴턴-코츠'] },
        { id: 'composite-integration', title: '복합 적분 공식과 오차 분석', en: 'Composite Quadrature and Error Analysis', slug: 'differentiation-integration/composite-rules' },
        { id: 'romberg-integration', title: '롬베르크 적분법', en: 'Romberg Integration', slug: 'differentiation-integration/romberg' },
        { id: 'gaussian-quadrature', title: '가우스 구적법', en: 'Gaussian Quadrature', slug: 'differentiation-integration/gaussian-quadrature', keywords: ['Gauss-Legendre'] },
        { id: 'adaptive-quadrature', title: '적응형 수치적분', en: 'Adaptive Quadrature', slug: 'differentiation-integration/adaptive-quadrature' },
      ],
    },
    {
      id: 'linear-algebra',
      title: '수치선형대수',
      level: 'intermediate',
      lectures: [
        { id: 'linear-systems-properties', title: '행렬과 연립방정식의 수치적 성질', en: 'Numerical Properties of Matrices and Linear Systems', slug: 'linear-algebra/linear-systems' },
        { id: 'gaussian-elimination', title: '가우스 소거법과 피벗팅', en: 'Gaussian Elimination and Pivoting', slug: 'linear-algebra/gaussian-elimination' },
        { id: 'lu-cholesky-qr', title: 'LU·Cholesky·QR 분해', en: 'LU, Cholesky, and QR Decompositions', slug: 'linear-algebra/lu-cholesky-qr', keywords: ['숄레스키', '촐레스키', 'factorization'] },
        { id: 'matrix-condition-number', title: '행렬 조건수와 오차 전파', en: 'Matrix Condition Number and Error Propagation', slug: 'linear-algebra/condition-number' },
        { id: 'stationary-iterative-methods', title: 'Jacobi·Gauss-Seidel·SOR 반복법', en: 'Jacobi, Gauss-Seidel, and SOR Iterations', slug: 'linear-algebra/iterative-methods', keywords: ['야코비', '가우스-자이델'] },
        { id: 'conjugate-gradient-krylov', title: 'Conjugate Gradient와 Krylov 부분공간', en: 'Conjugate Gradient and Krylov Subspaces', slug: 'linear-algebra/conjugate-gradient', keywords: ['켤레 기울기', '크릴로프', 'GMRES'] },
        { id: 'eigenvalue-computation', title: '고유값과 고유벡터 계산', en: 'Computing Eigenvalues and Eigenvectors', slug: 'linear-algebra/eigenvalues', keywords: ['power method', '거듭제곱법', 'QR algorithm'] },
        { id: 'svd-least-squares', title: 'SVD와 최소제곱 문제', en: 'SVD and Least-Squares Problems', slug: 'linear-algebra/svd', keywords: ['특이값 분해', 'singular value decomposition'] },
      ],
    },
    {
      id: 'ode',
      title: '상미분방정식의 수치해법',
      level: 'intermediate',
      lectures: [
        { id: 'ivp-euler', title: '초기값 문제와 오일러 방법', en: "Initial Value Problems and Euler's Method", slug: 'ode/euler-method', keywords: ['IVP'] },
        { id: 'improved-euler-midpoint', title: '개선 오일러법과 중점법', en: "Improved Euler (Heun's) and Midpoint Methods", slug: 'ode/heun-midpoint', keywords: ['호인'] },
        { id: 'runge-kutta', title: 'Runge-Kutta 방법', en: 'Runge-Kutta Methods', slug: 'ode/runge-kutta', keywords: ['룽게-쿠타', 'RK4'] },
        { id: 'multistep-predictor-corrector', title: '다단계법과 예측자-수정자 방법', en: 'Multistep and Predictor-Corrector Methods', slug: 'ode/multistep-methods', keywords: ['Adams-Bashforth', 'Adams-Moulton', '애덤스'] },
        { id: 'ode-error-adaptive-step', title: '국소오차·전역오차·적응형 시간간격', en: 'Local and Global Error, Adaptive Step Size', slug: 'ode/error-step-size-control', keywords: ['RK45', 'Dormand-Prince'] },
        { id: 'stiffness-implicit', title: '강직성(Stiffness)과 암시적 방법', en: 'Stiffness and Implicit Methods', slug: 'ode/stiffness', keywords: ['backward Euler', 'BDF', '후진 오일러'] },
        { id: 'bvp-shooting', title: '경계값 문제와 Shooting Method', en: 'Boundary Value Problems and the Shooting Method', slug: 'ode/shooting-method', keywords: ['BVP', '사격법'] },
      ],
    },
    {
      id: 'pde',
      title: '편미분방정식의 수치해법',
      level: 'advanced',
      lectures: [
        { id: 'pde-classification', title: 'PDE의 분류와 물리적 의미', en: 'Classification and Physical Meaning of PDEs', slug: 'pde/classification', keywords: ['편미분방정식'] },
        { id: 'fdm-basics', title: '유한차분법(FDM)의 기초', en: 'Fundamentals of the Finite Difference Method', slug: 'pde/finite-difference-method' },
        { id: 'elliptic-poisson', title: '타원형 PDE와 Poisson 방정식', en: "Elliptic PDEs and Poisson's Equation", slug: 'pde/poisson-equation', keywords: ['푸아송', 'Laplace', '라플라스'] },
        { id: 'parabolic-heat', title: '포물형 PDE와 열전도 방정식', en: 'Parabolic PDEs and the Heat Equation', slug: 'pde/heat-equation', keywords: ['Crank-Nicolson', '크랭크-니콜슨'] },
        { id: 'hyperbolic-wave', title: '쌍곡형 PDE와 파동 방정식', en: 'Hyperbolic PDEs and the Wave Equation', slug: 'pde/wave-equation', keywords: ['advection', '이류'] },
        { id: 'cfl-stability', title: 'CFL 조건과 수치적 안정성', en: 'The CFL Condition and Numerical Stability', slug: 'pde/cfl-stability', keywords: ['Courant', 'von Neumann', '폰 노이만'] },
        { id: 'fvm-basics', title: '유한체적법(FVM) 기초', en: 'Fundamentals of the Finite Volume Method', slug: 'pde/finite-volume-method' },
        { id: 'fem-connection', title: '유한요소법(FEM)과의 연결', en: 'Connecting to the Finite Element Method', slug: 'pde/fem-connection', keywords: ['Galerkin', '갤러킨', 'weak form', '약형식'] },
      ],
    },
    {
      id: 'optimization',
      title: '수치최적화',
      level: 'advanced',
      lectures: [
        { id: 'optimization-problems', title: '최적화 문제와 목적함수', en: 'Optimization Problems and Objective Functions', slug: 'optimization/introduction' },
        { id: 'gradient-descent', title: '경사하강법과 학습률', en: 'Gradient Descent and Learning Rate', slug: 'optimization/gradient-descent' },
        { id: 'newton-quasi-newton', title: '뉴턴법과 준뉴턴법(BFGS)', en: 'Newton and Quasi-Newton Methods (BFGS)', slug: 'optimization/quasi-newton', keywords: ['L-BFGS', 'Hessian', '헤시안'] },
        { id: 'line-search-trust-region', title: '선형 탐색과 Trust Region', en: 'Line Search and Trust-Region Methods', slug: 'optimization/line-search-trust-region', keywords: ['Wolfe', '신뢰 영역'] },
        { id: 'constrained-kkt', title: '제약 최적화와 KKT 조건', en: 'Constrained Optimization and KKT Conditions', slug: 'optimization/constrained-kkt', keywords: ['Lagrange multiplier', '라그랑주 승수'] },
        { id: 'levenberg-marquardt', title: '비선형 최소제곱과 Levenberg-Marquardt', en: 'Nonlinear Least Squares and Levenberg-Marquardt', slug: 'optimization/levenberg-marquardt', keywords: ['Gauss-Newton', '가우스-뉴턴'] },
      ],
    },
    {
      id: 'advanced-theory',
      title: '고급 수치해석 이론',
      level: 'advanced',
      lectures: [
        { id: 'backward-error-analysis', title: '수치적 안정성과 후방오차 분석', en: 'Numerical Stability and Backward Error Analysis', slug: 'advanced-theory/backward-error-analysis' },
        { id: 'consistency-stability-convergence', title: '일관성·안정성·수렴성의 관계', en: 'Consistency, Stability, and Convergence', slug: 'advanced-theory/consistency-stability-convergence', keywords: ['Lax equivalence', '랙스 동치 정리'] },
        { id: 'sparse-large-systems', title: '희소행렬과 대규모 선형시스템', en: 'Sparse Matrices and Large-Scale Linear Systems', slug: 'advanced-theory/sparse-matrices', keywords: ['CSR'] },
        { id: 'preconditioning', title: '전처리(Preconditioning) 기법', en: 'Preconditioning Techniques', slug: 'advanced-theory/preconditioning', keywords: ['ILU', 'multigrid', '다중격자'] },
        { id: 'adaptive-mesh-error-estimation', title: '적응형 메시와 오차 추정', en: 'Adaptive Meshes and Error Estimation', slug: 'advanced-theory/adaptive-mesh', keywords: ['AMR', 'a posteriori'] },
        { id: 'spectral-methods', title: '고차 정확도와 스펙트럴 방법', en: 'High-Order Accuracy and Spectral Methods', slug: 'advanced-theory/spectral-methods', keywords: ['Fourier', '푸리에', 'FFT'] },
      ],
    },
    {
      id: 'hpc',
      title: '과학계산과 고성능 컴퓨팅',
      level: 'expert',
      lectures: [
        { id: 'vectorization', title: '벡터화와 계산 성능 최적화', en: 'Vectorization and Performance Optimization', slug: 'hpc/vectorization', keywords: ['NumPy', 'SIMD'] },
        { id: 'parallel-computing', title: '병렬 수치계산의 기본 원리', en: 'Principles of Parallel Numerical Computing', slug: 'hpc/parallel-computing', keywords: ['MPI', 'OpenMP'] },
        { id: 'gpu-computing', title: 'GPU 기반 수치계산', en: 'GPU-Based Numerical Computing', slug: 'hpc/gpu-computing', keywords: ['CUDA'] },
        { id: 'mixed-precision', title: '혼합정밀도(Mixed Precision) 계산', en: 'Mixed-Precision Computing', slug: 'hpc/mixed-precision', keywords: ['FP16', 'iterative refinement'] },
        { id: 'large-sparse-solvers', title: '대규모 희소행렬 솔버', en: 'Large-Scale Sparse Solvers', slug: 'hpc/sparse-solvers', keywords: ['PETSc', 'direct solver'] },
        { id: 'reproducible-computing', title: '재현 가능한 과학계산', en: 'Reproducible Scientific Computing', slug: 'hpc/reproducibility' },
      ],
    },
    {
      id: 'stochastic-inverse',
      title: '확률적 수치계산과 역문제',
      level: 'expert',
      lectures: [
        { id: 'monte-carlo-integration', title: '몬테카를로 적분', en: 'Monte Carlo Integration', slug: 'stochastic/monte-carlo-integration' },
        { id: 'randomized-algorithms', title: '확률적 수치 알고리즘', en: 'Randomized Numerical Algorithms', slug: 'stochastic/randomized-algorithms', keywords: ['randomized SVD', 'sketching'] },
        { id: 'uncertainty-quantification', title: '불확실성 정량화(UQ)', en: 'Uncertainty Quantification', slug: 'stochastic/uncertainty-quantification' },
        { id: 'inverse-problems-regularization', title: '역문제와 정칙화', en: 'Inverse Problems and Regularization', slug: 'stochastic/inverse-problems', keywords: ['Tikhonov', '티호노프'] },
        { id: 'parameter-estimation-data-assimilation', title: '매개변수 추정과 데이터 동화', en: 'Parameter Estimation and Data Assimilation', slug: 'stochastic/data-assimilation', keywords: ['Kalman filter', '칼만 필터'] },
        { id: 'sde-basics', title: '확률적 미분방정식 기초', en: 'Introduction to Stochastic Differential Equations', slug: 'stochastic/sde', keywords: ['SDE', 'Euler-Maruyama', '오일러-마루야마'] },
      ],
    },
    {
      id: 'ai-numerics',
      title: '최신 수치계산과 AI 융합',
      level: 'research',
      lectures: [
        { id: 'automatic-differentiation', title: '자동미분과 미분 가능한 프로그래밍', en: 'Automatic Differentiation and Differentiable Programming', slug: 'ai/automatic-differentiation', keywords: ['autodiff', 'backpropagation', '역전파'] },
        { id: 'jax-pytorch', title: 'JAX·PyTorch 기반 수치계산', en: 'Numerical Computing with JAX and PyTorch', slug: 'ai/jax-pytorch' },
        { id: 'pinns', title: 'Physics-Informed Neural Networks(PINNs)', en: 'Physics-Informed Neural Networks', slug: 'ai/pinns', keywords: ['물리 정보 신경망', 'PINN'] },
        { id: 'neural-operators', title: 'Neural Operators와 데이터 기반 PDE 솔버', en: 'Neural Operators and Data-Driven PDE Solvers', slug: 'ai/neural-operators', keywords: ['FNO', 'DeepONet', '신경 연산자'] },
        { id: 'differentiable-simulation', title: '미분 가능한 시뮬레이션과 역설계', en: 'Differentiable Simulation and Inverse Design', slug: 'ai/differentiable-simulation' },
        { id: 'ai-verification-limits', title: 'AI 기반 과학계산의 검증과 한계', en: 'Verification and Limits of AI for Scientific Computing', slug: 'ai/verification-limits' },
      ],
    },
  ],
});
