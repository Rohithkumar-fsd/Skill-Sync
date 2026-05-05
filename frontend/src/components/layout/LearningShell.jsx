import React from 'react'
import { AppShell } from './AppShell'

/**
 * LearningShell — lightweight wrapper around AppShell.
 * Keeps backward compatibility: all pages using LearningShell continue
 * to work while the new sidebar is applied globally.
 */
export const LearningShell = ({ title, subtitle, children }) => {
  return (
    <AppShell>
      <div className="page-container animate-fade-slide-in">
        {/* Page header */}
        <div className="page-header">
          <p className="page-eyebrow">Personal Learning OS</p>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {/* Page content */}
        <div>{children}</div>
      </div>
    </AppShell>
  )
}

export default LearningShell
