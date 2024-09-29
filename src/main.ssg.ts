import { ViteSSG } from 'vite-ssg/single-page'
import { createPinia } from 'pinia'
import useBookmarks from '@/stores/useBookmarks';
import App from './App.vue'

// @ts-ignore
import bookmarksData from '../bookmarks-data.json'

import 'tdesign-vue-next/dist/reset.css';
import 'tdesign-vue-next/es/style/index.css';
import '@/styles/base.scss'

export const createApp = ViteSSG(App, async (ctx) => {
  const { app } = ctx

  const pinia = createPinia()
  app.use(pinia)

  const bookmarksStore = useBookmarks();
  bookmarksStore.setBookmarks(bookmarksData)
})
