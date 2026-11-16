// Mesh Generation Research Lab — 데이터 모듈을 하나로 묶는다 (페이지·사이드바에서 사용).
import type { ResearchDef } from '../lib/research';
import { meshAreas, meshStages } from './mesh-roadmap';
import { meshPapers, pendingPapers } from './mesh-papers';
import { meshAlgorithms, meshExplorers } from './mesh-algorithms';
import { meshExperiments, meshGeometries, meshMetrics } from './mesh-experiments';
import { meshResearchNotes } from './mesh-research-notes';

export const meshResearch: ResearchDef = {
  basePath: 'mesh-generation',
  stages: meshStages,
  areas: meshAreas,
  papers: meshPapers,
  pending: pendingPapers,
  algorithms: meshAlgorithms,
  explorers: meshExplorers,
  geometries: meshGeometries,
  metrics: meshMetrics,
  experiments: meshExperiments,
  notes: meshResearchNotes,
};
