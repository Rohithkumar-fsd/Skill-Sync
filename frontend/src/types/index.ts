/**
 * Core domain types for LevelUp application
 */

// ─── Skill & Category Types ───────────────────────────────────────────────────
export type SkillStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type ToastType = 'success' | 'error' | 'info' | 'warning'
export type Theme = 'light' | 'dark'

export interface Subskill {
  id: string
  title: string
  done: boolean
}

export interface Skill {
  id: string
  userId: string
  categoryId: string
  name: string
  title: string
  description: string
  priority: Priority
  progress: number
  status: SkillStatus
  notes: string
  subskills: Subskill[]
  createdAt: string
  updatedAt: string
  lastActiveAt?: string
  order?: number
  category?: string
  key?: string
}

export interface Category {
  id: string
  userId: string
  name: string
  title: string
  key: string
  description: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  userId: string
  title: string
  status: TaskStatus
  priority: Priority
  deadline?: string
  category?: string
  createdAt: string
  updatedAt: string
}

// ─── UI & Toast Types ────────────────────────────────────────────────────────
export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

// ─── API Error Types ────────────────────────────────────────────────────────
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  status?: number
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// ─── Form Types ─────────────────────────────────────────────────────────────
export interface CreateSkillInput {
  name: string
  categoryId: string
  description?: string
  priority: Priority
  progress?: number
}

export interface UpdateSkillInput extends Partial<CreateSkillInput> {
  id: string
}

export interface CreateCategoryInput {
  name: string
  description?: string
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string
}

export interface CreateTaskInput {
  title: string
  priority: Priority
  deadline?: string
  category?: string
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string
}

// ─── User Types ─────────────────────────────────────────────────────────────
export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
}

// ─── Stats & Analytics Types ────────────────────────────────────────────────
export interface SkillStats {
  totalSkills: number
  completedSkills: number
  inProgressSkills: number
  totalProgress: number
  completionRate: number
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
  completionRate: number
  todayTasks: Task[]
}

// ─── Component Props Types ──────────────────────────────────────────────────
export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  status?: SkillStatus
  priority?: Priority
  categoryId?: string
  search?: string
}

export interface SortParams {
  field: 'name' | 'progress' | 'createdAt' | 'updatedAt'
  order: 'asc' | 'desc'
}

// ─── Environment Types ──────────────────────────────────────────────────────
export interface EnvConfig {
  apiUrl: string
  firebaseApiKey: string
  firebaseAuthDomain: string
  firebaseProjectId: string
  firebaseStorageBucket: string
  firebaseMessagingSenderId: string
  firebaseAppId: string
  firebaseMeasurementId: string
  sentryDsn?: string
  mode: 'development' | 'production' | 'test'
}
