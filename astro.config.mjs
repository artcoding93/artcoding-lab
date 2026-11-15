
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'artcoding Lab',
      customCss: ['./src/styles/custom.css'],
      description: '수치해석, FEM, 양자컴퓨팅을 위한 공학 학습 플랫폼',

      // 사용자 정의 CSS
      customCss: ['./src/styles/custom.css'],
      
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
