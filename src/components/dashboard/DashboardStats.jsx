import { useStore } from '../../lib/store'
import { ListChecks, AlertTriangle, Clock } from 'lucide-react'

export default function DashboardStats() {
  const tasks = useStore((s) => s.tasks)
  const overdue = useStore((s) => s.getOverdueTasks())
  const upcoming = useStore((s) => s.getUpcomingDeadlines())

  const stats = [
    {
      label: 'Total Tugas',
      value: tasks.length,
      icon: ListChecks,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Deadline Mendekat',
      value: upcoming.length,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Tugas Terlewat',
      value: overdue.length,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center`}>
              <Icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
