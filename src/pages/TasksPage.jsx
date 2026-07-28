import { useEffect } from 'react'
import { GraduationCap } from 'lucide-react'
import { useStore } from '../lib/store'
import TaskBoard from '../components/tasks/TaskBoard'

export default function TasksPage() {
  const loaded = useStore((s) => s.loaded)
  const loadData = useStore((s) => s.loadData)

  useEffect(() => {
    if (!loaded) loadData()
  }, [loaded, loadData])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-blue-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Papan Tugas</h1>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            Kelola tugas kuliah dengan Kanban board
          </p>
        </div>
      </div>

      <TaskBoard />
    </div>
  )
}
