<template>
  <section class="grid">
    <button class="item"><span class="icon">🏛️</span><span>数字藏馆</span></button>
    <button class="item"><span class="icon">🪙</span><span>金币中心</span></button>
    <button class="item"><span class="icon">🛍️</span><span>个性商城</span></button>
    <button class="item"><span class="icon">🎮</span><span>娱乐中心</span></button>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.grid {
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 0.5rem 1.5rem rgba(24, 39, 75, 0.08);
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 0.7rem;
}
.icon {
  font-size: 1.25rem;
}
</style>
