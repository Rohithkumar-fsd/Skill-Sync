import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers3, ListTodo, BarChart3, Zap, TrendingUp, Clock,
  CheckCircle2, CircleDot, ArrowRight, Plus, Calendar,
  Flame, Target, AlertCircle, ChevronRight
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { useSkills } from '../contexts/SkillContext'
import { useTasks } from '../contexts/TaskContext'
import { getAuth } from 'firebase/auth'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', cls: 'badge-not-started', dot: 'bg-gray-400' },
  IN_PROGRESS:  { label: 'In Progress',  cls: 'badge-in-progress', dot: 'bg-blue-500'  },
  COMPLETED:    { label: 'Completed',    cls: 'badge-completed',   dot: 'bg-emerald-500'},
}

const PRIORITY_CONFIG = {
  HIGH:   { label: 'High',   cls: 'priority-high',   dot: 'bg-red-500'   },
  MEDIUM: { label: 'Medium', cls: 'priority-medium', dot: 'bg-amber-500' },
  LOW:    { label: 'Low',    cls: 'priority-low',    dot: 'bg-gray-400'  },
}

const formatRelativeDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = Math.floor((d - today) / 86400000)
  if (diff < -1) return { label: `${Math.abs(diff)} days overdue`, cls: 'text-red-600 dark:text-red-400' }
  if (diff === -1) return { label: 'Yesterday', cls: 'text-red-500 dark:text-red-400' }
  if (diff === 0)  return { label: 'Today',     cls: 'text-indigo-600 dark:text-indigo-400' }
  if (diff === 1)  return { label: 'Tomorrow',  cls: 'text-emerald-600 dark:text-emerald-400' }
  return { label: `In ${diff} days`, cls: 'text-gray-500 dark:text-gray-400' }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = 'indigo', onClick }) => {
  const colorMap = {
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-950/40',  icon: 'text-indigo-600 dark:text-indigo-400'  },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: 'text-emerald-600 dark:text-emerald-400'},
    amber:   { bg: 'bg-amber-50 dark:bg-amber-950/40',    icon: 'text-amber-600 dark:text-amber-400'    },
    violet:  { bg: 'bg-violet-50 dark:bg-violet-950/40',  icon: 'text-violet-600 dark:text-violet-400'  },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <button
      onClick={onClick}
      className="stat-card text-left group w-full"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${c.bg} transition-transform group-hover:scale-110 duration-200`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{sub}</div>}
    </button>
  )
}

// ─── Quick Task Row ───────────────────────────────────────────────────────────
const QuickTaskRow = ({ task, onToggle }) => {
  const isDone = task.status === 'COMPLETED'
  const pCfg   = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.MEDIUM
  const date   = formatRelativeDate(task.deadline)

  return (
    <div className={`task-row group ${isDone ? 'completed' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className={`check-box shrink-0 mt-0.5 ${isDone ? 'checked' : ''}`}
      >
        {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-gray-400 dark:text-zinc-500' : 'text-gray-900 dark:text-white'}`}>
          {task.title}
        </p>
        {date && (
          <p className={`text-xs mt-0.5 ${date.cls}`}>{date.label}</p>
        )}
      </div>

      {/* Priority dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${pCfg.dot}`} title={pCfg.label} />
    </div>
  )
}

// ─── Progress Ring (SVG) ──────────────────────────────────────────────────────
const ProgressRing = ({ value = 0, size = 80, stroke = 6, color = '#6366f1' }) => {
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.min(100, Math.max(0, value)) / 100) * circ

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
        className="text-gray-200 dark:text-zinc-700" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  )
}

// ─── Skill Progress Card ──────────────────────────────────────────────────────
const SkillProgressCard = ({ skill, onClick }) => {
  const pct = Math.round(skill.progress || 0)
  const sCfg = STATUS_CONFIG[skill.status] || STATUS_CONFIG.NOT_STARTED

  return (
    <button
      onClick={onClick}
      className="skill-card text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate pr-2">{skill.name || skill.title}</p>
        <span className={sCfg.cls} style={{ fontSize: 10, whiteSpace: 'nowrap' }}>{sCfg.label}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">{pct}% complete</p>
    </button>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate     = useNavigate()
  const firebaseAuth = getAuth()
  const { skills, loading: skillsLoading } = useSkills()
  const { tasks,  updateTask, createTask, loading: tasksLoading } = useTasks()

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [addingTask, setAddingTask]     = useState(false)

  const userName = firebaseAuth.currentUser?.displayName
    || firebaseAuth.currentUser?.email?.split('@')[0]
    || 'there'

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  // ── Metrics ──────────────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const completedSkills   = skills.filter(s => s.status === 'COMPLETED').length
    const inProgressSkills  = skills.filter(s => s.status === 'IN_PROGRESS').length
    const completedTasks    = tasks.filter(t => t.status === 'COMPLETED').length
    const todayTasks = tasks.filter(t => {
      if (!t.deadline) return false
      const d = new Date(t.deadline); d.setHours(0,0,0,0)
      const today = new Date(); today.setHours(0,0,0,0)
      return d.getTime() === today.getTime()
    })
    const overallProgress = skills.length
      ? Math.round(skills.reduce((sum, s) => sum + (s.progress || 0), 0) / skills.length)
      : 0

    return { completedSkills, inProgressSkills, completedTasks, overallProgress, todayTasks }
  }, [skills, tasks])

  // ── Today / Upcoming Tasks ───────────────────────────────────────────────
  const todayStr   = new Date().toISOString().slice(0, 10)
  const todayTasks = tasks
    .filter(t => t.status !== 'COMPLETED' && (t.deadline?.slice(0,10) === todayStr || !t.deadline))
    .slice(0, 6)
  const overdueTasks = tasks.filter(t => {
    if (!t.deadline || t.status === 'COMPLETED') return false
    const d = new Date(t.deadline); d.setHours(0,0,0,0)
    const today = new Date(); today.setHours(0,0,0,0)
    return d < today
  })

  // ── Active Skills (sorted by progress desc) ──────────────────────────────
  const topSkills = [...skills]
    .filter(s => s.status !== 'COMPLETED')
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 6)

  const handleToggleTask = async (task) => {
    const next = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'
    await updateTask(task.id, { ...task, status: next })
  }

  const handleQuickAdd = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    setAddingTask(true)
    try {
      await createTask({ title: newTaskTitle.trim(), priority: 'MEDIUM', status: 'NOT_STARTED' })
      setNewTaskTitle('')
    } finally {
      setAddingTask(false)
    }
  }

  const loading = skillsLoading || tasksLoading

  return (
    <AppShell>
      <div className="page-container space-y-6 animate-fade-slide-in">

        {/* ── Welcome Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="page-eyebrow">Personal Learning OS</p>
            <h1 className="page-title">
              {greeting}, <span className="gradient-text capitalize">{userName}</span> 👋
            </h1>
            <p className="page-subtitle">
              {metrics.inProgressSkills > 0
                ? `You have ${metrics.inProgressSkills} skill${metrics.inProgressSkills > 1 ? 's' : ''} in progress`
                : 'Start learning something new today'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {overdueTasks.length > 0 && (
              <button
                onClick={() => navigate('/tasks')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                  bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400
                  border border-red-200 dark:border-red-900/60 hover:bg-red-100 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {overdueTasks.length} overdue
              </button>
            )}
            <button
              onClick={() => navigate('/skill-gap')}
              className="btn-primary gap-1.5"
            >
              <Zap className="w-4 h-4" />
              Analyze Skill Gap
            </button>
          </div>
        </div>

        {/* ── Stat Grid ──────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Layers3} color="indigo"
              label="Total Skills"
              value={skills.length}
              sub={`${metrics.completedSkills} completed`}
              onClick={() => navigate('/skills')}
            />
            <StatCard
              icon={Target} color="violet"
              label="Overall Progress"
              value={`${metrics.overallProgress}%`}
              sub={`${metrics.inProgressSkills} in progress`}
              onClick={() => navigate('/skills')}
            />
            <StatCard
              icon={ListTodo} color="amber"
              label="Tasks Today"
              value={metrics.todayTasks.length}
              sub={`${metrics.completedTasks} done total`}
              onClick={() => navigate('/tasks')}
            />
            <StatCard
              icon={Flame} color="emerald"
              label="Active Streak"
              value="—"
              sub="Keep learning daily"
              onClick={() => navigate('/analytics')}
            />
          </div>
        )}

        {/* ── Main Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.85fr] gap-6">

          {/* LEFT: Tasks + Skills ─────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Today's Tasks */}
            <div className="card-surface p-5">
              <div className="section-header">
                <div>
                  <h2 className="section-title flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-indigo-500" style={{width:18,height:18}} />
                    Today's Tasks
                  </h2>
                  <p className="section-subtitle">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</p>
                </div>
                <button
                  onClick={() => navigate('/tasks')}
                  className="btn-ghost text-xs gap-1"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Quick add */}
              <form onSubmit={handleQuickAdd} className="flex gap-2 mb-4">
                <input
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Quick add a task…"
                  className="input-base flex-1 py-2 text-sm"
                />
                <button type="submit" disabled={addingTask || !newTaskTitle.trim()} className="btn-primary py-2 px-3">
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Task list */}
              {loading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-14" />)}
                </div>
              ) : todayTasks.length === 0 ? (
                <div className="empty-state py-10">
                  <div className="empty-state-icon">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">All clear!</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">No tasks for today. Add one above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTasks.map(task => (
                    <QuickTaskRow key={task.id} task={task} onToggle={handleToggleTask} />
                  ))}
                </div>
              )}
            </div>

            {/* Skill Progress Grid */}
            <div className="card-surface p-5">
              <div className="section-header">
                <div>
                  <h2 className="section-title flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-violet-500" style={{width:18,height:18}} />
                    Skill Progress
                  </h2>
                  <p className="section-subtitle">Your active learning areas</p>
                </div>
                <button onClick={() => navigate('/skills')} className="btn-ghost text-xs gap-1">
                  Manage <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-24" />)}
                </div>
              ) : topSkills.length === 0 ? (
                <div className="empty-state py-10">
                  <div className="empty-state-icon">
                    <Layers3 className="w-7 h-7 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No skills tracked yet</p>
                  <button onClick={() => navigate('/skills')} className="btn-primary mt-3 text-xs py-2 px-4">
                    Add your first skill
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {topSkills.map(skill => (
                    <SkillProgressCard
                      key={skill.id}
                      skill={skill}
                      onClick={() => navigate(`/skills/${skill.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Overall Progress + AI Panel ──────────────────────── */}
          <div className="space-y-6">

            {/* Overall progress ring */}
            <div className="card-surface p-5">
              <h2 className="section-title mb-4 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-amber-500" style={{width:18,height:18}} />
                Your Progress
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ProgressRing value={metrics.overallProgress} size={100} stroke={8} color="#6366f1" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{metrics.overallProgress}%</span>
                    <span className="text-[10px] text-gray-400 -mt-0.5">overall</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {[
                    { label: 'Completed',   value: metrics.completedSkills,  dot: 'bg-emerald-500', total: skills.length },
                    { label: 'In Progress', value: metrics.inProgressSkills, dot: 'bg-blue-500',    total: skills.length },
                    { label: 'Not Started', value: skills.length - metrics.completedSkills - metrics.inProgressSkills, dot: 'bg-gray-300 dark:bg-zinc-600', total: skills.length },
                  ].map(row => (
                    <div key={row.label} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${row.dot}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{row.value}</span>
                        </div>
                        <div className="progress-track h-1.5">
                          <div className="h-full rounded-full" style={{
                            width: row.total ? `${(row.value / row.total) * 100}%` : '0%',
                            background: row.dot.includes('emerald') ? '#10b981' : row.dot.includes('blue') ? '#3b82f6' : '#d1d5db'
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Skill Gap CTA */}
            <div className="relative overflow-hidden rounded-2xl p-5"
              style={{ background: 'linear-gradient(135deg, hsl(250 84% 14%) 0%, hsl(280 70% 16%) 100%)' }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #a78bfa, transparent)', transform: 'translate(30%, -30%)' }} />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="font-bold text-white mb-1.5">AI Skill Gap Analyzer</h3>
                <p className="text-sm text-violet-200 mb-4 leading-relaxed">
                  Upload your resume and discover exactly which skills you need for your target role.
                </p>
                <button
                  onClick={() => navigate('/skill-gap')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                    bg-white text-indigo-700 font-semibold text-sm
                    hover:bg-violet-50 transition-colors"
                >
                  Start Analysis <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick nav shortcuts */}
            <div className="card-surface p-5">
              <h2 className="section-title mb-3">Quick Access</h2>
              <div className="space-y-1">
                {[
                  { to: '/tasks',     label: 'Manage Tasks',    icon: ListTodo,  sub: `${tasks.filter(t=>t.status!=='COMPLETED').length} pending` },
                  { to: '/goals',     label: 'Set Goals',       icon: Target,    sub: 'AI-powered guidance' },
                  { to: '/analytics', label: 'View Analytics',  icon: BarChart3, sub: 'Track your progress' },
                  { to: '/skill-gap', label: 'Skill Gap',       icon: Zap,       sub: 'Find missing skills' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.to}
                      onClick={() => navigate(item.to)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                        hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group text-left"
                    >
                      <Icon className="w-4 h-4 text-gray-400 dark:text-zinc-500 group-hover:text-indigo-500 transition-colors" style={{width:16,height:16}} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">{item.sub}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
