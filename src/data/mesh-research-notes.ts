// Mesh Generation Research Lab — Research Notebook
//
// 연구 노트는 논문 리뷰와 별도로 운영한다. 노트를 쓸 때마다 다음 순서로 추가한다.
//   1. src/content/docs/mesh-generation/notebook/<id>.mdx 작성
//      (작성일, 관련 논문·알고리즘, 문제 정의, 관찰, 가설, 실험 계획, 결과, 한계, 다음 과제)
//   2. 아래 배열에 { id, type, title, date, page, paperIds, algorithmIds, relatedNoteIds } 추가
// 빈 노트는 만들지 않는다. 페이지가 없는 노트를 등록하면 빌드가 실패한다.
import type { NoteDef } from '../lib/research';

export const meshResearchNotes: NoteDef[] = [];
