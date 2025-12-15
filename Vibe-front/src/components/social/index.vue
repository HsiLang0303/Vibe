<template>
  <div class="social-page">
    <SocialTopNav @change="(v)=>tab=v" />
    <section class="list">
      <div class="user" v-for="u in users" :key="u.id">
        <div class="avatar">{{ u.name[0] }}</div>
        <div class="info">
          <div class="name">{{ u.name }}</div>
          <div class="sub">{{ u.bio }}</div>
        </div>
        <button class="action">关注</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SocialTopNav from '@/components/topNav/SocialTopNav.vue'
const tab = ref<'recommend'|'nearby'|'online'>('recommend')
const users = ref([
  { id:1, name:'Nova', bio:'爱好摄影与旅行' },
  { id:2, name:'Ken', bio:'跑步健身爱好者' },
  { id:3, name:'Lily', bio:'咖啡控与猫咪铲屎官' },
])
</script>

<style scoped lang="scss">
.list { display:grid; gap:10px; padding: 8px clamp(12px,4vw,16px) 84px; }
.user { display:flex; align-items:center; gap:10px; background:#fff; border-radius:14px; padding:12px; box-shadow: 0 4px 12px rgba(24,39,75,.06); }
.avatar { width:36px; height:36px; border-radius:50%; background:#eef3ff; display:flex; align-items:center; justify-content:center; color:#2563eb; font-weight:700; }
.info .name { font-weight:700; }
.info .sub { font-size:12px; color:#9ca3af; }
.action { margin-left:auto; border:1px solid #e5e7eb; background:#fff; border-radius:10px; padding:6px 10px; }
</style>
