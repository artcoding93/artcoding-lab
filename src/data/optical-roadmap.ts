// 광학 계측과 계산 영상 학습 로드맵 데이터 (8 Part · 56강)
//
// 작성 규칙은 다른 분야 로드맵과 같다.
// - 강의 번호는 배열 순서로 자동 계산된다. URL은 slug로 고정된다(/optical/<slug>/).
// - status를 생략하면 'planned'. 실제 강의 페이지를 작성한 뒤에만 status: 'published'를 추가한다.
// - 강의 id는 시뮬레이터 프로젝트(optical-simulator-project.ts)에서 Phase와 강의를 연결하는 키다.
// - 난이도: Part III(기초·중급), Part VI(중급·심화)는 강의별 level로 나눈다. Part VIII는 'expert'를 '프로젝트'로 표시한다.
import { defineRoadmap } from '../lib/roadmap';

export const opticalRoadmap = defineRoadmap({
  id: 'optical',
  basePath: 'optical',
  title: '광학 계측과 계산 영상',
  levelLabels: { expert: '프로젝트' },
  searchExamples: ['OCT', '위상 펼침'],
  parts: [
    {
      id: 'fundamentals',
      title: '광학 계측의 기초',
      level: 'intro',
      lectures: [
        { id: 'what-is-optical-metrology', title: '광학 계측이란 무엇인가?', en: 'What Is Optical Metrology?', slug: 'fundamentals/what-is-optical-metrology', keywords: ['metrology', '계측'] },
        { id: 'wavelength-phase', title: '빛의 파장·주파수·위상', en: 'Wavelength, Frequency, and Phase of Light', slug: 'fundamentals/wavelength-frequency-phase', keywords: ['wavelength', 'phase'] },
        { id: 'reflection-refraction', title: '반사와 굴절의 기본 원리', en: 'Reflection and Refraction', slug: 'fundamentals/reflection-refraction', keywords: ['snell', '스넬'] },
        { id: 'refractive-index', title: '굴절률과 복소 굴절률', en: 'Refractive Index and Complex Refractive Index', slug: 'fundamentals/complex-refractive-index', keywords: ['n', 'k', '소광계수', 'extinction'] },
        { id: 'interference-coherence', title: '빛의 간섭과 결맞음(Coherence)', en: 'Interference and Coherence', slug: 'fundamentals/interference-coherence', keywords: ['interference', '간섭'] },
        { id: 'opd-phase', title: '광학적 경로차(OPD)와 위상차', en: 'Optical Path Difference and Phase Difference', slug: 'fundamentals/optical-path-difference', keywords: ['optical path difference', '광경로차'] },
        { id: 'thickness-step-shape', title: '박막 두께·단차·표면 형상의 차이', en: 'Film Thickness vs. Step Height vs. Surface Form', slug: 'fundamentals/thickness-step-surface', keywords: ['광학적 두께', 'optical thickness', 'step height'] },
      ],
    },
    {
      id: 'signal-processing',
      title: '광학 신호처리와 역문제',
      level: 'basic',
      lectures: [
        { id: 'sampling', title: '측정 신호의 샘플링과 디지털화', en: 'Sampling and Digitizing Measurement Signals', slug: 'signal-processing/sampling-digitization', keywords: ['sampling', 'nyquist', '나이퀴스트'] },
        { id: 'fourier-fft', title: 'Fourier Transform과 FFT', en: 'The Fourier Transform and FFT', slug: 'signal-processing/fourier-fft', keywords: ['푸리에', 'fft'] },
        { id: 'spectrum-interference', title: '스펙트럼과 간섭 신호의 관계', en: 'Spectra and Interference Signals', slug: 'signal-processing/spectrum-interference', keywords: ['spectrum'] },
        { id: 'noise-snr', title: '노이즈와 신호 대 잡음비(SNR)', en: 'Noise and Signal-to-Noise Ratio', slug: 'signal-processing/noise-snr', keywords: ['noise', 'snr', '잡음'] },
        { id: 'filtering-fitting', title: '필터링·피크 검출·곡선 피팅', en: 'Filtering, Peak Detection, and Curve Fitting', slug: 'signal-processing/filtering-peak-fitting', keywords: ['filter', 'peak', 'fitting'] },
        { id: 'least-squares', title: '최소제곱법과 비선형 최적화', en: 'Least Squares and Nonlinear Optimization', slug: 'signal-processing/least-squares-optimization', keywords: ['least squares', 'levenberg-marquardt', 'scipy'] },
        { id: 'forward-inverse', title: '정방향 모델과 역문제의 이해', en: 'Forward Models and Inverse Problems', slug: 'signal-processing/forward-inverse-problems', keywords: ['forward model', 'inverse problem'] },
      ],
    },
    {
      id: 'thin-film',
      title: '분광 기반 박막 두께 측정',
      level: 'basic',
      lectures: [
        { id: 'sr-principle', title: 'SR(Spectral Reflectometry)의 원리', en: 'Principles of Spectral Reflectometry', slug: 'thin-film/spectral-reflectometry', keywords: ['반사율 분광', 'reflectometry'] },
        { id: 'fresnel-thin-film', title: 'Fresnel 반사계수와 박막 간섭', en: 'Fresnel Coefficients and Thin-Film Interference', slug: 'thin-film/fresnel-interference', keywords: ['프레넬'] },
        { id: 'single-film-spectrum', title: '단일 박막 반사율 스펙트럼 생성', en: 'Generating a Single-Layer Reflectance Spectrum', slug: 'thin-film/single-layer-spectrum', keywords: ['reflectance'] },
        { id: 'transfer-matrix', title: '다층 박막과 Transfer Matrix Method', en: 'Multilayer Films and the Transfer Matrix Method', slug: 'thin-film/transfer-matrix-method', level: 'intermediate', keywords: ['tmm', '전달 행렬'] },
        { id: 'thickness-inversion', title: '반사율 스펙트럼을 이용한 두께 역추정', en: 'Thickness Inversion from Reflectance Spectra', slug: 'thin-film/thickness-fitting', level: 'intermediate', keywords: ['두께 피팅'] },
        { id: 'se-principle', title: 'SE(Spectroscopic Ellipsometry)의 원리', en: 'Principles of Spectroscopic Ellipsometry', slug: 'thin-film/spectroscopic-ellipsometry', level: 'intermediate', keywords: ['엘립소미터', '편광'] },
        { id: 'psi-delta-fitting', title: 'Ψ·Δ 스펙트럼과 광학상수 피팅', en: 'Ψ/Δ Spectra and Optical Constant Fitting', slug: 'thin-film/psi-delta-fitting', level: 'intermediate', keywords: ['psi', 'delta', 'cauchy', '분산 모델'] },
      ],
    },
    {
      id: 'interferometry',
      title: '간섭 기반 표면 형상 측정',
      level: 'intermediate',
      lectures: [
        { id: 'wsi-principle', title: 'WSI(White-light Scanning Interferometry)의 원리', en: 'Principles of White-Light Scanning Interferometry', slug: 'interferometry/white-light-scanning', keywords: ['백색광 간섭계', 'csi', 'vsi'] },
        { id: 'wsi-envelope', title: '백색광 간섭 신호와 포락선', en: 'White-Light Interference Signals and Envelopes', slug: 'interferometry/white-light-envelope', keywords: ['envelope', 'hilbert', '힐베르트'] },
        { id: 'height-reconstruction', title: '수직 스캔 데이터를 이용한 표면 높이 복원', en: 'Surface Height from Vertical Scan Data', slug: 'interferometry/height-reconstruction', keywords: ['height map'] },
        { id: 'psi-principle', title: 'PSI(Phase-Shifting Interferometry)의 원리', en: 'Principles of Phase-Shifting Interferometry', slug: 'interferometry/phase-shifting', keywords: ['위상 이동 간섭계'] },
        { id: 'phase-retrieval', title: '위상 이동 알고리즘과 위상 복원', en: 'Phase-Shifting Algorithms and Phase Retrieval', slug: 'interferometry/phase-shift-algorithms', keywords: ['4-step', '4단계'] },
        { id: 'phase-unwrapping', title: '위상 펼침(Phase Unwrapping)', en: 'Phase Unwrapping', slug: 'interferometry/phase-unwrapping', keywords: ['unwrap'] },
        { id: 'interferometry-limits', title: 'WSI·PSI의 분해능과 측정 한계', en: 'Resolution and Limits of WSI and PSI', slug: 'interferometry/resolution-limits', keywords: ['resolution', '분해능'] },
      ],
    },
    {
      id: 'confocal',
      title: '공초점 기반 높이 및 두께 측정',
      level: 'intermediate',
      lectures: [
        { id: 'confocal-principle', title: 'Confocal 측정의 광학 원리', en: 'Optical Principles of Confocal Measurement', slug: 'confocal/confocal-principle', keywords: ['공초점', 'pinhole', '핀홀'] },
        { id: 'axial-response', title: '초점 응답과 Axial Response', en: 'Focus Response and Axial Response', slug: 'confocal/axial-response', keywords: ['축방향 응답'] },
        { id: 'depth-scan', title: '깊이 스캔을 이용한 표면 높이 추정', en: 'Surface Height Estimation by Depth Scanning', slug: 'confocal/depth-scan-height', keywords: ['z-scan'] },
        { id: 'chromatic-confocal', title: 'Chromatic Confocal의 원리', en: 'Principles of Chromatic Confocal Sensing', slug: 'confocal/chromatic-confocal', keywords: ['색수차', 'chromatic aberration'] },
        { id: 'chromatic-spectrum', title: '파장별 초점 위치와 스펙트럼 분석', en: 'Wavelength-Dependent Focus and Spectral Analysis', slug: 'confocal/wavelength-focus-spectrum', keywords: ['spectrum'] },
        { id: 'transparent-layer', title: '투명층의 계면 검출과 굴절률 보정', en: 'Interface Detection and Index Correction in Transparent Layers', slug: 'confocal/transparent-layer-interfaces', keywords: ['계면', 'interface'] },
        { id: 'confocal-limits', title: '공초점 방식의 정확도와 한계', en: 'Accuracy and Limits of Confocal Methods', slug: 'confocal/accuracy-limits', keywords: ['한계'] },
      ],
    },
    {
      id: 'oct-holography',
      title: '광학 단층 영상과 디지털 홀로그래피',
      level: 'intermediate',
      lectures: [
        { id: 'oct-principle', title: 'OCT(Optical Coherence Tomography)의 원리', en: 'Principles of Optical Coherence Tomography', slug: 'oct-holography/oct-principle', keywords: ['광간섭 단층촬영', '단층 영상'] },
        { id: 'low-coherence', title: '저결맞음 간섭과 깊이 분해', en: 'Low-Coherence Interference and Depth Resolution', slug: 'oct-holography/low-coherence-depth', keywords: ['oct', 'coherence length', '결맞음 길이'] },
        { id: 'sd-oct', title: 'Spectral-Domain OCT와 FFT', en: 'Spectral-Domain OCT and the FFT', slug: 'oct-holography/spectral-domain-oct', keywords: ['sd-oct', 'fourier domain'] },
        { id: 'a-scan', title: 'A-scan 신호 생성 및 깊이 복원', en: 'Generating A-Scans and Recovering Depth', slug: 'oct-holography/a-scan', level: 'advanced', keywords: ['oct', 'ascan'] },
        { id: 'b-scan', title: 'B-scan 단층 영상 생성', en: 'Building B-Scan Tomograms', slug: 'oct-holography/b-scan', level: 'advanced', keywords: ['oct', 'bscan'] },
        { id: 'dhm-principle', title: 'Digital Holographic Microscopy의 원리', en: 'Principles of Digital Holographic Microscopy', slug: 'oct-holography/digital-holographic-microscopy', level: 'advanced', keywords: ['dhm', '디지털 홀로그래피'] },
        { id: 'hologram-reconstruction', title: '홀로그램 생성과 복소 광학장 복원', en: 'Hologram Generation and Complex Field Reconstruction', slug: 'oct-holography/hologram-reconstruction', level: 'advanced', keywords: ['hologram', '홀로그램', 'angular spectrum'] },
      ],
    },
    {
      id: 'accuracy',
      title: '측정 정확도와 최적화',
      level: 'advanced',
      lectures: [
        { id: 'resolution-accuracy-precision', title: '광학 계측에서 분해능·정확도·정밀도', en: 'Resolution, Accuracy, and Precision', slug: 'accuracy/resolution-accuracy-precision', keywords: ['accuracy', 'precision'] },
        { id: 'uncertainty', title: '측정 불확도와 오차 전파', en: 'Measurement Uncertainty and Error Propagation', slug: 'accuracy/uncertainty-propagation', keywords: ['uncertainty', 'gum'] },
        { id: 'initial-guess', title: '모델 피팅의 초기값과 국소 최적해', en: 'Initial Guesses and Local Minima in Model Fitting', slug: 'accuracy/initial-values-local-minima', keywords: ['local minimum', '전역 최적화'] },
        { id: 'identifiability', title: '다중 매개변수 추정과 식별 가능성', en: 'Multi-Parameter Estimation and Identifiability', slug: 'accuracy/multi-parameter-identifiability', keywords: ['상관관계', 'correlation'] },
        { id: 'robust-estimation', title: '노이즈에 강한 추정 알고리즘', en: 'Noise-Robust Estimation Algorithms', slug: 'accuracy/robust-estimation', keywords: ['robust'] },
        { id: 'synthetic-real-validation', title: '합성 데이터와 실제 측정 데이터 검증', en: 'Validating with Synthetic and Real Measurement Data', slug: 'accuracy/synthetic-real-validation', keywords: ['실측', '표준시료', 'validation'] },
        { id: 'method-comparison', title: '측정 방법별 적용 범위와 한계 비교', en: 'Comparing Measurement Methods: Scope and Limits', slug: 'accuracy/method-comparison', keywords: ['비교'] },
      ],
    },
    {
      id: 'simulator',
      title: '통합 광학 계측 시뮬레이터',
      level: 'expert',
      lectures: [
        { id: 'simulator-architecture', title: 'Optical Metrology Simulator 아키텍처', en: 'Optical Metrology Simulator Architecture', slug: 'simulator/architecture', keywords: ['설계'] },
        { id: 'sr-se-simulator', title: 'SR·SE 시뮬레이터 구현', en: 'Implementing the SR and SE Simulators', slug: 'simulator/sr-se', keywords: ['구현'] },
        { id: 'wsi-psi-simulator', title: 'WSI·PSI 시뮬레이터 구현', en: 'Implementing the WSI and PSI Simulators', slug: 'simulator/wsi-psi', keywords: ['구현'] },
        { id: 'confocal-simulator', title: 'Confocal·Chromatic Confocal 시뮬레이터 구현', en: 'Implementing the Confocal Simulators', slug: 'simulator/confocal', keywords: ['구현'] },
        { id: 'oct-dhm-simulator', title: 'OCT·DHM 시뮬레이터 구현', en: 'Implementing the OCT and DHM Simulators', slug: 'simulator/oct-dhm', keywords: ['구현'] },
        { id: 'inverse-integration', title: '역해석·최적화·오차 분석 기능 통합', en: 'Integrating Inversion, Optimization, and Error Analysis', slug: 'simulator/inverse-analysis', keywords: ['통합'] },
        { id: 'simulator-complete', title: '통합 광학 계측 시뮬레이터 완성', en: 'Completing the Integrated Optical Metrology Simulator', slug: 'simulator/complete', keywords: ['web', '브라우저'] },
      ],
    },
  ],
});
