import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Loader2, Sparkles } from 'lucide-react'

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

const ResultList = ({ label, items, variant = 'default' }) => {
  if (!items?.length) return null

  const chipClass = variant === 'danger'
    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    : variant === 'success'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'

  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${chipClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

const formatResult = (result) => {
  if (!result) return null
  if (result.error) {
    return {
      title: 'AI error',
      variant: 'danger',
      summary: [String(result.error)],
    }
  }

  if (result.suggestions) {
    return {
      title: result.title || 'Suggestions',
      summary: Array.isArray(result.suggestions)
        ? result.suggestions.map((item) => (isObject(item) ? item.name || item.title || item.priority || JSON.stringify(item) : String(item)))
        : [String(result.suggestions)],
    }
  }

  if (result.missingSkills || result.learningOrder) {
    return {
      title: result.targetRole ? `Gap analysis · ${result.targetRole}` : 'Skill gap analysis',
      summary: [],
      danger: result.missingSkills || [],
      success: result.learningOrder || [],
    }
  }

  if (result.orderedTasks) {
    return {
      title: 'Task plan',
      summary: (result.orderedTasks || []).map((task) => task.title || task.name).filter(Boolean),
    }
  }

  if (result.recommendedOrder) {
    return {
      title: 'Optimized path',
      summary: result.recommendedOrder || [],
    }
  }

  if (result.subskills) {
    return {
      title: result.skillName ? `Subskills · ${result.skillName}` : 'Subskills',
      summary: (result.subskills || []).map((item) => item.title || item).filter(Boolean),
    }
  }

  if (result.estimatedHours != null) {
    return {
      title: 'Time estimate',
      summary: [
        `${result.skillName || 'Selected skill'} · ${result.estimatedHours} hours`,
      ],
    }
  }

  if (result.done != null || result.missed != null) {
    return {
      title: 'Weekly review',
      summary: [
        `Done: ${result.done ?? 0}`,
        `Missed: ${result.missed ?? 0}`,
        `Skills progressed: ${result.skillsProgressed ?? 0}`,
      ],
      danger: result.improve || [],
    }
  }

  if (isObject(result)) {
    return {
      title: 'Result',
      json: result,
    }
  }

  return null
}

export const AIActionPanel = ({ title = 'AI Assistant', actions = [], result }) => {
  const [loadingKey, setLoadingKey] = useState(null)
  const formatted = formatResult(result)

  const runAction = async (action) => {
    setLoadingKey(action.key)
    try {
      await action.onClick()
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant="outline"
              className="rounded-full border-gray-200 dark:border-zinc-700 bg-transparent"
              onClick={() => runAction(action)}
              disabled={loadingKey === action.key}
            >
              {loadingKey === action.key ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loadingKey === action.key ? 'Running...' : action.label}
            </Button>
          ))}
        </div>
        {formatted ? (
          <div className="rounded-2xl bg-gray-50 dark:bg-zinc-800 p-4 text-sm text-gray-700 dark:text-gray-200 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-gray-900 dark:text-white">{formatted.title}</div>
              {formatted.variant ? <span className="text-xs font-semibold text-red-500">Needs attention</span> : null}
            </div>

            {formatted.summary ? <ResultList label="Summary" items={formatted.summary} /> : null}
            {formatted.success ? <ResultList label="Learning order" items={formatted.success} variant="success" /> : null}
            {formatted.danger ? <ResultList label="Missing / improve" items={formatted.danger} variant="danger" /> : null}

            {formatted.json ? (
              <pre className="overflow-auto whitespace-pre-wrap rounded-xl bg-white/70 dark:bg-black/20 p-3 text-xs leading-5 text-gray-700 dark:text-gray-200">
                {JSON.stringify(formatted.json, null, 2)}
              </pre>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
