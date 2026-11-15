// Sätteri용 KaTeX 수식 렌더링 플러그인
//
// Astro 7의 기본 Markdown 처리기(Sätteri)는 `features.math`를 켜면
// `$...$`(인라인)와 `$$...$$`(블록)를 math / inlineMath 노드로 파싱한다.
// 이 플러그인은 그 노드를 빌드 시점에 KaTeX HTML로 바꾼다(브라우저 JS 불필요).
// `html` 노드는 Markdown으로 다시 해석되지 않으므로 수식 속 `\{`, `\_` 등이 보존된다.
// MDX에서는 astro.config.mjs의 `features.rawHtml: true`가 이 HTML을 JSX 요소로 변환한다.
// 스타일은 astro.config.mjs의 customCss에 등록한 `katex/dist/katex.min.css`가 담당한다.
import katex from 'katex';
import { defineMdastPlugin } from 'satteri';

function render(tex, displayMode) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false, // 잘못된 수식은 빌드를 멈추지 않고 빨간 글씨로 표시
    output: 'htmlAndMathml', // 화면 표시용 HTML + 스크린리더용 MathML
  });
}

export const satteriKatex = defineMdastPlugin({
  name: 'artcoding-katex',
  math(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: render(node.value, true) });
  },
  inlineMath(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: render(node.value, false) });
  },
});
