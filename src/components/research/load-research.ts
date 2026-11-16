// 연구 데이터를 실제 콘텐츠 페이지·파일과 대조해 해석한다 (빌드 시 실행, 페이지마다 한 번만 계산).
import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { resolveResearch, type ResearchDef, type ResolvedResearch } from '../../lib/research';

const cache = new WeakMap<ResearchDef, Promise<ResolvedResearch>>();

export function loadResearch(research: ResearchDef): Promise<ResolvedResearch> {
  let result = cache.get(research);
  if (!result) {
    result = (async () => {
      const entries = await getCollection('docs', (entry) => !entry.data.draft);
      return resolveResearch(research, {
        pages: new Set(entries.map((e) => e.id)),
        fileExists: (file) => fs.existsSync(path.join(process.cwd(), 'public', file)),
        basePath: import.meta.env.BASE_URL,
      });
    })();
    cache.set(research, result);
  }
  return result;
}
