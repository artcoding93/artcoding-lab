// 양자컴퓨팅 학습 로드맵 데이터 (8 Part · 48강)
//
// 작성 규칙은 numerical-roadmap.ts·fem-roadmap.ts와 같다.
// - 강의 번호는 배열 순서로 자동 계산된다. URL은 slug로 고정된다(/quantum/<slug>/).
// - status를 생략하면 'planned'. 실제 강의 페이지를 작성한 뒤에만 status: 'published'를 추가한다.
// - 강의 id는 시뮬레이터 프로젝트(quantum-simulator-project.ts)에서 Phase와 강의를 연결하는 키다. 한 번 정하면 바꾸지 않는다.
// - 난이도: Part VI·VII는 'advanced'를 '프로젝트', Part VIII는 'expert'를 '확장'으로 표시한다(levelLabels).
import { defineRoadmap } from '../lib/roadmap';

export const quantumRoadmap = defineRoadmap({
  id: 'quantum',
  basePath: 'quantum',
  title: '양자컴퓨팅',
  levelLabels: { advanced: '프로젝트', expert: '확장' },
  searchExamples: ['블로흐', 'CNOT'],
  parts: [
    {
      id: 'basics',
      title: '양자 세계를 이해하기',
      level: 'intro',
      lectures: [
        { id: 'what-is-qc', title: '양자컴퓨팅이란 무엇인가?', en: 'What Is Quantum Computing?', slug: 'basics/what-is-quantum-computing', keywords: ['quantum computing', '양자컴퓨터'] },
        { id: 'bits-vs-qubits', title: '고전 비트와 큐비트의 차이', en: 'Classical Bits vs. Qubits', slug: 'basics/bits-vs-qubits', keywords: ['qubit', 'bit'] },
        { id: 'wave-particle', title: '빛과 물질의 파동·입자 성질', en: 'Wave–Particle Duality', slug: 'basics/wave-particle-duality', keywords: ['이중성', '이중 슬릿', 'double slit'] },
        { id: 'superposition-concept', title: '양자 중첩의 의미', en: 'What Superposition Means', slug: 'basics/superposition', keywords: ['superposition'] },
        { id: 'measurement-concept', title: '양자 측정과 확률', en: 'Quantum Measurement and Probability', slug: 'basics/measurement-probability', keywords: ['measurement', '본 규칙', 'born rule'] },
        { id: 'entanglement-concept', title: '양자 얽힘은 무엇인가?', en: 'What Is Entanglement?', slug: 'basics/entanglement', keywords: ['entanglement'] },
      ],
    },
    {
      id: 'math',
      title: '양자컴퓨팅에 필요한 수학',
      level: 'basic',
      lectures: [
        { id: 'complex-numbers', title: '복소수와 복소평면', en: 'Complex Numbers and the Complex Plane', slug: 'math/complex-numbers', keywords: ['complex', '오일러 공식', 'euler'] },
        { id: 'vectors-matrices', title: '벡터와 행렬의 기초', en: 'Vectors and Matrices', slug: 'math/vectors-matrices', keywords: ['선형대수', 'linear algebra'] },
        { id: 'inner-product-normalization', title: '내적·정규화·확률진폭', en: 'Inner Products, Normalization, and Amplitudes', slug: 'math/inner-product-normalization', keywords: ['inner product', 'amplitude', '브라켓', 'bra-ket', 'dirac'] },
        { id: 'tensor-product', title: '텐서곱과 다중 큐비트', en: 'Tensor Products and Multiple Qubits', slug: 'math/tensor-product', keywords: ['tensor product', 'kronecker', '크로네커'] },
        { id: 'unitary-matrices', title: '유니터리 행렬과 양자 상태 변화', en: 'Unitary Matrices and State Evolution', slug: 'math/unitary-matrices', keywords: ['unitary', '켤레전치', 'hermitian'] },
        { id: 'numpy-quantum-states', title: 'Python NumPy로 양자 상태 표현하기', en: 'Representing Quantum States with NumPy', slug: 'math/numpy-quantum-states', keywords: ['numpy', 'python'] },
      ],
    },
    {
      id: 'qubits-gates',
      title: '큐비트와 양자 게이트',
      level: 'basic',
      lectures: [
        { id: 'state-vector', title: '큐비트 상태벡터 이해하기', en: 'The Qubit State Vector', slug: 'qubits/state-vector', keywords: ['state vector'] },
        { id: 'bloch-sphere', title: '블로흐 구면(Bloch Sphere)', en: 'The Bloch Sphere', slug: 'qubits/bloch-sphere', keywords: ['블로흐 구'] },
        { id: 'pauli-gates', title: 'X·Y·Z 게이트', en: 'Pauli X, Y, Z Gates', slug: 'qubits/pauli-gates', keywords: ['pauli', '파울리', 'not 게이트', 'bit flip', 'phase flip'] },
        { id: 'hadamard', title: 'Hadamard 게이트와 중첩', en: 'The Hadamard Gate and Superposition', slug: 'qubits/hadamard', keywords: ['아다마르', 'h 게이트'] },
        { id: 'rotation-gates', title: '회전 게이트 Rx·Ry·Rz', en: 'Rotation Gates Rx, Ry, Rz', slug: 'qubits/rotation-gates', keywords: ['rotation'] },
        { id: 'gate-composition', title: '게이트 조합과 측정 확률', en: 'Composing Gates and Measurement Probabilities', slug: 'qubits/gate-composition', keywords: ['s 게이트', 't 게이트', 'phase gate'] },
      ],
    },
    {
      id: 'multi-qubit',
      title: '다중 큐비트와 양자회로',
      level: 'intermediate',
      lectures: [
        { id: 'two-qubit-states', title: '2큐비트 상태 표현', en: 'Two-Qubit States', slug: 'circuits/two-qubit-states', keywords: ['two qubit'] },
        { id: 'cnot', title: 'CNOT 게이트', en: 'The CNOT Gate', slug: 'circuits/cnot', keywords: ['controlled not', '제어 not', 'cx'] },
        { id: 'bell-states', title: 'Bell 상태와 얽힘 생성', en: 'Bell States and Creating Entanglement', slug: 'circuits/bell-states', keywords: ['벨 상태', 'epr'] },
        { id: 'circuit-diagrams', title: '양자회로 읽고 그리기', en: 'Reading and Drawing Quantum Circuits', slug: 'circuits/circuit-diagrams', keywords: ['circuit', '회로도'] },
        { id: 'measurement-shots', title: '측정과 샷(Shots) 시뮬레이션', en: 'Measurement and Shot Simulation', slug: 'circuits/measurement-shots', keywords: ['shots', '샘플링', 'sampling', '히스토그램'] },
        { id: 'ghz-state', title: 'GHZ 상태 만들기', en: 'Creating the GHZ State', slug: 'circuits/ghz-state', keywords: ['ghz', '3큐비트'] },
      ],
    },
    {
      id: 'algorithms',
      title: '양자 알고리즘 체험',
      level: 'intermediate',
      lectures: [
        { id: 'parallelism-interference', title: '양자 병렬성과 간섭의 차이', en: 'Quantum Parallelism vs. Interference', slug: 'algorithms/parallelism-interference', keywords: ['interference', 'parallelism', '오라클', 'oracle'] },
        { id: 'deutsch', title: 'Deutsch 알고리즘', en: "Deutsch's Algorithm", slug: 'algorithms/deutsch', keywords: ['도이치'] },
        { id: 'deutsch-jozsa', title: 'Deutsch-Jozsa 알고리즘', en: 'The Deutsch–Jozsa Algorithm', slug: 'algorithms/deutsch-jozsa', keywords: ['도이치-조사'] },
        { id: 'grover', title: 'Grover 검색 알고리즘', en: "Grover's Search Algorithm", slug: 'algorithms/grover', keywords: ['그로버', 'amplitude amplification', '진폭 증폭'] },
        { id: 'qft', title: '양자 푸리에 변환(QFT) 기초', en: 'Quantum Fourier Transform Basics', slug: 'algorithms/qft', keywords: ['quantum fourier transform', '푸리에'] },
        { id: 'teleportation', title: '양자 텔레포테이션 프로토콜', en: 'The Quantum Teleportation Protocol', slug: 'algorithms/teleportation', keywords: ['teleportation', '순간이동'] },
      ],
    },
    {
      id: 'python-simulator',
      title: 'Python으로 양자 시뮬레이터 만들기',
      level: 'advanced',
      lectures: [
        { id: 'simulator-design', title: '상태벡터 시뮬레이터 설계', en: 'Designing a State-Vector Simulator', slug: 'python-simulator/design', keywords: ['statevector', 'simulator'] },
        { id: 'single-qubit-gates-impl', title: '단일 큐비트 게이트 구현', en: 'Implementing Single-Qubit Gates', slug: 'python-simulator/single-qubit-gates', keywords: ['구현'] },
        { id: 'multi-qubit-impl', title: '다중 큐비트와 텐서곱 구현', en: 'Implementing Multi-Qubit States and Tensor Products', slug: 'python-simulator/multi-qubit', keywords: ['kron', '구현'] },
        { id: 'controlled-gates-impl', title: 'CNOT·제어 게이트 구현', en: 'Implementing CNOT and Controlled Gates', slug: 'python-simulator/controlled-gates', keywords: ['controlled gate', '구현'] },
        { id: 'measurement-impl', title: '측정과 확률 샘플링 구현', en: 'Implementing Measurement and Sampling', slug: 'python-simulator/measurement', keywords: ['shots', 'sampling', '구현'] },
        { id: 'circuit-engine', title: '양자회로 실행 엔진 완성', en: 'Completing the Circuit Execution Engine', slug: 'python-simulator/circuit-engine', keywords: ['engine', '엔진'] },
      ],
    },
    {
      id: 'web-simulator',
      title: '웹 기반 양자 시뮬레이터',
      level: 'advanced',
      lectures: [
        { id: 'circuit-editor-design', title: '양자회로 편집기 설계', en: 'Designing a Circuit Editor', slug: 'web-simulator/circuit-editor-design', keywords: ['editor', 'ui'] },
        { id: 'gate-editing', title: '게이트 추가·삭제·이동', en: 'Adding, Removing, and Moving Gates', slug: 'web-simulator/gate-editing', keywords: ['드래그', 'drag'] },
        { id: 'state-visualization', title: '상태벡터와 확률 시각화', en: 'Visualizing State Vectors and Probabilities', slug: 'web-simulator/state-visualization', keywords: ['visualization', '그래프'] },
        { id: 'bloch-interactive', title: '블로흐 구면 인터랙티브 구현', en: 'Building an Interactive Bloch Sphere', slug: 'web-simulator/bloch-sphere', keywords: ['bloch', 'canvas', 'svg'] },
        { id: 'example-circuits', title: 'Bell·GHZ·Grover 예제 제공', en: 'Bell, GHZ, and Grover Examples', slug: 'web-simulator/example-circuits', keywords: ['예제', 'example'] },
        { id: 'web-simulator-complete', title: '웹 양자 시뮬레이터 완성', en: 'Completing the Web Quantum Simulator', slug: 'web-simulator/complete', keywords: ['web', '브라우저'] },
      ],
    },
    {
      id: 'beyond',
      title: '양자컴퓨팅의 현실과 확장',
      level: 'expert',
      lectures: [
        { id: 'noise-decoherence', title: '양자 노이즈와 디코히런스', en: 'Quantum Noise and Decoherence', slug: 'beyond/noise-decoherence', keywords: ['noise', 'decoherence', '결어긋남'] },
        { id: 'error-correction', title: '양자 오류 정정의 기본 개념', en: 'Basics of Quantum Error Correction', slug: 'beyond/error-correction', keywords: ['qec', 'error correction'] },
        { id: 'quantum-hardware', title: '실제 양자 하드웨어의 구조', en: 'How Real Quantum Hardware Works', slug: 'beyond/quantum-hardware', keywords: ['hardware', '초전도', '이온 트랩'] },
        { id: 'quantum-sdk', title: 'Qiskit 등 양자 SDK 활용', en: 'Using Quantum SDKs such as Qiskit', slug: 'beyond/quantum-sdk', keywords: ['qiskit', 'sdk', 'cirq'] },
        { id: 'applications-limits', title: '양자컴퓨팅의 활용과 한계', en: 'Applications and Limits of Quantum Computing', slug: 'beyond/applications-limits', keywords: ['활용', '한계'] },
        { id: 'validation-extension', title: '시뮬레이터 검증 및 확장 프로젝트', en: 'Validating and Extending the Simulator', slug: 'beyond/validation-extension', keywords: ['검증', 'validation', '테스트'] },
      ],
    },
  ],
});
