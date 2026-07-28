import { useStore } from '../../lib/store'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export default function ToastContainer() {
  const toasts = useStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = icons[t.type] || CheckCircle
        return (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colors[t.type] || colors.success}`}
          >
            <Icon size={18} className="shrink-0" />
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button
              onClick={() =>
                useStore.setState((s) => ({
                  toasts: s.toasts.filter((x) => x.id !== t.id),
                }))
              }
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
