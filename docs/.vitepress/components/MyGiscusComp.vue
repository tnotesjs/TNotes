<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // 动态注入 giscus 评论脚本
  const giscusScript = document.createElement('script');
  giscusScript.src = "https://giscus.app/client.js";
  giscusScript.setAttribute('data-repo', 'Tdahuyou/notes');
  giscusScript.setAttribute('data-repo-id', 'R_kgDONayFGQ');
  giscusScript.setAttribute('data-category', 'Announcements');
  giscusScript.setAttribute('data-category-id', 'DIC_kwDONayFGc4Cl8dM');
  giscusScript.setAttribute('data-mapping', 'pathname');
  giscusScript.setAttribute('data-strict', '0');
  giscusScript.setAttribute('data-reactions-enabled', '1');
  giscusScript.setAttribute('data-emit-metadata', '0');
  giscusScript.setAttribute('data-input-position', 'top');
  giscusScript.setAttribute('data-theme', 'noborder_dark');
  giscusScript.setAttribute('data-lang', 'zh-CN');
  giscusScript.setAttribute('data-loading', 'lazy');
  giscusScript.setAttribute('crossorigin', 'anonymous');
  giscusScript.async = true;

  // 确保脚本仅注入一次
  if (!document.getElementById('giscus-script')) {
    giscusScript.id = 'giscus-script';
    document.getElementById('giscus-comments').appendChild(giscusScript);
  }
});
</script>

<template>
  <div id="giscus-comments"></div>
</template>