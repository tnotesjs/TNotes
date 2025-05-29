import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"0033. ScreenCaptureApp","description":"","frontmatter":{},"headers":[],"relativePath":"TNotes.electron/0033. ScreenCaptureApp/README.md","filePath":"TNotes.electron/0033. ScreenCaptureApp/README.md"}');
const _sfc_main = { name: "TNotes.electron/0033. ScreenCaptureApp/README.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="0033-screencaptureapp" tabindex="-1"><a href="https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0033.%20ScreenCaptureApp" target="_self" rel="noopener">0033. ScreenCaptureApp</a> <a class="header-anchor" href="#0033-screencaptureapp" aria-label="Permalink to &quot;[0033. ScreenCaptureApp](https://github.com/Tdahuyou/TNotes.electron/tree/main/notes/0033.%20ScreenCaptureApp)&quot;" target="_self" rel="noopener">​</a></h1><ul><li>demo - 自动截图程序</li><li>目前在测试 nodejs 的第三方库，看下是否能够支持实现定时定区域自动截图的功能，如果表现良好，可以考虑将其集成到 electron 中，出一个桌面端的自动截图工具。</li><li>应用场景：看外文视频的时候，自动定时截字幕。</li><li>功能： <ul><li>定时截图</li><li>定区域截图</li><li>ORC 识别（识别字幕，去重）</li></ul></li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("TNotes.electron/0033. ScreenCaptureApp/README.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const README = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  README as default
};
