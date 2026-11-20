# Coding Skills 작성 가이드
artcoding Lab의 부록인 **Coding Skills** (Practical Programming & Development Archive)에 글을 쓰고 공개하는 방법을 정리한다.

Coding Skills는 순서대로 수강하는 교육과정이 아니라, **하나의 구체적인 기술·API·기능 또는 실무 문제를 하나의 독립적인 게시글로 충분히 설명하는 개발 기술 블로그**이다. 각 글은 다른 글을 순서대로 읽지 않아도 해당 주제를 이해하고 실제 개발에 활용할 수 있도록 작성한다.

- **주제의 범위는 작고 명확하게, 설명은 필요한 만큼 충분하게** 작성한다. 코드 줄 수, 글자 수, 읽는 시간, 예제 수에 고정된 제한을 두지 않는다.
- 이해에 필요한 배경, 코드, 실행 결과, 오류 처리와 주의사항은 생략하지 않는다. 반대로 분량을 늘리기 위해 관련성이 낮은 기술까지 한 글에 묶지 않는다.
- 게시 순서나 시리즈 참여를 강제하지 않는다. 시리즈는 필요할 때만 사용하며, 관련 글은 `related`로 느슨하게 연결한다.
- 예: `std::unique_ptr`, `std::make_unique`, `std::shared_ptr`는 서로 관련이 있어도 각각 독립적인 글로 작성할 수 있다. 하나의 '메모리 관리 1~5편'으로 묶을 필요가 없다.

- 글 하나 = MDX 파일 하나. 목록·검색·카테고리·최근 글·관련 글·시리즈 목차는 **frontmatter에서 자동으로 만들어진다.** 목록 페이지나 홈을 직접 고치지 않는다.

- 분류(섹션·카테고리·태그·프레임워크·시리즈)는 `src/data/coding-skills.ts` 한 곳에서 관리한다.

- 언어별 전문성을 우선한다. 같은 기능을 여러 언어로 구현해 비교하는 글, 언어별 코드 탭은 만들지 않는다. 다른 언어의 글은 일반적인 관련 글(`related`)로만 연결한다.

---

## 1. 파일 위치와 URL
| 항목 | 규칙 |

|---|---|

| 글 파일 | `src/content/docs/coding-skills/posts/<파일명>.mdx` (하위 폴더 없음. 폴더가 없으면 첫 글을 쓸 때 만든다) |

| URL | `/coding-skills/posts/<파일명>/` — 파일명이 URL이다 |

| 파일명 | 영문 소문자·숫자·하이픈. 섹션을 앞에 붙인다: `cpp-smart-pointer`, `python-pathlib-walk`, `java-stream-api`, `flask-rest-api`, `git-cheatsheet` |

| skill.id | 관련 글 연결 키. 보통 파일명과 같게 짓고, **한 번 정하면 바꾸지 않는다** |

| 원고 | 승인된 원고는 `lecture-source/coding-skills/<skill.id>.md`에 보관한다 (사이트 빌드에는 쓰지 않음) |

- 글의 분류(섹션·카테고리)를 바꿔도 URL은 바뀌지 않는다.

- 공개 후 파일명을 바꿔야 하면 `git mv`로 옮기고 `astro.config.mjs`의 `redirects`에 이전 URL → 새 URL을 추가한다. `skill.id`는 그대로 둔다.

## 2. 메타데이터
### 최소 템플릿 (필수 필드만)
```yaml

\---

title: "std::filesystem으로 디렉터리 순회하기"

description: "하위 폴더까지 파일을 찾고 확장자·크기로 거르는 방법"

draft: true

skill:

  id: cpp-filesystem-walk

  section: cpp

  category: filesystem

  tags: [file-io]

  difficulty: basic

  publishedAt: 2026-12-01

\---

```

### 확장 템플릿 (선택 필드 포함)
```yaml

\---

title: "std::filesystem으로 디렉터리 순회하기"

description: "하위 폴더까지 파일을 찾고 확장자·크기로 거르는 방법"

draft: true

skill:

  id: cpp-filesystem-walk

  section: cpp

  kind: recipe

  category: filesystem

  tags: [file-io, performance]

  difficulty: intermediate

  publishedAt: 2026-12-01

  updatedAt: 2026-12-15

  language: cpp

  languageVersion: C++17

  readingTime: 6

  related: [cpp-string-view, python-pathlib-walk]

  compilerNotes: "(컴파일러·표준 라이브러리별 지원 버전을 공식 문서에서 확인해 적는다)"

\---

```

### 필드 설명
| 필드 | 필수 | 값 |

|---|---|---|

| `title` | ✔ | 한국어 제목 (Starlight가 페이지 제목으로 출력) |

| `description` | ✔ | 한 줄 설명. 카드와 검색에 쓰인다 |

| `draft` | (공개 전 ✔) | `true`면 공개 빌드에서 제외. **공개 여부는 이 값으로만 정한다** |

| `skill.id` | ✔ | 고유 id (kebab-case). 관련 글 연결 키 |

| `skill.section` | ✔ | `cpp` · `python` · `java` · `backend` · `tools` |

| `skill.kind` | | `recipe`(기본) · `legacy-modern` · `cheatsheet` |

| `skill.category` | ✔ | 섹션별 허용 목록에서 선택 (아래 표) |

| `skill.tags` | ✔ | 1개 이상. 태그 목록에서 선택 |

| `skill.difficulty` | ✔ | `basic`(기초) · `intermediate`(중급) · `advanced`(고급) |

| `skill.publishedAt` | ✔ | 게시일 `YYYY-MM-DD`. 표시·정렬용이며 **이 날짜로 자동 공개하지 않는다** |

| `skill.updatedAt` | | 의미 있는 수정을 했을 때의 날짜. 게시일 이후여야 한다. 있으면 '최근 수정'에 나온다 |

| `skill.language` | | 섹션 기본 언어가 있으면 생략 (cpp·python·java). tools 글에서 필요하면 `shell` 등 지정 |

| `skill.languageVersion` | | 예: `C++17`, `Python 3.10+`, `Java 21` (언어 이름으로 시작하면 중복 없이 표시) |

| `skill.framework` | backend ✔ | `flask` · `nodejs` · `spring-boot` |

| `skill.frameworkVersion` | | 예: `"3.1"` (숫자처럼 보이는 값은 따옴표) |

| `skill.readingTime` | | 독자 참고용 예상 읽기·실습 시간(분). 분량 제한 기준이 아니며 적은 값만 표시하고 자동 추정하지 않는다 |

| `skill.series` | | `{ id: legacy-to-modern-cpp, order: 3 }` — 선택적으로 시리즈에 속할 때만 지정. 시리즈 안 순서(중복 불가) |

| `skill.related` | | 관련 글의 `skill.id` 목록 (표시 순서 그대로) |

| `skill.compilerNotes` | | 컴파일러·표준 라이브러리 지원 메모 (주로 Modern C++) |

**YAML 주의**: 값에 `:`이 있거나 `[`·`{`·`#`·`*`로 시작하면 큰따옴표로 감싼다. 예: `title: "[C++20] std::span"`, `description: "주의: 수명 관리"`.

### 섹션별 카테고리 (id)
| 섹션 | 카테고리 id |

|---|---|

| `cpp` | language, stl, memory, strings, filesystem, templates, concurrency, performance, binary-data, system, mfc |

| `python` | files, text, data-formats, data-analysis, scientific, visualization, language, automation, async, packaging |

| `java` | collections, streams, language, io, time, networking, concurrency, errors, data, testing |

| `backend` | routing, request-response, validation, database, auth, files, realtime, runtime, architecture, errors, config, testing, deployment |

| `tools` | git, docker, editor, shell, debugging, testing, build, ci-cd, deployment, workflow |

### 태그 (id → 표시)
file-io(File I/O), string(String Processing), json(JSON), networking(Networking), database(Database), concurrency(Concurrency), async(Async), performance(Performance), automation(Automation), visualization(Visualization), testing(Testing), security(Security), logging(Logging), memory(Memory)

### 빌드 검사 (위반하면 `npm run build` 실패)
skill 없음 · id 중복 · 목록에 없는 섹션/카테고리/태그/프레임워크/시리즈 · backend 글의 framework 누락 · backend 밖의 framework · 섹션 언어와 다른 language · updatedAt이 게시일보다 앞섬 · 없는 related id · 자기 자신을 related로 지정 · 시리즈 order 중복 · `legacy-modern`이 cpp의 Legacy to Modern C++ 시리즈 밖에 있음 · 하위 폴더에 둔 글.

draft 글도 똑같이 검사한다.

## 3. 본문 템플릿
모든 글은 머리말(`SkillHeader`)과 꼬리말(`RelatedSkills`)을 한 줄씩 넣는다. id는 frontmatter의 `skill.id`와 같아야 한다.

본문 제목은 `##`부터 쓴다(H1 금지). 아래 템플릿의 목차는 권장 예시이며, 모든 섹션을 기계적으로 넣지 않는다. 글의 분량과 읽는 시간을 제한하지 않고, 주제 이해와 실무 활용에 필요한 내용을 충분히 담는다.

**작성 범위:** 한 글은 하나의 구체적인 기술이나 문제에 집중한다. 배경, 기본 사용법, 코드 예제, 동작 원리, 실행 결과, 예외 처리, 호환성, 실무 활용과 참고 문서는 필요한 만큼 구성한다. `std::unique_ptr` 글에서 `std::shared_ptr`까지 모두 다룰 필요는 없다.

**독립성:** 다른 글의 선행 학습이나 특정 게시 순서를 전제하지 않는다. 시리즈에 속한 글도 개별적으로 이해할 수 있어야 한다.

### 3.1 Recipe (`kind: recipe`)
````mdx

\---

(메타데이터)

\---

import SkillHeader from '../../../../components/coding-skills/SkillHeader.astro';

import RelatedSkills from '../../../../components/coding-skills/RelatedSkills.astro';

<SkillHeader id="cpp-filesystem-walk" />

## Problem

어떤 실무 문제를 해결하는지 2~4문장.

## Quick Solution

```cpp title="walk.cpp"

// 주제를 이해하고 재현하는 데 필요한 실행 코드

```

## How It Works

사용한 API와 코드 설명. 필요하면 줄 강조로 핵심 줄을 가리킨다.

## Run & Output

```bash

g++ -std=c++17 walk.cpp -o walk && ./walk ./data

```

```text

(실제로 실행해서 얻은 출력)

```

## Practical Notes

- 오류 처리, 성능, 보안, 버전 차이, 플랫폼 호환성

## Alternatives

(필요할 때만) 다른 구현 방식과 선택 기준

## References

- 공식 문서 링크

<RelatedSkills id="cpp-filesystem-walk" />

````

`Related Skills` 섹션은 `related`와 시리즈에서 자동으로 만들어지므로 본문에 쓰지 않는다.

### 3.2 Legacy to Modern C++ (`kind: legacy-modern`)
같은 C++ 안에서 기존 방식과 현대적 방식을 비교한다(다른 언어와의 비교가 아님). 기존 코드를 무조건 잘못된 것으로 설명하지 않고, 배경과 호환성을 함께 적는다. **이 종류의 글도 하나의 구체적인 변화에 집중한다.** 기존 Legacy to Modern C++ 시리즈 구조는 유지하되, 모든 C++ 글을 이 시리즈에 넣거나 순서대로 게시할 필요는 없다.

````mdx

\---

title: "Raw Pointer에서 Smart Pointer로"

description: "new/delete로 관리하던 객체를 unique_ptr로 옮기는 방법과 주의사항"

draft: true

skill:

  id: cpp-raw-pointer-to-smart-pointer

  section: cpp

  kind: legacy-modern

  category: memory

  tags: [memory]

  difficulty: intermediate

  publishedAt: 2026-12-01

  languageVersion: C++14

  series: { id: legacy-to-modern-cpp, order: 1 }

  compilerNotes: "std::make_unique는 C++14부터 표준입니다."

  related: [cpp-smart-pointer]

\---

import SkillHeader from '../../../../components/coding-skills/SkillHeader.astro';

import RelatedSkills from '../../../../components/coding-skills/RelatedSkills.astro';

<SkillHeader id="cpp-raw-pointer-to-smart-pointer" />

## 기존 구현 방식

(그 방식이 쓰인 배경과 당시의 합리성)

## Legacy 코드

```cpp title="legacy.cpp"

```

## 현대적 구현 방식

## Modern C++ 코드

```cpp title="modern.cpp"

```

## 주요 문법 변화

## 개선 효과

## 성능 및 호환성

(표준 버전, 컴파일러·표준 라이브러리 지원, ABI·MFC와 함께 쓸 때의 사항)

## 기존 프로젝트 적용 시 주의사항

<RelatedSkills id="cpp-raw-pointer-to-smart-pointer" />

````

변경 전후를 한 블록에 보여 줄 때는 `del={2} ins={3}` 표시를 쓸 수 있다.

### 3.3 Cheat Sheet (`kind: cheatsheet`)
요약성과 검색 편의를 우선한다. 해당 섹션 목록과 Cheat Sheets 목록에 함께 나온다. 필요한 항목을 충분히 수록하되, 분량을 맞추기 위해 불필요한 항목을 채우지 않는다.

````mdx

\---

title: "Git 명령어 Cheat Sheet"

description: "브랜치·커밋·되돌리기·원격 저장소에서 자주 쓰는 Git 명령어 요약"

draft: true

skill:

  id: git-cheatsheet

  section: tools

  kind: cheatsheet

  category: git

  tags: [automation]

  difficulty: basic

  publishedAt: 2026-12-01

\---

import SkillHeader from '../../../../components/coding-skills/SkillHeader.astro';

import RelatedSkills from '../../../../components/coding-skills/RelatedSkills.astro';

<SkillHeader id="git-cheatsheet" />

## 브랜치

| 작업 | 명령 |

|---|---|

| 새 브랜치 만들고 이동 | `git switch -c feature/x` |

## 커밋 되돌리기

```bash

git restore --staged file.txt

```

<RelatedSkills id="git-cheatsheet" />

````

### 3.4 코드 블록 기능 (Expressive Code)
| 기능 | 쓰는 법 |

|---|---|

| 파일명 | ` ```python title="main.py" ` |

| 줄 강조 | ` ```cpp {3-5} ` |

| 추가·삭제 줄 | ` ```cpp del={2} ins={3} ` |

| 터미널 | ` ```bash ` (실행 명령), ` ```text ` (출력) |

| 복사 버튼·가로 스크롤·다크 모드 | 자동 |

본문의 실행 결과는 **실제로 실행해서 얻은 값**만 싣는다. 필요한 버전, 설치 방법(`pip install …`, `npm install …`), 실행 명령을 함께 적는다.

## 4. 분류 추가 방법 (`src/data/coding-skills.ts`)
| 추가할 것 | 방법 |

|---|---|

| 태그 | `tags`에 `{ id: 'regex', label: 'Regex' }` 한 줄 추가 |

| 카테고리 | 해당 섹션의 `categories`에 `{ id, label }` 추가 |

| 프레임워크 | `frameworks`에 `{ id: 'fastapi', title: 'FastAPI', language: 'python', summary, hasPage: true }` 추가 → `src/content/docs/coding-skills/backend/fastapi.mdx`를 기존 flask.mdx처럼 만든다(`<SkillCategory framework="fastapi" />`). 범위 필터·사이드바·Backend 카드에 자동으로 추가된다 |

| 언어 표시 이름 | `languages`에 `typescript: 'TypeScript'`처럼 추가 |

| 시리즈 | `series`에 `{ id, section, title, summary, page }` 추가 → `page`에 지정한 경로에 `<SeriesList series="…" />` 페이지를 만든다 |

- id는 영문 소문자·하이픈으로 짓고, 글에서 쓰기 시작한 뒤에는 바꾸지 않는다(라벨은 바꿔도 된다).

- 필터에는 실제 글에 쓰인 태그·난이도만 표시되므로, 목록에 미리 추가해도 화면에는 영향이 없다.

## 5. 원고 작성부터 공개까지
1\. **주제 선정·원고 작성** (ChatGPT): 문제, 핵심 코드, 설명, 실행 결과.

2\. **코드 실행 검증**: 원고의 코드를 실제로 실행해 출력·버전을 확인한다.

3\. **사용자 검토·승인** → 승인된 원고를 `lecture-source/coding-skills/<skill.id>.md`에 보관한다.

4\. **구현** (Claude Code): `posts/<파일명>.mdx`를 `draft: true`로 만들고, 메타데이터·태그·카테고리·관련 글을 지정한다. 필요하면 전체 코드를 `public/code/coding-skills/<파일명>.<확장자>`에 둔다.

5\. **확인**: `npx astro dev`에서 글과 목록을 확인한다. 개발 서버에서는 draft 글이 'Draft' 배지와 함께 목록·관련 글·시리즈에 보인다.

6\. **빌드**: `npm run build`가 성공하는지 확인한다(메타데이터 오류는 여기서 잡힌다).

7\. **공개**: 사용자 승인 후 `draft: true`를 지운다. 공개 빌드의 목록·검색·최근 글·관련 글·시리즈에 자동으로 반영된다.

수정할 때는 내용이 의미 있게 바뀐 경우에만 `updatedAt`을 갱신한다.

**게시글 운영 원칙:** 글을 번호순으로 작성하거나 언어별 글 수를 맞출 필요가 없다. 새로운 기술을 익히거나 실제 개발 문제를 해결했을 때 해당 주제의 독립적인 글을 추가한다. 시리즈는 필요할 때만 선택하고, 연관된 글은 `related`로 연결한다.

### 공개 규칙 요약
| | 운영 빌드 (`npm run build`) | 개발 서버 (`astro dev`) |

|---|---|---|

| draft 글 페이지 | 만들어지지 않음 (404) | 보임 + 상단 Draft 안내 |

| 목록·검색·최근 글 | 제외 | 'Draft' 배지와 함께 표시 |

| 관련 글·시리즈 이전/다음·시리즈 목차 | 제외 (공개 글에서 draft 글로 가는 링크 없음) | 표시 |

| 사이트 검색(Pagefind) | 색인되지 않음 | — |
