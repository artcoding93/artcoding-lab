
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriKatex } from './src/plugins/satteri-katex.mjs';

export default defineConfig({
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
        {
          label: '수치해석',
          items: [
            { label: '수치해석 소개', slug: 'numerical' },
            { label: '이분법', slug: 'numerical/bisection' },
            { label: '뉴턴-랩슨', slug: 'numerical/newton-raphson' },
          ],
        },
        {
          label: '유한요소법 (FEM)',
          items: [
            { label: 'FEM 소개', slug: 'fem' },
          ],
        },
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
