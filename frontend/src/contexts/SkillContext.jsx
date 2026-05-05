import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import {
  createCategory,
  createSkill,
  deleteCategory,
  deleteSkill,
  listCategories,
  listSkills,
  saveSkillNotes,
  saveSkillProgress,
  saveSkillSubskills,
  updateCategory,
  updateSkill,
} from '../services/api'

const SkillContext = createContext(null)

const normalizeProgress = (skills) =>
  skills.reduce((sum, skill) => sum + Number(skill.progress || 0), 0)

export const SkillProvider = ({ children }) => {
  const [userId, setUserId] = useState(null)
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async (uid) => {
    if (!uid) {
      setCategories([])
      setSkills([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [nextCategories, nextSkills] = await Promise.all([
        listCategories(uid),
        listSkills(uid),
      ])
      setCategories(nextCategories)
      setSkills(nextSkills)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => onAuthStateChanged(auth, (user) => {
    const uid = user?.uid || null
    setUserId(uid)
    loadAll(uid)
  }), [loadAll])

  const refreshSkills = useCallback(() => loadAll(userId), [loadAll, userId])

  const createNewCategory = useCallback(async (data) => {
    const item = await createCategory(data, userId)
    setCategories((prev) => [...prev, item])
    return item
  }, [userId])

  const editCategory = useCallback(async (id, data) => {
    const item = await updateCategory(id, data, userId)
    setCategories((prev) => prev.map((category) => (category.id === id ? { ...category, ...item } : category)))
    return item
  }, [userId])

  const removeCategory = useCallback(async (id) => {
    await deleteCategory(id, userId)
    setCategories((prev) => prev.filter((category) => category.id !== id))
    setSkills((prev) => prev.filter((skill) => skill.categoryId !== id))
    return true
  }, [userId])

  const createNewSkill = useCallback(async (data) => {
    const item = await createSkill(data, userId)
    setSkills((prev) => [...prev, item])
    return item
  }, [userId])

  const editSkill = useCallback(async (id, data) => {
    const item = await updateSkill(id, data, userId)
    setSkills((prev) => prev.map((skill) => (skill.id === id ? { ...skill, ...item } : skill)))
    return item
  }, [userId])

  const removeSkill = useCallback(async (id) => {
    await deleteSkill(id, userId)
    setSkills((prev) => prev.filter((skill) => skill.id !== id))
    return true
  }, [userId])

  const updateProgress = useCallback(async (id, progress) => {
    await saveSkillProgress(id, progress, userId)
    setSkills((prev) => prev.map((skill) => skill.id === id ? {
      ...skill,
      progress: Math.max(0, Math.min(100, Number(progress))),
      status: Number(progress) >= 100 ? 'COMPLETED' : Number(progress) > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      lastActiveAt: new Date().toISOString(),
    } : skill))
  }, [userId])

  const updateNotes = useCallback(async (id, notes) => {
    await saveSkillNotes(id, notes, userId)
    setSkills((prev) => prev.map((skill) => skill.id === id ? { ...skill, notes, lastActiveAt: new Date().toISOString() } : skill))
  }, [userId])

  const updateSubskills = useCallback(async (id, subskills) => {
    await saveSkillSubskills(id, subskills, userId)
    setSkills((prev) => prev.map((skill) => skill.id === id ? { ...skill, subskills, lastActiveAt: new Date().toISOString() } : skill))
  }, [userId])

  const getSkillById = useCallback((id) => skills.find((skill) => skill.id === id), [skills])
  const getCategoryById = useCallback((id) => categories.find((category) => category.id === id), [categories])

  const stats = useMemo(() => {
    const totalProgress = skills.length ? Math.round(normalizeProgress(skills) / skills.length) : 0
    const completedSkills = skills.filter((skill) => skill.status === 'COMPLETED').length
    const highPriorityPending = skills.filter((skill) => skill.priority === 'HIGH' && skill.status !== 'COMPLETED')
    const inactiveSkills = skills.filter((skill) => {
      if (!skill.lastActiveAt) return true
      const diff = Date.now() - new Date(skill.lastActiveAt).getTime()
      return diff > 1000 * 60 * 60 * 24 * 7
    })

    return {
      totalProgress,
      completedSkills,
      highPriorityPending,
      inactiveSkills,
      skillCount: skills.length,
      categoryCount: categories.length,
    }
  }, [categories.length, skills])

  const value = {
    userId,
    loading,
    categories,
    skills,
    stats,
    refreshSkills,
    createCategory: createNewCategory,
    updateCategory: editCategory,
    deleteCategory: removeCategory,
    createSkill: createNewSkill,
    updateSkill: editSkill,
    deleteSkill: removeSkill,
    updateSkillProgress: updateProgress,
    updateSkillNotes: updateNotes,
    updateSkillSubskills: updateSubskills,
    getSkillById,
    getCategoryById,
  }

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>
}

export const useSkills = () => {
  const context = useContext(SkillContext)
  if (!context) {
    throw new Error('useSkills must be used within a SkillProvider')
  }
  return context
}
