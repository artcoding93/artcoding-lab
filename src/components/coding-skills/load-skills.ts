// Coding Skills 글을 docs 컬렉션에서 모아 검증하고 화면용 데이터로 바꾼다 (빌드 시 한 번만 계산).
// 공개 규칙
// - 운영 빌드(astro build): draft 글은 목록·검색·최근 글·관련 글·시리즈에서 모두 빠진다. 페이지도 만들어지지 않는다.
// - 개발 서버(astro dev): draft 글도 'Draft' 배지와 함께 보여 검토할 수 있다.
// - 검증은 draft 글까지 포함해서 한다 (draft 글의 메타데이터 오류도 빌드에서 잡는다).
import { getCollection } from 'astro:content';
import { codingSkills } from '../../data/coding-skills';
import { byPublished, resolveSkills, type ResolvedSkill } from '../../lib/coding-skills';

/** draft 글을 보여 주는가 (개발 서버에서만) */
export const SHOW_DRAFTS = import.meta.env.DEV;

let cache: Promise<ResolvedSkill[]> | undefined;

/** 화면에 보일 글 목록 (최근 등록순) */
export function loadSkills(): Promise<ResolvedSkill[]> {
  cache ??= (async () => {
    const entries = await getCollection('docs');
    const all = resolveSkills(
      codingSkills,
      entries.map((e) => ({
        entryId: e.id,
        title: e.data.title,
        description: e.data.description,
        draft: Boolean(e.data.draft),
        skill: e.data.skill,
      })),
      import.meta.env.BASE_URL,
    );
    return all.filter((s) => SHOW_DRAFTS || !s.draft).sort(byPublished);
  })();
  return cache;
}

/** 글 하나와 그 관련 글·시리즈 이웃 (보이는 글만 연결한다) */
export async function loadSkill(id: string) {
  const skills = await loadSkills();
  const skill = skills.find((s) => s.id === id);
  if (!skill) {
    throw new Error(`[coding-skills] skill.id '${id}'인 글이 없다 (SkillHeader·RelatedSkills의 id는 글 frontmatter의 skill.id와 같아야 한다)`);
  }
  const related = skill.relatedIds
    .map((rid) => skills.find((s) => s.id === rid))
    .filter((s): s is ResolvedSkill => Boolean(s));
  const seriesItems = skill.series
    ? skills.filter((s) => s.series?.def.id === skill.series!.def.id).sort((a, b) => a.series!.order - b.series!.order)
    : [];
  const index = seriesItems.indexOf(skill);
  return {
    skill,
    related,
    seriesItems,
    seriesIndex: index,
    prev: index > 0 ? seriesItems[index - 1] : undefined,
    next: index >= 0 && index < seriesItems.length - 1 ? seriesItems[index + 1] : undefined,
  };
}

/** 페이지 경로 (base 포함, 끝에 /) */
export const pageHref = (contentId: string) => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}${contentId}/`;
