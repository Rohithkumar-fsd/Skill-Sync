import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent } from '../ui/card'
import { SkillCard } from './SkillCard'

export const CategoryColumn = ({ category, items = [] }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: category.key,
    data: {
      type: 'column',
      categoryKey: category.key,
    },
  })

  return (
    <section
      ref={setNodeRef}
      className={`w-[320px] min-w-[320px] rounded-3xl border transition-all duration-200 ${isOver ? 'border-violet-400 ring-2 ring-violet-200 shadow-lg' : 'border-gray-200/80 shadow-sm'} bg-slate-50/80 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-gray-200/80 px-4 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">{category.name}</h3>
          <p className="mt-1 text-[11px] text-gray-500">{items.length} cards</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 shadow-sm">
          {category.key}
        </span>
      </div>

      <Card className="m-3 border-0 bg-transparent shadow-none">
        <CardContent className="space-y-3 p-0">
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            {items.length > 0 ? (
              items.map((skill, index) => (
                <SkillCard
                  key={skill.id}
                  skill={{ ...skill, index, categoryKey: category.key }}
                  categoryName={category.name}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-6 text-center">
                <p className="text-sm font-medium text-gray-700">Empty column</p>
                <p className="mt-1 text-xs text-gray-500">Drop a card here or add a new one.</p>
              </div>
            )}
          </SortableContext>
        </CardContent>
      </Card>

      <div className="px-4 pb-4">
        <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white/90 px-4 py-3 text-center text-sm font-medium text-gray-500">
          Add cards from the top bar
        </div>
      </div>
    </section>
  )
}
