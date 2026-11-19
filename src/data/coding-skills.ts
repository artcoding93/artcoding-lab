// Coding Skills (부록: 실무 개발 기술 아카이브) 분류 정의.
// - 글 목록은 여기에 적지 않는다. src/content/docs/coding-skills/posts/*.mdx의 frontmatter `skill`에서 자동으로 모은다.
// - 새 태그·카테고리·프레임워크·시리즈는 아래 목록에 한 줄 추가한다. 목록에 없는 값을 글에 쓰면 빌드가 실패한다.
// - id는 글의 frontmatter와 URL 쿼리(?tag=…)에 쓰이므로 한 번 쓰기 시작하면 바꾸지 않는다. 라벨은 바꿔도 된다.
// - 언어 간 비교(같은 기능의 다중 언어 구현)를 위한 필드는 두지 않는다.
import type { CodingSkillsDef } from '../lib/coding-skills';

export const codingSkills: CodingSkillsDef = {
  basePath: 'coding-skills',
  title: 'Coding Skills',
  subtitle: 'Practical Programming & Development Archive',
  intro: '개발하면서 자주 사용하는 기능과 최신 프로그래밍 언어·프레임워크 활용법을 짧은 예제로 정리하는 실무 개발 아카이브',

  sections: [
    {
      id: 'cpp',
      title: 'Modern C++',
      language: 'cpp',
      summary: '최신 C++ 표준(C++11~23)과 STL, 메모리·동시성·성능 등 실무 기능을 짧은 예제로 정리합니다.',
      topics: ['C++11/14/17/20/23', 'STL', 'Smart Pointer · RAII', 'Move Semantics', 'Lambda', 'std::filesystem', 'string_view · span', 'optional · variant', 'std::format', 'Ranges · Concepts', 'Templates', 'Multithreading', 'Performance', 'Binary Data', 'System Programming'],
      categories: [
        { id: 'language', label: '언어 기능' },
        { id: 'stl', label: 'STL' },
        { id: 'memory', label: '메모리 관리' },
        { id: 'strings', label: '문자열' },
        { id: 'filesystem', label: '파일 시스템' },
        { id: 'templates', label: '템플릿 · Concepts' },
        { id: 'concurrency', label: '동시성' },
        { id: 'performance', label: '성능 최적화' },
        { id: 'binary-data', label: '바이너리 데이터' },
        { id: 'system', label: '시스템 프로그래밍' },
        { id: 'mfc', label: 'MFC · Win32 연동' },
      ],
    },
    {
      id: 'python',
      title: 'Python',
      language: 'python',
      summary: '파일·데이터 자동화, 데이터 처리와 시각화, 과학기술 계산 등 Python이 강한 실무 문제를 다룹니다.',
      topics: ['pathlib', '파일 자동화', '정규표현식', 'JSON · CSV · Excel', 'NumPy · Pandas', 'Matplotlib · SciPy', 'dataclass · typing', 'logging', 'subprocess', 'asyncio', 'HTTP 요청', '가상환경 · 패키지', 'CLI 프로그램'],
      categories: [
        { id: 'files', label: '파일 · 디렉터리' },
        { id: 'text', label: '문자열 · 정규표현식' },
        { id: 'data-formats', label: 'JSON · CSV · Excel' },
        { id: 'data-analysis', label: '데이터 처리' },
        { id: 'scientific', label: '과학기술 계산' },
        { id: 'visualization', label: '시각화' },
        { id: 'language', label: '언어 기능 · 타입' },
        { id: 'automation', label: '자동화 · CLI' },
        { id: 'async', label: '비동기 · 네트워크' },
        { id: 'packaging', label: '환경 · 패키지 관리' },
      ],
    },
    {
      id: 'java',
      title: 'Java',
      language: 'java',
      summary: '현대 Java의 표준 라이브러리, 컬렉션·스트림, 비동기 처리와 Virtual Threads 등 실무 기능을 Java 버전과 함께 정리합니다.',
      topics: ['Collections', 'Generics', 'Stream API', 'Optional', 'Record', 'Lambda', 'Files API', 'java.time', 'HttpClient', 'CompletableFuture', 'Virtual Threads', '예외 처리', 'JSON', 'Logging', 'Testing'],
      categories: [
        { id: 'collections', label: 'Collections · Generics' },
        { id: 'streams', label: 'Stream · Lambda' },
        { id: 'language', label: '언어 기능' },
        { id: 'io', label: '파일 · I/O' },
        { id: 'time', label: '날짜 · 시간' },
        { id: 'networking', label: '네트워크' },
        { id: 'concurrency', label: '동시성 · 비동기' },
        { id: 'errors', label: '예외 처리' },
        { id: 'data', label: 'JSON · 직렬화' },
        { id: 'testing', label: '로깅 · 테스트' },
      ],
    },
    {
      id: 'backend',
      title: 'Backend & Frameworks',
      summary: '웹서비스와 API 개발에 필요한 기능을 프레임워크별로 독립된 예제로 정리합니다.',
      topics: ['Routing', 'REST API', 'Request · Response', '파일 업로드', 'Database', '인증', '예외 처리', '설정 · 환경 변수', '테스트', '배포'],
      categories: [
        { id: 'routing', label: '라우팅 · REST API' },
        { id: 'request-response', label: '요청 · 응답' },
        { id: 'validation', label: '검증' },
        { id: 'database', label: '데이터베이스' },
        { id: 'auth', label: '인증 · 보안' },
        { id: 'files', label: '파일 처리' },
        { id: 'realtime', label: '실시간 · WebSocket' },
        { id: 'runtime', label: '런타임 기초' },
        { id: 'architecture', label: '구조 · 의존성 주입' },
        { id: 'errors', label: '예외 처리 · 로깅' },
        { id: 'config', label: '설정 · 환경 변수' },
        { id: 'testing', label: '테스트' },
        { id: 'deployment', label: '배포' },
      ],
    },
    {
      id: 'tools',
      title: 'Developer Tools',
      summary: 'Git, Docker, 터미널, 디버깅, 테스트, CI/CD 등 언어에 묶이지 않는 개발 도구와 작업 흐름을 정리합니다.',
      topics: ['Git · GitHub', 'Docker', 'VS Code', 'Terminal · Shell', 'Debugging', 'Unit Testing', 'Build Tools', 'Package Managers', '환경 변수', 'CI/CD · GitHub Actions', 'Deployment'],
      categories: [
        { id: 'git', label: 'Git · GitHub' },
        { id: 'docker', label: 'Docker' },
        { id: 'editor', label: 'VS Code · 에디터' },
        { id: 'shell', label: '터미널 · 셸' },
        { id: 'debugging', label: '디버깅' },
        { id: 'testing', label: '테스트' },
        { id: 'build', label: '빌드 · 패키지 관리' },
        { id: 'ci-cd', label: 'CI/CD' },
        { id: 'deployment', label: '배포' },
        { id: 'workflow', label: '개발 워크플로' },
      ],
    },
  ],

  // backend 섹션의 프레임워크. 새 프레임워크(FastAPI, Express, NestJS 등)는 여기에 추가하고
  // 목록 페이지가 필요하면 src/content/docs/coding-skills/backend/<id>.mdx를 만든다.
  frameworks: [
    { id: 'flask', title: 'Flask', language: 'python', summary: 'Python 마이크로 웹 프레임워크로 REST API와 웹 기능을 구현합니다.', hasPage: true },
    { id: 'nodejs', title: 'Node.js', language: 'javascript', summary: 'JavaScript 런타임으로 HTTP 서버, 비동기 I/O, 스트림을 다룹니다. Express 같은 프레임워크는 글에서 따로 밝힙니다.', hasPage: true },
    { id: 'spring-boot', title: 'Spring Boot', language: 'java', summary: 'Java 기반 Spring 애플리케이션으로 REST API, 검증, JPA, 예외 처리를 구현합니다.', hasPage: true },
  ],

  // 언어 표시 이름
  languages: {
    cpp: 'C++',
    python: 'Python',
    java: 'Java',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    shell: 'Shell',
  },

  // 기능별 태그 (탐색 보조용. 같은 태그라도 언어별 구현 비교를 강제하지 않는다)
  tags: [
    { id: 'file-io', label: 'File I/O' },
    { id: 'string', label: 'String Processing' },
    { id: 'json', label: 'JSON' },
    { id: 'networking', label: 'Networking' },
    { id: 'database', label: 'Database' },
    { id: 'concurrency', label: 'Concurrency' },
    { id: 'async', label: 'Async' },
    { id: 'performance', label: 'Performance' },
    { id: 'automation', label: 'Automation' },
    { id: 'visualization', label: 'Visualization' },
    { id: 'testing', label: 'Testing' },
    { id: 'security', label: 'Security' },
    { id: 'logging', label: 'Logging' },
    { id: 'memory', label: 'Memory' },
  ],

  series: [
    {
      id: 'legacy-to-modern-cpp',
      section: 'cpp',
      title: 'Legacy to Modern C++',
      summary:
        '기존 C/C++·MFC 코드의 배경을 존중하면서, 같은 C++ 안에서 현대적인 대안과 장단점, 호환성, 적용 시 주의사항을 정리하는 특별 시리즈입니다.',
      page: 'coding-skills/cpp/legacy-to-modern',
    },
  ],
};
