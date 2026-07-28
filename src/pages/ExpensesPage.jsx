import { useEffect } from 'react'
import { Wallet } from 'lucide-react'
import { useStore } from '../lib/store'
import ExpenseList from '../components/expenses/ExpenseList'

export default function ExpensesPage() {
  const loaded = useStore((s) => s.loaded)
  const loadData = useStore((s) => s.loadData)

  useEffect(() => {
    if (!loaded) loadData()
  }, [loaded, loadData])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <Wallet size={20} className="text-primary-700" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Biaya Kuliah</h1>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            Catat dan pantau pengeluaran biaya kuliah per semester
          </p>
        </div>
      </div>

      <ExpenseList />
    </div>
  )
}
