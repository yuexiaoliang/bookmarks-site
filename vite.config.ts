import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import { NAMESPACE } from './src/constants'


export default defineConfig({
  base: './',

  plugins: [
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
})
