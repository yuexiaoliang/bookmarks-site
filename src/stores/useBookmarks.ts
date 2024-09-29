import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pinyin } from 'pinyin-pro'

export type BookmarkNode = chrome.bookmarks.BookmarkTreeNode

export default defineStore('bookmarks', () => {
  const bookmarks = ref<BookmarkNode[]>([])

  const flatBookmarks = computed(() => {
    return deep(bookmarks.value)

    function deep(list: BookmarkNode[], result = [] as BookmarkNode[]) {
      list.forEach(item => {
        const { children } = item
        result.push(item)

        if (children) {
          deep(children, result)
        }
      })

      return result
    }
  })

  const bookmarksMap = computed(() => {
    return flatBookmarks.value.reduce((acc, cur) => {
      acc[cur.id] = cur
      return acc
    }, {} as Record<string, BookmarkNode>)
  })

  function setBookmarks(data: BookmarkNode[]) {

    bookmarks.value = data.map(item => deep(item))

    function deep(node: BookmarkNode, parent?: BookmarkNode) {
      const { children, ...bm } = node

      const result: BookmarkNode = {
        ...bm,
        pinyin: pinyin(node.title, { toneType: 'none', nonZh: 'consecutive', separator: '' }).toLocaleLowerCase(),
      }

      if (parent) {
        if (!result.parentsPath) result.parentsPath = []
        result.parentsPath.push(...parent?.parentsPath || [], parent)
      }

      if (Array.isArray(children)) {
        result.children = children.map((child => {
          return deep(child, result)
        }))
      }

      return result
    }
  }

  return {
    bookmarks,
    flatBookmarks,
    bookmarksMap,
    setBookmarks
  }
})