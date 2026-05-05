import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { Skill, CreateSkillInput, UpdateSkillInput } from '@/types'

const SKILLS_KEY = ['skills']
const SKILL_DETAIL_KEY = (id: string) => ['skills', id]

export const useSkills = (userId: string | null) => {
  return useQuery({
    queryKey: [...SKILLS_KEY, userId],
    queryFn: async () => {
      if (!userId) return []
      const { data } = await apiClient.get<Skill[]>('/skills', {
        params: { userId },
      })
      return data
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export const useSkill = (skillId: string | null) => {
  return useQuery({
    queryKey: SKILL_DETAIL_KEY(skillId || ''),
    queryFn: async () => {
      if (!skillId) return null
      const { data } = await apiClient.get<Skill>(`/skills/${skillId}`)
      return data
    },
    enabled: !!skillId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useCreateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateSkillInput) => {
      const { data } = await apiClient.post<Skill>('/skills', input)
      return data
    },
    onSuccess: (newSkill) => {
      // Invalidate skills list to refetch
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
      // Add to cache
      queryClient.setQueryData(SKILL_DETAIL_KEY(newSkill.id), newSkill)
    },
    onError: (error) => {
      console.error('Failed to create skill:', error)
    },
  })
}

export const useUpdateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Skill>) => {
      const { data } = await apiClient.patch<Skill>(`/skills/${id}`, updates)
      return data
    },
    onSuccess: (updatedSkill) => {
      // Update individual skill cache
      queryClient.setQueryData(SKILL_DETAIL_KEY(updatedSkill.id), updatedSkill)
      // Invalidate skills list
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
    },
    onError: (error) => {
      console.error('Failed to update skill:', error)
    },
  })
}

export const useDeleteSkill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/skills/${id}`)
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: SKILL_DETAIL_KEY(id) })
      // Invalidate skills list
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
    },
    onError: (error) => {
      console.error('Failed to delete skill:', error)
    },
  })
}

export const useUpdateSkillProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const { data } = await apiClient.patch<Skill>(`/skills/${id}/progress`, {
        progress,
      })
      return data
    },
    onSuccess: (updatedSkill) => {
      queryClient.setQueryData(SKILL_DETAIL_KEY(updatedSkill.id), updatedSkill)
      queryClient.invalidateQueries({ queryKey: SKILLS_KEY })
    },
  })
}
