// 논문 기반 연구 플랫폼(Mesh Generation Research Lab) 공통 모델
//
// - 연구 Stage · 논문 · 재현 알고리즘 · 실험 · 연구 노트를 고유 ID로 연결한다.
// - 상태는 '선언'만으로 인정하지 않는다. resolveResearch()가 실제 페이지·파일·연결 관계를 확인하고,
//   조건을 만족하지 않으면 빌드를 중단한다.
//     논문 reviewed 이상  → review 페이지 존재
//     논문 reproduced 이상 → 연결된 알고리즘 중 하나가 reproduced
//     논문 validated      → 그 알고리즘을 포함한 실험 중 하나가 completed
//     알고리즘 reproduced → public/ 아래 code 파일 존재
//     실험 completed      → report 페이지 존재
//     연구 노트           → page 존재
// - Astro 런타임에 의존하지 않으므로 astro.config.mjs(사이드바)에서도 import할 수 있다.

// ─── 상태와 분류 ──────────────────────────────────────────
export const PAPER_STATUSES = {
  candidate: { label: '후보', hint: '검토 대상 후보' },
  selected: { label: '선정', hint: '리뷰 대상으로 선정' },
  reviewing: { label: '리뷰 중', hint: '원문을 읽고 리뷰 작성 중' },
  reviewed: { label: '리뷰 완료', hint: '리뷰 페이지 공개' },
  reproduced: { label: '재현 완료', hint: '핵심 알고리즘 구현' },
  validated: { label: '실험 검증', hint: '공통 실험으로 검증' },
} as const;
export type PaperStatusId = keyof typeof PAPER_STATUSES;
export const PAPER_STATUS_ORDER = Object.keys(PAPER_STATUSES) as PaperStatusId[];
const rank = (s: PaperStatusId) => PAPER_STATUS_ORDER.indexOf(s);

export const ALGORITHM_STATUSES = {
  planned: { label: '계획' },
  'in-progress': { label: '구현 중' },
  reproduced: { label: '재현 완료' },
} as const;
export type AlgorithmStatusId = keyof typeof ALGORITHM_STATUSES;

export const EXPERIMENT_STATUSES = {
  planned: { label: '계획' },
  running: { label: '진행 중' },
  completed: { label: '완료' },
} as const;
export type ExperimentStatusId = keyof typeof EXPERIMENT_STATUSES;

export const STAGE_STATUSES = {
  planned: { label: '준비 중' },
  exploring: { label: '탐색 중' },
  active: { label: '진행 중' },
  completed: { label: '완료' },
} as const;
export type StageStatusId = keyof typeof STAGE_STATUSES;

export const NOTE_TYPES = {
  question: { label: 'Research Question', ko: '새롭게 발견한 연구 문제' },
  hypothesis: { label: 'Hypothesis', ko: '검증 가능한 연구 가설' },
  experiment: { label: 'Experiment', ko: '가설을 검증하기 위한 실험' },
  failure: { label: 'Failure Analysis', ko: '기존 알고리즘의 실패 사례와 원인' },
  idea: { label: 'Algorithm Idea', ko: '새 알고리즘 또는 기존 알고리즘 개선 아이디어' },
  discussion: { label: 'Research Discussion', ko: '최근 논문 검토와 연구 방향 논의' },
} as const;
export type NoteTypeId = keyof typeof NOTE_TYPES;

// ─── 데이터 정의 타입 ─────────────────────────────────────
export interface StageDef {
  id: string;
  title: string;
  ko: string;
  /** 시대 구분 (표시용, 예: '1930s–1980s') */
  era: string;
  status?: StageStatusId;
  topics: string[];
  /** 비교 연구 주제 (예: 사각형 메시) */
  comparisonTopics?: string[];
  question: string;
  deliverables: string[];
  /** 주제가 확정되지 않은 탐색 단계 (Stage 8·9) */
  openEnded?: boolean;
  note?: string;
}

export interface ResearchAreaDef {
  id: string;
  label: string;
}

export interface PaperDef {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  /** DOI가 없을 때의 원문(또는 출처) URL */
  url?: string;
  /** url 링크 문구 (예: 'Math-Net.Ru 원문 정보') */
  urlLabel?: string;
  /** original: 원 논문, survey: 서베이, comparison: 비교 연구(사각형 메시 등) */
  kind: 'original' | 'survey' | 'comparison';
  stages: string[];
  areas: string[];
  /** 핵심 기여. 리뷰 전에는 널리 알려진 기여를 요약한 것이며, 리뷰 후 원문 기준으로 갱신한다. */
  contributions: string[];
  /** 연구 흐름상 앞선 논문 (원문 인용 관계는 리뷰 시 확인). 후속 연구는 자동 계산한다. */
  predecessors?: string[];
  status?: PaperStatusId;
  /** 리뷰 페이지 콘텐츠 ID (예: 'mesh-generation/papers/ruppert-1995') */
  review?: string;
  /** 서지정보 검증 기록 */
  verification: { sources: string[]; checkedOn: string; note?: string };
}

/** 서지정보가 확인되지 않아 라이브러리에 등록하지 않은 논문 */
export interface PendingPaperDef {
  id: string;
  /** 알려진 정보 그대로 (확인되지 않은 부분은 '?'로 표시) */
  citation: string;
  reason: string;
  stages: string[];
}

export interface AlgorithmDef {
  id: string;
  name: string;
  stage: string;
  paperIds: string[];
  status?: AlgorithmStatusId;
  /** 재현 코드 (public/ 기준 경로) */
  code?: string;
  /** 'reproduction': 원 논문 알고리즘 재현, 'simplified': 교육·연구용 단순화 구현 */
  scope: 'reproduction' | 'simplified';
  summary: string;
  /** 비교 연구 대상 */
  comparison?: boolean;
}

export interface ExplorerDef {
  name: string;
  algorithmIds: string[];
  features: string[];
  status?: AlgorithmStatusId;
}

export interface GeometryDef {
  id: string;
  name: string;
  purpose: string;
}

export interface MetricDef {
  id: string;
  name: string;
  description: string;
  optional?: boolean;
}

export interface ExperimentDef {
  id: string;
  title: string;
  stage: string;
  goal: string;
  algorithmIds: string[];
  geometryIds: string[];
  metricIds: string[];
  status?: ExperimentStatusId;
  /** 결과 보고서 페이지 콘텐츠 ID */
  report?: string;
}

export interface NoteDef {
  id: string;
  type: NoteTypeId;
  title: string;
  /** 작성일 (YYYY-MM-DD) */
  date: string;
  /** 노트 페이지 콘텐츠 ID */
  page: string;
  paperIds?: string[];
  algorithmIds?: string[];
  relatedNoteIds?: string[];
}

export interface ResearchDef {
  basePath: string;
  stages: StageDef[];
  areas: ResearchAreaDef[];
  papers: PaperDef[];
  pending: PendingPaperDef[];
  algorithms: AlgorithmDef[];
  explorers: ExplorerDef[];
  geometries: GeometryDef[];
  metrics: MetricDef[];
  experiments: ExperimentDef[];
  notes: NoteDef[];
}

// ─── 해석된 타입 ──────────────────────────────────────────
export interface ResolvedPaper extends Omit<PaperDef, 'status'> {
  status: PaperStatusId;
  successors: string[];
  algorithmIds: string[];
  experimentIds: string[];
  noteIds: string[];
  reviewHref?: string;
  doiUrl?: string;
  /** 표시용 연대 (예: '1980년대') */
  decade: string;
  /** 짧은 인용 표기 (예: 'Ruppert (1995)', 같은 저자·연도가 겹치면 'Chew (1989a)') */
  cite: string;
}

export interface ResolvedResearch {
  basePath: string;
  stages: (StageDef & { status: StageStatusId; number: number; paperIds: string[]; algorithmIds: string[]; experimentIds: string[] })[];
  areas: ResearchAreaDef[];
  papers: ResolvedPaper[];
  paper: Map<string, ResolvedPaper>;
  pending: PendingPaperDef[];
  algorithms: (AlgorithmDef & { status: AlgorithmStatusId; codeHref?: string; experimentIds: string[] })[];
  explorers: (ExplorerDef & { status: AlgorithmStatusId })[];
  geometries: GeometryDef[];
  metrics: MetricDef[];
  experiments: (ExperimentDef & { status: ExperimentStatusId; reportHref?: string })[];
  notes: (NoteDef & { href: string })[];
  stats: {
    papers: number;
    byStatus: Record<PaperStatusId, number>;
    pending: number;
    reviewed: number;
    algorithms: { total: number; reproduced: number };
    experiments: { total: number; completed: number };
    notes: number;
  };
}

export interface ResolveResearchOptions {
  /** 존재하는 콘텐츠 페이지 ID (draft 제외) */
  pages: Set<string>;
  fileExists: (path: string) => boolean;
  basePath?: string;
}

function checkUnique(items: { id: string }[], label: string, errors: string[]) {
  const seen = new Set<string>();
  for (const { id } of items) {
    if (seen.has(id)) errors.push(`${label} ID 중복: ${id}`);
    seen.add(id);
  }
  return seen;
}

/** 데이터 구조(ID 중복, 존재하지 않는 참조)를 검사한다. 사이드바 생성에서도 사용한다. */
export function validateResearch(r: ResearchDef): string[] {
  const errors: string[] = [];
  const stageIds = checkUnique(r.stages, 'Stage', errors);
  const areaIds = checkUnique(r.areas, '연구 분야', errors);
  const paperIds = checkUnique(r.papers, '논문', errors);
  checkUnique(r.pending, '검증 대기 논문', errors);
  const algorithmIds = checkUnique(r.algorithms, '알고리즘', errors);
  const geometryIds = checkUnique(r.geometries, '테스트 형상', errors);
  const metricIds = checkUnique(r.metrics, '평가 지표', errors);
  checkUnique(r.experiments, '실험', errors);
  const noteIds = checkUnique(r.notes, '연구 노트', errors);
  const ref = (set: Set<string>, ids: string[] | undefined, owner: string, kind: string) => {
    for (const id of ids ?? []) if (!set.has(id)) errors.push(`${owner}: 존재하지 않는 ${kind} '${id}'`);
  };

  for (const p of r.papers) {
    const owner = `논문 ${p.id}`;
    ref(stageIds, p.stages, owner, 'Stage');
    ref(areaIds, p.areas, owner, '연구 분야');
    ref(paperIds, p.predecessors, owner, '선행 논문');
    if (!p.doi && !p.url) errors.push(`${owner}: DOI 또는 원문 URL이 필요합니다(없으면 검증 대기 목록에 둡니다).`);
    if (!p.verification?.sources?.length) errors.push(`${owner}: 서지정보 검증 출처(verification.sources)가 없습니다.`);
    if (p.status && !(p.status in PAPER_STATUSES)) errors.push(`${owner}: 알 수 없는 상태 '${p.status}'`);
    if (p.predecessors?.includes(p.id)) errors.push(`${owner}: 자기 자신을 선행 연구로 지정했습니다.`);
  }
  for (const p of r.pending) ref(stageIds, p.stages, `검증 대기 ${p.id}`, 'Stage');
  for (const a of r.algorithms) {
    ref(stageIds, [a.stage], `알고리즘 ${a.id}`, 'Stage');
    ref(paperIds, a.paperIds, `알고리즘 ${a.id}`, '논문');
  }
  for (const e of r.explorers) ref(algorithmIds, e.algorithmIds, `Explorer ${e.name}`, '알고리즘');
  for (const x of r.experiments) {
    const owner = `실험 ${x.id}`;
    ref(stageIds, [x.stage], owner, 'Stage');
    ref(algorithmIds, x.algorithmIds, owner, '알고리즘');
    ref(geometryIds, x.geometryIds, owner, '테스트 형상');
    ref(metricIds, x.metricIds, owner, '평가 지표');
  }
  for (const n of r.notes) {
    const owner = `노트 ${n.id}`;
    if (!(n.type in NOTE_TYPES)) errors.push(`${owner}: 알 수 없는 유형 '${n.type}'`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.date)) errors.push(`${owner}: 작성일 형식은 YYYY-MM-DD입니다.`);
    ref(paperIds, n.paperIds, owner, '논문');
    ref(algorithmIds, n.algorithmIds, owner, '알고리즘');
    ref(noteIds, n.relatedNoteIds, owner, '노트');
  }
  return errors;
}

/** 데이터와 실제 페이지·파일을 대조해 표시용 구조로 변환한다. 상태 조건을 어기면 빌드를 중단한다. */
export function resolveResearch(r: ResearchDef, options: ResolveResearchOptions): ResolvedResearch {
  const errors = validateResearch(r);
  const { pages, fileExists } = options;
  const base = (options.basePath ?? '/').replace(/\/?$/, '/');
  const page = (id: string) => `${base}${id}/`;

  const algorithms = r.algorithms.map((a) => {
    const status = a.status ?? 'planned';
    if (a.code && !fileExists(a.code)) errors.push(`알고리즘 ${a.id}: 코드 파일 public/${a.code}이 없습니다.`);
    if (status === 'reproduced' && !a.code) errors.push(`알고리즘 ${a.id}: reproduced로 표시하려면 code(재현 코드 경로)가 필요합니다.`);
    return {
      ...a,
      status,
      codeHref: a.code ? `${base}${a.code}` : undefined,
      experimentIds: r.experiments.filter((x) => x.algorithmIds.includes(a.id)).map((x) => x.id),
    };
  });
  const algorithm = new Map(algorithms.map((a) => [a.id, a]));

  const experiments = r.experiments.map((x) => {
    const status = x.status ?? 'planned';
    if (x.report && !pages.has(x.report)) errors.push(`실험 ${x.id}: 보고서 페이지 '${x.report}'가 없습니다.`);
    if (status === 'completed' && !x.report) errors.push(`실험 ${x.id}: completed로 표시하려면 결과 보고서(report)가 필요합니다.`);
    return { ...x, status, reportHref: x.report ? page(x.report) : undefined };
  });

  const notes = r.notes.map((n) => {
    if (!pages.has(n.page)) errors.push(`노트 ${n.id}: 페이지 '${n.page}'가 없습니다.`);
    return { ...n, href: page(n.page) };
  });

  const papers: ResolvedPaper[] = [...r.papers]
    .sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))
    .map((p) => {
      const status = p.status ?? 'candidate';
      const owner = `논문 ${p.id}`;
      const algorithmIds = algorithms.filter((a) => a.paperIds.includes(p.id)).map((a) => a.id);
      const experimentIds = experiments.filter((x) => x.algorithmIds.some((id) => algorithmIds.includes(id))).map((x) => x.id);
      if (p.review && !pages.has(p.review)) errors.push(`${owner}: 리뷰 페이지 '${p.review}'가 없습니다.`);
      if (rank(status) >= rank('reviewed') && !p.review) errors.push(`${owner}: ${status}로 표시하려면 리뷰 페이지(review)가 필요합니다.`);
      if (rank(status) >= rank('reproduced') && !algorithmIds.some((id) => algorithm.get(id)!.status === 'reproduced')) {
        errors.push(`${owner}: ${status}로 표시하려면 연결된 알고리즘 중 하나가 reproduced여야 합니다.`);
      }
      if (status === 'validated' && !experiments.some((x) => x.status === 'completed' && experimentIds.includes(x.id))) {
        errors.push(`${owner}: validated로 표시하려면 연결된 실험 중 하나가 completed여야 합니다.`);
      }
      return {
        ...p,
        status,
        successors: r.papers.filter((q) => q.predecessors?.includes(p.id)).sort((a, b) => a.year - b.year).map((q) => q.id),
        algorithmIds,
        experimentIds,
        noteIds: notes.filter((n) => n.paperIds?.includes(p.id)).map((n) => n.id),
        reviewHref: p.review ? page(p.review) : undefined,
        doiUrl: p.doi ? `https://doi.org/${p.doi}` : undefined,
        decade: `${Math.floor(p.year / 10) * 10}년대`,
        cite: '',
      };
    });

  // 짧은 인용 표기: 같은 표기가 여러 편이면 연도 뒤에 a, b, … 를 붙인다(목록 순서 기준).
  const surname = (name: string) => name.split(' ').pop()!;
  const label = (p: PaperDef) =>
    surname(p.authors[0]) + (p.authors.length > 2 ? ' et al.' : p.authors.length === 2 ? ` & ${surname(p.authors[1])}` : '');
  const groups = new Map<string, ResolvedPaper[]>();
  for (const p of papers) {
    const key = `${label(p)} (${p.year}`;
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  for (const [key, list] of groups) {
    list.forEach((p, i) => (p.cite = `${key}${list.length > 1 ? String.fromCharCode(97 + i) : ''})`));
  }

  if (errors.length) {
    throw new Error(`[research] 연구 데이터 검증 실패\n - ${errors.join('\n - ')}`);
  }

  const byStatus = Object.fromEntries(PAPER_STATUS_ORDER.map((s) => [s, papers.filter((p) => p.status === s).length])) as Record<PaperStatusId, number>;

  return {
    basePath: r.basePath,
    stages: r.stages.map((s, i) => ({
      ...s,
      status: s.status ?? 'planned',
      number: i + 1,
      paperIds: papers.filter((p) => p.stages.includes(s.id)).map((p) => p.id),
      algorithmIds: algorithms.filter((a) => a.stage === s.id).map((a) => a.id),
      experimentIds: experiments.filter((x) => x.stage === s.id).map((x) => x.id),
    })),
    areas: r.areas,
    papers,
    paper: new Map(papers.map((p) => [p.id, p])),
    pending: r.pending,
    algorithms,
    explorers: r.explorers.map((e) => ({ ...e, status: e.status ?? 'planned' })),
    geometries: r.geometries,
    metrics: r.metrics,
    experiments,
    notes: [...notes].sort((a, b) => b.date.localeCompare(a.date)),
    stats: {
      papers: papers.length,
      byStatus,
      pending: r.pending.length,
      reviewed: papers.filter((p) => rank(p.status) >= rank('reviewed')).length,
      algorithms: { total: algorithms.length, reproduced: algorithms.filter((a) => a.status === 'reproduced').length },
      experiments: { total: experiments.length, completed: experiments.filter((x) => x.status === 'completed').length },
      notes: notes.length,
    },
  };
}

// ─── Starlight 사이드바 ────────────────────────────────────
/** 연구 플랫폼 고정 메뉴 + 리뷰 페이지가 있는 논문만 자동 표시 */
export function researchSidebar(r: ResearchDef, label: string) {
  const errors = validateResearch(r);
  if (errors.length) throw new Error(`[research] 연구 데이터 오류\n - ${errors.join('\n - ')}`);
  const b = r.basePath;
  const reviews = [...r.papers]
    .filter((p) => p.review)
    .sort((a, c) => a.year - c.year)
    .map((p) => ({ label: `${p.authors[0].split(' ').pop()} (${p.year}) ${p.title.length > 28 ? p.title.slice(0, 28) + '…' : p.title}`, slug: p.review! }));
  const notes = [...r.notes]
    .sort((a, c) => c.date.localeCompare(a.date))
    .map((n) => ({ label: n.title, slug: n.page }));
  return {
    label,
    items: [
      { label: 'Research Lab 홈', slug: b },
      { label: '연구 로드맵', slug: `${b}/roadmap` },
      { label: 'Paper Library', slug: `${b}/papers` },
      { label: 'Algorithm Reproduction', slug: `${b}/algorithms` },
      { label: 'Benchmark & Experiments', slug: `${b}/experiments` },
      { label: 'Research Notebook', slug: `${b}/notebook` },
      { label: 'Frontier: AI·최신 연구', slug: `${b}/frontier` },
      ...(reviews.length ? [{ label: '논문 리뷰', collapsed: true, items: reviews }] : []),
      ...(notes.length ? [{ label: '연구 노트', collapsed: true, items: notes }] : []),
    ],
  };
}
