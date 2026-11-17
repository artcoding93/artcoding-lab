
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriKatex } from './src/plugins/satteri-katex.mjs';
import { satteriCodeMetaKeep, satteriCodeMetaRestore } from './src/plugins/satteri-code-meta.mjs';
import { roadmapSidebar } from './src/lib/roadmap.ts';
import { numericalRoadmap } from './src/data/numerical-roadmap.ts';
import { femRoadmap } from './src/data/fem-roadmap.ts';
import { quantumRoadmap } from './src/data/quantum-roadmap.ts';
import { opticalRoadmap } from './src/data/optical-roadmap.ts';
import { researchSidebar } from './src/lib/research.ts';
import { meshResearch } from './src/data/mesh-research.ts';

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
      mdastPlugins: [satteriKatex, satteriCodeMetaKeep],
      // rawHtml이 지우는 코드 블록 언어·메타를 복원 (Expressive Code 문법 강조·제목용)
      hastPlugins: [satteriCodeMetaRestore],
    }),
  },
  integrations: [
    starlight({
      title: 'artcoding Lab',
      description: '수치해석, FEM, 양자컴퓨팅, 광학 계측, 메시 생성 연구를 위한 공학 학습 플랫폼',

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
        // 양자컴퓨팅: 로드맵 + 시뮬레이터 프로젝트 + 공개된 강의만 자동 표시 (src/data/quantum-roadmap.ts 기준)
        roadmapSidebar(quantumRoadmap, {
          label: '양자컴퓨팅',
          overviewLabel: '양자컴퓨팅 학습 로드맵',
          extraItems: [{ label: 'Quantum Simulator Project', slug: 'quantum/simulator-project' }],
        }),
        // 광학 계측: 로드맵 + 시뮬레이터 프로젝트 + 공개된 강의만 자동 표시 (src/data/optical-roadmap.ts 기준)
        roadmapSidebar(opticalRoadmap, {
          label: '광학 계측과 계산 영상',
          overviewLabel: '광학 계측 학습 로드맵',
          extraItems: [{ label: 'Optical Metrology Simulator Project', slug: 'optical/simulator-project' }],
        }),
        // 메시 생성 연구: 고정 메뉴 + 리뷰 페이지가 있는 논문·연구 노트만 자동 표시 (src/data/mesh-*.ts 기준)
        researchSidebar(meshResearch, '메시 생성 알고리즘 연구'),
      ],
    }),
  ],
});
