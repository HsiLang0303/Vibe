<script setup lang="ts">
import { ref, defineEmits } from 'vue'
const active = ref<'posts' | 'favorites'>('posts')
const emit = defineEmits<{
  (e: 'change', v: 'posts' | 'favorites'): void
  (e: 'search'): void
}>()
function set(v: 'posts' | 'favorites') {
  active.value = v
  emit('change', v)
}
</script>

<template>
  <header class="top">
    <div class="center">
      <button :class="['tab', active === 'posts' && 'active']" @click="set('posts')">动态</button>
      <button :class="['tab', active === 'favorites' && 'active']" @click="set('favorites')">
        收藏
      </button>
    </div>
    <button class="search" @click="$emit('search')">🔍</button>
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
  gap: 14px;
  justify-content: center;
}
.tab {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  padding: 6px 0;
}
.tab.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
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
