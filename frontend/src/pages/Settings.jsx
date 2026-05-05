import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { LearningShell } from '../components/learning/LearningShell'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useSkills } from '../contexts/SkillContext'
import { useTasks } from '../contexts/TaskContext'
import { exportUserData } from '../services/api'
import { auth } from '../firebase'

const Settings = () => {
  const { categories, skills } = useSkills()
  const { tasks } = useTasks()
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await exportUserData(auth.currentUser?.uid)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'levelup-export.json'
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <LearningShell
      title="Settings"
      subtitle="Export your learning data as JSON whenever you need a portable backup."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg">Data snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>Categories: {categories.length}</p>
            <p>Skills: {skills.length}</p>
            <p>Tasks: {tasks.length}</p>
            <Button className="rounded-full" onClick={handleExport} disabled={exporting}>
              <Download className="w-4 h-4 mr-2" /> {exporting ? 'Exporting...' : 'Export JSON'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-lg">What gets exported</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>• Categories</p>
            <p>• Skills with progress, notes, and subskills</p>
            <p>• Tasks with deadlines and status</p>
            <p>• Export timestamp</p>
          </CardContent>
        </Card>
      </div>
    </LearningShell>
  )
}

export default Settings
