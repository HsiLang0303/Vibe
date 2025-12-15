<template>
  <nav class="tabs">
    <button
      :class="['tab', model === 'moment' && 'active']"
      @click="$emit('update:modelValue', 'moment')"
    >
      动态<span class="count"></span>
    </button>
    <button
      :class="['tab', model === 'love' && 'active']"
      @click="$emit('update:modelValue', 'love')"
    >
      喜欢
    </button>
    <button
      :class="['tab', model === 'fav' && 'active']"
      @click="$emit('update:modelValue', 'fav')"
    >
      收藏
    </button>
    <button
      :class="['tab', model === 'liked' && 'active']"
      @click="$emit('update:modelValue', 'liked')"
    >
      赞过
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue: 'moment' | 'love' | 'fav' | 'liked' }>()
const model = computed(() => props.modelValue)
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  gap: 1.125rem;
  padding: var(--space-md);
}
.tab {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
}
.tab.active {
  color: #2563eb;
  border-bottom: 0.125rem solid #2563eb;
}
.count {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
