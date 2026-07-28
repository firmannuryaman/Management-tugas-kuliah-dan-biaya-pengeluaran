import { useState, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { useStore, formatRupiah } from '../../lib/store'
import ExpenseForm from './ExpenseForm'
import { CategoryPie, SemesterComparison } from './ExpenseChart'
import Modal from '../ui/Modal'
import EmptyState from '../ui/EmptyState'
import { Plus, Pencil, Trash2, Wallet, FileDown } from 'lucide-react'

export default function ExpenseList() {
  const filteredExpenses = useStore((s) => s.getFilteredExpenses())
  const activeSemester = useStore((s) => s.activeSemester)
  const semesters = useStore((s) => s.semesters)
  const setActiveSemester = useStore((s) => s.setActiveSemester)
  const deleteExpense = useStore((s) => s.deleteExpense)
  const getTotalExpenses = useStore((s) => s.getTotalExpenses)

  const [modalOpen, setModalOpen] = useState(false)
  const [editExpense, setEditExpense] = useState(null)

  const total = getTotalExpenses(activeSemester)

  const openAdd = () => {
    setEditExpense(null)
    setModalOpen(true)
  }

  const openEdit = (exp) => {
    setEditExpense(exp)
    setModalOpen(true)
  }

  const handleDelete = (exp) => {
    if (window.confirm(`Hapus pengeluaran "${exp.title}"?`)) {
      deleteExpense(exp.id)
    }
  }

  const exportPDF = useCallback(() => {
    const doc = new jsPDF()
    const date = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    doc.setFontSize(16)
    doc.text('Laporan Biaya Kuliah', 14, 20)
    doc.setFontSize(11)
    doc.text(`Semester: ${activeSemester}`, 14, 28)
    doc.setFontSize(9)
    doc.text(`Dicetak: ${date}`, 14, 34)

    const rows = filteredExpenses.map((exp, i) => [
      i + 1,
      exp.title,
      exp.category,
      new Date(exp.expenseDate).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
      }),
      formatRupiah(exp.amount),
    ])

    doc.autoTable({
      startY: 40,
      head: [['No', 'Nama', 'Kategori', 'Tanggal', 'Nominal']],
      body: rows,
      foot: [['', '', '', 'Total', formatRupiah(total)]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] },
      footStyles: { fillColor: [243, 244, 246], textColor: [79, 70, 229], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 55 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40, halign: 'right' },
      },
    })

    doc.save(`laporan-biaya-${activeSemester.replace(/\s+/g, '-')}.pdf`)
  }, [filteredExpenses, activeSemester, total])

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={activeSemester}
            onChange={(e) => setActiveSemester(e.target.value)}
            className="input w-full sm:w-auto font-medium"
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-lg">
            <Wallet size={16} className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">
              {formatRupiah(total)}
            </span>
          </div>
        </div>
        <div className="flex items-stretch sm:items-center gap-2">
          <button onClick={exportPDF} className="btn-secondary w-full sm:w-auto justify-center">
            <FileDown size={16} />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button onClick={openAdd} className="btn-primary w-full sm:w-auto justify-center">
            <Plus size={16} />
            Tambah Pengeluaran
          </button>
        </div>
      </div>

      <div className="sm:hidden mb-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-primary-50 rounded-xl">
          <Wallet size={18} className="text-primary-600" />
          <span className="text-sm text-primary-700">Total semester ini:</span>
          <span className="text-sm font-bold text-primary-700">
            {formatRupiah(total)}
          </span>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="card mb-6">
          <EmptyState
            icon={Wallet}
            title="Belum ada pengeluaran"
            description={`Catat pengeluaran pertama untuk ${activeSemester}.`}
            action={
              <button onClick={openAdd} className="btn-primary">
                <Plus size={16} />
                Catat Pengeluaran
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="card p-0 overflow-hidden mb-6 hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Nama</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Kategori</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Tanggal</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Nominal</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500 w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{exp.title}</div>
                        {exp.note && (
                          <div className="text-xs text-gray-400 mt-0.5">{exp.note}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(exp.expenseDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {formatRupiah(exp.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(exp)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(exp)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={3} className="px-4 py-3 text-gray-600">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-primary-700">
                      {formatRupiah(total)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3 mb-6">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{exp.title}</div>
                    {exp.note && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{exp.note}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(exp)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full font-medium">
                    {exp.category}
                  </span>
                  <span>
                    {new Date(exp.expenseDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="text-base font-bold text-primary-700">
                  {formatRupiah(exp.amount)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CategoryPie semester={activeSemester} />
        <SemesterComparison />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editExpense ? 'Edit Pengeluaran' : 'Catat Pengeluaran Baru'}
      >
        <ExpenseForm
          editExpense={editExpense}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
