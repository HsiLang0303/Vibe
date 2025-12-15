<script setup lang="ts">
import { ref, defineEmits, onMounted, nextTick, watch } from 'vue'
type Tab = 'publish' | 'circle' | 'social' | 'chat' | 'profile'
const active = ref<Tab>('circle')
const props = defineProps<{ active?: Tab }>()
const emit = defineEmits<{
  (e: 'navigate', v: 'publish' | 'circle' | 'social' | 'chat' | 'profile'): void
}>()
const order = ['circle', 'social', 'publish', 'chat', 'profile'] as const
const container = ref<HTMLElement | null>(null)
const itemRefs = ref<Array<HTMLElement | null>>([])
const indicatorStyle = ref<Record<string, string>>({})
function updateIndicator() {
  const root = container.value
  const idx = order.indexOf(active.value as any)
  const el = itemRefs.value[idx]
  if (!root || !el) return
  const rc = root.getBoundingClientRect()
  const ri = el.getBoundingClientRect()
  indicatorStyle.value = {
    left: `${ri.left - rc.left}px`,
    top: `${ri.top - rc.top}px`,
    width: `${ri.width}px`,
    height: `${ri.height}px`,
  }
}
function set(v: 'publish' | 'circle' | 'social' | 'chat' | 'profile') {
  active.value = v
  emit('navigate', v)
  nextTick(updateIndicator)
}
onMounted(() => {
  nextTick(updateIndicator)
  window.addEventListener('resize', updateIndicator)
})
watch(
  () => props.active,
  (v) => {
    if (v) {
      active.value = v as Tab
      nextTick(updateIndicator)
    }
  },
)
</script>

<template>
  <nav class="bottom" ref="container">
    <div class="indicator" :style="indicatorStyle"></div>
    <button
      :class="['item', active === 'circle' && 'active']"
      @click="set('circle')"
      :ref="(el) => (itemRefs[0] = el as any)"
    >
      🌀<span>圈子</span>
    </button>
    <button
      :class="['item', active === 'social' && 'active']"
      @click="set('social')"
      :ref="(el) => (itemRefs[1] = el as any)"
    >
      🤝<span>交友</span>
    </button>
    <button
      :class="['item', active === 'publish' && 'active']"
      @click="set('publish')"
      :ref="(el) => (itemRefs[2] = el as any)"
    >
      ✚<span>发布</span>
    </button>
    <button
      :class="['item', active === 'chat' && 'active']"
      @click="set('chat')"
      :ref="(el) => (itemRefs[3] = el as any)"
    >
      💬<span>聊天</span>
    </button>
    <button
      :class="['item', active === 'profile' && 'active']"
      @click="set('profile')"
      :ref="(el) => (itemRefs[4] = el as any)"
    >
      👤<span>个人</span>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--safe-bottom));
  display: flex;
  gap: 6px;
  padding: 6px clamp(12px, 4vw, 16px);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
}
.indicator {
  position: absolute;
  border-radius: 12px;
  background: #eef3ff;
  transition:
    left 0.25s ease,
    width 0.25s ease,
    top 0.25s ease,
    height 0.25s ease;
  z-index: 0;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 12px;
  padding: 8px 0;
  background: transparent;
  color: #6b7280;
  position: relative;
  z-index: 1;
  flex: 1;
  transition:
    transform 0.18s ease,
    color 0.18s ease;
}
.item.active {
  color: #2563eb;
  transform: translateY(-3px) scale(1.08);
  font-weight: 700;
}
.item span {
  font-size: 12px;
}
</style>
