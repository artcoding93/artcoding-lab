// 학습 로드맵 공통 모델과 유틸리티
//
// - 수치해석·FEM·양자컴퓨팅 로드맵이 함께 사용한다.
// - Astro 런타임(`astro:content`)에 의존하지 않으므로 astro.config.mjs(사이드바)에서도 import할 수 있다.
// - 공개 여부 판정은 `resolveRoadmap()`이 담당한다: 데이터의 status와 실제 콘텐츠 페이지 존재 여부를 함께 확인한다.

// ─── 난이도 ────────────────────────────────────────────────
// 로드맵별로 라벨을 바꾸려면 RoadmapDef.levelLabels를 사용한다 (예: research → '연구').
export const LEVELS = {
  intro: { label: '입문' },
  basic: { label: '기초' },
  intermediate: { label: '중급' },
  advanced: { label: '심화' },
  expert: { label: '고급' },
  research: { label: '최신·연구' },
} as const;
export type LevelId = keyof typeof LEVELS;
export const LEVEL_ORDER = Object.keys(LEVELS) as LevelId[];

// ─── 공개 상태 ─────────────────────────────────────────────
// 새 상태(예: draft)를 추가하려면 여기에 한 줄을 추가한다.
// isPublic: true인 상태만 링크·사이드바·진행률에 반영된다.
export const STATUSES = {
  published: { label: '공개', isPublic: true },
  planned: { label: '준비 중', isPublic: false },
} as const;
export type StatusId = keyof typeof STATUSES;

// ─── 데이터 정의 타입 (데이터 파일에서 작성) ──────────────
export interface LectureDef {
  /** 고유 식별자. 한 로드맵 안에서 중복 불가. 한 번 정하면 바꾸지 않는다. */
  id: string;
  /** 강의 제목(한국어). 바꿔도 URL에는 영향이 없다. */
  title: string;
  /** 영문 제목. 검색과 보조 표시에 사용한다. */
  en?: string;
  /** 로드맵 basePath 기준 상대 경로. 예: 'root-finding/bisection' → /numerical/root-finding/bisection/
   *  강의 번호·제목·순서와 무관하게 고정된다. 공개 이후에는 변경하지 않는다. */
  slug: string;
  /** 기본값 'planned'. 실제 강의 페이지를 작성한 뒤에만 'published'로 바꾼다. */
  status?: StatusId;
  /** 기본값은 소속 Part의 난이도. */
  level?: LevelId;
  /** 추가 검색어 (약어, 다른 표기 등). */
  keywords?: string[];
  /** 강의 유형 ID 목록 (RoadmapDef.typeLabels의 키, 예: ['A', 'C']). 지정한 로드맵에서만 표시된다. */
  type?: string[];
  /** 한 줄 학습 목표. 지정하면 로드맵 목록에 표시되고 검색 대상이 된다. */
  goal?: string;
  /** 계획 단계의 시각화 후보. 구현 전이므로 화면에 표시하지 않는다(기록용). */
  visuals?: string[];
}

export interface PartDef {
  id: string;
  title: string;
  level: LevelId;
  /** Part 설명 한두 문장. 지정하면 Part 제목 아래에 표시된다. */
  summary?: string;
  lectures: LectureDef[];
}

export interface RoadmapDef {
  id: string;
  /** 콘텐츠 경로 접두사. 예: 'numerical' */
  basePath: string;
  title: string;
  /** 이 로드맵에서만 쓰는 난이도 라벨 (기본값은 LEVELS의 label) */
  levelLabels?: Partial<Record<LevelId, string>>;
  /** 검색창 안내 문구에 보여 줄 예시 검색어 (기본: 뉴턴, Spline) */
  searchExamples?: string[];
  /** 강의 유형 라벨 (예: { A: '개념', B: '수학', C: '시뮬레이션' }). 강의의 type은 이 키만 쓸 수 있다. */
  typeLabels?: Record<string, string>;
  parts: PartDef[];
}

/** 타입 추론을 위한 헬퍼 */
export function defineRoadmap<T extends RoadmapDef>(roadmap: T): T {
  return roadmap;
}

// ─── 해석된(표시용) 타입 ──────────────────────────────────
export interface ResolvedLecture {
  id: string;
  /** 전체 로드맵에서의 순번(1부터). 배열 순서로 자동 계산된다. */
  number: number;
  title: string;
  en?: string;
  keywords: string[];
  /** 콘텐츠 컬렉션 ID 형태의 전체 경로. 예: 'numerical/root-finding/bisection' */
  slug: string;
  level: LevelId;
  /** 데이터 파일에 적힌 상태 */
  declaredStatus: StatusId;
  /** 실제 페이지 검증을 거친 최종 상태 */
  status: StatusId;
  isPublic: boolean;
  /** 공개 강의에만 존재 */
  href?: string;
  /** 강의 유형 (데이터에 type이 없으면 빈 배열) */
  types: { id: string; label: string }[];
  goal?: string;
}

export interface ResolvedPart {
  id: string;
  number: number;
  numeral: string;
  title: string;
  level: LevelId;
  summary?: string;
  lectures: ResolvedLecture[];
  publishedCount: number;
}

export interface RoadmapStats {
  total: number;
  published: number;
  planned: number;
  /** 0–100, 소수 첫째 자리까지 */
  percent: number;
}

export interface ResolvedRoadmap {
  id: string;
  title: string;
  parts: ResolvedPart[];
  stats: RoadmapStats;
  /** 이 로드맵에서 실제로 사용하는 난이도 (표준 순서) — 필터 버튼에 사용 */
  levels: LevelId[];
  /** 난이도 라벨 (levelLabels 반영) */
  levelLabels: Record<LevelId, string>;
}

/** 강의 ID → 해석된 강의. 프로젝트 등 다른 데이터에서 강의를 ID로 연결할 때 사용한다. */
export function lectureIndex(resolved: ResolvedRoadmap): Map<string, ResolvedLecture> {
  return new Map(resolved.parts.flatMap((part) => part.lectures.map((lecture) => [lecture.id, lecture] as const)));
}

const ROMAN = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export function fullSlug(roadmap: RoadmapDef, lecture: LectureDef): string {
  return `${roadmap.basePath}/${lecture.slug}`;
}

/** 실제 존재하는 콘텐츠 페이지 정보 */
export interface ExistingPage {
  /** 본문 길이(문자 수). 임시 안내문 감지에 사용한다. */
  bodyLength?: number;
}

export interface ResolveOptions {
  /** 콘텐츠 컬렉션 ID → 페이지 정보. draft 페이지는 넣지 않는다. */
  pages: Map<string, ExistingPage>;
  /** 이 길이보다 짧은 본문의 공개 강의는 경고한다. */
  minBodyLength?: number;
  basePath?: string;
}

/** 데이터 구조 자체의 오류(중복 ID·슬러그, 잘못된 형식)를 검사한다. */
export function validateRoadmap(roadmap: RoadmapDef): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const partIds = new Set<string>();

  for (const part of roadmap.parts) {
    if (partIds.has(part.id)) errors.push(`Part ID 중복: ${part.id}`);
    partIds.add(part.id);
    if (!(part.level in LEVELS)) errors.push(`알 수 없는 난이도: ${part.id} → ${part.level}`);

    for (const lecture of part.lectures) {
      if (ids.has(lecture.id)) errors.push(`강의 ID 중복: ${lecture.id}`);
      ids.add(lecture.id);
      if (!SLUG_PATTERN.test(lecture.slug)) {
        errors.push(`슬러그 형식 오류(영문 소문자·숫자·하이픈, 앞뒤 '/' 없음): ${lecture.id} → '${lecture.slug}'`);
      }
      if (slugs.has(lecture.slug)) errors.push(`슬러그 중복: ${lecture.slug}`);
      slugs.add(lecture.slug);
      if (lecture.status && !(lecture.status in STATUSES)) {
        errors.push(`알 수 없는 상태: ${lecture.id} → ${lecture.status}`);
      }
      if (lecture.level && !(lecture.level in LEVELS)) {
        errors.push(`알 수 없는 난이도: ${lecture.id} → ${lecture.level}`);
      }
      for (const type of lecture.type ?? []) {
        if (!roadmap.typeLabels || !(type in roadmap.typeLabels)) {
          errors.push(`알 수 없는 강의 유형(typeLabels에 없음): ${lecture.id} → ${type}`);
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(`[roadmap:${roadmap.id}] 로드맵 데이터 오류\n - ${errors.join('\n - ')}`);
  }
}

/**
 * 로드맵 데이터를 실제 콘텐츠와 대조해 표시용 구조로 변환한다.
 * - status: 'published'인데 페이지가 없거나 draft이면 빌드를 중단한다.
 * - status: 'planned'인 강의는 페이지(임시 안내문 등)가 있어도 공개로 집계하지 않는다.
 */
export function resolveRoadmap(roadmap: RoadmapDef, options: ResolveOptions): ResolvedRoadmap {
  validateRoadmap(roadmap);
  const { pages, minBodyLength = 0, basePath = '/' } = options;
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const errors: string[] = [];
  let number = 0;

  const parts: ResolvedPart[] = roadmap.parts.map((part, partIndex) => {
    const lectures = part.lectures.map((lecture): ResolvedLecture => {
      number += 1;
      const slug = fullSlug(roadmap, lecture);
      const declaredStatus = lecture.status ?? 'planned';
      const isPublic = STATUSES[declaredStatus].isPublic;
      const page = pages.get(slug);

      if (isPublic && !page) {
        errors.push(
          `'${lecture.title}'(${lecture.id})은 ${declaredStatus}로 표시되었지만 ` +
            `src/content/docs/${slug}.md(x) 페이지가 없거나 draft입니다.`,
        );
      }
      if (isPublic && page && minBodyLength && (page.bodyLength ?? 0) < minBodyLength) {
        console.warn(
          `[roadmap:${roadmap.id}] 경고: 공개 강의 '${lecture.title}'의 본문이 ${page.bodyLength}자로 매우 짧습니다. ` +
            `임시 안내문이라면 status를 'planned'로 되돌리세요.`,
        );
      }

      return {
        id: lecture.id,
        number,
        title: lecture.title,
        en: lecture.en,
        keywords: lecture.keywords ?? [],
        slug,
        level: lecture.level ?? part.level,
        declaredStatus,
        status: declaredStatus,
        isPublic,
        href: isPublic ? `${base}${slug}/` : undefined,
        types: (lecture.type ?? []).map((id) => ({ id, label: roadmap.typeLabels![id] })),
        goal: lecture.goal,
      };
    });

    return {
      id: part.id,
      number: partIndex + 1,
      numeral: ROMAN[partIndex] ?? String(partIndex + 1),
      title: part.title,
      level: part.level,
      summary: part.summary,
      lectures,
      publishedCount: lectures.filter((l) => l.isPublic).length,
    };
  });

  if (errors.length) {
    throw new Error(`[roadmap:${roadmap.id}] 공개 상태 검증 실패\n - ${errors.join('\n - ')}`);
  }

  const total = number;
  const published = parts.reduce((sum, p) => sum + p.publishedCount, 0);
  const percent = total ? Math.round((published / total) * 1000) / 10 : 0;

  const used = new Set(parts.flatMap((p) => [p.level, ...p.lectures.map((l) => l.level)]));
  const levelLabels = Object.fromEntries(
    LEVEL_ORDER.map((id) => [id, roadmap.levelLabels?.[id] ?? LEVELS[id].label]),
  ) as Record<LevelId, string>;

  return {
    id: roadmap.id,
    title: roadmap.title,
    parts,
    stats: { total, published, planned: total - published, percent },
    levels: LEVEL_ORDER.filter((id) => used.has(id)),
    levelLabels,
  };
}

// ─── Starlight 사이드바 ────────────────────────────────────
interface SidebarLink {
  label: string;
  slug: string;
}
interface SidebarGroup {
  label: string;
  collapsed?: boolean;
  items: Array<SidebarLink | SidebarGroup>;
}

/**
 * 사이드바 그룹을 만든다: 로드맵 링크 + 공개 강의(Part별 하위 그룹).
 * 준비 중인 강의는 넣지 않는다. 공개 강의의 페이지가 없으면 Starlight가 빌드 오류를 낸다.
 */
export function roadmapSidebar(
  roadmap: RoadmapDef,
  options: {
    label: string;
    overviewLabel: string;
    /** 로드맵 링크 바로 다음에 넣을 고정 링크 (예: 솔버 프로젝트 페이지) */
    extraItems?: SidebarLink[];
  },
): SidebarGroup {
  validateRoadmap(roadmap);
  const partGroups: SidebarGroup[] = [];

  roadmap.parts.forEach((part, index) => {
    const items = part.lectures
      .filter((lecture) => STATUSES[lecture.status ?? 'planned'].isPublic)
      .map((lecture) => ({ label: lecture.title, slug: fullSlug(roadmap, lecture) }));
    if (items.length) {
      partGroups.push({ label: `${ROMAN[index] ?? index + 1}. ${part.title}`, collapsed: true, items });
    }
  });

  return {
    label: options.label,
    items: [
      { label: options.overviewLabel, slug: roadmap.basePath },
      ...(options.extraItems ?? []),
      ...partGroups,
    ],
  };
}
