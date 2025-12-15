import { request } from '@/utils/request'

export type PostType = 'fav' | 'liked' | 'saved' | 'moment'

export interface PostItem {
  id: number
  phone: string
  type: PostType
  content: string
  images?: string[]
  likes?: number
  saves?: number
  created_at?: string
  updated_at?: string
}

export interface GetPostsRes {
  ok: boolean
  list: PostItem[]
  limit?: number
  offset?: number
}

export interface GetPostsParams {
  phone: string
  type?: PostType
  limit?: number
  offset?: number
}

export function getPosts(params: GetPostsParams) {
  return request<GetPostsRes>('/posts', { method: 'GET', query: params })
}

export interface CreatePostReq {
  phone: string
  type: PostType
  content: string
  images?: Array<File | string>
  videos?: File[]
}

export interface CreatePostRes {
  ok: boolean
  id: number
}

export function createPost(p: CreatePostReq) {
  const fd = new FormData()
  fd.append('phone', p.phone)
  fd.append('type', p.type)
  fd.append('content', p.content)
  for (const f of p.images || []) fd.append('images', f as any)
  for (const v of p.videos || []) fd.append('videos', v)
  return request<CreatePostRes>('/posts', { method: 'POST', body: fd })
}
