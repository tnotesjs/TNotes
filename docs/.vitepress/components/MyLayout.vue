<template>
  <Layout>
    <template #doc-top>
      <!-- <pre>{{ vscodeNoteDir }}</pre> -->
      <!-- <pre>{{ vpData.page.value.relativePath }}</pre> -->
      <!-- <button @click="copyRawFile" title="Copy raw file">raw</button> -->
      <!-- <pre>{{ notesData[vpData.page.value.title] }}</pre> -->
    </template>
    <!-- <template #doc-bottom>doc-bottom</template> -->
    <template #doc-footer-before>
      <div
        class="footer-update-time"
        v-show="!notesmeta.repos_vitepress.includes(vpData.page.value.title)"
      >
        更新于：{{ formatDate(vpData.page.value.lastUpdated) }}
      </div>
    </template>
    <template #doc-before>
      <div class="doc-before-container">
        <div class="left-area">
          <div class="vscode-box" v-show="vscodeNoteDir">
            <a
              :href="vscodeNoteDir"
              aria-label="open in vscode"
              title="open in vscode"
              target="_blank"
            >
              <img src="./icon__vscode.svg" alt="open in vscode" />
            </a>
          </div>
        </div>
      </div>
    </template>
    <!-- <template #doc-after>doc-after</template> -->

    <template #aside-top>
      <!-- aside-top -->
      <!-- {{ vpData.page.value.title }} -->
    </template>
    <template #aside-outline-before>
      <span
        @click="scrollToTop"
        style="cursor: pointer; height: 1em; width: 1em"
        title="回到顶部"
      >
        <img src="./icon__totop.svg" alt="to top" />
      </span>
    </template>

    <!-- <template #sidebar-nav-before>sidebar-nav-before</template> -->
    <!-- <template #sidebar-nav-after>sidebar-nav-after</template> -->

    <!-- <template #aside-outline-after>aside-outline-after</template> -->
    <!-- <template #aside-bottom>aside-bottom</template> -->
    <!-- <template #aside-ads-before>aside-ads-before</template> -->
    <!-- <template #aside-ads-after>aside-ads-after</template> -->
    <!-- <template #layout-top>layout-top</template> -->
    <!-- <template #layout-bottom>layout-bottom</template> -->
    <!-- <template #nav-bar-title-before>nav-bar-title-before</template> -->
    <!-- <template #nav-bar-title-after>nav-bar-title-after</template> -->
    <!-- <template #nav-bar-content-before>nav-bar-content-before</template> -->
    <!-- <template #nav-bar-content-after>nav-bar-content-after</template> -->

    <!-- !NOTE 不清楚下面的插槽所对应的位置 -->
    <!-- <template #nav-screen-content-before>nav-screen-content-before</template> -->
    <!-- <template #nav-screen-content-after>nav-screen-content-after</template> -->
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { data as notesData } from '../../src/notes/notes.data'
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import notesmeta from '../../../scripts/.notesmeta.json'
import { formatDate, scrollToTop } from './utils'

// --------------------------------------------------------------
// #region - swiper
// --------------------------------------------------------------
// doc: https://swiperjs.com/demos

// import Swiper from 'swiper'
// import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const swiperInstance = ref(null)

const initSwiper = () => {
  import('swiper').then(({ default: Swiper }) => {
    import('swiper/modules').then(({ Navigation, Pagination }) => {
      swiperInstance.value = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        modules: [Navigation, Pagination],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    })
  })
}

function destroySwiper() {
  // ! unknow error
  if (swiperInstance.value && swiperInstance.value.destroy) {
    try {
      swiperInstance.value.destroy(true, true)
    } catch (error) {
      console.log(error)
    }
  }

  // document.querySelectorAll('.swiper-container').forEach(el => el.remove())
  // swiperInstance.value = null
}

onBeforeUnmount(destroySwiper)

// <!-- Slider main container -->
// <div class="swiper">
//   <!-- Additional required wrapper -->
//   <div class="swiper-wrapper">
//     <!-- Slides -->
//     <div class="swiper-slide">Slide 1</div>
//     <div class="swiper-slide">Slide 2</div>
//     <div class="swiper-slide">Slide 3</div>
//     ...
//   </div>
//   <!-- If we need pagination -->
//   <div class="swiper-pagination"></div>

//   <!-- If we need navigation buttons -->
//   <div class="swiper-button-prev"></div>
//   <div class="swiper-button-next"></div>

//   <!-- If we need scrollbar -->
//   <div class="swiper-scrollbar"></div>
// </div>
// --------------------------------------------------------------
// #endregion - swiper
// --------------------------------------------------------------

const { Layout } = DefaultTheme
const vpData = useData()
// console.log('notesData:', notesData)
// console.log('vpData:', vpData)

const vscodeNoteDir = ref('')

const updateVscodeNoteDir = () => {
  if (vpData.page.value?.relativePath?.startsWith('notes/')) {
    const TNotesDir = localStorage.getItem('TNotesDir')
    const relativePath = vpData.page.value.relativePath
      .replaceAll(/^notes\//g, '')
      .replaceAll('README.md', '')
    vscodeNoteDir.value = TNotesDir
      ? `vscode://file/${TNotesDir}/${relativePath}`
      : ''
  } else {
    vscodeNoteDir.value = ''
  }
}

onMounted(() => {
  updateVscodeNoteDir()
  initSwiper()
})
watch(
  () => vpData.page.value.relativePath,
  () => {
    updateVscodeNoteDir()
    initSwiper()
  }
)

const allNotesLen = computed(
  () => notesData[vpData.page.value.title.toLowerCase()]?.allNotesLen
)
const doneNotesLen = computed(
  () => notesData[vpData.page.value.title.toLowerCase()]?.doneNotesLen
)
const isCopied = ref(false)
const copyRawFile = () => {
  const noteData = notesData[vpData.page.value.title.toLowerCase()]
  // console.log(notesData, vpData.page.value.title.toLowerCase())
  if (!noteData) return
  let data = notesData[vpData.page.value.title.toLowerCase()].fileContent
  data = data.replace('<MyGlobalComponent />', '')
  navigator.clipboard.writeText(data)
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 1000)

  const targetWindow = window.open('https://tdahuyou.github.io/m2mm/', '_blank')
  setTimeout(() => {
    targetWindow.postMessage(
      {
        senderID: '__TNotes__',
        message: data,
      },
      '*'
    )
  }, 1000)
}
</script>

<style>
.doc-before-container {
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
  justify-content: space-between;
}

.doc-before-container .left-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.vscode-box {
  width: 1em;
  height: 1em;
}

.copy-box {
  width: 1em;
  height: 1em;
  position: relative;
}

.copy-box .tip {
  position: absolute;
  top: -1.5rem;
  left: -1rem;
}

.copy-box .copy-raw-file {
  vertical-align: top;

  height: 100%;
  line-height: 100%;
}

.right-area {
  display: flex;
  align-items: center;

  font-style: italic;
  font-size: 0.7rem;
}

.update-time {
  vertical-align: middle;
}

.footer-update-time {
  text-align: right;
  font-style: italic;
  font-size: 0.7rem;
}

/* add some custom styles to set Swiper size */
.swiper-container {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
}

.swiper-container img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* .swiper-container .swiper-pagination-bullet {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #1a1a1a;
    opacity: .2;
    background: rgba(0, 0, 0, 0.2);
} */

.swiper-container .swiper-pagination-bullet:hover {
  opacity: 0.8;
}

.swiper-container .swiper-pagination-bullet-active {
  color: #fff;
  background: var(--vp-c-brand-1);
  opacity: 0.8;
}

.swiper-container .swiper-button-prev:after,
.swiper-container .swiper-button-next:after {
  font-size: 1.5rem;
}

.swiper-container .swiper-button-prev,
.swiper-container .swiper-button-next {
  transition: all 0.3s;
  opacity: 0.5;
}

.swiper-container .swiper-button-prev:hover,
.swiper-container .swiper-button-next:hover {
  transform: scale(1.5);
  opacity: 1;
}
</style>
