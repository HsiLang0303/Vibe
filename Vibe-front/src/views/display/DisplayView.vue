<template>
  <div class="page">
    <div class="content"><RouterView /></div>

    <BottomNav :active="current" @navigate="onNavigate" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
type Tab = 'publish' | 'circle' | 'social' | 'chat' | 'profile'
const router = useRouter()
const route = useRoute()
const pathTab = computed<Tab>(() => {
  const seg = (route.path.split('/')[2] || 'circle') as Tab
  return ['publish', 'circle', 'social', 'chat', 'profile'].includes(seg) ? seg : 'circle'
})
const current = computed<Tab>(() => pathTab.value)
function onNavigate(v: Tab) {
  router.push(`/display/${v}`)
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100dvh;
  padding-bottom: 72px;
}
.content {
  height: calc(100dvh - 72px);
  overflow-y: auto;
}
</style>
