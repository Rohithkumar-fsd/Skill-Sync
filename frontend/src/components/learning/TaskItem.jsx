import React from 'react'
import { Card, CardContent } from '../ui/card'
import { PriorityBadge } from './PriorityBadge'

const STATUS_STYLES = {
  NOT_STARTED: 'text-gray-500 dark:text-gray-400',
  IN_PROGRESS: 'text-violet-600 dark:text-violet-400',
  COMPLETED: 'text-emerald-600 dark:text-emerald-400',
}

export const TaskItem = ({ task, skillName, onToggle, onEdit, onDelete }) => {
  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
            <PriorityBadge value={task.priority} />
            <span className={`text-xs font-semibold ${STATUS_STYLES[task.status] || STATUS_STYLES.NOT_STARTED}`}>{task.status}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {skillName || 'No skill linked'} {task.deadline ? `· Due ${task.deadline.slice(0, 10)}` : ''}
          </p>
        </div>

        {(onToggle || onEdit || onDelete) ? (
          <div className="flex flex-wrap items-center gap-2">
            {onToggle ? (
              <button onClick={() => onToggle?.(task)} className="rounded-full border border-gray-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                Toggle status
              </button>
            ) : null}
            {onEdit ? (
              <button onClick={() => onEdit?.(task)} className="rounded-full border border-gray-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800">
                Edit
              </button>
            ) : null}
            {onDelete ? (
              <button onClick={() => onDelete?.(task.id)} className="rounded-full border border-red-200 dark:border-red-900/60 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
