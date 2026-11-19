import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { skillSchema } from './lib/coding-skills-schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		// skill: Coding Skills 글(coding-skills/posts/*)의 메타데이터. 선택 필드라 다른 페이지에는 영향이 없다.
		schema: docsSchema({ extend: z.object({ skill: skillSchema.optional() }) }),
	}),
};
