<template>
  <div class="chat-page">
    <ChatTopNav />
    <section class="list">
      <div class="conv" v-for="c in convs" :key="c.id">
        <div class="avatar">{{ c.name[0] }}</div>
        <div class="info">
          <div class="name">{{ c.name }}</div>
          <div class="sub">{{ c.last }}</div>
        </div>
        <span class="time">{{ c.time }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatTopNav from '@/components/topNav/ChatTopNav.vue'
const convs = ref([
  { id: 1, name: 'Ava', last: '晚上一起看电影？', time: '18:02' },
  { id: 2, name: '群聊·跑步', last: '周末 8:00 集合', time: '昨天' },
])
</script>

<style scoped lang="scss">
.sub {
  color: #9ca3af;
  font-size: 12px;
}
.list {
  display: grid;
  gap: 10px;
  padding: 8px clamp(12px, 4vw, 16px) 84px;
}
.conv {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(24, 39, 75, 0.06);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eef3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  font-weight: 700;
}
.info .name {
  font-weight: 700;
}
.info .sub {
  font-size: 12px;
  color: #9ca3af;
}
.time {
  margin-left: auto;
  font-size: 12px;
  color: #9ca3af;
}
</style>
