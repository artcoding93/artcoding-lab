// Optical Metrology Simulator Project 데이터 — 정방향 모델로 합성 측정 데이터를 만들고,
// 역해석으로 두께·단차·깊이를 복원하는 브라우저용 교육 시뮬레이터를 단계별로 구현한다.
//
// 작성 규칙 (다른 프로젝트 데이터와 같다)
// - Phase 번호는 배열 순서로 자동 계산된다.
// - 강의 연결은 optical-roadmap.ts의 강의 id로 지정한다(번호·URL과 무관).
//   Part VIII의 기술별 구현 강의(51–55)는 해당 기술 Phase와 통합 Phase 7에 모두 연결한다.
// - status 기본값은 'planned'. 실제 코드·데모 페이지가 생기면 결과물에 page/file을 지정하고 상태를 올린다.
// - 현재(2026-11) 저장소에는 시뮬레이터 코드가 없으므로 모든 단계가 'planned'다.
import { defineProject } from '../lib/project';

export const opticalSimulatorProject = defineProject({
  id: 'optical-simulator',
  title: 'Optical Metrology Simulator Project',
  progressLabel: '시뮬레이터 개발 진행률',
  phases: [
    {
      id: 'signal-generator',
      name: 'Optical Signal Generator',
      title: '광학 신호 생성기',
      goal: '시료·광원 매개변수를 정의하고, 기본 광학 모델로 노이즈가 포함된 합성 측정 신호를 생성·시각화한다.',
      topics: ['파장·굴절률·두께·단차 매개변수', '기본 광학 모델', '합성 신호 생성', '노이즈 추가', '데이터 시각화'],
      deliverables: [
        { id: 'parameter-model', title: '시료·광원 매개변수 모델' },
        { id: 'synthetic-signal', title: '합성 신호·노이즈 생성 함수' },
        { id: 'signal-plot', title: '합성 신호 시각화' },
      ],
      lectureIds: [
        'wavelength-phase', 'reflection-refraction', 'refractive-index', 'interference-coherence', 'opd-phase', 'thickness-step-shape',
        'sampling', 'spectrum-interference', 'noise-snr',
      ],
    },
    {
      id: 'thin-film',
      name: 'Thin-Film Measurement',
      title: '박막 두께 측정',
      goal: 'Fresnel 계수와 Transfer Matrix로 반사율·Ψ·Δ 스펙트럼을 계산하고, 스펙트럼 피팅으로 박막 두께를 역추정한다.',
      topics: ['SR 반사율 모델', 'Fresnel 계수', '다층 박막 모델', '두께 역추정', 'SE 편광 스펙트럼 모델'],
      deliverables: [
        { id: 'reflectance-model', title: 'SR 반사율 모델 (단층·다층 TMM)' },
        { id: 'thickness-inversion', title: '반사율 스펙트럼 기반 두께 역추정' },
        { id: 'se-model', title: 'SE Ψ·Δ 스펙트럼 모델' },
      ],
      lectureIds: [
        'sr-principle', 'fresnel-thin-film', 'single-film-spectrum', 'transfer-matrix', 'thickness-inversion', 'se-principle', 'psi-delta-fitting',
        'sr-se-simulator',
      ],
    },
    {
      id: 'surface-profilometry',
      name: 'Surface Profilometry',
      title: '표면 형상 측정',
      goal: 'WSI·PSI 간섭 신호를 생성하고, 포락선 검출과 위상 복원·위상 펼침으로 표면 높이 지도를 복원한다.',
      topics: ['WSI 간섭 신호', '표면 높이 복원', 'PSI 위상 복원', 'Phase Unwrapping', '2D·3D 표면 형상 시각화'],
      deliverables: [
        { id: 'wsi-height', title: 'WSI 간섭 신호 생성과 높이 복원' },
        { id: 'psi-phase', title: 'PSI 위상 복원과 위상 펼침' },
        { id: 'surface-plot', title: '2D·3D 표면 형상 시각화' },
      ],
      lectureIds: [
        'wsi-principle', 'wsi-envelope', 'height-reconstruction', 'psi-principle', 'phase-retrieval', 'phase-unwrapping', 'interferometry-limits',
        'wsi-psi-simulator',
      ],
    },
    {
      id: 'confocal',
      name: 'Confocal Measurement',
      title: '공초점 측정',
      goal: '축방향 응답과 파장별 초점 위치를 모델링하고, 피크 검출로 표면 높이와 투명층 계면 위치를 추정한다.',
      topics: ['Confocal 축방향 응답', '깊이 스캔', '피크 검출', 'Chromatic Confocal 스펙트럼', '표면 높이·투명층 계면 추정'],
      deliverables: [
        { id: 'axial-response-model', title: 'Confocal 축방향 응답과 깊이 스캔' },
        { id: 'chromatic-model', title: 'Chromatic Confocal 스펙트럼 분석' },
        { id: 'interface-estimation', title: '표면 높이·투명층 계면 추정' },
      ],
      lectureIds: [
        'confocal-principle', 'axial-response', 'depth-scan', 'chromatic-confocal', 'chromatic-spectrum', 'transparent-layer', 'confocal-limits',
        'confocal-simulator',
      ],
    },
    {
      id: 'oct-holography',
      name: 'OCT & Digital Holography',
      title: 'OCT와 디지털 홀로그래피',
      goal: '스펙트럼 간섭 신호에서 FFT로 A-scan 깊이 정보를 복원해 B-scan 영상을 만들고, 디지털 홀로그램에서 복소 광학장의 위상을 복원한다.',
      topics: ['OCT 간섭 신호', 'A-scan 생성', 'B-scan 영상', 'FFT 기반 깊이 복원', '디지털 홀로그램과 위상 복원'],
      deliverables: [
        { id: 'oct-scans', title: 'OCT A-scan·B-scan 생성과 FFT 깊이 복원' },
        { id: 'hologram-phase', title: '디지털 홀로그램 생성과 위상 복원' },
      ],
      lectureIds: [
        'fourier-fft', 'oct-principle', 'low-coherence', 'sd-oct', 'a-scan', 'b-scan', 'dhm-principle', 'hologram-reconstruction',
        'oct-dhm-simulator',
      ],
    },
    {
      id: 'inverse-optimization',
      name: 'Inverse Problems & Optimization',
      title: '역문제와 최적화',
      goal: '모든 측정 기술에 공통으로 쓰는 피팅·최적화 모듈을 만들고, 정답을 아는 합성 데이터로 추정 정확도와 불확도를 평가한다.',
      topics: ['최소제곱 피팅', '비선형 최적화', '초기값과 파라미터 범위', '추정값과 정답 비교', '노이즈·불확도 분석', '알고리즘 성능 비교'],
      deliverables: [
        { id: 'fitting-module', title: '최소제곱·비선형 최적화 피팅 모듈' },
        { id: 'truth-comparison', title: '추정값–정답 비교와 불확도 분석' },
        { id: 'algorithm-benchmark', title: '알고리즘 성능 비교 보고서' },
      ],
      lectureIds: [
        'filtering-fitting', 'least-squares', 'forward-inverse',
        'resolution-accuracy-precision', 'uncertainty', 'initial-guess', 'identifiability', 'robust-estimation', 'synthetic-real-validation', 'method-comparison',
        'inverse-integration',
      ],
    },
    {
      id: 'web-simulator',
      name: 'Integrated Web Simulator',
      title: '통합 웹 시뮬레이터',
      goal: '측정 모드와 시료 매개변수를 브라우저에서 바꿔 합성 데이터를 만들고, 역해석 결과와 기술별 한계를 비교하는 통합 시뮬레이터를 완성한다.',
      topics: ['기술별 측정 모드 선택', '시료 모델과 매개변수 조작', '합성 측정 데이터 생성', '역해석 실행', '측정 결과 시각화', '기술별 결과 및 한계 비교'],
      deliverables: [
        { id: 'mode-parameter-ui', title: '측정 모드 선택·매개변수 조작 UI' },
        { id: 'browser-inversion', title: '브라우저 합성 데이터 생성과 역해석' },
        { id: 'method-comparison-view', title: '기술별 결과·한계 비교 화면' },
      ],
      lectureIds: [
        'simulator-architecture', 'sr-se-simulator', 'wsi-psi-simulator', 'confocal-simulator', 'oct-dhm-simulator', 'inverse-integration', 'simulator-complete',
      ],
    },
  ],
  checkpoints: [
    {
      id: 'real-data-validation',
      afterPhase: 'web-simulator',
      title: '확장: 실측·표준시료 데이터 검증',
      description:
        '합성 데이터로 검증한 알고리즘을 출처가 명확한 공개 실측 데이터나 표준시료 데이터에 적용해 확인한다. ' +
        '실측 데이터는 출처·조건과 함께 합성 데이터와 구분해 표시하며, 확보되지 않은 데이터를 실제 측정값처럼 만들지 않는다.',
      lectureIds: ['uncertainty', 'synthetic-real-validation', 'method-comparison'],
    },
  ],
  components: [
    { name: 'OpticalLayerViewer', role: '기판·박막·표면 단차로 이루어진 시료 모델의 층 구조와 매개변수 표시', phase: 'signal-generator' },
    { name: 'ReflectanceSpectrumViewer', role: '두께·굴절률을 바꾸며 단층·다층 박막의 반사율 스펙트럼 변화 관찰', phase: 'thin-film' },
    { name: 'EllipsometryExplorer', role: '입사각·박막 조건에 따른 Ψ·Δ 스펙트럼 변화와 피팅 결과 비교', phase: 'thin-film' },
    { name: 'InterferogramViewer', role: 'WSI 스캔 신호와 포락선, PSI 간섭무늬를 표시하고 높이 복원 과정 확인', phase: 'surface-profilometry' },
    { name: 'PhaseUnwrappingViewer', role: '감긴 위상(wrapped phase)과 펼친 위상을 나란히 비교', phase: 'surface-profilometry' },
    { name: 'ConfocalResponseViewer', role: '축방향 응답 곡선과 파장별 초점 위치에서 피크 검출 과정 표시', phase: 'confocal' },
    { name: 'OCTScanViewer', role: '스펙트럼 간섭 신호 → FFT → A-scan → B-scan 영상 단계별 표시', phase: 'oct-holography' },
    { name: 'HologramViewer', role: '홀로그램과 복원된 진폭·위상 영상 비교', phase: 'oct-holography' },
    { name: 'ParameterFittingExplorer', role: '초기값과 범위를 바꿔 피팅 수렴 과정, 국소 최적해, 정답과의 차이 관찰', phase: 'inverse-optimization' },
    { name: 'MeasurementErrorAnalyzer', role: '노이즈 수준별 반복 추정으로 오차 분포와 불확도 분석', phase: 'inverse-optimization' },
  ],
});
