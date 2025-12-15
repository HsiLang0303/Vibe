<script setup lang="ts">
import { defineEmits } from 'vue'
const emit = defineEmits<{ (e: 'search'): void }>()
function onSearch() {
  emit('search')
}
</script>

<template>
  <header class="top">
    <div class="center">
      <strong>发布</strong>
      <span class="sub">文字 · 图片 · 视频</span>
    </div>
    <button class="search" @click="onSearch">🔍</button>
  </header>
</template>

<style scoped lang="scss">
.top {
  position: relative;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: calc(var(--safe-top)) clamp(12px, 4vw, 16px) 8px;
  background: #fff;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.sub {
  color: #9ca3af;
  font-size: 12px;
}
.search {
  position: absolute;
  right: clamp(12px, 4vw, 16px);
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}
</style>
