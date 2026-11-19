// Coding Skills 공통 모델: 분류 정의 타입, 글 메타데이터 해석·검증, 정렬, 사이드바.
// - 분류(섹션·카테고리·태그·프레임워크·시리즈)는 src/data/coding-skills.ts, 글은 docs 컬렉션의 coding-skills/posts/*.
// - 이 파일은 astro.config.mjs(사이드바)에서도 불러오므로 astro:content·zod를 import하지 않는다.
//   컬렉션 읽기는 src/components/coding-skills/load-skills.ts, 스키마는 src/lib/coding-skills-schema.ts에 있다.

/** 글 종류 */
export const KINDS = {
  recipe: { label: 'Recipe' },
  'legacy-modern': { label: 'Legacy → Modern' },
  cheatsheet: { label: 'Cheat Sheet' },
} as const;
export type KindId = keyof typeof KINDS;

/** 난이도 */
export const DIFFICULTIES = {
  basic: { label: '기초', order: 1 },
  intermediate: { label: '중급', order: 2 },
  advanced: { label: '고급', order: 3 },
} as const;
export type DifficultyId = keyof typeof DIFFICULTIES;

export interface LabeledDef {
  id: string;
  label: string;
}

export interface SectionDef {
  id: string;
  title: string;
  /** 섹션의 기본 언어 (backend·tools는 글마다 지정) */
  language?: string;
  summary: string;
  /** 이 섹션에서 다룰 주제 (링크 없는 안내 문구, 공개 글이 아님) */
  topics: string[];
  categories: LabeledDef[];
}

export interface FrameworkDef {
  id: string;
  title: string;
  language: string;
  summary: string;
  /** /coding-skills/backend/<id>/ 목록 페이지가 있으면 true */
  hasPage?: boolean;
}

export interface SeriesDef {
  id: string;
  section: string;
  title: string;
  summary: string;
  /** 시리즈 목차 페이지 (콘텐츠 id) */
  page: string;
}

export interface CodingSkillsDef {
  basePath: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: SectionDef[];
  frameworks: FrameworkDef[];
  languages: Record<string, string>;
  tags: LabeledDef[];
  series: SeriesDef[];
}

/** 글 frontmatter의 skill 객체 (스키마 적용 후) */
export interface SkillMeta {
  id: string;
  section: string;
  kind: string;
  category: string;
  tags: string[];
  difficulty: string;
  publishedAt: Date;
  updatedAt?: Date;
  language?: string;
  languageVersion?: string;
  framework?: string;
  frameworkVersion?: string;
  readingTime?: number;
  series?: { id: string; order: number };
  related: string[];
  compilerNotes?: string;
}

/** 해석에 필요한 컬렉션 항목 (astro:content 타입에 묶이지 않도록 필요한 필드만) */
export interface SkillEntryInput {
  /** 콘텐츠 id (예: coding-skills/posts/cpp-smart-pointer) */
  entryId: string;
  title: string;
  description?: string;
  draft: boolean;
  skill?: SkillMeta;
}

export interface ResolvedSkill {
  id: string;
  entryId: string;
  href: string;
  title: string;
  description: string;
  draft: boolean;
  section: SectionDef;
  kind: { id: string; label: string };
  category: LabeledDef;
  tags: LabeledDef[];
  difficulty: { id: string; label: string; order: number };
  publishedAt: string;
  updatedAt?: string;
  /** 정렬용 최종 수정일 (updatedAt이 없으면 publishedAt) */
  modifiedAt: string;
  language?: { id: string; label: string };
  languageVersion?: string;
  framework?: FrameworkDef;
  frameworkVersion?: string;
  readingTime?: number;
  series?: { def: SeriesDef; order: number };
  relatedIds: string[];
  compilerNotes?: string;
  /** 검색 대상 문자열: 제목·설명·언어·프레임워크·카테고리·태그 */
  searchText: string;
}

export const POSTS_DIR = 'posts';

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

/** 글 목록 해석 + 검증. 오류가 있으면 모두 모아 예외를 던진다 (빌드 실패). */
export function resolveSkills(def: CodingSkillsDef, entries: SkillEntryInput[], base = '/'): ResolvedSkill[] {
  const errors: string[] = [];
  const postPrefix = `${def.basePath}/${POSTS_DIR}/`;
  const root = base.replace(/\/?$/, '/');
  const resolved: ResolvedSkill[] = [];
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const isPost = entry.entryId.startsWith(postPrefix);
    const where = `[${entry.entryId}]`;
    if (!isPost) {
      if (entry.skill) errors.push(`${where} skill 메타데이터는 ${postPrefix} 아래 글에서만 쓴다`);
      continue;
    }
    if (entry.entryId.slice(postPrefix.length).includes('/')) {
      errors.push(`${where} 글은 ${postPrefix} 바로 아래에 둔다 (하위 폴더 없음, 분류는 frontmatter로 지정)`);
    }
    const s = entry.skill;
    if (!s) {
      errors.push(`${where} frontmatter에 skill 객체가 없다`);
      continue;
    }
    if (seen.has(s.id)) errors.push(`${where} skill.id '${s.id}'가 ${seen.get(s.id)}와 중복된다`);
    seen.set(s.id, entry.entryId);
    if (!entry.description) errors.push(`${where} description이 없다`);

    const section = def.sections.find((x) => x.id === s.section)!;
    const category = section.categories.find((c) => c.id === s.category);
    if (!category) {
      errors.push(`${where} category '${s.category}'는 ${section.id} 섹션에 없다 (가능: ${section.categories.map((c) => c.id).join(', ')})`);
    }
    const framework = s.framework ? def.frameworks.find((f) => f.id === s.framework) : undefined;
    if (section.id === 'backend' && !framework) errors.push(`${where} backend 글은 framework를 지정한다`);
    if (section.id !== 'backend' && s.framework) errors.push(`${where} framework는 backend 글에서만 쓴다`);
    if (s.frameworkVersion && !framework) errors.push(`${where} frameworkVersion은 framework와 함께 쓴다`);
    if (s.language && section.language && s.language !== section.language) {
      errors.push(`${where} language '${s.language}'가 섹션 언어 '${section.language}'와 다르다`);
    }
    if (s.updatedAt && s.updatedAt < s.publishedAt) errors.push(`${where} updatedAt이 publishedAt보다 앞선다`);
    if (new Set(s.tags).size !== s.tags.length) errors.push(`${where} 태그가 중복된다`);
    if (s.related.includes(s.id)) errors.push(`${where} related에 자기 자신이 있다`);
    const series = s.series ? def.series.find((x) => x.id === s.series!.id) : undefined;
    if (series && series.section !== section.id) errors.push(`${where} 시리즈 '${series.id}'는 ${series.section} 섹션 글만 포함한다`);
    if (s.kind === 'legacy-modern' && (section.id !== 'cpp' || s.series?.id !== 'legacy-to-modern-cpp')) {
      errors.push(`${where} kind 'legacy-modern'은 cpp 섹션의 legacy-to-modern-cpp 시리즈 글에서만 쓴다`);
    }

    const languageId = s.language ?? section.language ?? framework?.language;
    const tags = s.tags.map((t) => def.tags.find((x) => x.id === t)!);
    const kind = { id: s.kind, label: KINDS[s.kind as KindId].label };
    const difficulty = { id: s.difficulty, ...DIFFICULTIES[s.difficulty as DifficultyId] };
    const language = languageId ? { id: languageId, label: def.languages[languageId] ?? languageId } : undefined;
    const publishedAt = isoDay(s.publishedAt);
    const updatedAt = s.updatedAt ? isoDay(s.updatedAt) : undefined;

    resolved.push({
      id: s.id,
      entryId: entry.entryId,
      href: `${root}${entry.entryId}/`,
      title: entry.title,
      description: entry.description ?? '',
      draft: entry.draft,
      section,
      kind,
      category: category ?? { id: s.category, label: s.category },
      tags,
      difficulty,
      publishedAt,
      updatedAt,
      modifiedAt: updatedAt ?? publishedAt,
      language,
      languageVersion: s.languageVersion,
      framework,
      frameworkVersion: s.frameworkVersion,
      readingTime: s.readingTime,
      series: series ? { def: series, order: s.series!.order } : undefined,
      relatedIds: s.related,
      compilerNotes: s.compilerNotes,
      searchText: [
        entry.title,
        entry.description,
        section.title,
        kind.label,
        language?.label,
        s.languageVersion,
        framework?.title,
        category?.label,
        ...tags.map((t) => t.label),
        ...tags.map((t) => t.id),
      ]
        .filter(Boolean)
        .join(' '),
    });
  }

  // 관련 글 id 존재 여부, 시리즈 순서 중복
  const ids = new Set(resolved.map((r) => r.id));
  for (const r of resolved) {
    for (const rel of r.relatedIds) {
      if (!ids.has(rel)) errors.push(`[${r.entryId}] related '${rel}'인 글이 없다`);
    }
  }
  const orders = new Map<string, string>();
  for (const r of resolved) {
    if (!r.series) continue;
    const key = `${r.series.def.id}#${r.series.order}`;
    if (orders.has(key)) errors.push(`[${r.entryId}] 시리즈 '${r.series.def.id}'의 order ${r.series.order}가 ${orders.get(key)}와 중복된다`);
    orders.set(key, r.entryId);
  }

  if (errors.length) throw new Error(`[coding-skills] 글 메타데이터 오류\n - ${errors.join('\n - ')}`);
  return resolved;
}

/** 언어·버전 표시 (예: 'C++' + 'C++17' → 'C++17', 'Java' + '21' → 'Java 21') */
export function versionText(label?: string, version?: string): string | undefined {
  if (!label) return version;
  if (!version) return label;
  return version.toLowerCase().startsWith(label.toLowerCase()) ? version : `${label} ${version}`;
}

/** 최근 등록순 (같은 날이면 제목순) */
export const byPublished = (a: ResolvedSkill, b: ResolvedSkill) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title, 'ko');
/** 최근 수정순 */
export const byModified = (a: ResolvedSkill, b: ResolvedSkill) =>
  b.modifiedAt.localeCompare(a.modifiedAt) || byPublished(a, b);

/** 실제로 수정된 글(updatedAt > publishedAt)만, 최근 수정순 */
export const recentlyUpdated = (skills: ResolvedSkill[]) =>
  skills.filter((s) => s.updatedAt && s.updatedAt > s.publishedAt).sort(byModified);

/** 사이드바: 고정 메뉴만 (글은 수가 많아질 수 있어 아카이브 검색으로 찾는다) */
export function codingSkillsSidebar(def: CodingSkillsDef, label: string) {
  const b = def.basePath;
  const section = (id: string) => def.sections.find((s) => s.id === id)!;
  const cppSeries = def.series.filter((s) => s.section === 'cpp');
  return {
    label,
    collapsed: true,
    items: [
      { label: 'Coding Skills 홈', slug: b },
      { label: section('cpp').title, slug: `${b}/cpp` },
      ...cppSeries.map((s) => ({ label: s.title, slug: s.page })),
      { label: section('python').title, slug: `${b}/python` },
      { label: section('java').title, slug: `${b}/java` },
      {
        label: section('backend').title,
        items: [
          { label: '전체 보기', slug: `${b}/backend` },
          ...def.frameworks.filter((f) => f.hasPage).map((f) => ({ label: f.title, slug: `${b}/backend/${f.id}` })),
        ],
      },
      { label: section('tools').title, slug: `${b}/tools` },
      { label: 'Cheat Sheets', slug: `${b}/cheatsheets` },
    ],
  };
}
