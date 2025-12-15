import { request } from '../utils/request'

export interface RegisterReq {
  phone: string
  password: string
  username?: string
}
export interface RegisterRes {
  ok: boolean
}

export interface LoginReq {
  phone: string
  password: string
}
export interface LoginRes {
  ok: boolean
  user: { id: number; username: string; phone: string }
}

export function register(req: RegisterReq) {
  return request<RegisterRes>('/auth/register', { method: 'POST', body: req })
}

export function login(req: LoginReq) {
  return request<LoginRes>('/auth/login', { method: 'POST', body: req })
}
