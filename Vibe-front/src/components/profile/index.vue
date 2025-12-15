<template>
  <div class="profile-page">
    <HeroCard />
    <ShortcutGrid />
    <TabsBar v-model="tab" />
    <component :is="Comp" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HeroCard from './components/HeroCard.vue'
import ShortcutGrid from './components/ShortcutGrid.vue'
import TabsBar from './components/TabsBar.vue'
import MomentTab from './components/tabs/MomentTab.vue'
import LoveTab from './components/tabs/LoveTab.vue'
import FavTab from './components/tabs/FavTab.vue'
import LikedTab from './components/tabs/LikedTab.vue'
const tab = ref<'moment' | 'love' | 'fav' | 'liked'>('moment')
const Comp = computed(
  () => ({ moment: MomentTab, love: LoveTab, fav: FavTab, liked: LikedTab })[tab.value],
)
</script>

<style scoped lang="scss">
.profile-page {
  display: grid;
  gap: 12px;
  padding: 8px clamp(12px, 4vw, 16px) 84px;
}
</style>
