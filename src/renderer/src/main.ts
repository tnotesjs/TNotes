import './assets/fonts.css'
import '@tnotesjs/ui/styles/tokens.css'
import '@tnotesjs/ui/styles/prose.css'
import '@tnotesjs/ui/styles/code.css'
import './assets/main.css'
import 'katex/dist/katex.min.css'
import '@milkdown/crepe/theme/common/style.css'
import '@milkdown/crepe/theme/frame.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
