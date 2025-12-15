<template>
  <section class="list">
    <article v-for="item in items" :key="item.id" class="card">
      <div class="head">
        <div class="avatar">
          <img
            v-if="item.avatar"
            :src="item.avatar"
            alt="avatar"
            style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover"
          />
          <template v-else>{{ item.username[0] }}</template>
        </div>
        <div class="meta">
          <div class="name">{{ item.username }}</div>
          <div class="sub">{{ item.time }}</div>
        </div>
      </div>
      <p class="text">{{ item.content }}</p>
      <div class="actions">
        <button>👍 {{ item.likes }}</button>
        <button>⭐ {{ item.saves }}</button>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPosts } from '@/api/posts'
import { ElMessage } from 'element-plus'
import { BASE_URL } from '@/utils/request'
import { formatTimeWithDiff } from '@/utils/time'
const items = ref<
  Array<{
    id: number
    username: string
    time: string
    content: string
    likes: number
    saves: number
    avatar?: string
  }>
>([])

onMounted(async () => {
  console.log('liked')
  try {
    const raw = localStorage.getItem('userInfo')
    const u = raw ? JSON.parse(raw) : null
    const phone = u?.phone
    const avatar = u?.avatar
      ? String(u.avatar).startsWith('http')
        ? u.avatar
        : `${BASE_URL}${u.avatar}`
      : undefined
    if (!phone) return
    const res = await getPosts({ phone, type: 'liked', limit: 20, offset: 0 })
    if (res?.ok && Array.isArray(res.list)) {
      items.value = res.list.map((p) => ({
        id: p.id,
        username: p.phone || '用户',
        time: (() => {
          const { formatted, diff } = formatTimeWithDiff(p.created_at || '')
          return diff ? `${formatted} · ${diff}` : formatted
        })(),
        content: p.content || '',
        likes: p.likes ?? 0,
        saves: p.saves ?? 0,
        avatar,
      }))
    }
  } catch (e: any) {
    if (e?.status === 0) ElMessage.error('网络错误或服务器不可达')
    else ElMessage.error('加载赞过失败')
  }
})
</script>

<style scoped lang="scss">
.filter {
  padding: 0 var(--space-md);
  color: #6b7280;
}
.list {
  display: grid;
  gap: var(--space-md);
}
.card {
  border-radius: var(--radius);
  background: #fff;
  padding: var(--space-md);
}
.head {
  display: flex;
  gap: 0.625rem;
  align-items: center;
}
.avatar {
  width: 2.25rem;
  height: 2.25rem;
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
  font-size: 0.75rem;
  color: #9ca3af;
}
.text {
  margin: 0.5rem 0 0.625rem;
}
.actions {
  display: flex;
  gap: var(--space-md);
}
.actions button {
  border: 0.0625rem solid #e5e7eb;
  background: #fff;
  border-radius: 0.625rem;
  padding: 0.375rem 0.625rem;
}
</style>
