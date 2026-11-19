// Coding Skills 글의 frontmatter `skill` 객체 스키마 (src/content.config.ts에서 docsSchema를 확장할 때 사용).
// - `skill`은 선택 필드라서 다른 분야 페이지에는 영향이 없다.
// - coding-skills/posts/ 아래 글에서 `skill`이 빠졌는지, 섹션별 카테고리·관련 글 id가 맞는지 등
//   여러 필드를 함께 보는 검사는 src/lib/coding-skills.ts의 validateSkills()가 한다.
// - 공개 여부는 Starlight의 `draft` 값으로만 정한다. publishedAt은 표시·정렬용이며 날짜로 자동 공개하지 않는다.
import { z } from 'astro/zod';
import { codingSkills } from '../data/coding-skills';
import { DIFFICULTIES, KINDS } from './coding-skills';

const ids = <T extends { id: string }>(items: T[]) => items.map((item) => item.id) as [string, ...string[]];
const keys = (record: Record<string, unknown>) => Object.keys(record) as [string, ...string[]];
const isoDate = z.coerce.date();

export const skillSchema = z
  .object({
    /** 고유 id (관련 글 연결 키). URL(파일명)과 별개이며 바꾸지 않는다 */
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id는 영문 소문자·숫자·하이픈(kebab-case)으로 쓴다'),
    section: z.enum(ids(codingSkills.sections)),
    kind: z.enum(keys(KINDS)).default('recipe'),
    category: z.string(),
    tags: z.array(z.enum(ids(codingSkills.tags))).min(1, '태그를 하나 이상 지정한다'),
    difficulty: z.enum(keys(DIFFICULTIES)),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    language: z.enum(keys(codingSkills.languages)).optional(),
    languageVersion: z.string().optional(),
    framework: z.enum(ids(codingSkills.frameworks)).optional(),
    frameworkVersion: z.string().optional(),
    /** 예상 읽기·실습 시간(분). 적은 값만 표시하며 자동 추정하지 않는다 */
    readingTime: z.number().int().positive().optional(),
    series: z.object({ id: z.enum(ids(codingSkills.series)), order: z.number().int().positive() }).optional(),
    /** 관련 글의 skill.id 목록 */
    related: z.array(z.string()).default([]),
    /** 컴파일러·표준 라이브러리 지원 메모 (주로 Modern C++) */
    compilerNotes: z.string().optional(),
  })
  .strict();

export type SkillFrontmatter = z.infer<typeof skillSchema>;
