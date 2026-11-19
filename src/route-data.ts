// Starlight 라우트 미들웨어 (astro.config.mjs의 starlight({ routeMiddleware })로 등록).
// 사이드바가 하나로 이어져 있어 기본 동작에서는 영역 경계에서 '마지막 연구 페이지 → Coding Skills 홈' 같은
// 이전/다음 페이지 링크가 생긴다. 아래 SEPARATE_AREAS에 적은 영역은 그 영역 안에서만 이전/다음으로 이어진다.
// - 학습·연구 분야(수치해석, FEM, 양자, 광학, 메시 연구)끼리의 기존 연결은 그대로 둔다.
// - 독립적으로 운영할 영역을 새로 만들면 경로 접두사를 SEPARATE_AREAS에 추가한다.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

/** 다른 영역과 이전/다음 링크로 잇지 않는 영역 (경로 접두사) */
const SEPARATE_AREAS = ['/coding-skills/'];

/** 경로가 속한 분리 영역 (없으면 '' = 일반 학습·연구 영역) */
const areaOf = (href: string) => {
  const path = new URL(href, 'http://localhost').pathname;
  return SEPARATE_AREAS.find((prefix) => path.startsWith(prefix)) ?? '';
};

export const onRequest = defineRouteMiddleware((context) => {
  const { pagination } = context.locals.starlightRoute;
  const here = areaOf(context.url.pathname);
  if (pagination.prev && areaOf(pagination.prev.href) !== here) pagination.prev = undefined;
  if (pagination.next && areaOf(pagination.next.href) !== here) pagination.next = undefined;
});
