
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriKatex } from './src/plugins/satteri-katex.mjs';
import { roadmapSidebar } from './src/lib/roadmap.ts';
import { numericalRoadmap } from './src/data/numerical-roadmap.ts';
import { femRoadmap } from './src/data/fem-roadmap.ts';

export default defineConfig({
  // 이동한 페이지의 이전 URL → 새 URL (외부 링크·북마크 보존)
  redirects: {
    '/numerical/bisection': '/numerical/root-finding/bisection/',
    '/numerical/newton-raphson': '/numerical/root-finding/newton-raphson/',
  },
  // LaTeX 수식 렌더링: $...$ (인라인), $$...$$ (블록) → KaTeX (.md / .mdx 공통)
  markdown: {
    processor: satteri({
      // rawHtml: KaTeX가 만든 HTML을 MDX에서도 손상 없이 요소로 변환하기 위해 필요
      features: { math: true, rawHtml: true },
      mdastPlugins: [satteriKatex],
    }),
  },
  integrations: [
    starlight({
      title: 'artcoding Lab',
      description: '수치해석, FEM, 양자컴퓨팅을 위한 공학 학습 플랫폼',

      // 사용자 정의 CSS (KaTeX 스타일 포함)
      customCss: ['katex/dist/katex.min.css', './src/styles/custom.css'],
      
      defaultLocale: 'root',
      locales: {
        root: {
          label: '한국어',
          lang: 'ko',
        },
      },
      sidebar: [
        // 수치해석: 로드맵 + 공개된 강의만 자동 표시 (src/data/numerical-roadmap.ts 기준)
        roadmapSidebar(numericalRoadmap, { label: '수치해석', overviewLabel: '수치해석 로드맵' }),
        // FEM: 로드맵 + 솔버 프로젝트 + 공개된 강의만 자동 표시 (src/data/fem-roadmap.ts 기준)
        roadmapSidebar(femRoadmap, {
          label: '유한요소법 (FEM)',
          overviewLabel: 'FEM 학습 로드맵',
          extraItems: [{ label: 'FEM Solver Project', slug: 'fem/solver-project' }],
        }),
        {
          label: '양자컴퓨팅',
          items: [
            { label: '양자컴퓨팅 소개', slug: 'quantum' },
          ],
        },
      ],
    }),
  ],
});
