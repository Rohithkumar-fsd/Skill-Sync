import React from 'react'

const PRIORITY_CONFIG = {
  HIGH:   { label: 'High',   cls: 'priority-high'   },
  MEDIUM: { label: 'Medium', cls: 'priority-medium' },
  LOW:    { label: 'Low',    cls: 'priority-low'    },
}

export const PriorityBadge = ({ value }) => {
  const cfg = PRIORITY_CONFIG[value] || PRIORITY_CONFIG.MEDIUM
  return (
    <span className={cfg.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        value === 'HIGH' ? 'bg-red-500' : value === 'LOW' ? 'bg-gray-400' : 'bg-amber-500'
      }`} />
      {cfg.label}
    </span>
  )
}

export default PriorityBadge
