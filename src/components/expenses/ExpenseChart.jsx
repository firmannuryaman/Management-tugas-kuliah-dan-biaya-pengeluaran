import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import { useStore, formatRupiah } from '../../lib/store'

const COLORS = [
  '#4c6ef5',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
]

export function CategoryPie({ semester }) {
  const categories = useStore((s) => s.getExpenseCategories(semester))

  if (categories.length === 0) return null

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Breakdown per Kategori</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {categories.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatRupiah(value)}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SemesterComparison() {
  const expenses = useStore((s) => s.expenses)
  const semesters = useStore((s) => s.semesters)

  const data = semesters.map((s) => ({
    name: s.replace('Semester ', 'Smt ').split(' - ')[0],
    total: expenses
      .filter((e) => e.semester === s)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0),
  }))

  if (data.length < 1) return null

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">
        Perbandingan Antar Semester
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000000 ? `${(v / 1000000).toFixed(1)}jt` : `${(v / 1000).toFixed(0)}rb`
            }
          />
          <Tooltip
            formatter={(value) => formatRupiah(value)}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
            }}
          />
          <Bar dataKey="total" fill="#4c6ef5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
