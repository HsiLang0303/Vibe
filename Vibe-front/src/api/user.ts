import { request } from '@/utils/request'

export interface UserInfo {
  phone: string
  username: string
  followers_count: number
  following_count: number
  visit_count: number
  tags?: string[]
  avatar?: string
  created_at?: string
  updated_at?: string
}

export interface GetUserRes {
  ok: true
  user: UserInfo
}

export type UpdateUserReq = Partial<
  Pick<
    UserInfo,
    'username' | 'avatar' | 'tags' | 'followers_count' | 'following_count' | 'visit_count'
  >
>

export interface UpdateUserRes {
  ok: true
}

export function getUserByPhone(phone: string) {
  return request<GetUserRes>(`/users/${encodeURIComponent(phone)}`, { method: 'GET' })
}

export function updateUserByPhone(phone: string, data: UpdateUserReq) {
  return request<UpdateUserRes>(`/users/${encodeURIComponent(phone)}`, {
    method: 'PUT',
    body: data,
  })
}

export interface UploadAvatarRes {
  ok: boolean
  avatar: string
}

export function uploadAvatarByPhone(phone: string, file: File) {
  const fd = new FormData()
  fd.append('avatar', file)
  return request<UploadAvatarRes>(`/users/${encodeURIComponent(phone)}/avatar`, {
    method: 'POST',
    body: fd,
  })
}

export interface UploadBackgroundRes {
  ok: boolean
  background: string
}

export function uploadBackgroundByPhone(phone: string, file: File) {
  const fd = new FormData()
  fd.append('background', file)
  return request<UploadBackgroundRes>(`/users/${encodeURIComponent(phone)}/background`, {
    method: 'POST',
    body: fd,
  })
}
