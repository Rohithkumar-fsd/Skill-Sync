import React, { useEffect, useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus, Loader2 } from 'lucide-react'
import { AppShell } from '../layout/AppShell'
import { PageHeader } from '../ui/PageHeader'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useSkills } from '../../contexts/SkillContext'
import { createCategory, createSkill, saveSkillsBatch } from '../../services/api'
import { auth } from '../../firebase'
import { CategoryColumn } from './CategoryColumn'
import { SkillCard } from './SkillCard'

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const BOARD_SUGGESTIONS = [
  { name: 'Web Development', key: 'web-development' },
  { name: 'DSA', key: 'dsa' },
  { name: 'Daily Activity', key: 'daily-activity' },
  { name: 'Gym', key: 'gym' },
]

const emptyNewSkill = {
  title: '',
  categoryKey: '',
  priority: 'MEDIUM',
}

const buildBoardState = (categories, skills) => {
  const normalizedCategories = categories.map((category) => ({
    ...category,
    key: category.key || slugify(category.name || category.title || category.id),
  }))

  const categoryLookup = normalizedCategories.reduce((acc, category) => {
    acc[category.id] = category
    acc[category.key] = category
    return acc
  }, {})

  const board = normalizedCategories.reduce((acc, category) => {
    acc[category.key] = []
    return acc
  }, {})

  const normalizedSkills = skills
    .map((skill) => {
      const category = categoryLookup[skill.categoryId] || categoryLookup[skill.category] || {}
      const categoryKey = skill.category || category.key || slugify(skill.categoryId || 'uncategorized')

      return {
        ...skill,
        title: skill.title || skill.name || '',
        name: skill.name || skill.title || '',
        categoryKey,
        categoryId: skill.categoryId || category.id || skill.categoryId || '',
        order: Number(skill.order || 0),
      }
    })
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))

  normalizedSkills.forEach((skill) => {
    if (!board[skill.categoryKey]) {
      board[skill.categoryKey] = []
    }
    board[skill.categoryKey].push(skill)
  })

  return { categories: normalizedCategories, board }
}

const KanbanBoard = () => {
  const { categories, skills, loading, refreshSkills } = useSkills()
  const [boardState, setBoardState] = useState({ categories: [], board: {} })
  const [activeSkill, setActiveSkill] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [skillDraft, setSkillDraft] = useState(emptyNewSkill)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  useEffect(() => {
    setBoardState(buildBoardState(categories, skills))
  }, [categories, skills])

  const normalizedCategories = boardState.categories
  const board = boardState.board

  const totalCards = useMemo(() => Object.values(board).reduce((sum, items) => sum + items.length, 0), [board])

  const getCategoryByKey = (key) => normalizedCategories.find((category) => category.key === key)

  const handleAddCategory = async (presetName) => {
    const name = (presetName || categoryName).trim()
    if (!name) return
    await createCategory({ name })
    setCategoryName('')
    await refreshSkills()
  }

  const handleAddSkill = async () => {
    if (!skillDraft.title.trim() || !skillDraft.categoryKey) return

    const category = getCategoryByKey(skillDraft.categoryKey)
    if (!category) return

    const nextOrder = (board[category.key]?.length || 0)
    await createSkill({
      title: skillDraft.title,
      name: skillDraft.title,
      category: category.key,
      categoryId: category.id,
      priority: skillDraft.priority,
      order: nextOrder,
      status: 'NOT_STARTED',
      progress: 0,
      userId: auth.currentUser?.uid,
    })

    setSkillDraft(emptyNewSkill)
    await refreshSkills()
  }

  const persistBoard = async (nextBoard) => {
    const flattened = normalizedCategories.flatMap((category) => {
      const items = nextBoard[category.key] || []
      return items.map((skill, index) => ({
        ...skill,
        title: skill.title || skill.name || '',
        name: skill.name || skill.title || '',
        category: category.key,
        categoryId: category.id,
        order: index,
      }))
    })

    if (flattened.length === 0) return

    setSaving(true)
    try {
      await saveSkillsBatch(flattened, auth.currentUser?.uid)
      await refreshSkills()
    } finally {
      setSaving(false)
    }
  }

  const findSkillLocation = (skillId, currentBoard = board) => {
    for (const category of normalizedCategories) {
      const index = (currentBoard[category.key] || []).findIndex((item) => item.id === skillId)
      if (index !== -1) {
        return { categoryKey: category.key, index }
      }
    }
    return null
  }

  const moveWithinBoard = (currentBoard, activeId, overId) => {
    const source = findSkillLocation(activeId, currentBoard)
    if (!source) return currentBoard

    const sourceItems = [...(currentBoard[source.categoryKey] || [])]
    const activeItem = sourceItems[source.index]

    let destinationKey = source.categoryKey
    let destinationIndex = source.index

    const overLocation = findSkillLocation(overId, currentBoard)
    if (overLocation) {
      destinationKey = overLocation.categoryKey
      destinationIndex = overLocation.index
    } else if (currentBoard[overId]) {
      destinationKey = overId
      destinationIndex = (currentBoard[overId] || []).length
    }

    if (destinationKey === source.categoryKey && destinationIndex === source.index) {
      return currentBoard
    }

    const nextBoard = Object.fromEntries(
      normalizedCategories.map((category) => [category.key, [...(currentBoard[category.key] || [])]]),
    )

    nextBoard[source.categoryKey] = nextBoard[source.categoryKey].filter((item) => item.id !== activeId)

    const targetItems = [...(nextBoard[destinationKey] || [])]
    const insertionIndex = Math.max(0, Math.min(destinationIndex, targetItems.length))
    targetItems.splice(insertionIndex, 0, {
      ...activeItem,
      categoryKey: destinationKey,
    })
    nextBoard[destinationKey] = targetItems

    return nextBoard
  }

  const handleDragStart = (event) => {
    const { active } = event
    const location = findSkillLocation(active.id)
    if (!location) return

    const card = (board[location.categoryKey] || []).find((item) => item.id === active.id)
    setActiveSkill(card ? { ...card, categoryKey: location.categoryKey } : null)
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveSkill(null)
    if (!over || active.id === over.id) return

    const nextBoard = moveWithinBoard(board, active.id, over.id)
    if (nextBoard === board) return

    setBoardState((prev) => ({ ...prev, board: nextBoard }))
    await persistBoard(nextBoard)
  }

  const handleDragCancel = () => setActiveSkill(null)

  return (
    <AppShell>
      <div className="page-container animate-fade-slide-in">
      <PageHeader
        title="Category Board"
        subtitle="Drag cards between category columns and keep your learning plan organized."
      />

      <div className="rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-border dark:bg-card/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-600">Board</p>
            <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-foreground">Kanban-style learning board</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">{totalCards} cards across {normalizedCategories.length} categories</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_auto]">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-border dark:bg-background">
              <Input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="New category"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
              />
              <Button type="button" className="rounded-lg" onClick={() => handleAddCategory()}>
                <Plus className="mr-2 h-4 w-4" /> Add category
              </Button>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-border dark:bg-background">
              <Input
                value={skillDraft.title}
                onChange={(e) => setSkillDraft((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="New card title"
                className="border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-border dark:bg-background">
              <Select
                value={skillDraft.categoryKey}
                onValueChange={(value) => setSkillDraft((prev) => ({ ...prev, categoryKey: value }))}
              >
                <SelectTrigger className="border-0 bg-transparent px-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {normalizedCategories.map((category) => (
                    <SelectItem key={category.key} value={category.key}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={skillDraft.priority}
                onValueChange={(value) => setSkillDraft((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="w-[120px] border-0 bg-transparent px-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">HIGH</SelectItem>
                  <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                  <SelectItem value="LOW">LOW</SelectItem>
                </SelectContent>
              </Select>

              <Button type="button" className="rounded-lg" onClick={handleAddSkill}>
                <Plus className="mr-2 h-4 w-4" /> Add skill
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {BOARD_SUGGESTIONS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => handleAddCategory(preset.name)}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors dark:border-border dark:bg-background dark:text-muted-foreground"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[520px] rounded-xl border border-gray-200 bg-gray-100/70 animate-pulse dark:border-border dark:bg-card" />
          ))}
        </div>
      ) : normalizedCategories.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-border dark:bg-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-foreground">No categories yet</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-muted-foreground">Create a category like Web Development, DSA, Daily Activity, or Gym to start the board.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {normalizedCategories.map((category) => (
              <CategoryColumn
                key={category.key}
                category={category}
                items={board[category.key] || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeSkill ? (
              <div className="w-[320px]">
                <SkillCard skill={activeSkill} categoryName={getCategoryByKey(activeSkill.categoryKey)?.name} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {saving ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Saving board changes...
        </div>
      ) : null}
      </div>
    </AppShell>
  )
}

export default KanbanBoard
