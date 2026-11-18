# CLAUDE.md — artcoding Lab 개발 지침

이 문서는 artcoding Lab의 학습 콘텐츠와 웹 기능을 개발할 때 항상 따르는 공통 규칙이다.
개발 서버 실행 방법과 Astro 공식 문서 링크는 [AGENTS.md](AGENTS.md)를 함께 참고한다.

---

## 1. 프로젝트 개요

- **프로젝트명**: artcoding Lab
- **슬로건**: 공학을 코드로 이해하다
- **목적**: 수학적·공학적 이론을 코드로 구현하고, 시각화와 인터랙티브 실습으로 학습하는 교육 플랫폼
- **대상**: 컴퓨터공학·공학계열 대학생, 관련 분야 입문자
- **학습 분야**: 수치해석(Numerical Methods), 유한요소법(Finite Element Method, FEM), 양자컴퓨팅(Quantum Computing), 광학 계측과 계산 영상(Optical Metrology & Computational Imaging), 메시 생성 알고리즘 연구(Mesh Generation Research Lab, 논문 기반 연구 플랫폼)

단순한 기술 블로그가 아니다. **이론과 구현을 한 페이지에서 함께 학습**하는 교육 플랫폼을 지향한다.

---

## 2. 기술 스택 및 현재 상태

| 구분 | 내용 | 현재 상태 |
|---|---|---|
| 프레임워크 | Astro `^7.2.10` | 설치됨 |
| 문서 테마 | Starlight `^0.42.7` (`@astrojs/starlight`) | 설치됨 |
| 콘텐츠 | Markdown / MDX (Starlight에 MDX 포함) | 사용 중 |
| 언어 | TypeScript(`astro/tsconfigs/strict`), JavaScript, CSS | 사용 중 |
| 이미지 | `sharp` | 설치됨 |
| 교육용 알고리즘 | Python 3 | 예제 파일 아직 없음 |
| 소스 관리 | GitHub (`origin`: artcoding93/artcoding-lab) | 사용 중 |
| 배포 | Vercel (정적 빌드, `vercel.json`·어댑터 없음) | — |
| UI 프레임워크 | React 등 | **미설치** |
| Markdown 처리기 | Sätteri (`@astrojs/markdown-satteri`, Astro 7 기본) | 설정됨 |
| 수식 렌더링 | KaTeX (`katex`) + `src/plugins/satteri-katex.mjs` | 설정됨 (빌드 시 렌더링) |

### 주요 명령

```bash
npm run dev       # 개발 서버 (Claude Code는 `npx astro dev --background` 사용, AGENTS.md 참고)
npm run build     # 프로덕션 빌드 → dist/
npm run preview   # 빌드 결과 미리보기
```

### 패키지 추가 규칙

- 불필요한 패키지나 프레임워크는 추가하지 않는다. 먼저 Astro 컴포넌트(`.astro`)와 바닐라 TS/JS로 해결할 수 있는지 검토한다.
- **React 등 UI 프레임워크가 필요하면 바로 설치하지 않는다.** 필요한 이유, 대안, 설치 명령(예: `npx astro add react`)을 먼저 제안하고 승인을 받는다.
- **Markdown 플러그인**: Astro 7은 remark/rehype 대신 Sätteri를 사용한다. `markdown.remarkPlugins`와 `rehypePlugins`는 deprecated이며, remark·rehype 플러그인은 그대로 쓸 수 없다. 필요한 기능은 `astro.config.mjs`의 `satteri({ mdastPlugins, hastPlugins })`에 Sätteri 플러그인으로 추가한다.

### 수식 (KaTeX)

- 인라인은 `$...$`, 블록은 `$$...$$`로 쓴다. `.md`와 `.mdx` 모두 빌드할 때 KaTeX로 렌더링된다(브라우저 JS 불필요).
- **블록 수식은 `$$`를 별도 줄에 둔다**(`$$` / 수식 / `$$` 세 줄). 한 줄에 `$$x^2$$`처럼 쓰면 인라인 수식으로 처리되어 가운데 정렬 블록이 되지 않는다.
- KaTeX가 지원하는 LaTeX 명령만 사용한다. 잘못된 수식이 있어도 빌드는 실패하지 않고 빨간 글씨로 표시되므로, 빌드 후 해당 페이지를 직접 확인한다.
- 본문의 금액이나 변수 표기 등에서 `$` 기호를 글자로 쓰려면 `\$`로 이스케이프한다.
- `satteri-katex.mjs`는 `.md`에서는 `html` 노드를, `.mdx`에서는 `features.rawHtml: true`를 사용한다. `{ raw }` 방식은 Markdown을 다시 해석하면서 `\{`, `\_` 같은 수식 원문을 손상시키므로 쓰지 않는다.
- `rawHtml: true`는 코드 블록의 언어·메타(` ```python title="…" `)를 지운다(satteri 0.10.5). `src/plugins/satteri-code-meta.mjs`가 이를 복원해 Expressive Code의 문법 강조·제목·복사 버튼이 동작한다. 이 플러그인을 제거하면 모든 코드가 plaintext로 표시된다.

### 강조(굵게) 표기 주의

- `**수치해석(Numerical Analysis)**은`처럼 닫는 `**` 앞이 문장부호이고 바로 뒤에 한글이 붙으면 CommonMark 규칙상 굵게 처리되지 않는다. 이런 경우 MDX에서는 `<strong>…</strong>`으로 쓴다. 빌드 후 페이지에 `**`가 남아 있지 않은지 확인한다.

---

## 3. 프로젝트 구조

```
astro.config.mjs          # Markdown 처리기(Sätteri+KaTeX), Starlight 설정, 사이드바, customCss
src/
  content.config.ts       # docs 컬렉션 (docsLoader + docsSchema)
  plugins/satteri-katex.mjs  # 수식 렌더링 플러그인
  plugins/satteri-code-meta.mjs  # rawHtml로 사라지는 코드 블록 언어·메타 복원 (문법 강조)
  lib/roadmap.ts          # 로드맵 공통 모델: 난이도·상태 정의, 공개 검증, 사이드바 생성
  lib/project.ts          # 단계별 프로젝트 공통 모델: Phase·결과물·마일스톤, 완료 검증, 개발 진행률
  data/numerical-roadmap.ts  # 수치해석 12 Part · 80강 목차 (강의 공개 상태의 기준)
  data/fem-roadmap.ts     # FEM 10 Part · 70강 목차
  data/fem-solver-project.ts  # FEM Solver Project Phase 1–6, 강의 연결(강의 id), 예정 컴포넌트
  data/quantum-roadmap.ts # 양자컴퓨팅 8 Part · 48강 목차
  data/quantum-simulator-project.ts  # Quantum Simulator Project Phase 1–6, 강의 연결, 예정 컴포넌트
  data/optical-roadmap.ts # 광학 계측 8 Part · 56강 목차
  data/optical-simulator-project.ts  # Optical Metrology Simulator Project Phase 1–7, 강의 연결, 예정 컴포넌트
  lib/research.ts         # 연구 플랫폼 공통 모델: Stage·논문·알고리즘·실험·노트, 상태 검증, 연구 사이드바
  data/mesh-*.ts          # 메시 생성 연구: roadmap(Stage·분야), papers(논문·검증 대기), algorithms(재현·Explorer),
                          #   experiments(형상·지표·실험), research-notes(노트), mesh-research.ts(통합)
  components/research/    # ResearchOverview, ResearchRoadmap, PaperLibrary·PaperCard·PaperSelection,
                          #   AlgorithmReproduction, ExperimentPlan, ResearchNotebook, research.css(.rs- 접두사), load-research.ts
  components/roadmap/LearningRoadmap.astro  # 로드맵 UI (검색·필터·아코디언·진행률), 분야 공통
  components/lecture/     # 강의 공통: LectureHeader(분야/Part/Lecture·난이도·시간), NextLecture(다음 강의·공개 상태),
                          #   FlowSteps(세로 흐름도, 단계별 detail 선택), ConceptCards·ConceptCard(개념 카드), load-lecture.ts
  components/numerical/   # 수치해석 시각화: FunctionPlot(정적), RiemannSumExplorer, BisectionExplorer, ConceptIcon,
                          #   render-*.ts(서버·브라우저 공용 SVG 생성), plot.css(.np- 접두사)
  lib/numerical/          # 브라우저·빌드 공용 계산: functions.ts(함수 키), bisection.ts, riemann.ts (Python 결과와 일치 검증)
  lib/plot/svg.ts         # SVG 그래프 공통: 좌표 변환, 곡선 path, 눈금
  components/fem/         # FEM 강의 그림: PlateMeshComparison(연속체·메시 비교), FemApplicationGallery(적용 분야 해석해 개념도 2×2)
  lib/fem/                # 빌드 시점 계산: plate-with-hole-mesh.ts(구멍 있는 판 삼각형 메시), application-fields.ts(해석해 모델·등치선)
  components/project/     # ProjectRoadmap(진행률·파이프라인·타임라인), ProjectComponentPlan, ProjectHero(상단 소개), load-project.ts
  content/docs/
    index.mdx             # 홈 (template: splash, 학습 분야 카드)
    numerical/            # index.mdx = 로드맵, fundamentals/introduction.mdx = 1강(공개),
                          #   root-finding/(bisection, newton-raphson) = 임시 페이지(준비 중)
    fem/                  # index.mdx = FEM 로드맵, solver-project/index.mdx = FEM Solver Project,
                          #   intuition/what-fem-solves.mdx = 1강(공개)
    quantum/              # index.mdx = 양자컴퓨팅 로드맵, simulator-project/index.mdx = Quantum Simulator Project
    optical/              # index.mdx = 광학 계측 로드맵, simulator-project/index.mdx = Optical Metrology Simulator Project
    mesh-generation/      # index(메인), roadmap, papers/(목록·리뷰), algorithms/, experiments/(목록·보고서), notebook/(목록·노트), frontier
    guides/, reference/   # Starlight 템플릿 예제 (사이드바 미연결)
  styles/custom.css       # 전역 커스텀 CSS (홈 카드, 분야별 색상, 반응형)
  assets/                 # 이미지 (houston.webp는 템플릿 기본 파일)
public/                   # 정적 파일 (favicon.svg), code/<분야>/ = 다운로드용 전체 코드
lecture-source/           # 확정 강의 원고·구현 지시서 (예: numerical-analysis/lecture-01.md, fem/lecture-01.md). 강의 본문의 기준이며 사이트 빌드에는 쓰지 않는다
```

### 새 파일 배치 규칙 (디렉터리가 없으면 처음 필요할 때 만든다)

| 용도 | 위치 | 예시 |
|---|---|---|
| 강의 페이지 | `src/content/docs/<분야>/<주제>.md(x)` | `numerical/secant-method.mdx` |
| 재사용 UI 컴포넌트 | `src/components/` | `src/components/FunctionPlot.astro` |
| 전체 실행 Python 코드 (다운로드용) | `public/code/<분야>/<주제>.py` | `public/code/numerical/bisection.py` |
| 강의 이미지 | `src/assets/<분야>/` | `src/assets/fem/mesh-1d.png` |

- 분야 디렉터리: `numerical`, `fem`, `quantum`, `optical`, `mesh-generation`
- 파일명은 **영문 소문자와 하이픈**을 사용한다(kebab-case). 컴포넌트 파일만 PascalCase를 허용한다.
- 인터랙티브 컴포넌트를 쓰는 페이지는 `.mdx`로 작성한다.

### 사이드바

- 강의형 네 분야는 `roadmapSidebar()`가 로드맵 데이터에서 자동 생성한다(로드맵 링크 + 고정 링크 + 공개 강의, Part별 그룹). 직접 편집하지 않는다.
- 프로젝트 페이지는 `extraItems`로 넣는다: FEM은 'FEM Solver Project', 양자컴퓨팅은 'Quantum Simulator Project', 광학 계측은 'Optical Metrology Simulator Project'.
- 메시 생성 연구는 `researchSidebar()`가 고정 메뉴 7개와 리뷰 페이지가 있는 논문·연구 노트만 자동으로 넣는다.

### 로드맵 강의 공개 절차 (네 분야 공통)

강의 목록과 공개 상태의 기준은 `src/data/<분야>-roadmap.ts`이다. 번호는 배열 순서로 자동 계산되고, URL은 `slug`로 고정된다.

1. 해당 강의의 `slug`를 확인한다. 공개 후에는 slug를 바꾸지 않는다. 제목과 순서는 바꿔도 URL에 영향이 없다.
2. `src/content/docs/<분야>/<slug>.mdx`에 강의를 작성한다(4절 표준 구성, FEM·양자컴퓨팅·광학 계측은 4절의 분야별 설명 순서).
3. 강의가 완성되면 데이터에 `status: 'published'`를 추가한다. 임시 안내문이나 빈 템플릿은 공개하지 않는다.
4. `npm run build`로 확인한다. 로드맵 링크, 진행률, 사이드바는 자동으로 반영된다.
   - 페이지가 없거나 `draft: true`인데 `published`로 표시하면 **빌드가 실패한다**.
   - 본문이 800자 미만이면 임시 안내문으로 의심하는 경고가 나온다.
- 새 강의를 추가할 때는 원하는 위치에 `{ id, title, en, slug }`를 넣는다. `id`와 `slug`는 중복될 수 없다(빌드 시 검사).
- 페이지를 옮길 때는 `git mv`로 파일을 이동하고, 데이터의 `slug`를 수정하고, `astro.config.mjs`의 `redirects`에 이전 URL → 새 URL을 추가한다. 예: `/numerical/bisection` → `/numerical/root-finding/bisection/`
- 새 상태(예: draft)는 `src/lib/roadmap.ts`의 `STATUSES`에 추가한다.
- 난이도는 `intro`(입문)·`basic`·`intermediate`·`advanced`·`expert`·`research`이다. 로드맵별 라벨은 `levelLabels`로 바꾼다(FEM: research → '연구', 양자컴퓨팅: advanced → '프로젝트', expert → '확장', 광학 계측: expert → '프로젝트'). 한 Part 안에서 난이도가 나뉘면 강의별 `level`로 지정한다. 검색창 예시 검색어는 `searchExamples`로 지정한다. 필터에는 사용하는 난이도만 표시된다.
- FEM·양자컴퓨팅·광학 계측 강의 `id`는 프로젝트의 연결 키이므로 **바꾸지 않는다**. 바꾸면 해당 `*-project.ts`도 함께 수정해야 하고, 그렇지 않으면 빌드가 실패한다.

### 단계별 프로젝트 진행 절차 (FEM · Quantum · Optical Metrology)

| 프로젝트 | 데이터 | 페이지 | 코드·컴포넌트 위치 |
|---|---|---|---|
| FEM Solver Project | `src/data/fem-solver-project.ts` | `/fem/solver-project/` | `public/code/fem/`, `src/components/fem/` |
| Quantum Simulator Project | `src/data/quantum-simulator-project.ts` | `/quantum/simulator-project/` | `public/code/quantum/`, `src/components/quantum/` |
| Optical Metrology Simulator Project | `src/data/optical-simulator-project.ts` | `/optical/simulator-project/` | `public/code/optical/`, `src/components/optical/` |

**프로젝트 개발 진행률(완료 Phase / 전체 Phase)과 강의 공개 진행률은 별개 지표이다.** 진행률 라벨은 `progressLabel`로 지정한다.

1. Phase 작업을 시작하면 해당 Phase(또는 Phase 6의 마일스톤)를 `status: 'in-progress'`로 바꾼다.
2. 결과물(코드·시각화)이 실제로 생기면 결과물에 `page`(콘텐츠 ID, 예: `fem/solver-project/phase-1`) 또는 `file`(public/ 기준 경로, 예: `code/fem/mesh.py`)을 지정하고 `status: 'completed'`로 바꾼다.
3. 모든 결과물(과 마일스톤)이 completed일 때만 Phase를 `completed`로 바꾼다.
- 검증(빌드 실패): 결과물 없이 완료 표시, page/file 경로 없음, 미완료 항목이 있는 Phase를 완료 표시, 로드맵에 없는 강의 id 연결.
- `checkpoints`는 Phase 사이의 별도 마일스톤이며 진행률에 포함하지 않는다: FEM '구조해석 확장'(Phase 5 뒤), 양자 '텔레포테이션 확장'(Phase 6 뒤, 중간 측정·조건부 연산 필요), 광학 '실측·표준시료 데이터 검증'(Phase 7 뒤).
- 예정 인터랙티브 컴포넌트는 `components`에 계획만 있다. **실제로 구현하기 전에는 동작하는 것처럼 표현하지 않는다.** 구현하면 위 표의 컴포넌트 위치에 만들고 status를 올린다.
  - FEM: MeshViewer, ElementExplorer, AssemblyVisualizer, FEMSolverDemo, FieldViewer, DomainPartitionViewer
  - 양자: QubitStateViewer, QuantumGateExplorer, MeasurementVisualizer, QuantumCircuitEditor, BlochSphereViewer, QuantumAlgorithmDemo
  - 광학: OpticalLayerViewer, ReflectanceSpectrumViewer, EllipsometryExplorer, InterferogramViewer, PhaseUnwrappingViewer, ConfocalResponseViewer, OCTScanViewer, HologramViewer, ParameterFittingExplorer, MeasurementErrorAnalyzer
- 전체 코드는 `public/code/<분야>/` 아래에 둔다(다운로드 가능). 페이지에는 핵심 코드만 싣는다.
- 양자 시뮬레이터 범위: 1~3큐비트 상태벡터, X·Y·Z·H·S·T·Rx·Ry·Rz·CNOT, 측정 확률·Shots, 블로흐 구면. 노이즈·오류 정정·하드웨어 시뮬레이션은 초기 범위에서 제외한다. 브라우저 JS 엔진은 Python 엔진과 같은 입력에 같은 결과(확률)를 내야 한다.

### Mesh Generation Research Lab 운영 절차

강의형 분야와 달리 **논문 기반 장기 연구 프로젝트**이다. 데이터는 `src/data/mesh-*.ts`, 검증 규칙은 `src/lib/research.ts`에 있다.

- **논문 등록**: 제목·저자·연도·학술지·DOI를 Crossref 등 공식 메타데이터로 확인한 뒤 `mesh-papers.ts`에 추가하고 `verification`(출처, 확인일, 비고)을 남긴다. 확인되지 않으면 `pendingPapers`에 둔다. **서지정보를 추측해서 쓰지 않는다.**
- `contributions`는 리뷰 전에는 '널리 알려진 기여 요약'이다. 리뷰 후 원문 기준으로 고친다. `predecessors`는 연구 흐름상 계보이고 후속 연구는 자동 계산된다.
- **논문 상태**: candidate → selected → reviewing → reviewed → reproduced → validated. 빌드 검사 조건은 다음과 같다.
  - reviewed 이상: `review` 페이지(`mesh-generation/papers/<id>.mdx`)가 있어야 한다.
  - reproduced: 연결된 알고리즘이 reproduced이고, 그 알고리즘의 `code` 파일(`public/code/mesh-generation/`)이 있어야 한다.
  - validated: 그 알고리즘을 포함한 실험이 completed이고 `report` 페이지가 있어야 한다.
- **리뷰 페이지 구성(13항목)**: 논문 정보 → 역사적 배경 → 기존 한계 → 핵심 기여(왜 혁신적이었나) → 원리 → 수학적 정의 → 의사코드 → 인터랙티브 시각화 → Python 재현 → 실험 결과 → 장단점 → 후속 연구 → 새 연구 아이디어. 논문 그림·표는 복제하지 않고 새로 그린다. 원 논문 재현과 단순화 구현을 구분한다.
- **재현**: 핵심 계산을 직접 구현한다. 외부 메시 라이브러리는 검증·비교용으로만 쓴다. NumPy·SciPy·Matplotlib·pytest로 시작하고, 프로파일링으로 확인된 병목만 최적화한다.
- **실험**: `mesh-experiments.ts`의 공통 형상·지표를 사용한다. 실행하지 않은 실험의 수치를 만들지 않는다.
- **연구 노트**: `notebook/<id>.mdx`를 작성하고 `mesh-research-notes.ts`에 등록한다. 빈 노트를 만들지 않는다.
- **Stage 8·9**: 고정 목록이 아니다. 조사 → 원 논문 확인 → 분석 → 고전 알고리즘과 비교 → 가치·구현 가능성 검토 → **사용자와 방향 논의** → 대상 확정 → 노트·로드맵 갱신 순서로 진행한다. AI가 더 우수하다고 가정하지 않는다.
- 범위 밖: 상용 메시 소프트웨어의 내부 알고리즘·제품 비교·채택 기술 조사.
- Interactive Explorer 5종(DelaunayExplorer 등)은 계획만 있다. 구현하면 `src/components/mesh/`에 만들고 status를 올린다.

### 알려진 사항 (임의로 고치지 않음)

- 빌드할 때 `i18n` 컬렉션 없음, `404` 엔트리 없음 경고가 나온다. Starlight 기본 동작에서 나오는 경고로, 빌드에는 영향이 없다.
- 기존 페이지 본문에 `# 제목`(H1)이 있는데, Starlight가 frontmatter `title`을 H1으로 이미 출력하므로 제목이 중복된다. **새 페이지에서는 본문 H1을 쓰지 않고 `##`부터 시작한다.**
- `astro.config.mjs`에 `site` 옵션이 없어서 빌드할 때 sitemap 생성이 건너뛰어진다(경고만 나오고 빌드는 성공). 운영 도메인이 정해지면 추가를 제안한다.
- `guides/`, `reference/` 예제 페이지와 `houston.webp`는 템플릿에서 남은 파일이다. 삭제하려면 사용자에게 먼저 확인한다.

---

## 4. 학습 콘텐츠 작성 원칙

- 모든 콘텐츠는 **한국어**로 작성한다.
- 기술 용어는 처음 나올 때 **한글(영문)**으로 함께 적는다. 예: 이분법(Bisection Method), 유한요소법(Finite Element Method)
- 수식은 LaTeX(KaTeX 문법)로 작성하고 정확하고 논리적으로 설명한다(2절 '수식' 참고).
- 설명 흐름: **문제 정의 → 수학적 원리 → 알고리즘 → 코드 구현 → 결과 시각화 → 분석 및 응용**
- 개념 나열에 그치지 말고 공학적 의미와 수학적 직관을 설명한다. **수식의 각 항이 코드의 어느 줄에 대응하는지** 보여준다.
- 깊이는 학부 수준을 기본으로 하되, 기초 개념부터 단계적으로 설명한다.
- frontmatter에는 `title`(한국어)과 `description`을 반드시 넣는다.

### 강의 표준 구성

주제에 맞게 조정할 수 있으며, 모든 항목을 기계적으로 넣지 않는다.

1. 학습 목표
2. 문제 정의 및 배경
3. 수학적 원리와 핵심 수식
4. 알고리즘 및 계산 절차
5. Python 핵심 코드
6. 실행 결과와 그래프
7. 인터랙티브 시뮬레이션
8. 오차, 수렴 특성 또는 성능 분석
9. 연습 문제
10. 핵심 요약 및 참고자료

### FEM 강의 설명 순서

FEM은 긴 수학적 유도보다 **개념적 이해와 계산 과정**을 우선한다. 기본 흐름은 다음과 같다.

1. 실제 물리 현상 제시
2. 개념도와 직관적 설명
3. 대표 수식 제시
4. 수식의 각 항이 의미하는 물리량 설명
5. Python 코드로 구현
6. 계산 결과 시각화
7. 매개변수 변경 실험
8. 수치적 정확성과 계산 비용 분석

- 엄밀성이 필요한 부분은 생략하지 않는다. 긴 유도는 Starlight `<details>` 등으로 '심화 설명'에 분리한다.
- 수식은 그림, 코드, 인터랙티브 시각화와 연결한다.
- 강의가 솔버 프로젝트의 Phase와 연결되어 있으면, 강의 끝에서 해당 Phase에서 무엇을 구현하는지 안내한다.

### 양자컴퓨팅 강의 설명 순서

대상은 양자역학·물리학 비전공자이다. 양자역학 전체가 아니라 양자컴퓨팅에 필요한 핵심 개념만 다루고, 수식보다 개념 이해와 시각화를 우선한다.

1. 이번 강의에서 배울 내용
2. 직관적인 개념 설명
3. 실생활 또는 컴퓨팅 관점의 비유
4. 핵심 수식과 의미
5. Python 코드 실습
6. 계산 결과 및 시각화
7. 간단한 실험 또는 응용 예제
8. 핵심 개념 정리
9. 다음 강의와의 연결

- 수식은 정확하게 쓰고, **비유가 실제 원리를 왜곡하지 않게** 한다(예: 중첩을 '0과 1을 동시에 계산한다'로만 설명하지 않는다). 비유의 한계를 함께 적는다.
- 상태는 디랙 표기($\lvert\psi\rangle$)와 NumPy 배열을 함께 보여 준다. 큐비트 순서(어느 큐비트가 최상위 비트인지) 규칙을 분야 전체에서 하나로 정하고 일관되게 쓴다.
- 코드는 NumPy 기반의 작은 예제로 작성한다. 초기 강의에서 Qiskit 등 양자 SDK 사용을 강제하지 않는다(SDK는 Part VIII에서 비교·검증용으로 다룬다).
- 강의가 시뮬레이터 프로젝트의 Phase와 연결되어 있으면, 강의 끝에서 해당 Phase에서 무엇을 구현하는지 안내한다.

### 광학 계측 강의 설명 순서

장비 소개가 아니라 **물리 모델로 측정 데이터를 만들고(정방향 모델) 거꾸로 해석하는(역문제)** 계산 과정을 학습한다. 개념 강의와 구현 강의의 성격에 맞게 조정한다.

1. 학습 목표
2. 측정 대상과 실제 활용 사례
3. 광학적 측정 원리
4. 핵심 수식과 변수 설명
5. 정방향 모델
6. Python 코드 구현
7. 합성 측정 데이터 생성
8. 역해석 및 최적화
9. 추정 결과와 실제 설정값 비교
10. 오차 분석 및 핵심 정리

- **데이터 원칙**: 초기에는 정답을 아는 합성 데이터를 사용한다. 합성 데이터와 실측 데이터는 그림·표·본문에서 항상 구분해 표시한다. 실측 데이터는 출처와 측정 조건을 밝히며, 확보되지 않은 데이터를 실제 장비 측정값처럼 만들거나 표시하지 않는다.
- 광학적 두께($nd$)와 기하학적 두께($d$), OCT의 광학 경로 길이와 실제 깊이를 구분하고 굴절률 보정을 설명한다.
- 예제는 NumPy·SciPy·Matplotlib을 우선 사용하고, 사용 목적을 본문에 적는다. 핵심 코드는 페이지에, 전체 코드는 `public/code/optical/`에 둔다.

---

## 5. Python 코드 규칙

- Python 3 기준으로 작성하며, 초보자도 읽을 수 있도록 **가독성을 우선**한다.
- 변수명과 함수명은 의미가 드러나게 짓는다(예: `tolerance`, `max_iterations`).
- 핵심 알고리즘은 직접 구현한다. NumPy, SciPy, Matplotlib 등을 쓸 때는 사용 목적을 본문에 적는다.
- 함수마다 입력, 출력, 종료 조건, 예외 상황(예: 부호 조건 위반, 도함수 0, 최대 반복 초과)을 명시한다.
- **핵심 코드는 페이지에 직접 넣는다.** 외부 Colab 링크 없이도 페이지만으로 학습할 수 있어야 한다.
- 전체 실행 코드는 `public/code/<분야>/` 아래 별도 파일로 제공한다.
- 본문에 싣는 결과(반복 횟수, 근사값, 오차)는 **실제로 코드를 실행해서 얻은 값**이어야 한다. 직접 실행해 수식·코드·결과가 서로 맞는지 확인한다.

---

## 6. 시각화 및 인터랙티브 실습

인터랙티브 학습은 artcoding Lab의 핵심 차별화 요소이다. 가능하면 다음 기능을 제공한다.

- 함수와 알고리즘의 그래프 시각화
- 매개변수를 바꾸는 슬라이더와 입력창
- 단계별 실행, 반복 과정 표시
- 오차·수렴 과정 비교
- 초기화와 재실행

분야별로 강조할 내용:
- **수치해석**: 함수 그래프, 반복점의 이동, 수렴 곡선
- **FEM**: 메시, 요소, 해석 결과 분포
- **양자컴퓨팅**: 양자 상태(진폭·확률, 블로흐 구), 회로 동작
- **광학 계측**: 시료 층 구조, 측정 신호(스펙트럼·간섭무늬·초점 응답·A/B-scan), 피팅 수렴과 정답 비교

구현 규칙:
- 기본은 **Astro 컴포넌트 + `<script>` + Canvas/SVG**로 구현한다. 무거운 라이브러리는 꼭 필요할 때만 제안한다.
- 컴포넌트는 props로 함수, 구간, 초기값 등을 받도록 만들어 다른 강의에서도 재사용할 수 있게 한다.
- 브라우저에서 안정적으로 동작해야 한다. 잘못된 입력은 검증하고, 무한 루프를 막기 위해 최대 반복 횟수를 둔다.
- 모바일에서도 읽을 수 있고 기본 조작이 가능해야 한다(터치, 좁은 화면).
- 브라우저용 JS 구현은 같은 입력에 대해 Python 코드와 같은 결과를 내야 한다.

---

## 7. 디자인 원칙

- 현재 홈페이지 디자인(`index.mdx`, `custom.css`의 카드 레이아웃)을 유지한다. 학습 분야 카드는 데스크톱·태블릿 2열(강의 4개 2×2 + 연구 카드 전체 폭 `learning-card--wide`), 모바일 1열이다.
- 간결하고 현대적인 교육 플랫폼 디자인을 지향하며, 수식과 코드의 가독성을 우선한다.
- 분야별 색상을 일관되게 사용한다: 수치해석 `#2563eb`(파랑), FEM `#9333ea`(보라), 양자컴퓨팅 `#16a34a`(초록), 광학 계측 `#ea580c`(주황), 메시 생성 연구 `#0891b2`(청록)
- 색상, 테두리, 배경은 가능한 한 Starlight CSS 변수(`--sl-color-*`)를 사용해 **다크 모드와 호환**되게 한다.
- PC, 태블릿(≤900px), 모바일(≤600px)에서 모두 확인한다. 기존 브레이크포인트를 따른다.
- 컴포넌트 전용 스타일은 컴포넌트 안의 scoped `<style>`에 둔다. `custom.css`는 전역에 영향을 주므로, 수정하기 전에 다른 페이지(특히 홈)에 미치는 영향을 검토한다.

---

## 8. 정확성 및 품질 검증

학습 콘텐츠에서는 **정확성이 가장 중요하다.**

- 수식의 변수와 기호를 페이지 안에서, 그리고 같은 분야의 페이지끼리 일관되게 사용한다.
- 알고리즘의 적용 조건, 가정, 한계를 적는다(예: 이분법은 연속성과 $f(a)f(b)<0$이 필요하다).
- 수치 결과, 그래프, 본문 설명이 서로 맞는지 확인한다.
- 참고자료는 신뢰할 수 있는 교재와 공식 문서를 우선한다.
- **출처가 불분명한 수치, 인용, 참고문헌을 만들어내지 않는다.** 확실하지 않으면 사용자에게 확인을 요청한다.
- 작업이 끝나면 `npm run build`가 성공하는지 반드시 확인한다. 가능하면 Python 코드도 실행해서 검증한다.

---

## 9. 작업 절차

새 강의나 기능을 요청받으면 다음 순서로 진행한다.

1. 기존 구조와 관련 파일(설정, 사이드바, 같은 분야 페이지)을 확인한다.
2. 요청을 분석하고 개발 범위를 정리한다.
3. 만들거나 수정할 파일과 구현 방법을 간단히 제안한다. 패키지 설치나 구조 변경이 필요하면 여기서 승인을 받는다.
4. 요청받은 범위 안에서만 구현한다.
5. 코드, 수식, 그래프, 링크(사이드바 포함)를 검증한다.
6. Python 실행과 `npm run build`로 테스트한다.
7. 수정한 파일 목록과 결과를 **한국어로** 요약한다.

기술적 선택이 필요하면 **기존 프로젝트와의 호환성 → 학습 효과 → 유지보수성** 순으로 판단한다.

---

## 10. Git 및 배포 정책

- 코드 수정과 로컬 테스트(dev, build, preview)는 자유롭게 수행한다.
- **사용자가 명시적으로 요청하지 않으면 `git push`를 하지 않는다.** 커밋도 요청이 있을 때만 한다.
- **승인 없이 운영 사이트(Vercel)에 배포하지 않는다.** `main`에 push하면 배포될 수 있다는 점에 유의한다.
- 파일 삭제, 대규모 구조 변경, 공통 설정(`astro.config.mjs`, `custom.css`, `package.json`) 변경은 사전에 확인을 받는다.
- API 키, 인증정보, `.env` 등 비밀정보는 Git에 포함하지 않는다(`.env`, `.env.production`은 `.gitignore`에 등록되어 있음).
