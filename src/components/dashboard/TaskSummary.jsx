import { useStore, STATUSES, STATUS_LABELS, formatRupiah } from '../../lib/store'
import { AlertCircle, Clock, CheckCircle, ListChecks } from 'lucide-react'

export default function TaskSummary() {
  const tasks = useStore((s) => s.tasks)
  const upcomingDeadlines = useStore((s) => s.getUpcomingDeadlines())
  const overdue = useStore((s) => s.getOverdueTasks())

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const stats = STATUSES.map((s) => ({
    status: s,
    label: STATUS_LABELS[s],
    count: tasks.filter((t) => t.status === s).length,
  }))

  if (total === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Ringkasan Tugas</h3>
        <span className="text-xs text-gray-400">{done}/{total} selesai</span>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((s) => (
          <div
            key={s.status}
            className="text-center p-2 sm:p-3 rounded-xl bg-gray-50"
          >
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{s.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {overdue.length > 0 && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 mb-3">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 mb-2">
            <AlertCircle size={16} />
            Tugas Terlewat ({overdue.length})
          </div>
          <ul className="space-y-1">
            {overdue.slice(0, 3).map((t) => (
              <li key={t.id} className="text-xs text-red-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {upcomingDeadlines.length > 0 && (
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-700 mb-2">
            <Clock size={16} />
            Deadline Mendatang ({upcomingDeadlines.length})
          </div>
          <ul className="space-y-1">
            {upcomingDeadlines.slice(0, 3).map((t) => (
              <li key={t.id} className="text-xs text-orange-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                {t.title} —{' '}
                {new Date(t.deadline).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
