import { useStore, formatRupiah } from '../../lib/store'
import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react'

export default function ExpenseSummary() {
  const activeSemester = useStore((s) => s.activeSemester)
  const semesters = useStore((s) => s.semesters)
  const getTotalExpenses = useStore((s) => s.getTotalExpenses)
  const getExpenseCategories = useStore((s) => s.getExpenseCategories)

  const total = getTotalExpenses(activeSemester)
  const categories = getExpenseCategories(activeSemester)
  const topCategory = categories.sort((a, b) => b.value - a.value)[0]

  const prevSemester =
    semesters.length > 1
      ? semesters[semesters.indexOf(activeSemester) - 1]
      : null
  const prevTotal = prevSemester ? getTotalExpenses(prevSemester) : 0
  const diff = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0

  if (total === 0 && categories.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Ringkasan Keuangan</h3>
        <span className="text-xs text-gray-400">{activeSemester}</span>
      </div>

      <div className="text-3xl font-bold text-primary-700 mb-1">
        {formatRupiah(total)}
      </div>
      <p className="text-xs text-gray-400 mb-4">Total pengeluaran semester ini</p>

      <div className="grid grid-cols-2 gap-3">
        {prevSemester && (
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <TrendingUp size={12} />
              Dibanding {prevSemester.replace('Semester ', 'Smt ')}
            </div>
            <div
              className={`text-sm font-semibold flex items-center gap-0.5 ${
                diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-gray-500'
              }`}
            >
              {diff > 0 ? '+' : ''}
              {diff.toFixed(1)}%
              <ArrowUpRight
                size={14}
                className={diff > 0 ? '' : 'rotate-90'}
              />
            </div>
          </div>
        )}

        {topCategory && (
          <div className="p-3 rounded-xl bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">Kategori Tertinggi</div>
            <div className="text-sm font-semibold text-gray-800">
              {topCategory.name}
            </div>
            <div className="text-xs text-gray-400">
              {formatRupiah(topCategory.value)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
