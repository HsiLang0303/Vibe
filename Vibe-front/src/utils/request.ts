export const BASE_URL = import.meta.env?.VITE_API_BASE ?? 'http://localhost:3000'

export interface RequestOptions {
  method?: string
  headers?: Record<string, string>
  body?: any
  query?: Record<string, string | number | boolean | undefined>
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET'
  const headers = { ...(options.headers || {}) }
  let url = `${BASE_URL}${path}`
  if (options.query) {
    const q = new URLSearchParams()
    Object.entries(options.query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) q.append(k, String(v))
    })
    const qs = q.toString()
    if (qs) url += (url.includes('?') ? '&' : '?') + qs
  }
  let body = options.body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    if (headers['Content-Type'].includes('application/json')) body = JSON.stringify(body)
  }
  try {
    const res = await fetch(url, { method, headers, body })
    const contentType = res.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? await res.json() : await res.text()
    if (!res.ok) throw { status: res.status, data }
    return data as T
  } catch (err: any) {
    if (typeof err === 'object' && 'status' in err) throw err
    throw { status: 0, data: String(err?.message ?? err) }
  }
}

export async function jsonPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body })
}
