import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import DashboardStats from '../components/dashboard/DashboardStats'
import TaskSummary from '../components/dashboard/TaskSummary'
import EmptyState from '../components/ui/EmptyState'
import { ListChecks, ArrowRight, GraduationCap } from 'lucide-react'

export default function DashboardPage() {
  const tasks = useStore((s) => s.tasks)
  const loaded = useStore((s) => s.loaded)
  const loadData = useStore((s) => s.loadData)
  const hasData = tasks.length > 0

  useEffect(() => {
    loadData()
  }, [loadData])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <GraduationCap size={20} className="text-primary-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            Gambaran cepat tugas kuliah
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="card">
          <EmptyState
            icon={GraduationCap}
            title="Selamat datang di KuliahTracker!"
            description="Belum ada data tugas. Mulai dengan menambahkan tugas pertama kamu."
            action={
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link to="/tasks" className="btn-primary w-full sm:w-auto justify-center">
                  <ListChecks size={16} />
                  Mulai Catat Tugas
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          <DashboardStats />

          <div className="max-w-2xl mx-auto">
            <TaskSummary />
          </div>

          <div className="flex items-center justify-center pt-2">
            <Link
              to="/tasks"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Kelola Tugas <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
