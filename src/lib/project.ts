// 단계별 개발 프로젝트(예: FEM Solver Project) 공통 모델
//
// - 강의 로드맵(src/lib/roadmap.ts)과 별도의 지표: 강의 공개 진행률 ≠ 프로젝트 개발 진행률
// - Phase와 강의는 강의 ID로 연결한다(강의 번호·URL이 바뀌어도 연결이 유지된다).
// - '완료'는 선언만으로 인정하지 않는다: 결과물이 실제 페이지/파일로 존재해야 한다(resolveProject에서 검증).
import { lectureIndex, type ResolvedLecture, type ResolvedRoadmap } from './roadmap';

// ─── 상태 ──────────────────────────────────────────────────
// 새 상태를 추가하려면 여기에 한 줄을 추가한다.
export const PROJECT_STATUSES = {
  planned: { label: '준비 중' },
  'in-progress': { label: '개발 중' },
  completed: { label: '완료' },
} as const;
export type ProjectStatusId = keyof typeof PROJECT_STATUSES;

// ─── 데이터 정의 타입 ─────────────────────────────────────
export interface DeliverableDef {
  id: string;
  title: string;
  /** 기본값 'planned' */
  status?: ProjectStatusId;
  /** 결과물이 있는 학습 페이지 (콘텐츠 컬렉션 ID, 예: 'fem/solver-project/phase-1') */
  page?: string;
  /** 결과물 파일 (public/ 기준 경로, 예: 'code/fem/mesh.py') */
  file?: string;
}

export interface MilestoneDef {
  id: string;
  title: string;
  status?: ProjectStatusId;
  /** 이 마일스톤과 연결된 강의 ID */
  lectureIds: string[];
}

export interface PhaseDef {
  id: string;
  /** 영문 단계명 (예: 'Mesh Generation') */
  name: string;
  title: string;
  goal: string;
  status?: ProjectStatusId;
  topics: string[];
  deliverables: DeliverableDef[];
  /** 연결 강의 ID. milestones가 있으면 생략하고 마일스톤별로 지정한다. */
  lectureIds?: string[];
  /** 세부 단계 (고급 Phase를 나눌 때 사용) */
  milestones?: MilestoneDef[];
}

/** Phase 사이에 표시하는 별도 마일스톤 (예: 구조해석 확장). 진행률에는 포함하지 않는다. */
export interface CheckpointDef {
  id: string;
  /** 이 Phase 다음에 표시한다 */
  afterPhase: string;
  title: string;
  description: string;
  status?: ProjectStatusId;
  lectureIds: string[];
}

/** 향후 구현할 인터랙티브 학습 컴포넌트 계획 */
export interface PlannedComponentDef {
  name: string;
  role: string;
  phase: string;
  status?: ProjectStatusId;
}

export interface ProjectDef {
  id: string;
  title: string;
  phases: PhaseDef[];
  checkpoints?: CheckpointDef[];
  components?: PlannedComponentDef[];
}

export function defineProject<T extends ProjectDef>(project: T): T {
  return project;
}

// ─── 해석된 타입 ──────────────────────────────────────────
export interface ResolvedDeliverable extends Omit<DeliverableDef, 'status'> {
  status: ProjectStatusId;
  href?: string;
}
export interface ResolvedMilestone {
  id: string;
  title: string;
  status: ProjectStatusId;
  lectures: ResolvedLecture[];
}
export interface ResolvedPhase {
  id: string;
  number: number;
  name: string;
  title: string;
  goal: string;
  status: ProjectStatusId;
  topics: string[];
  deliverables: ResolvedDeliverable[];
  /** 마일스톤이 있으면 마일스톤 강의를 순서대로 합친 목록 */
  lectures: ResolvedLecture[];
  milestones: ResolvedMilestone[];
  components: PlannedComponentDef[];
}
export interface ResolvedCheckpoint {
  id: string;
  afterPhase: string;
  title: string;
  description: string;
  status: ProjectStatusId;
  lectures: ResolvedLecture[];
}
export interface ProjectStats {
  phases: { total: number; completed: number; inProgress: number; percent: number };
  /** 세부 단위(마일스톤이 없는 Phase는 1단위) 기준 — 확장용 보조 지표 */
  steps: { total: number; completed: number };
  lectures: { total: number; published: number };
}
export interface ResolvedProject {
  id: string;
  title: string;
  phases: ResolvedPhase[];
  checkpoints: ResolvedCheckpoint[];
  components: PlannedComponentDef[];
  stats: ProjectStats;
}

export interface ResolveProjectOptions {
  roadmap: ResolvedRoadmap;
  /** 존재하는 콘텐츠 페이지 ID 집합 (draft 제외) */
  pages: Set<string>;
  /** public/ 아래 파일이 존재하는지 확인하는 함수 */
  fileExists: (path: string) => boolean;
  basePath?: string;
}

export function resolveProject(project: ProjectDef, options: ResolveProjectOptions): ResolvedProject {
  const { roadmap, pages, fileExists } = options;
  const base = (options.basePath ?? '/').replace(/\/?$/, '/');
  const lectures = lectureIndex(roadmap);
  const errors: string[] = [];
  const phaseIds = new Set(project.phases.map((p) => p.id));

  const lookup = (ids: string[], owner: string) =>
    ids.flatMap((id) => {
      const lecture = lectures.get(id);
      if (!lecture) errors.push(`${owner}: 로드맵에 없는 강의 ID '${id}'`);
      return lecture ? [lecture] : [];
    });

  const phases = project.phases.map((phase, index): ResolvedPhase => {
    const owner = `Phase ${index + 1}(${phase.id})`;
    const status = phase.status ?? 'planned';

    const deliverables = phase.deliverables.map((d): ResolvedDeliverable => {
      const dStatus = d.status ?? 'planned';
      if (d.page && !pages.has(d.page)) errors.push(`${owner} 결과물 '${d.title}': 페이지 '${d.page}'가 없습니다.`);
      if (d.file && !fileExists(d.file)) errors.push(`${owner} 결과물 '${d.title}': 파일 public/${d.file}이 없습니다.`);
      if (dStatus === 'completed' && !d.page && !d.file) {
        errors.push(`${owner} 결과물 '${d.title}': 완료로 표시하려면 page 또는 file로 실제 결과물을 지정해야 합니다.`);
      }
      return {
        ...d,
        status: dStatus,
        href: d.page ? `${base}${d.page}/` : d.file ? `${base}${d.file}` : undefined,
      };
    });

    const milestones = (phase.milestones ?? []).map((m) => ({
      id: m.id,
      title: m.title,
      status: m.status ?? 'planned',
      lectures: lookup(m.lectureIds, `${owner} 마일스톤 '${m.title}'`),
    }));
    if (phase.milestones && phase.lectureIds) {
      errors.push(`${owner}: milestones가 있으면 lectureIds 대신 마일스톤별로 강의를 지정합니다.`);
    }
    const phaseLectures = milestones.length
      ? milestones.flatMap((m) => m.lectures)
      : lookup(phase.lectureIds ?? [], owner);

    if (status === 'completed') {
      const unfinished = [
        ...deliverables.filter((d) => d.status !== 'completed').map((d) => `결과물 '${d.title}'`),
        ...milestones.filter((m) => m.status !== 'completed').map((m) => `마일스톤 '${m.title}'`),
      ];
      if (unfinished.length) errors.push(`${owner}: 완료로 표시했지만 미완료 항목이 있습니다 — ${unfinished.join(', ')}`);
    }

    return {
      id: phase.id,
      number: index + 1,
      name: phase.name,
      title: phase.title,
      goal: phase.goal,
      status,
      topics: phase.topics,
      deliverables,
      lectures: phaseLectures,
      milestones,
      components: (project.components ?? []).filter((c) => c.phase === phase.id),
    };
  });

  const checkpoints = (project.checkpoints ?? []).map((c) => {
    if (!phaseIds.has(c.afterPhase)) errors.push(`마일스톤 '${c.title}': 알 수 없는 Phase '${c.afterPhase}'`);
    return {
      id: c.id,
      afterPhase: c.afterPhase,
      title: c.title,
      description: c.description,
      status: c.status ?? 'planned',
      lectures: lookup(c.lectureIds, `마일스톤 '${c.title}'`),
    };
  });

  for (const c of project.components ?? []) {
    if (!phaseIds.has(c.phase)) errors.push(`컴포넌트 ${c.name}: 알 수 없는 Phase '${c.phase}'`);
  }

  if (errors.length) {
    throw new Error(`[project:${project.id}] 프로젝트 데이터 검증 실패\n - ${errors.join('\n - ')}`);
  }

  const completed = phases.filter((p) => p.status === 'completed').length;
  const steps = phases.flatMap((p) =>
    p.milestones.length ? p.milestones.map((m) => m.status) : [p.status],
  );
  const linked = new Map(phases.flatMap((p) => p.lectures).map((l) => [l.id, l]));

  return {
    id: project.id,
    title: project.title,
    phases,
    checkpoints,
    components: project.components ?? [],
    stats: {
      phases: {
        total: phases.length,
        completed,
        inProgress: phases.filter((p) => p.status === 'in-progress').length,
        percent: phases.length ? Math.round((completed / phases.length) * 1000) / 10 : 0,
      },
      steps: { total: steps.length, completed: steps.filter((s) => s === 'completed').length },
      lectures: { total: linked.size, published: [...linked.values()].filter((l) => l.isPublic).length },
    },
  };
}
