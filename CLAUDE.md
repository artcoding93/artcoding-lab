# CLAUDE.md — artcoding Lab 개발 지침

이 문서는 artcoding Lab의 학습 콘텐츠와 웹 기능을 개발할 때 항상 따르는 공통 규칙이다.
개발 서버 실행 방법과 Astro 공식 문서 링크는 [AGENTS.md](AGENTS.md)를 함께 참고한다.

---

## 1. 프로젝트 개요

- **프로젝트명**: artcoding Lab
- **슬로건**: 공학을 코드로 이해하다
- **목적**: 수학적·공학적 이론을 코드로 구현하고, 시각화와 인터랙티브 실습으로 학습하는 교육 플랫폼
- **대상**: 컴퓨터공학·공학계열 대학생, 관련 분야 입문자
- **학습 분야**: 수치해석(Numerical Methods), 유한요소법(Finite Element Method, FEM), 양자컴퓨팅(Quantum Computing)

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
- KaTeX가 지원하는 LaTeX 명령만 사용한다. 잘못된 수식이 있어도 빌드는 실패하지 않고 빨간 글씨로 표시되므로, 빌드 후 해당 페이지를 직접 확인한다.
- 본문의 금액이나 변수 표기 등에서 `$` 기호를 글자로 쓰려면 `\$`로 이스케이프한다.
- `satteri-katex.mjs`는 `.md`에서는 `html` 노드를, `.mdx`에서는 `features.rawHtml: true`를 사용한다. `{ raw }` 방식은 Markdown을 다시 해석하면서 `\{`, `\_` 같은 수식 원문을 손상시키므로 쓰지 않는다.

---

## 3. 프로젝트 구조

```
astro.config.mjs          # Markdown 처리기(Sätteri+KaTeX), Starlight 설정, 사이드바, customCss
src/
  content.config.ts       # docs 컬렉션 (docsLoader + docsSchema)
  plugins/satteri-katex.mjs  # 수식 렌더링 플러그인
  lib/roadmap.ts          # 로드맵 공통 모델: 난이도·상태 정의, 공개 검증, 사이드바 생성
  data/numerical-roadmap.ts  # 수치해석 12 Part · 80강 목차 (강의 공개 상태의 기준)
  components/roadmap/LearningRoadmap.astro  # 로드맵 UI (검색·필터·아코디언·진행률), 분야 공통
  content/docs/
    index.mdx             # 홈 (template: splash, 학습 분야 카드)
    numerical/            # index.mdx = 로드맵, root-finding/(bisection, newton-raphson) = 임시 페이지(준비 중)
    fem/                  # /fem/ 유한요소법 (index)
    quantum/              # /quantum/ 양자컴퓨팅 (index)
    guides/, reference/   # Starlight 템플릿 예제 (사이드바 미연결)
  styles/custom.css       # 전역 커스텀 CSS (홈 카드, 분야별 색상, 반응형)
  assets/                 # 이미지 (houston.webp는 템플릿 기본 파일)
public/                   # 정적 파일 (favicon.svg)
```

### 새 파일 배치 규칙 (디렉터리가 없으면 처음 필요할 때 만든다)

| 용도 | 위치 | 예시 |
|---|---|---|
| 강의 페이지 | `src/content/docs/<분야>/<주제>.md(x)` | `numerical/secant-method.mdx` |
| 재사용 UI 컴포넌트 | `src/components/` | `src/components/FunctionPlot.astro` |
| 전체 실행 Python 코드 (다운로드용) | `public/code/<분야>/<주제>.py` | `public/code/numerical/bisection.py` |
| 강의 이미지 | `src/assets/<분야>/` | `src/assets/fem/mesh-1d.png` |

- 분야 디렉터리: `numerical`, `fem`, `quantum`
- 파일명은 **영문 소문자와 하이픈**을 사용한다(kebab-case). 컴포넌트 파일만 PascalCase를 허용한다.
- 인터랙티브 컴포넌트를 쓰는 페이지는 `.mdx`로 작성한다.

### 사이드바

- **수치해석**: `roadmapSidebar()`가 로드맵 데이터에서 자동 생성한다(로드맵 링크 + 공개 강의, Part별 그룹). 직접 편집하지 않는다.
- FEM·양자컴퓨팅: 아직 `astro.config.mjs`의 `sidebar`에 직접 등록한다. 로드맵을 만들면 수치해석과 같은 방식으로 바꾼다.

### 로드맵 강의 공개 절차 (수치해석)

강의 목록과 공개 상태의 기준은 `src/data/numerical-roadmap.ts`이다. 번호는 배열 순서로 자동 계산되고, URL은 `slug`로 고정된다.

1. 해당 강의의 `slug`를 확인한다. 공개 후에는 slug를 바꾸지 않는다. 제목과 순서는 바꿔도 URL에 영향이 없다.
2. `src/content/docs/numerical/<slug>.mdx`에 강의를 작성한다(4절 표준 구성).
3. 강의가 완성되면 데이터에 `status: 'published'`를 추가한다. 임시 안내문이나 빈 템플릿은 공개하지 않는다.
4. `npm run build`로 확인한다. 로드맵 링크, 진행률, 사이드바는 자동으로 반영된다.
   - 페이지가 없거나 `draft: true`인데 `published`로 표시하면 **빌드가 실패한다**.
   - 본문이 800자 미만이면 임시 안내문으로 의심하는 경고가 나온다.
- 새 강의를 추가할 때는 원하는 위치에 `{ id, title, en, slug }`를 넣는다. `id`와 `slug`는 중복될 수 없다(빌드 시 검사).
- 페이지를 옮길 때는 `git mv`로 파일을 이동하고, 데이터의 `slug`를 수정하고, `astro.config.mjs`의 `redirects`에 이전 URL → 새 URL을 추가한다. 예: `/numerical/bisection` → `/numerical/root-finding/bisection/`
- 새 상태(예: draft)는 `src/lib/roadmap.ts`의 `STATUSES`에 추가한다.

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

구현 규칙:
- 기본은 **Astro 컴포넌트 + `<script>` + Canvas/SVG**로 구현한다. 무거운 라이브러리는 꼭 필요할 때만 제안한다.
- 컴포넌트는 props로 함수, 구간, 초기값 등을 받도록 만들어 다른 강의에서도 재사용할 수 있게 한다.
- 브라우저에서 안정적으로 동작해야 한다. 잘못된 입력은 검증하고, 무한 루프를 막기 위해 최대 반복 횟수를 둔다.
- 모바일에서도 읽을 수 있고 기본 조작이 가능해야 한다(터치, 좁은 화면).
- 브라우저용 JS 구현은 같은 입력에 대해 Python 코드와 같은 결과를 내야 한다.

---

## 7. 디자인 원칙

- 현재 홈페이지 디자인(`index.mdx`, `custom.css`의 카드 레이아웃)을 유지한다.
- 간결하고 현대적인 교육 플랫폼 디자인을 지향하며, 수식과 코드의 가독성을 우선한다.
- 분야별 색상을 일관되게 사용한다: 수치해석 `#2563eb`(파랑), FEM `#9333ea`(보라), 양자컴퓨팅 `#16a34a`(초록)
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
