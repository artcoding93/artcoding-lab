// 프로젝트 데이터를 실제 콘텐츠·파일과 대조해 해석한다 (빌드 시 실행).
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { resolveRoadmap, type ExistingPage, type RoadmapDef } from '../../lib/roadmap';
import { resolveProject, type ProjectDef } from '../../lib/project';

export async function loadProject(project: ProjectDef, roadmap: RoadmapDef) {
  const entries = await getCollection('docs', (entry) => !entry.data.draft);
  const pages = new Map<string, ExistingPage>(
    entries.map((entry) => [entry.id, { bodyLength: entry.body?.trim().length ?? 0 }]),
  );
  const basePath = import.meta.env.BASE_URL;
  const resolvedRoadmap = resolveRoadmap(roadmap, { pages, basePath });
  return resolveProject(project, {
    roadmap: resolvedRoadmap,
    pages: new Set(pages.keys()),
    fileExists: (file) => fs.existsSync(path.join(process.cwd(), 'public', file)),
    basePath,
  });
}
