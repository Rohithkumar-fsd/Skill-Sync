import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { getActiveRoadmap, updateActiveRoadmap } from '../services/api'

const RoadmapContext = createContext(null)

export const RoadmapProvider = ({ children }) => {
  const [userId, setUserId] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadRoadmap = useCallback(async (uid) => {
    if (!uid) {
      setRoadmap(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getActiveRoadmap(uid)
      setRoadmap(data)
    } catch (err) {
      console.error('Failed to load roadmap:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => onAuthStateChanged(auth, (user) => {
    const uid = user?.uid || null
    setUserId(uid)
    loadRoadmap(uid)
  }), [loadRoadmap])

  const refreshRoadmap = useCallback(() => loadRoadmap(userId), [loadRoadmap, userId])

  const updateRoadmap = useCallback(async (data) => {
    await updateActiveRoadmap(data, userId)
    setRoadmap(prev => ({ ...prev, ...data }))
  }, [userId])

  const value = {
    roadmap,
    loading,
    refreshRoadmap,
    updateRoadmap,
  }

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
}

export const useRoadmap = () => {
  const context = useContext(RoadmapContext)
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider')
  }
  return context
}
