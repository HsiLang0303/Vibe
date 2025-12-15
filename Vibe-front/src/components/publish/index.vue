<template>
  <div class="publish-page">
    <PublishTopNav />
    <form class="form" @submit.prevent="onSubmit">
      <label class="field">
        <span>内容</span>
        <textarea v-model="content" class="textarea" rows="4" placeholder="分享你的想法"></textarea>
      </label>

      <div class="media-grid">
        <div class="thumb" v-for="(m, i) in media" :key="i">
          <img v-if="m.kind === 'image'" :src="m.url" alt="image" />
          <video v-else :src="m.url" controls preload="metadata"></video>
          <button class="del" @click="removeMedia(i)">×</button>
        </div>
        <label class="add-tile">
          <input type="file" accept="image/*,video/*" multiple @change="onPickMedia" />
          <span>＋</span>
        </label>
      </div>
      <div class="counts">图片 {{ imageCount }}，视频 {{ videoCount }}</div>

      <button class="primary" type="submit" :disabled="submitting">发布</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import PublishTopNav from '@/components/topNav/PublishTopNav.vue'
import { createPost } from '@/api/posts'
import { ElMessage } from 'element-plus'

const type = ref<'moment' | 'fav' | 'liked' | 'saved'>('moment')
const content = ref('')
const media = ref<Array<{ file: File; url: string; kind: 'image' | 'video' }>>([])
const imageCount = computed(() => media.value.filter((m) => m.kind === 'image').length)
const videoCount = computed(() => media.value.filter((m) => m.kind === 'video').length)
const submitting = ref(false)

const phone = ref(JSON.parse(localStorage.getItem('userInfo')).phone)
function onPickMedia(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  for (const f of files) {
    const kind: 'image' | 'video' = f.type.startsWith('video') ? 'video' : 'image'
    media.value.push({ file: f, url: URL.createObjectURL(f), kind })
  }
}
function removeMedia(i: number) {
  const item = media.value[i]
  if (item) URL.revokeObjectURL(item.url)
  media.value.splice(i, 1)
}

onUnmounted(() => {
  for (const it of media.value) URL.revokeObjectURL(it.url)
})

async function onSubmit() {
  if (!content.value.trim()) {
    ElMessage.error('请输入内容')
    return
  }

  submitting.value = true
  try {
    const res = await createPost({
      phone: phone.value,
      type: type.value,
      content: content.value.trim(),
      images: media.value.filter((m) => m.kind === 'image').map((m) => m.file),
      videos: media.value.filter((m) => m.kind === 'video').map((m) => m.file),
    })
    if (res?.ok) {
      ElMessage.success('发布成功')
      content.value = ''
      for (const it of media.value) URL.revokeObjectURL(it.url)
      media.value = []
    }
  } catch (e: any) {
    if (e?.status === 400) ElMessage.error('参数不合法')
    else ElMessage.error('发布失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.form {
  display: grid;
  gap: var(--space-md);
  padding: 8px clamp(12px, 4vw, 16px) 84px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.input {
  height: 2.5rem;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 0 0.75rem;
}
.textarea {
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 0.75rem;
}
.media-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
.thumb {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}
.thumb img,
.thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.add-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  position: relative;
  cursor: pointer;
}
.add-tile input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.add-tile span {
  font-size: 2rem;
  color: #2563eb;
}
.counts {
  color: #6b7280;
  font-size: 0.75rem;
}
.del {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
}
.primary {
  height: 2.75rem;
  border: none;
  border-radius: 0.625rem;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
}
</style>
