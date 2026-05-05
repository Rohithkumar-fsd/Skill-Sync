import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { PriorityBadge } from '../learning/PriorityBadge'

export const SkillCard = ({ skill, categoryName }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: skill.id,
    data: {
      type: 'card',
      categoryKey: skill.categoryKey,
      index: skill.index,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl bg-white border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 ${isDragging ? 'opacity-40 ring-2 ring-violet-500 shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            aria-label="Drag skill"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-gray-900">
              {skill.title || skill.name}
            </h4>
            <p className="mt-1 text-[11px] text-gray-500 truncate">
              {categoryName || 'Uncategorized'}
            </p>
          </div>
        </div>

        <PriorityBadge value={skill.priority || 'MEDIUM'} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
        <span>{skill.status || 'NOT_STARTED'}</span>
        <span>{Number(skill.progress || 0)}%</span>
      </div>
    </article>
  )
}
