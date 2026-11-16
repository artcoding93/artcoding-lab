// Quantum Simulator Project 데이터 — 브라우저에서 실행되는 1~3큐비트 상태벡터 양자회로 시뮬레이터를 단계별로 구현한다.
//
// 작성 규칙 (fem-solver-project.ts와 같다)
// - Phase 번호는 배열 순서로 자동 계산된다.
// - 강의 연결은 quantum-roadmap.ts의 강의 id로 지정한다(번호·URL과 무관).
// - status 기본값은 'planned'. 실제 코드·데모 페이지가 생기면 결과물에 page/file을 지정하고 상태를 올린다.
//   Phase를 'completed'로 바꾸려면 모든 결과물이 completed여야 하며, 위반 시 빌드가 실패한다.
// - 현재(2026-11) 저장소에는 시뮬레이터 코드가 없으므로 모든 단계가 'planned'다.
import { defineProject } from '../lib/project';

export const quantumSimulatorProject = defineProject({
  id: 'quantum-simulator',
  title: 'Quantum Simulator Project',
  progressLabel: '시뮬레이터 개발 진행률',
  phases: [
    {
      id: 'state-representation',
      name: 'Quantum State Representation',
      title: '양자 상태 표현',
      goal: '양자 상태를 복소수 상태벡터로 표현하고 Python(NumPy)으로 정규화와 측정 확률을 계산한다.',
      topics: ['복소수', '벡터와 행렬', '확률진폭', '정규화', '상태벡터', '텐서곱'],
      deliverables: [
        { id: 'single-qubit-state', title: 'NumPy 기반 단일 큐비트 상태 표현' },
        { id: 'normalize-probability', title: '상태벡터 정규화 및 확률 계산' },
        { id: 'state-plot', title: '간단한 상태 시각화' },
      ],
      lectureIds: [
        'complex-numbers', 'vectors-matrices', 'inner-product-normalization', 'tensor-product',
        'unitary-matrices', 'numpy-quantum-states', 'state-vector',
      ],
    },
    {
      id: 'quantum-gates',
      name: 'Quantum Gates',
      title: '양자 게이트',
      goal: '양자 게이트를 유니터리 행렬로 구현하고, 게이트 적용 전후의 상태와 측정 확률을 비교한다.',
      topics: ['유니터리 연산', 'X·Y·Z 게이트', 'Hadamard 게이트', 'S·T 게이트', '회전 게이트', '게이트 조합'],
      deliverables: [
        { id: 'basic-gates', title: '기본 게이트 Python 구현' },
        { id: 'gate-before-after', title: '게이트 적용 전후 상태 비교' },
        { id: 'probability-change-plot', title: '측정 확률 변화 시각화' },
      ],
      lectureIds: ['bloch-sphere', 'pauli-gates', 'hadamard', 'rotation-gates', 'gate-composition', 'single-qubit-gates-impl'],
    },
    {
      id: 'multi-qubit',
      name: 'Multi-Qubit & Entanglement',
      title: '다중 큐비트와 얽힘',
      goal: '텐서곱으로 2~3큐비트 상태를 만들고, CNOT으로 Bell·GHZ 얽힘 상태를 생성한다.',
      topics: ['텐서곱', '다중 큐비트 상태', 'CNOT', 'Bell 상태', 'GHZ 상태', '측정 확률'],
      deliverables: [
        { id: 'multi-qubit-state', title: '2~3큐비트 상태벡터 계산' },
        { id: 'cnot-gate', title: 'CNOT 게이트' },
        { id: 'bell-ghz', title: 'Bell 및 GHZ 상태 생성' },
      ],
      lectureIds: [
        'two-qubit-states', 'cnot', 'bell-states', 'circuit-diagrams', 'measurement-shots', 'ghz-state',
        'multi-qubit-impl', 'controlled-gates-impl',
      ],
    },
    {
      id: 'circuit-engine',
      name: 'Quantum Circuit Engine',
      title: '양자회로 실행 엔진',
      goal: '회로 데이터 구조에 따라 게이트를 순서대로 적용하고, 측정과 Shots 샘플링까지 수행하는 실행 엔진을 완성한다.',
      topics: ['회로 데이터 구조', '게이트 순서', '상태벡터 갱신', '측정', 'Shots 샘플링', '계산 결과 검증'],
      deliverables: [
        { id: 'python-engine', title: 'Python 양자회로 실행 엔진' },
        { id: 'circuit-tests', title: '기본 회로 테스트' },
        { id: 'sampling-results', title: '측정 확률 및 샘플링 결과' },
      ],
      lectureIds: [
        'measurement-shots', 'simulator-design', 'single-qubit-gates-impl', 'multi-qubit-impl',
        'controlled-gates-impl', 'measurement-impl', 'circuit-engine',
      ],
    },
    {
      id: 'web-simulator',
      name: 'Web Quantum Simulator',
      title: '웹 양자 시뮬레이터',
      goal: '브라우저에서 양자회로를 구성·실행하고 상태벡터, 확률 분포, 블로흐 구면으로 결과를 확인한다.',
      topics: ['회로 편집 UI', '큐비트 레지스터', '게이트 추가·삭제·이동', '회로 실행', '측정 확률 시각화', '블로흐 구면'],
      deliverables: [
        { id: 'circuit-editor', title: '브라우저 기반 양자회로 편집기' },
        { id: 'browser-statevector', title: '상태벡터 시뮬레이션' },
        { id: 'probability-chart', title: '확률 분포 그래프' },
        { id: 'interactive-bloch', title: '인터랙티브 블로흐 구면' },
      ],
      lectureIds: [
        'circuit-editor-design', 'gate-editing', 'state-visualization', 'bloch-interactive', 'example-circuits', 'web-simulator-complete',
      ],
    },
    {
      id: 'algorithms-validation',
      name: 'Algorithms & Validation',
      title: '알고리즘과 검증',
      goal: '대표 양자 알고리즘을 시뮬레이터로 실행하고, 해석적 결과·기존 양자 SDK와 비교해 시뮬레이터를 검증한다.',
      topics: ['Deutsch 알고리즘', 'Deutsch-Jozsa 알고리즘', '작은 규모의 Grover 알고리즘', 'Bell·GHZ 상태', '계산 결과 검증', '양자 SDK와 결과 비교'],
      deliverables: [
        { id: 'example-collection', title: '대표 예제 회로 모음' },
        { id: 'algorithm-results', title: '알고리즘 실행 결과' },
        { id: 'validation-report', title: '테스트 및 검증 보고서' },
        { id: 'final-simulator', title: '최종 교육용 양자 시뮬레이터' },
      ],
      lectureIds: [
        'parallelism-interference', 'deutsch', 'deutsch-jozsa', 'grover', 'qft', 'teleportation',
        'example-circuits', 'web-simulator-complete', 'quantum-sdk', 'validation-extension',
      ],
    },
  ],
  checkpoints: [
    {
      id: 'teleportation-extension',
      afterPhase: 'algorithms-validation',
      title: '확장 기능: 양자 텔레포테이션',
      description:
        '양자 텔레포테이션은 회로 중간의 측정(mid-circuit measurement)과 측정 결과에 따른 조건부 연산이 필요하다. ' +
        '기본 회로 엔진(게이트 적용 → 마지막에 측정)의 지원 범위를 검토한 뒤 별도 확장 기능으로 구현한다.',
      lectureIds: ['teleportation', 'measurement-impl', 'circuit-engine'],
    },
  ],
  components: [
    { name: 'QubitStateViewer', role: '상태벡터의 복소 진폭과 측정 확률을 막대·위상으로 함께 표시', phase: 'state-representation' },
    { name: 'QuantumGateExplorer', role: '게이트를 선택해 적용 전후의 상태벡터와 측정 확률 비교', phase: 'quantum-gates' },
    { name: 'MeasurementVisualizer', role: 'Shots 수를 바꿔 가며 샘플링 히스토그램과 이론 확률 비교', phase: 'multi-qubit' },
    { name: 'QuantumCircuitEditor', role: '1~3큐비트 회로에 게이트를 추가·삭제·이동하고 실행', phase: 'web-simulator' },
    { name: 'BlochSphereViewer', role: '단일 큐비트 상태를 블로흐 구면 위의 점으로 표시하고 게이트에 따른 회전 관찰', phase: 'web-simulator' },
    { name: 'QuantumAlgorithmDemo', role: 'Deutsch-Jozsa·Grover 등 대표 알고리즘을 단계별로 실행하며 진폭 변화 관찰', phase: 'algorithms-validation' },
  ],
});
