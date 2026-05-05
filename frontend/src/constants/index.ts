import type { Priority, SkillStatus, TaskStatus } from '@/types'

export const SKILL_STATUS_CONFIG: Record<SkillStatus, { label: string; color: string; icon: string }> = {
  NOT_STARTED: { label: 'Not Started', color: 'gray', icon: '⭕' },
  IN_PROGRESS: { label: 'In Progress', color: 'blue', icon: '🔵' },
  COMPLETED: { label: 'Completed', color: 'emerald', icon: '✅' },
}

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string; badge: string }> = {
  HIGH: { label: 'High', color: 'red', icon: '🔴', badge: 'bg-red-100 text-red-700' },
  MEDIUM: { label: 'Medium', color: 'amber', icon: '🟡', badge: 'bg-amber-100 text-amber-700' },
  LOW: { label: 'Low', color: 'gray', icon: '⚪', badge: 'bg-gray-100 text-gray-700' },
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'gray' },
  IN_PROGRESS: { label: 'In Progress', color: 'blue' },
  COMPLETED: { label: 'Completed', color: 'emerald' },
}

export const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
] as const

export const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
] as const

export const TASK_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
] as const

export const BUTTON_SIZES = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export const BADGE_VARIANTS = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
} as const

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxItems: 100,
} as const

export const API_ENDPOINTS = {
  SKILLS: '/skills',
  CATEGORIES: '/categories',
  TASKS: '/tasks',
  AI: '/ai',
  USERS: '/users',
} as const

export const TOAST_DURATION = {
  short: 2000,
  medium: 3000,
  long: 5000,
} as const

export const ANIMATION_DURATION = {
  fast: 150,
  base: 200,
  slow: 300,
} as const

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
