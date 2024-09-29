import { createApp as _createApp } from 'vue'
import { createPinia } from 'pinia'
import useBookmarks, { BookmarkNode } from '@/stores/useBookmarks'
import App from './App.vue'

import 'tdesign-vue-next/dist/reset.css';
import 'tdesign-vue-next/es/style/index.css';
import '@/styles/base.scss'

createApp()

function createApp() {
  const app = _createApp(App)

  const pinia = createPinia()
  app.use(pinia)

  app.mount('#app')

  const bookmarksStore = useBookmarks()
  window.addEventListener('message', (e) => {
    if (typeof e.data !== 'object') return;
    if (e.data?.source !== 'ext-message') return;

    const { data, type } = e.data.data

    if (type !== 'bookmarks-tree') return;

    const d: BookmarkNode[] = data?.[0]?.children || []
    bookmarksStore.setBookmarks(d)
  })
}