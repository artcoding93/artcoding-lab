// 코드 블록의 언어·메타 정보 보존 플러그인 (Sätteri)
//
// 문제: astro.config.mjs의 `features.rawHtml: true`(MDX에서 KaTeX HTML을 살리기 위해 필요)를 켜면
//   Markdown → HTML 변환 과정에서 <code> 요소의 data.lang / data.meta가 사라진다.
//   Expressive Code는 이 값으로 언어(문법 강조)와 메타(title="…" 등)를 읽으므로,
//   모든 코드 블록이 plaintext로 표시되고 제목이 빠진다. (satteri 0.10.5에서 확인)
//
// 해결:
//   1) satteriCodeMetaKeep (mdast): code 노드의 meta 문자열을 <pre>의 임시 속성으로 옮겨 둔다.
//   2) satteriCodeMetaRestore (hast): <code>의 class="language-xxx"와 임시 속성으로
//      data.lang / data.meta를 다시 채우고 임시 속성은 지운다.
//   hast 플러그인은 Expressive Code보다 먼저 실행되어야 한다
//   (astro.config.mjs의 satteri({ hastPlugins })에 넣으면 통합 플러그인보다 앞에 놓인다).
// 이미 data.lang이 있으면(나중에 Sätteri가 고쳐지면) 아무것도 하지 않는다.
import { defineHastPlugin, defineMdastPlugin } from 'satteri';

const META_PROPERTY = 'dataArtcodingCodeMeta';

export const satteriCodeMetaKeep = defineMdastPlugin({
  name: 'artcoding-code-meta-keep',
  code(node, ctx) {
    if (!node.meta) return;
    const data = node.data ?? {};
    ctx.setProperty(node, 'data', { ...data, hProperties: { ...(data.hProperties ?? {}), [META_PROPERTY]: node.meta } });
  },
});

export const satteriCodeMetaRestore = defineHastPlugin({
  name: 'artcoding-code-meta-restore',
  element: {
    filter: ['pre'],
    visit(node) {
      const code = node.children?.find((child) => child.type === 'element' && child.tagName === 'code');
      if (!code) return;
      const { [META_PROPERTY]: meta, ...preProperties } = node.properties ?? {};
      if (code.data?.lang) {
        // 언어 정보가 살아 있으면 임시 속성만 지운다
        return meta === undefined ? undefined : { ...node, properties: preProperties };
      }
      const className = Array.isArray(code.properties?.className) ? code.properties.className : [];
      const languageClass = className.find((name) => typeof name === 'string' && name.startsWith('language-'));
      if (!languageClass && meta === undefined) return;
      const data = { ...(code.data ?? {}) };
      if (languageClass) data.lang = languageClass.slice('language-'.length);
      if (meta) data.meta = String(meta);
      return {
        ...node,
        properties: preProperties,
        children: node.children.map((child) => (child === code ? { ...code, data } : child)),
      };
    },
  },
});
