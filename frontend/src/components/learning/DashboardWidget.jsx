import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export const DashboardWidget = ({ title, icon, children, className = '' }) => {
  const Icon = icon

  return (
    <Card className={`border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm ${className}`}>
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
        {Icon ? <Icon className="w-4 h-4 text-gray-400" /> : null}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
