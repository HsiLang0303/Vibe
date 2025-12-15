<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { throttle } from '@/utils/fn'
import { login } from '@/api/auth'
import { getUserByPhone } from '@/api/user'
const router = useRouter()
const tab = ref<'code' | 'password'>('code')
const phone = ref('')
const code = ref('')
const password = ref('')
const agreed = ref(false)
const sending = ref(false)
const countdown = ref(0)
const validPhone = computed(() => /^1\d{10}$/.test(phone.value))
const loading = ref(false)
function switchTab(t: 'code' | 'password') {
  tab.value = t
}
function sendCode() {
  if (sending.value || countdown.value > 0) return
  if (!/^1\d{10}$/.test(phone.value)) return
  sending.value = true
  setTimeout(() => {
    sending.value = false
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }, 800)
}
const canLogin = computed(() => {
  const okPhone = /^1\d{10}$/.test(phone.value)
  const okCred = tab.value === 'code' ? code.value.length >= 4 : password.value.length >= 6
  return agreed.value && okPhone && okCred
})
async function submit() {
  if (!canLogin.value) return
  if (tab.value === 'code') {
    ElMessage.info('当前版本仅支持密码登录')
    return
  }
  loading.value = true
  try {
    const res = await login({ phone: phone.value, password: password.value })
    if (res?.ok) {
      try {
        const p = res.user?.phone
        getUserByPhone(p).then((res) => {
          if (res?.ok) {
            localStorage.setItem('userInfo', JSON.stringify(res.user))
          }
        })
      } catch {
        ElMessage.error('获取信息失败')
      }
      ElMessage.success('登录成功')
      router.push('/display')
    }
  } catch (e: any) {
    if (e?.status === 400) ElMessage.error('参数缺失')
    else if (e?.status === 401) ElMessage.error('手机号不存在或密码错误')
    else if (e?.status === 404) ElMessage.error('未查询到该用户，请注册')
    else if (e?.status === 0) ElMessage.error('网络错误或服务器不可达')
    else ElMessage.error(e?.data?.message ?? '服务器内部错误')
  } finally {
    loading.value = false
  }
}
const onSubmit = throttle(submit, 1000)
function socialLogin(type: 'wechat' | 'qq') {
  const map = { wechat: '微信', qq: 'QQ' }
  ElMessage.warning('此功能暂未开发...')
}
</script>

<template>
  <div class="login-wrap">
    <div class="title-wrap">
      <h1 class="title">欢迎来到 Vibe</h1>
      <p class="subtitle">发现新氛围，连接真实人群</p>
    </div>
    <div class="card">
      <div class="tabs">
        <button :class="['tab', tab === 'code' && 'active']" @click="switchTab('code')">
          验证码登录
        </button>
        <button :class="['tab', tab === 'password' && 'active']" @click="switchTab('password')">
          密码登录
        </button>
      </div>

      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <input v-model="phone" class="input" placeholder="手机号" maxlength="11" />
        </div>

        <div v-if="tab === 'code'" class="field inline">
          <input v-model="code" class="input" placeholder="验证码" maxlength="6" />
          <button
            type="button"
            class="text-btn"
            :disabled="!validPhone || sending || countdown > 0"
            @click="sendCode"
          >
            <span v-if="countdown === 0">发送验证码</span>
            <span v-else>重新发送({{ countdown }}s)</span>
          </button>
        </div>

        <div v-else class="field">
          <input v-model="password" type="password" class="input" placeholder="密码" />
        </div>

        <label class="agree">
          <input type="checkbox" v-model="agreed" />
          我已阅读 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
        </label>

        <button class="primary" type="submit" :disabled="!canLogin || loading">立即登录</button>
      </form>

      <div class="actions">
        <RouterLink class="link" to="/register">去注册 →</RouterLink>
      </div>
    </div>
    <div class="social-footer">
      <div class="social-title">社交账号登录</div>
      <div class="icons">
        <div class="icon" @click="socialLogin('wechat')">
          <img src="@/assets/images/weChat.png" alt="" />
        </div>
        <div class="icon" @click="socialLogin('qq')">
          <img src="@/assets/images/qq.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100dvh;
  background: linear-gradient(180deg, #eef3ff 0%, #f7fbff 100%);
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  padding-inline: clamp(12px, 4vw, 24px);
  display: flex;
  align-items: center;
  flex-direction: column;
}
.card {
  width: min(85vw, 320px);
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
.title-wrap {
  height: 100px;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
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
  margin-left: 100px;
  color: #6b7280;
  font-size: var(--fs-sub);
  font-weight: 500;
}
.tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.tab {
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 600;
  padding: 6px 0;
  cursor: pointer;
}
.tab.active {
  color: #2563eb;
  border-bottom: 2px solid #2563eb;
}
.form {
  display: grid;
  gap: 12px;
}
.field {
  display: flex;
  gap: 8px;
}
.field.inline {
  align-items: center;
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
.text-btn {
  font-size: 11px;
  height: clamp(40px, 6.2dvh, 48px);
  border: none;
  background: transparent;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
}
.text-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
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
.social-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--safe-bottom) + 20px);
  text-align: center;
}
.social-title {
  color: #9ca3af;
  font-size: 12px;
  margin-bottom: 8px;
}
.icons {
  display: flex;
  justify-content: center;
  gap: clamp(24px, 6vw, 50px);
}
.icon {
  width: clamp(36px, 10vw, 48px);
  height: clamp(36px, 10vw, 48px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}
.icon img {
  width: clamp(20px, 6vw, 24px);
  height: clamp(20px, 6vw, 24px);
}
</style>
