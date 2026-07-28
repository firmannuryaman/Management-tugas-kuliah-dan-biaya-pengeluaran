import { useState } from 'react'
import { useStore, todayStr } from '../../lib/store'

const emptyForm = {
  title: '',
  category: '',
  amount: '',
  expenseDate: todayStr(),
  semester: '',
  note: '',
}

const presetCategories = [
  'SPP',
  'Buku',
  'Praktikum',
  'Kos',
  'Transportasi',
  'Alat Tulis',
  'UKT',
  'Lainnya',
]

export default function ExpenseForm({ editExpense, onClose }) {
  const addExpense = useStore((s) => s.addExpense)
  const updateExpense = useStore((s) => s.updateExpense)
  const semesters = useStore((s) => s.semesters)
  const activeSemester = useStore((s) => s.activeSemester)

  const [form, setForm] = useState(
    editExpense
      ? {
          title: editExpense.title || '',
          category: editExpense.category || '',
          amount: String(editExpense.amount || ''),
          expenseDate: editExpense.expenseDate || todayStr(),
          semester: editExpense.semester || activeSemester,
          note: editExpense.note || '',
        }
      : { ...emptyForm, semester: activeSemester }
  )

  const [customCategory, setCustomCategory] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.amount) return

    const category = form.category === '__custom__' ? customCategory : form.category
    if (!category.trim()) return

    const data = {
      ...form,
      category: category.trim(),
      amount: Number(form.amount),
    }

    if (editExpense) {
      updateExpense(editExpense.id, data)
    } else {
      addExpense(data)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nama Pengeluaran *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input"
          placeholder="Contoh: Beli buku Aljabar"
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Kategori *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Pilih kategori</option>
            {presetCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__custom__">+ Tambah kategori baru</option>
          </select>
        </div>
        <div>
          <label className="label">Nominal (Rp) *</label>
          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            className="input"
            placeholder="100000"
            min="0"
            required
          />
        </div>
      </div>

      {form.category === '__custom__' && (
        <div>
          <label className="label">Nama Kategori Baru *</label>
          <input
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="input"
            placeholder="Misal: Sertifikasi"
            autoFocus
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Tanggal</label>
          <input
            name="expenseDate"
            type="date"
            value={form.expenseDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div>
          <label className="label">Semester *</label>
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            className="input"
            required
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="__new__">+ Semester baru</option>
          </select>
          {form.semester === '__new__' && (
            <input
              name="semester"
              value={
                form.semester === '__new__' ? '' : form.semester
              }
              onChange={(e) =>
                setForm((prev) => ({ ...prev, semester: e.target.value }))
              }
              className="input mt-2"
              placeholder="Semester 6 - 2026/2027"
              autoFocus
            />
          )}
        </div>
      </div>

      <div>
        <label className="label">Catatan (opsional)</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="input min-h-[60px] resize-none"
          placeholder="Catatan tambahan..."
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1">
          {editExpense ? 'Simpan Perubahan' : 'Catat Pengeluaran'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Batal
        </button>
      </div>
    </form>
  )
}
