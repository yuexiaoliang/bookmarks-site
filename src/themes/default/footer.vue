<script setup lang="ts">
import { bem } from '@/utils';

const b = bem('theme-layout-footer');
</script>

<template>
  <div :class="b()">
    <div :class="b('copyright')">© {{ new Date().getFullYear() }} by <a href="https://bookmarks.wuxian.space" target="_blank" rel="noopener noreferrer nofollow">wuxianx-bookmarks</a></div>
  </div>
</template>

<style lang="scss">
.#{b(theme-layout-footer)} {
  padding: 15px 0;
  color: var(--td-text-color-secondary);
  font-size: 12px;

  &__copyright {
    text-align: center;
  }
}
</style>
