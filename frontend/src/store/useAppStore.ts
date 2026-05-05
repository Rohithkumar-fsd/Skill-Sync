import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Skill, Category, Task, User } from '@/types'

interface AppState {
  // Auth
  user: User | null
  userId: string | null
  loading: boolean
  error: string | null

  // Skills & Categories
  skills: Skill[]
  categories: Category[]

  // Tasks
  tasks: Task[]

  // UI State
  isInitialized: boolean

  // Setters
  setUser: (user: User | null) => void
  setUserId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInitialized: (initialized: boolean) => void

  // Skills
  setSkills: (skills: Skill[]) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, updates: Partial<Skill>) => void
  deleteSkill: (id: string) => void
  getSkillById: (id: string) => Skill | undefined

  // Categories
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategoryById: (id: string) => Category | undefined

  // Tasks
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTaskById: (id: string) => Task | undefined

  // Computed
  getSkillsByCategory: (categoryId: string) => Skill[]
  getTotalProgress: () => number
  getCompletedSkillsCount: () => number
  getTaskStats: () => { total: number; completed: number; pending: number }
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        userId: null,
        loading: false,
        error: null,
        skills: [],
        categories: [],
        tasks: [],
        isInitialized: false,

        // Auth
        setUser: (user) => set({ user }),
        setUserId: (id) => set({ userId: id }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setInitialized: (initialized) => set({ isInitialized: initialized }),

        // Skills
        setSkills: (skills) => set({ skills }),
        addSkill: (skill) =>
          set((state) => ({ skills: [...state.skills, skill] })),
        updateSkill: (id, updates) =>
          set((state) => ({
            skills: state.skills.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          })),
        deleteSkill: (id) =>
          set((state) => ({
            skills: state.skills.filter((s) => s.id !== id),
          })),
        getSkillById: (id) => get().skills.find((s) => s.id === id),

        // Categories
        setCategories: (categories) => set({ categories }),
        addCategory: (category) =>
          set((state) => ({ categories: [...state.categories, category] })),
        updateCategory: (id, updates) =>
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          })),
        deleteCategory: (id) =>
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          })),
        getCategoryById: (id) => get().categories.find((c) => c.id === id),

        // Tasks
        setTasks: (tasks) => set({ tasks }),
        addTask: (task) =>
          set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) =>
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          })),
        deleteTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          })),
        getTaskById: (id) => get().tasks.find((t) => t.id === id),

        // Computed
        getSkillsByCategory: (categoryId) =>
          get().skills.filter((s) => s.categoryId === categoryId),
        getTotalProgress: () => {
          const { skills } = get()
          if (skills.length === 0) return 0
          const total = skills.reduce((sum, s) => sum + (s.progress || 0), 0)
          return Math.round(total / skills.length)
        },
        getCompletedSkillsCount: () =>
          get().skills.filter((s) => s.status === 'COMPLETED').length,
        getTaskStats: () => {
          const { tasks } = get()
          return {
            total: tasks.length,
            completed: tasks.filter((t) => t.status === 'COMPLETED').length,
            pending: tasks.filter((t) => t.status !== 'COMPLETED').length,
          }
        },
      }),
      {
        name: 'app-store',
        version: 1,
        partialize: (state) => ({
          categories: state.categories,
          skills: state.skills,
          tasks: state.tasks,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)

export const useAppStoreActions = () => {
  const store = useAppStore()
  return {
    setUser: store.setUser,
    setUserId: store.setUserId,
    setLoading: store.setLoading,
    setError: store.setError,
    setSkills: store.setSkills,
    setCategories: store.setCategories,
    setTasks: store.setTasks,
    addSkill: store.addSkill,
    updateSkill: store.updateSkill,
    deleteSkill: store.deleteSkill,
    addCategory: store.addCategory,
    updateCategory: store.updateCategory,
    deleteCategory: store.deleteCategory,
    addTask: store.addTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
  }
}

export const useAppStoreSelectors = () => {
  const store = useAppStore()
  return {
    user: store.user,
    userId: store.userId,
    skills: store.skills,
    categories: store.categories,
    tasks: store.tasks,
    loading: store.loading,
    error: store.error,
    getTotalProgress: store.getTotalProgress,
    getCompletedSkillsCount: store.getCompletedSkillsCount,
    getTaskStats: store.getTaskStats,
    getSkillsByCategory: store.getSkillsByCategory,
  }
}
