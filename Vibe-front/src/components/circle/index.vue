<template>
  <div class="circle-page">
    <CircleTopNav @change="(v) => (tab = v)" @search="onSearch" />
    <section class="feed">
      <article v-for="item in list" :key="item.id" class="card">
        <div class="head">
          <div class="avatar">{{ item.username[0] }}</div>
          <div class="meta">
            <div class="name">{{ item.username }}</div>
            <div class="sub">{{ item.location }} · {{ item.hobby }}</div>
          </div>
        </div>
        <p class="text">{{ item.content }}</p>
        <div class="actions">
          <button @click="like(item.id)">👍 {{ item.likes }}</button>
          <button @click="save(item.id)">⭐ {{ item.saves }}</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CircleTopNav from '@/components/topNav/CircleTopNav.vue'
const tab = ref<'recommend' | 'nearby' | 'follow'>('recommend')
const list = ref([
  {
    id: 1,
    username: 'Ava',
    location: '上海',
    hobby: '摄影',
    content: '今天的夕阳很美。',
    likes: 12,
    saves: 3,
  },
  {
    id: 2,
    username: 'Leo',
    location: '北京',
    hobby: '跑步',
    content: '5公里晨跑打卡。',
    likes: 8,
    saves: 1,
  },
  {
    id: 3,
    username: 'Mia',
    location: '深圳',
    hobby: '美食',
    content: '新开的店好好吃。',
    likes: 20,
    saves: 5,
  },
])
function onSearch() {}
function like(id: number) {
  const t = list.value.find((i) => i.id === id)
  if (t) t.likes++
}
function save(id: number) {
  const t = list.value.find((i) => i.id === id)
  if (t) t.saves++
}
</script>

<style scoped lang="scss">
.circle-page {
  padding-bottom: 72px;
}
.feed {
  display: grid;
  gap: 12px;
  padding: 8px clamp(12px, 4vw, 16px) 72px;
}
.card {
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(24, 39, 75, 0.06);
  padding: 12px;
}
.head {
  display: flex;
  gap: 10px;
  align-items: center;
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
.meta .name {
  font-weight: 700;
}
.meta .sub {
  font-size: 12px;
  color: #9ca3af;
}
.text {
  margin: 8px 0 10px;
}
.actions {
  display: flex;
  gap: 12px;
}
.actions button {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 6px 10px;
}
</style>
