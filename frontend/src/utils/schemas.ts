import { z } from 'zod'
import type { Priority, SkillStatus } from '@/types'

// Common field schemas
export const nameSchema = z.string().min(1, 'Name required').max(100, 'Name too long')
export const descriptionSchema = z.string().max(500, 'Description too long').optional()
export const prioritySchema = z.enum(['HIGH', 'MEDIUM', 'LOW'] as const)
export const progressSchema = z.number().min(0).max(100, 'Progress must be 0-100')
export const emailSchema = z.string().email('Invalid email')
export const urlSchema = z.string().url('Invalid URL').optional()

// Skill form schema
export const skillFormSchema = z.object({
  name: nameSchema,
  categoryId: z.string().min(1, 'Category required'),
  description: descriptionSchema,
  priority: prioritySchema,
  progress: progressSchema.default(0),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).optional(),
})

export type SkillFormData = z.infer<typeof skillFormSchema>

// Category form schema
export const categoryFormSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  color: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>

// Task form schema
export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title required').max(200),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).optional(),
  priority: prioritySchema,
  deadline: z.string().datetime().optional(),
  category: z.string().optional(),
})

export type TaskFormData = z.infer<typeof taskFormSchema>

// Login form schema
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginFormData = z.infer<typeof loginFormSchema>

// Signup form schema
export const signupFormSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  })

export type SignupFormData = z.infer<typeof signupFormSchema>

// Profile form schema
export const profileFormSchema = z.object({
  displayName: z.string().min(1, 'Name required').max(100),
  bio: z.string().max(500).optional(),
  photoURL: urlSchema,
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

/**
 * Helper to parse form errors from validation results
 */
export const parseFormErrors = (
  error: z.ZodError<any>
): Record<string, string> => {
  const errors: Record<string, string> = {}

  error.issues.forEach((issue: any) => {
    const path = issue.path.join('.')
    if (path) {
      errors[path] = issue.message
    }
  })

  return errors
}
