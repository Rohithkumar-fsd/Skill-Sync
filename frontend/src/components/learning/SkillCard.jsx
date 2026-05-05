import React from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'

const PRIORITY_CONFIG = {
  HIGH:   { label: 'High',   dot: 'bg-red-500' },
  MEDIUM: { label: 'Medium', dot: 'bg-amber-500' },
  LOW:    { label: 'Low',    dot: 'bg-gray-400' },
}

const STATUS_CONFIG = {
  NOT_STARTED: { label: 'Not Started', cls: 'text-gray-500 dark:text-zinc-400' },
  IN_PROGRESS:  { label: 'In Progress',  cls: 'text-blue-600 dark:text-blue-400' },
  COMPLETED:    { label: 'Completed',    cls: 'text-emerald-600 dark:text-emerald-400' },
}

export const SkillCard = ({ skill, onEdit }) => {
  const pCfg = PRIORITY_CONFIG[skill.priority] || PRIORITY_CONFIG.MEDIUM
  const sCfg = STATUS_CONFIG[skill.status] || STATUS_CONFIG.NOT_STARTED
  const pct  = Math.round(skill.progress || 0)

  return (
    <div className="card-surface p-5 flex flex-col group relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50">
      
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <Link to={`/skills/${skill.id}`} className="block flex-1 pr-4">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {skill.name}
          </h3>
        </Link>
        <button 
          onClick={(e) => { e.preventDefault(); onEdit?.(skill); }}
          className="btn-icon w-8 h-8 opacity-0 group-hover:opacity-100 absolute top-3 right-3"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-6 flex-1 min-h-[40px]">
        {skill.description || 'No description provided.'}
      </p>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray-900 dark:text-white">{pct}%</span>
          <span className={sCfg.cls}>{sCfg.label}</span>
        </div>
        <div className="progress-track h-1.5">
          <div 
            className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-500 font-medium">
        <div className="flex gap-3">
          <span>{skill.subskills?.length || 0} items</span>
          {skill.notes && <span>Has notes</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
          {pCfg.label}
        </div>
      </div>
    </div>
  )
}

export default SkillCard
