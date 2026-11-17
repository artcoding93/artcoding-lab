// 로드맵 데이터에서 강의 하나의 위치(Part·번호·난이도)와 다음 강의를 찾는다 (빌드 시 실행).
import { getCollection } from 'astro:content';
import { resolveRoadmap, type ExistingPage, type RoadmapDef } from '../../lib/roadmap';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export async function loadLecture(roadmap: RoadmapDef, lectureId: string) {
  const entries = await getCollection('docs', (entry) => !entry.data.draft);
  const pages = new Map<string, ExistingPage>(entries.map((entry) => [entry.id, {}]));
  const resolved = resolveRoadmap(roadmap, { pages, basePath: import.meta.env.BASE_URL });

  const flat = resolved.parts.flatMap((part) => part.lectures.map((lecture) => ({ part, lecture })));
  const index = flat.findIndex((item) => item.lecture.id === lectureId);
  if (index < 0) throw new Error(`[lecture] 로드맵 '${roadmap.id}'에 강의 id '${lectureId}'가 없습니다.`);

  const { part, lecture } = flat[index];
  return {
    part,
    partRoman: ROMAN[part.number - 1] ?? String(part.number),
    lecture,
    levelLabel: resolved.levelLabels[lecture.level],
    next: flat[index + 1]?.lecture,
  };
}

/** 강의 번호를 두 자리로 표시한다 (예: 1 → '01') */
export const pad2 = (n: number) => String(n).padStart(2, '0');
