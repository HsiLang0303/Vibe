<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { throttle } from '@/utils/fn'
import { register } from '@/api/auth'
import { ElMessage } from 'element-plus'
const router = useRouter()
const phone = ref('')
const password = ref('')
const agreed = ref(false)

function categoryCount(pw: string) {
  let c = 0
  if (/[0-9]/.test(pw)) c++
  if (/[A-Z]/.test(pw)) c++
  if (/[a-z]/.test(pw)) c++
  if (/[^A-Za-z0-9]/.test(pw)) c++
  return c
}

const validPhone = computed(() => /^1\d{10}$/.test(phone.value))
const validPassword = computed(
  () => password.value.length >= 6 && categoryCount(password.value) >= 2,
)
const canRegister = computed(() => validPhone.value && validPassword.value && agreed.value)
const loading = ref(false)

async function submit() {
  if (!canRegister.value) return
  loading.value = true
  try {
    const res = await register({
      phone: phone.value,
      password: password.value,
      username: phone.value,
    })
    if (res?.ok) {
      ElMessage.success('注册成功')
      router.push('/login')
    }
  } catch (e: any) {
    if (e?.status === 400) ElMessage.error('参数缺失或不合法')
    else if (e?.status === 409) ElMessage.error('手机号已存在')
    else if (e?.status === 404) ElMessage.error('接口不存在或路径错误 (404)')
    else if (e?.status === 0) ElMessage.error('网络错误或服务器不可达')
    else ElMessage.error(e?.data?.message ?? '服务器内部错误')
  } finally {
    loading.value = false
  }
}
const onSubmit = throttle(submit, 1000)
</script>

<template>
  <div class="register-wrap">
    <div class="title-wrap">
      <h1 class="title">加入 Vibe</h1>
      <p class="subtitle">用手机号创建你的 Vibe 账号</p>
    </div>

    <div class="card">
      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <input v-model="phone" class="input" placeholder="手机号" maxlength="11" />
        </div>
        <div class="field">
          <input v-model="password" type="password" class="input" placeholder="密码" />
        </div>
        <p class="hint" :class="{ ok: validPassword }">
          包含数字、大小写字母、特殊字符中的任意两种
        </p>
        <label class="agree">
          <input type="checkbox" v-model="agreed" />
          我已阅读 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
        </label>
        <button class="primary" type="submit" :disabled="!canRegister || loading">立即注册</button>
      </form>

      <div class="actions">
        <RouterLink class="link" to="/login">已有账号？去登录 →</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-wrap {
  min-height: 100dvh;
  background: linear-gradient(180deg, #eef3ff 0%, #f7fbff 100%);
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  padding-inline: clamp(12px, 4vw, 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card {
  width: min(92vw, 420px);
  display: flex;
  flex-direction: column;
}
.title-wrap {
  height: 120px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  margin: 0;
  font-size: var(--fs-title);
  font-weight: 700;
  line-height: 1.15;
  background: linear-gradient(90deg, #111827 0%, #2563eb 55%, #111827 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  position: relative;
  margin-bottom: 10px;
}
.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 64px;
  height: 4px;
  border-radius: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
}
.subtitle {
  margin: 10px 0 16px;
  color: #6b7280;
  font-size: var(--fs-sub);
  font-weight: 500;
}
.form {
  display: grid;
  gap: 12px;
}
.field {
  display: flex;
  gap: 8px;
}
.input {
  flex: 1;
  height: clamp(40px, 6.2dvh, 48px);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
}
.input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.hint {
  margin-top: -4px;
  font-size: 12px;
  color: #9ca3af;
}
.hint.ok {
  color: #10b981;
}
.agree {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
}
.agree a {
  color: #2563eb;
  text-decoration: none;
}
.primary {
  height: clamp(42px, 6.4dvh, 50px);
  border: none;
  border-radius: 12px;
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
.primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
.actions {
  margin-top: 8px;
  text-align: center;
}
.link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
</style>
