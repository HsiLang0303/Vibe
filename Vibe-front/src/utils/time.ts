export function formatTimeWithDiff(iso: string): { formatted: string; diff: string } {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return { formatted: iso, diff: '' }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const formatted = `${y}-${m}-${dd} ${hh}:${mm}`

  const now = Date.now()
  const ms = Math.max(0, now - d.getTime())
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const years = Math.floor(days / 365)
  let diff = ''
  if (minutes < 1) diff = '刚刚'
  else if (minutes === 1) diff = '1分钟前'
  else if (minutes < 60) diff = `${minutes}分钟前`
  else if (hours === 1) diff = '一个小时前'
  else if (hours < 24) diff = `${hours}小时前`
  else if (days === 1) diff = '一天前'
  else if (days === 2) diff = '两天前'
  else if (days >= 182 && days < 365) diff = '半年前'
  else if (years === 1) diff = '一年前'
  else if (years === 2) diff = '两年前'
  else if (years > 5) diff = ''
  else diff = `${days}天前`
  return { formatted, diff }
}
