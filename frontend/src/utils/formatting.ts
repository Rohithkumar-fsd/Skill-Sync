import type { Priority, SkillStatus, TaskStatus } from '@/types'

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'

  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * Format date relative to now
 */
export const formatRelativeDate = (iso: string | null): { label: string; cls: string } | null => {
  if (!iso) return null

  const d = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)

  const diff = Math.floor((d.getTime() - today.getTime()) / 86400000)

  if (diff < -1)
    return { label: `${Math.abs(diff)} days overdue`, cls: 'text-red-600 dark:text-red-400' }
  if (diff === -1)
    return { label: 'Yesterday', cls: 'text-red-500 dark:text-red-400' }
  if (diff === 0)
    return { label: 'Today', cls: 'text-indigo-600 dark:text-indigo-400' }
  if (diff === 1)
    return { label: 'Tomorrow', cls: 'text-emerald-600 dark:text-emerald-400' }

  return { label: `In ${diff} days`, cls: 'text-gray-500 dark:text-gray-400' }
}

/**
 * Format time duration
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Truncate string
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Slugify string
 */
export const slugify = (value: string): string => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Capitalize string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Calculate progress percentage
 */
export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

/**
 * Format percentage
 */
export const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`
}

/**
 * Deep clone object
 */
export const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge objects deeply
 */
export const mergeDeep = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = mergeDeep(targetValue, sourceValue)
      } else {
        result[key] = sourceValue as any
      }
    }
  }

  return result
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Retry function
 */
export const retry = async <T,>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; delay?: number } = {}
): Promise<T> => {
  const { maxAttempts = 3, delay = 1000 } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt))
      }
    }
  }

  throw lastError!
}
