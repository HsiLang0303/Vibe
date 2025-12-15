export type AnyFn = (...args: any[]) => any

export function debounce<T extends AnyFn>(fn: T, wait = 300, immediate = false) {
  let timer: any = null
  return function(this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    if (immediate && !timer) fn.apply(this, args)
    timer = setTimeout(() => {
      if (!immediate) fn.apply(this, args)
      timer = null
    }, wait)
  } as T
}

export function throttle<T extends AnyFn>(fn: T, wait = 300, options?: { leading?: boolean; trailing?: boolean }) {
  let last = 0
  let timer: any = null
  const leading = options?.leading !== false
  const trailing = options?.trailing !== false
  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (!last && !leading) last = now
    const remaining = wait - (now - last)
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      fn.apply(this, args)
    } else if (trailing && !timer) {
      timer = setTimeout(() => {
        last = leading ? Date.now() : 0
        timer = null
        fn.apply(this, args)
      }, remaining)
    }
  } as T
}

