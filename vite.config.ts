import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// @ts-ignore
import importmap from 'vite-plugin-importmap'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { NAMESPACE } from './src/constants'
import { join } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const importmapMark = process.env.VITE_BUILD_TYPE

export default defineConfig({
  base: './',

  plugins: [
    importmap(importmapMark),
    initDataFiles(),
    createIndexHtml(),
    vue(),
    jsx(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next',
      })],
      dts: false
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next',
        resolveIcons: true
      })],
      dts: false
    }),
    vueDevTools()
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        $namespace:${NAMESPACE};
        @import "@/styles/index.scss";
        `
      }
    }
  },

  resolve: {
    alias: {
      '@': '/src'
    }
  },

  server: {
    host: true,
    port: 7494,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const arr = [
            'lodash-es',
            'tdesign-icons-vue-next',
            'tdesign-vue-next',
            ['@vueuse/core', 'vueuse'],
            'pinyin-pro',
          ]

          for (const item of arr) {
            if (typeof item === 'string') {
              if (id.includes(item)) return item
            }

            if (Array.isArray(item)) {
              const [key, val] = item
              if (id.includes(key)) return val
            }
          }

          if (id.includes('node_modules')) return 'vendor'
        }
      }
    },
    chunkSizeWarningLimit: 2048
  }
})

function createIndexHtml(): Plugin {
  return {
    name: 'create-index-html',
    config() {
      const temp = readFileSync(join(__dirname, 'index.temp.html'), 'utf-8')

      writeFileSync(join(__dirname, 'index.html'), temp.replace('SCRIPT_SRC', `./src/main.${importmapMark}.ts`))
    }
  }
}

function initDataFiles(): Plugin {
  return {
    name: 'init-data-files',
    config() {
      // bookmarks-data.json
      if (!existsSync(join(__dirname, 'bookmarks-data.json'))) {
        writeFileSync(join(__dirname, 'bookmarks-data.json'), '[]')
      }

      // user-settings.json
      if (!existsSync(join(__dirname, 'user-settings.json'))) {
        writeFileSync(join(__dirname, 'user-settings.json'), '{}')
      }

      // theme-config.json
      if (!existsSync(join(__dirname, 'theme-config.json'))) {
        writeFileSync(join(__dirname, 'theme-config.json'), '{}')
      }
    }
  }
}