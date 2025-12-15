<template>
  <section class="hero">
    <div class="top-actions" ref="actionsRef">
      <button class="gear" @click="showMenu = !showMenu">⚙️</button>
      <div v-if="showMenu" class="menu">
        <button class="menu-item" @click="onAvatarClick">更换头像</button>
        <button class="menu-item" @click="logout">退出登录</button>
      </div>
    </div>
    <div class="bg"></div>
    <div class="card">
      <div class="row">
        <div class="avatar">
          <img :src="avatar || defaultAvatar" alt="avatar" />
        </div>
        <div class="info">
          <div class="name">{{ name }}</div>
          <div class="stats">
            <span>{{ following }} 关注</span>
            <span>{{ followers }} 被关注</span>
            <span>{{ views }} 看过我</span>
          </div>
        </div>
        <button class="edit" @click="openEdit">✎</button>
      </div>
      <div class="tags">
        <span class="pill" v-for="(t, i) in tags" :key="i">{{ t }}</span>
        <button class="pill add" @click="openEdit">＋</button>
      </div>
    </div>
    <input
      ref="fileRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFileChange"
    />
    <div v-if="showEdit" class="modal">
      <div class="dialog">
        <h3 class="dlg-title">编辑资料</h3>
        <label class="field">
          <span>用户名</span>
          <input v-model="editName" class="input" placeholder="请输入用户名" />
        </label>
        <div class="field">
          <span>标签</span>
          <div class="chips">
            <span class="chip" v-for="(t, i) in editTags" :key="i"
              >{{ t }}
              <button class="x" @click="removeTag(i)">×</button>
            </span>
          </div>
          <input v-model="editTagInput" class="input" placeholder="用逗号分隔多个标签" />
        </div>
        <div class="dlg-actions">
          <button class="btn" @click="onSave">保存</button>
          <button class="btn outline" @click="showEdit = false">取消</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUserByPhone, uploadAvatarByPhone } from '@/api/user'
import { BASE_URL } from '@/utils/request'
import { useRouter } from 'vue-router'
const name = ref('黄四郎')
const following = ref(0)
const followers = ref(0)
const views = ref(667)
const tags = ref<string[]>(['ENTP', '程序猿', '信息秒回'])
const defaultAvatar = '../images/avatar.jpg'
const avatar = ref<string>('')
const fileRef = ref<HTMLInputElement | null>(null)
const showMenu = ref(false)
const router = useRouter()
const actionsRef = ref<HTMLElement | null>(null)
const showEdit = ref(false)
const editName = ref(name.value)
const editTags = ref<string[]>([...tags.value])
const editTagInput = ref('')
function openEdit() {
  editName.value = name.value
  editTags.value = [...tags.value]
  editTagInput.value = ''
  showEdit.value = true
}
function removeTag(i: number) {
  editTags.value.splice(i, 1)
}
async function onSave() {
  const newName = editName.value.trim()
  const newTags = [...editTags.value]
  const extra = editTagInput.value
    .split(/[，,;；、\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  for (const t of extra) {
    if (!newTags.includes(t)) newTags.push(t)
  }
  let phone = ''
  try {
    const raw = localStorage.getItem('userInfo')
    const u = raw ? JSON.parse(raw) : null
    phone = u?.phone || ''
  } catch {}
  try {
    await updateUserByPhone(phone, { username: newName || undefined, tags: newTags })
    name.value = newName || name.value
    tags.value = newTags
    showEdit.value = false
    editTagInput.value = ''
    try {
      const raw = localStorage.getItem('userInfo')
      const u = raw ? JSON.parse(raw) : {}
      u.username = name.value
      u.tags = tags.value
      localStorage.setItem('userInfo', JSON.stringify(u))
    } catch {}
    ElMessage.success('已更新个人资料')
  } catch (e: any) {
    if (e?.status === 404) ElMessage.error('用户不存在')
    else if (e?.status === 0) ElMessage.error('网络错误或服务器不可达')
    else ElMessage.error('更新失败')
  }
}
onMounted(() => {
  try {
    const user = JSON.parse(localStorage.getItem('userInfo') ?? '{}')
    if (user.username) name.value = user.username
    if (typeof user.followers_count === 'number') followers.value = user.followers_count
    if (typeof user.following_count === 'number') following.value = user.following_count
    if (typeof user.visit_count === 'number') views.value = user.visit_count
    if (Array.isArray(user.tags)) tags.value = user.tags
    if (user.avatar) {
      avatar.value = String(user.avatar).startsWith('http')
        ? user.avatar
        : `${BASE_URL}${user.avatar}`
    }
  } catch {}
})

function handleDocClick(e: MouseEvent) {
  const el = actionsRef.value
  if (!el) return
  const target = e.target as Node
  if (showMenu.value && target && !el.contains(target)) showMenu.value = false
}
onMounted(() => document.addEventListener('click', handleDocClick))
onUnmounted(() => document.removeEventListener('click', handleDocClick))

function onAvatarClick() {
  fileRef.value?.click()
}
function logout() {
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch {}
  showMenu.value = false
  ElMessage.success('已退出登录')
  router.push('/login')
}
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const u = JSON.parse(localStorage.getItem('userInfo') ?? '{}')
    const phone = u?.phone || ''
    if (!phone) throw new Error('no-phone')
    const res = await uploadAvatarByPhone(phone, file)
    if (res?.ok && res.avatar) {
      const url = String(res.avatar).startsWith('http') ? res.avatar : `${BASE_URL}${res.avatar}`
      avatar.value = url
      u.avatar = url
      localStorage.setItem('user', JSON.stringify(u))
      ElMessage.success('头像已更新')
      return
    }
    throw new Error('upload-failed')
  } catch (err) {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      if (!dataUrl) return
      avatar.value = dataUrl
      try {
        const u = JSON.parse(localStorage.getItem('user') ?? '{}')
        u.avatar = dataUrl
        localStorage.setItem('user', JSON.stringify(u))
      } catch {}
      ElMessage.success('头像已更新（本地）')
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped lang="scss">
.hero {
  position: relative;
}
.top-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.gear {
  border-radius: 0.625rem;
  width: 2rem;
  height: 2rem;
  border: none;
}
.menu {
  width: 5rem;
  right: 0rem;
  position: absolute;
  margin-top: 0.25rem;
  background: #fff;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.625rem;
  box-shadow: 0 0.5rem 1rem rgba(24, 39, 75, 0.1);
}
.menu-item {
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
}
.bg {
  height: clamp(8rem, 22dvh, 10rem);
  border-radius: var(--radius);
  background: url('https://picsum.photos/800/240') center/cover no-repeat;
}
.card {
  margin-top: -1.75rem;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 0.5rem 1.5rem rgba(24, 39, 75, 0.08);
  padding: var(--space-md);
}
.row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}
.avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
.info {
  flex: 1;
}
.name {
  font-size: var(--fs-title);
  font-weight: 700;
}
.stats {
  display: flex;
  gap: var(--space-md);
  margin-top: 0.375rem;
  font-size: 0.55rem;
  color: #6b7280;
}
.edit {
  border: 0.0625rem solid #e5e7eb;
  background: #fff;
  border-radius: 0.625rem;
  width: 2.25rem;
  height: 2.25rem;
}
.tags {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  flex-wrap: wrap;
}
.pill {
  padding: 0.1rem 0.625rem;
  border-radius: 999px;
  background: #f3f4f6;
  font-size: 0.75rem;
}
.pill.add {
  padding: 0.1rem 0.2rem;
  background: #eef3ff;
  color: #2563eb;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 clamp(var(--space-md), 4vw, var(--space-lg));
}
.dialog {
  width: min(92vw, 24rem);
  background: #fff;
  border-radius: var(--radius);
  box-shadow: 0 0.5rem 1.5rem rgba(24, 39, 75, 0.2);
  padding: var(--space-lg);
}
.dlg-title {
  margin: 0 0 var(--space-md) 0;
  font-size: var(--fs-title);
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: var(--space-md);
}
.input {
  height: 2.5rem;
  border: 0.0625rem solid #e5e7eb;
  border-radius: 0.625rem;
  padding: 0 0.75rem;
  outline: none;
}
.chips {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
.chip {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 999px;
  font-size: 0.8125rem;
}
.x {
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
}
.dlg-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-sm);
}
.btn {
  border: none;
  border-radius: 0.625rem;
  padding: 0.5rem 0.875rem;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
}
.btn.outline {
  background: #fff;
  color: #2563eb;
  border: 0.0625rem solid #2563eb;
}
</style>
