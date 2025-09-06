import GithubSlugger from 'github-slugger'
import markdownItContainer from 'markdown-it-container'
import mila from 'markdown-it-link-attributes'
import markdownItTaskLists from 'markdown-it-task-lists'
import {
  DefaultTheme,
  defineConfig,
  HeadConfig,
  MarkdownOptions,
} from 'vitepress'

const slugger = new GithubSlugger()

// doc => https://vitepress.dev/zh/reference/site-config
export default defineConfig({
  lang: 'zh-Hans',
  base: '/notes/',
  title: 'TNotes',
  description: 'TNotes',
  appearance: 'dark',
  srcDir: './src',
  lastUpdated: true,
  ignoreDeadLinks: true,
  // doc: https://vitepress.dev/zh/guide/sitemap-generation#sitemap-generation
  sitemap: {
    hostname: 'https://tdahuyou.github.io/notes/',
    lastmodDateOnly: false,
  },
  head: head(),
  // doc => https://vitepress.dev/reference/default-theme-config
  themeConfig: themeConfig(),
  // doc => https://vitepress.dev/zh/guide/markdown#image-lazy-loading
  markdown: markdown(),
  router: {
    prefetchLinks: false, // 禁止预加载，确保每次加载内容是同步的
  },
})

function markdown() {
  const markdown: MarkdownOptions = {
    lineNumbers: true,
    math: true,
    config(md) {
      md.use(markdownItTaskLists)

      md.use(mila, {
        attrs: {
          target: '_self',
          rel: 'noopener',
        },
      })

      md.use(markdownItContainer, 'swiper', {
        render: (tokens, idx) => {
          const defaultRenderRulesImage =
            md.renderer.rules.image ||
            ((tokens, idx, options, env, slf) =>
              slf.renderToken(tokens, idx, options))
          if (tokens[idx].nesting === 1) {
            md.renderer.rules.paragraph_open = () => ''
            md.renderer.rules.paragraph_close = () => ''
            md.renderer.rules.image = (tokens, idx, options, env, slf) =>
              `<div class="swiper-slide">${defaultRenderRulesImage(
                tokens,
                idx,
                options,
                env,
                slf
              )
                .replaceAll('<div class="swiper-slide">', '')
                .replaceAll('</div>', '')}</div>`

            return `<div class="swiper-container"><div class="swiper-wrapper">\n`
          } else {
            md.renderer.rules.paragraph_open = undefined
            md.renderer.rules.paragraph_close = undefined
            md.renderer.rules.image = (tokens, idx, options, env, slf) =>
              `${defaultRenderRulesImage(tokens, idx, options, env, slf)
                .replaceAll('<div class="swiper-slide">', '')
                .replaceAll('</div>', '')}`
            return '</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div><div class="swiper-pagination"></div></div>\n'
          }
        },
      })
    },
    anchor: {
      slugify: (label: string) => {
        slugger.reset()
        return slugger.slug(label)
      },
    },
    image: {
      lazyLoading: true,
    },
  }

  return markdown
}

function socialLinks() {
  const socialLinks: DefaultTheme.SocialLink[] = [
    // icon 的引用，存在 CORS 跨域错误。
    // yuque icon from => https://icon-sets.iconify.design/?query=yuque
    {
      ariaLabel: 'Tdahuyou 语雀主页链接',
      link: 'https://www.yuque.com/tdahuyou',
      icon: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17.28 2.955c2.97.203 3.756 2.342 3.84 2.597l1.297.096c.13 0 .169.18.054.236c-1.323.716-1.727 2.17-1.49 3.118c.09.358.254.69.412 1.02c.307.642.651 1.418.707 2.981c.117 3.24-2.51 6.175-5.789 6.593c1.17-1.187 1.815-2.444 2.12-3.375c.606-1.846.508-3.316.055-4.44a4.46 4.46 0 0 0-1.782-2.141c-1.683-1.02-3.22-1.09-4.444-.762c.465-.594.876-1.201 1.2-1.864c.584-1.65-.102-2.848-.704-3.519c-.192-.246-.061-.655.305-.655c1.41 0 2.813.02 4.22.115M3.32 19.107c1.924-2.202 4.712-5.394 7.162-8.15c.559-.63 2.769-2.338 5.748-.533c.878.532 2.43 2.165 1.332 5.51c-.803 2.446-4.408 7.796-15.76 5.844c-.227-.039-.511-.354-.218-.687z"/></svg>`,
      },
    },
    // bilibili icon from => https://icon-sets.iconify.design/?query=bilibili
    {
      ariaLabel: 'Tdahuyou B 站主页链接',
      link: 'https://space.bilibili.com/407241004',
      icon: {
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g fill="currentColor"><path d="M310.134 596.45c-7.999-4.463-16.498-8.43-24.997-11.9a274 274 0 0 0-26.996-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c.999.992 1.999 1.488 2.999.496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c1.5-1.487 0-2.479.5-2.975m323.96-11.9a274 274 0 0 0-26.997-7.438c-2.5-.992-2.5.991-2.5 1.487c0 7.934.5 18.843 1.5 27.768c1 7.438 2 15.372 4 22.81c0 .496 0 .991.5 1.487c1 .992 2 1.488 3 .496c7.999-4.463 15.998-8.43 22.997-13.388c7.499-5.454 15.498-11.9 21.997-18.347c2-1.487.5-2.479.5-2.975c-7.5-4.463-16.498-8.43-24.997-11.9"/><path d="M741.496 112H283c-94.501 0-171 76.5-171 171.5v458c.5 94 77 170.5 170.999 170.5h457.997c94.5 0 171.002-76.5 171.002-170.5v-458c.497-95-76.002-171.5-170.502-171.5m95 343.5h15.5v48h-15.5zm-95.5-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 1.5l-6.5-47.5h17zm-230.498 1.5h15v48h-15zm-96-1.5l2 43l-13.5 1.5l-5-44.5zm-23.5 0l4 45.5l-14.5 2l-6-47.5zm-3.5 149C343.498 668.5 216 662.5 204.5 660.5C195.5 499 181.5 464 170 385l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 47c.5 3 0 6-1.5 8.5m20.5 35.5l-23.5-124h35.5l13 123zm44.5-8l-27-235l33.5-1.5l21 236H429zm34-175h17.5v48H467zm41 190h-26.5l-9.5-126h36zm209.998-43C693.496 668 565.997 662 554.497 660c-9-161-23-196-34.5-275l54.5-22.5c1 71.5 9 185 9 185s108.5-15.5 132 46.5c.5 3 0 6-1.5 8.5m19.5 36l-23-124h35.5l13 123zm45.5-8l-27.5-235l33.5-1.5l21 236h-27zm33.5-175h17.5v48h-13zm41 190h-26.5l-9.5-126h36z"/></g></svg>',
      },
    },
    {
      ariaLabel: 'Tdahuyou github 主页链接',
      link: 'https://github.com/Tdahuyou',
      icon: 'github',
    },
  ]

  return socialLinks
}

function head() {
  const head: HeadConfig[] = [
    [
      'meta',
      {
        name: 'keywords',
        content: 'Tdahuyou, Tdahuyou notes, TNotes',
      },
    ],
    ['meta', { name: 'author', content: 'Tdahuyou' }],
    ['link', { rel: 'canonical', href: 'https://tdahuyou.github.io/notes' }],

    // 当用户在社交媒体上分享链接时，预览效果会更加美观
    ['meta', { property: 'og:title', content: 'TNotes' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          '记录学习与开发过程中的笔记分享，涵盖前端开发、技术文档和个人心得。',
      },
    ],
    ['meta', { property: 'og:image', content: '/notes/cover-image.png' }],
    [
      'meta',
      { property: 'og:url', content: 'https://tdahuyou.github.io/notes' },
    ],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['link', { rel: 'icon', href: '/notes/favicon.ico' }],
    [
      'link',
      { rel: 'icon', href: 'https://tdahuyou.github.io/notes/favicon.ico' },
    ],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
        rel: 'stylesheet',
      },
    ],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-PKWV2KVJR7',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PKWV2KVJR7');`,
    ],
  ]

  return head
}

function themeConfig() {
  const themeConfig: DefaultTheme.Config = {
    // aside: false, // 隐藏侧边栏
    outline: {
      // level: [2, 3],
      label: '目录',
    },
    search: {
      // 使用本地搜索（不依赖远程服务器）
      provider: 'local',
      options: {
        miniSearch: {
          /**
           * 控制如何对文档进行分词、字段提取等预处理
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {
            // 自定义分词逻辑
            tokenize: (text, language) => {
              if (language === 'zh') {
                return text.match(/[\u4e00-\u9fa5]+|\S+/g) || []
              }
              return text.split(/\s+/)
            },
            // 将所有词转为小写，确保大小写不敏感匹配
            processTerm: (term) => term.toLowerCase(),
          },
          /**
           * 控制搜索时的行为（如模糊匹配、权重）
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {
            fuzzy: 0.2, // 模糊匹配阈值（0-1），允许拼写错误的阈值（数值越低越严格）
            prefix: true, // 是否启用前缀匹配（输入“jav”可匹配“javascript”）
            boost: {
              title: 5,
              headings: 5,
              text: 5,
              code: 1,
            },
          },
        },
        /**
         * 控制哪些 Markdown 内容参与本地搜索引擎索引
         * @param {string} src 当前 Markdown 文件的原始内容（即 .md 文件中的文本）
         * @param {import('vitepress').MarkdownEnv} env 包含当前页面环境信息的对象，比如 frontmatter、路径等
         * @param {import('markdown-it-async')} md 一个 Markdown 渲染器实例，用来将 Markdown 转换为 HTML
         */
        async _render(src, env, md) {
          const filePath = env.relativePath
          // if (filePath.includes('TOC.md')) return ''

          // 提取路径中 "notes/..." 后面的第一个目录名
          const notesIndex = filePath.indexOf('notes/')
          let folderName = ''

          if (notesIndex !== -1) {
            const pathAfterNotes = filePath.slice(notesIndex + 'notes/'.length)
            folderName = pathAfterNotes.split('/')[0]
          }

          // 显式添加一个高权重字段，例如 "title"
          const titleField = `# ${folderName}\n`
          const html = md.render(titleField + '\n\n' + src, env)

          // console.log('html:', html)

          return html
        },
      },
    },

    nav: [{ text: '👀 README', link: '/README' }],

    socialLinks: socialLinks(),

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    // lastUpdated: {
    //   text: '更新于 ',
    //   formatOptions: {
    //     dateStyle: 'full',
    //     timeStyle: 'short'
    //   }
    // },
    externalLinkIcon: true,
  }

  return themeConfig
}
