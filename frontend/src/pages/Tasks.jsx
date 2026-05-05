import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ListTodo, Plus, CheckCircle2, Circle, Pencil, Trash2,
  Calendar, ChevronDown, X, Tag, AlertCircle, Clock
} from 'lucide-react'
import { LearningShell } from '../components/learning/LearningShell'
import { useSkills } from '../contexts/SkillContext'
import { useTasks } from '../contexts/TaskContext'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  HIGH:   { label: 'High',   cls: 'priority-high',   dot: 'bg-red-500',   ring: 'ring-red-200 dark:ring-red-900' },
  MEDIUM: { label: 'Medium', cls: 'priority-medium', dot: 'bg-amber-500', ring: 'ring-amber-200 dark:ring-amber-900' },
  LOW:    { label: 'Low',    cls: 'priority-low',    dot: 'bg-gray-400',  ring: 'ring-gray-200 dark:ring-zinc-800' },
}

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', cls: 'badge-not-started' },
  IN_PROGRESS:  { label: 'In Progress',  cls: 'badge-in-progress' },
  COMPLETED:    { label: 'Completed',    cls: 'badge-completed'   },
}

const formatDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso); d.setHours(0,0,0,0)
  const today = new Date(); today.setHours(0,0,0,0)
  const diff = Math.floor((d - today) / 86400000)
  if (diff < -1)  return { text: `${Math.abs(diff)}d overdue`, cls: 'text-red-600 dark:text-red-400', overdue: true }
  if (diff === -1) return { text: 'Yesterday',   cls: 'text-red-500 dark:text-red-400',    overdue: true }
  if (diff === 0)  return { text: 'Today',       cls: 'text-indigo-600 dark:text-indigo-400', overdue: false }
  if (diff === 1)  return { text: 'Tomorrow',    cls: 'text-emerald-600 dark:text-emerald-400', overdue: false }
  return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), cls: 'text-gray-400 dark:text-zinc-500', overdue: false }
}

const emptyForm = { title: '', skillId: '', deadline: '', priority: 'MEDIUM', status: 'NOT_STARTED', notes: '' }

// ─── Task Row ─────────────────────────────────────────────────────────────────
const TaskRow = ({ task, skillName, onToggle, onEdit, onDelete }) => {
  const isDone  = task.status === 'COMPLETED'
  const pCfg    = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM
  const date    = formatDate(task.deadline)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={`task-row group ${isDone ? 'completed' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className={`check-box mt-0.5 shrink-0 hover:ring-2 transition-all ${isDone ? 'checked ring-indigo-300 dark:ring-indigo-800' : `ring-transparent ${pCfg.ring}`}`}
      >
        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-gray-400 dark:text-zinc-600' : 'text-gray-900 dark:text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {skillName && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-zinc-400">
              <Tag className="w-2.5 h-2.5" />{skillName}
            </span>
          )}
          {date && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${date.cls}`}>
              <Clock className="w-2.5 h-2.5" />{date.text}
            </span>
          )}
        </div>
      </div>

      {/* Priority + actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`${pCfg.cls} hidden sm:inline-flex`} style={{ fontSize: 10 }}>
          <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
          {pCfg.label}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)}
            className="btn-icon w-7 h-7 rounded-lg" title="Edit">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={() => onDelete(task.id)}
            className="btn-icon w-7 h-7 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Group Header ─────────────────────────────────────────────────────────────
const GroupHeader = ({ title, count, warning }) => (
  <div className="flex items-center gap-2 mb-2 mt-6 first:mt-0">
    {warning && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">{title}</span>
    <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">({count})</span>
    <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
  </div>
)

// ─── Slide-Over Form ──────────────────────────────────────────────────────────
const TaskSlideOver = ({ form, editingId, skills, onChange, onSubmit, onClose }) => {
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <div className="slideover-backdrop" onClick={onClose} />
      <div className="slideover-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            {editingId ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="label-base">Task title *</label>
            <input
              autoFocus
              className="input-base"
              placeholder="What do you need to do?"
              value={form.title}
              onChange={e => onChange('title', e.target.value)}
            />
          </div>

          {/* Link to skill */}
          <div>
            <label className="label-base">Link to skill</label>
            <select
              className="input-base"
              value={form.skillId}
              onChange={e => onChange('skillId', e.target.value)}
            >
              <option value="">— No skill —</option>
              {skills.map(s => (
                <option key={s.id} value={s.id}>{s.name || s.title}</option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="label-base">Due date</label>
            <input
              type="date"
              className="input-base"
              value={form.deadline}
              min={today}
              onChange={e => onChange('deadline', e.target.value)}
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Priority</label>
              <select className="input-base" value={form.priority} onChange={e => onChange('priority', e.target.value)}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="label-base">Status</label>
              <select className="input-base" value={form.status} onChange={e => onChange('status', e.target.value)}>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label-base">Notes</label>
            <textarea
              rows={4}
              className="input-base resize-none"
              placeholder="Any additional notes…"
              value={form.notes}
              onChange={e => onChange('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex gap-3 shrink-0">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={onSubmit} disabled={!form.title.trim()} className="btn-primary flex-1">
            {editingId ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Tasks Page ───────────────────────────────────────────────────────────────
const Tasks = () => {
  const { skills, getSkillById } = useSkills()
  const { tasks, createTask, updateTask, deleteTask } = useTasks()

  const [form, setForm]           = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [filter, setFilter]       = useState('all') // all | today | active | completed

  const todayStr = new Date().toISOString().slice(0, 10)

  // ── Filtered tasks ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    switch (filter) {
      case 'today':     return tasks.filter(t => t.deadline?.slice(0,10) === todayStr)
      case 'active':    return tasks.filter(t => t.status !== 'COMPLETED')
      case 'completed': return tasks.filter(t => t.status === 'COMPLETED')
      default:          return tasks
    }
  }, [tasks, filter, todayStr])

  // ── Grouped tasks ───────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const overdue   = filtered.filter(t => {
      if (!t.deadline || t.status === 'COMPLETED') return false
      const d = new Date(t.deadline); d.setHours(0,0,0,0)
      const today = new Date(); today.setHours(0,0,0,0)
      return d < today
    })
    const today     = filtered.filter(t => t.deadline?.slice(0,10) === todayStr && t.status !== 'COMPLETED')
    const upcoming  = filtered.filter(t => {
      if (!t.deadline || t.status === 'COMPLETED') return false
      const d = new Date(t.deadline); d.setHours(0,0,0,0)
      const now = new Date(); now.setHours(0,0,0,0)
      return d > now && t.deadline.slice(0,10) !== todayStr
    })
    const noDate    = filtered.filter(t => !t.deadline && t.status !== 'COMPLETED')
    const completed = filtered.filter(t => t.status === 'COMPLETED')

    return { overdue, today, upcoming, noDate, completed }
  }, [filtered, todayStr])

  // ── Form handlers ───────────────────────────────────────────────────────
  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (!form.title.trim()) return
    if (editingId) {
      await updateTask(editingId, form)
    } else {
      await createTask(form)
    }
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (task) => {
    setEditingId(task.id)
    setForm({
      title:    task.title || '',
      skillId:  task.skillId || '',
      deadline: task.deadline || '',
      priority: task.priority || 'MEDIUM',
      status:   task.status || 'NOT_STARTED',
      notes:    task.notes || '',
    })
    setShowForm(true)
  }

  const handleToggle = async (task) => {
    const next = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'
    await updateTask(task.id, { ...task, status: next })
  }

  const handleClose = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const FILTERS = [
    { key: 'all',       label: 'All',       count: tasks.length },
    { key: 'today',     label: 'Today',     count: tasks.filter(t => t.deadline?.slice(0,10) === todayStr).length },
    { key: 'active',    label: 'Active',    count: tasks.filter(t => t.status !== 'COMPLETED').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'COMPLETED').length },
  ]

  const renderGroup = (list, title, warning = false) => {
    if (!list.length) return null
    return (
      <div>
        <GroupHeader title={title} count={list.length} warning={warning} />
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {list.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                skillName={getSkillById(task.skillId)?.name}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  const totalVisible = Object.values(groups).flat().length

  return (
    <LearningShell
      title="Tasks"
      subtitle="Capture your work, link it to skills, and keep today's priorities visible."
    >
      <AnimatePresence>
        {showForm && (
          <TaskSlideOver
            form={form}
            editingId={editingId}
            skills={skills}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${filter === f.key
                    ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                  ${filter === f.key ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400' : 'bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400'}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <button
            onClick={() => setShowForm(true)}
            className="btn-primary gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Task groups */}
        {totalVisible === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ListTodo className="w-7 h-7 text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">No tasks found</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1 mb-4">
              {filter === 'today' ? "No tasks scheduled for today." : "Start by adding your first task."}
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-xs py-2 px-4">
              Add Task
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {renderGroup(groups.overdue,   'Overdue',  true)}
            {renderGroup(groups.today,     'Today')}
            {renderGroup(groups.upcoming,  'Upcoming')}
            {renderGroup(groups.noDate,    'No Due Date')}
            {renderGroup(groups.completed, 'Completed')}
          </div>
        )}
      </div>
    </LearningShell>
  )
}

export default Tasks
