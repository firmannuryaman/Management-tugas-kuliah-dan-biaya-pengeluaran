import { useState } from 'react'
import { useStore, todayStr, STATUSES, STATUS_LABELS } from '../../lib/store'

const emptyForm = {
  title: '',
  courseName: '',
  lecturerName: '',
  deadline: '',
  description: '',
}

export default function TaskForm({ editTask, onClose }) {
  const addTask = useStore((s) => s.addTask)
  const updateTask = useStore((s) => s.updateTask)
  const [form, setForm] = useState(
    editTask
      ? {
          title: editTask.title || '',
          courseName: editTask.courseName || '',
          lecturerName: editTask.lecturerName || '',
          deadline: editTask.deadline || '',
          description: editTask.description || '',
        }
      : { ...emptyForm }
  )

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    if (editTask) {
      updateTask(editTask.id, form)
    } else {
      addTask(form)
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Nama Tugas *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="input"
          placeholder="Contoh: Membuat makalah AI"
          autoFocus
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="label">Mata Kuliah</label>
          <input
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            className="input"
            placeholder="Struktur Data"
          />
        </div>
        <div>
          <label className="label">Nama Dosen</label>
          <input
            name="lecturerName"
            value={form.lecturerName}
            onChange={handleChange}
            className="input"
            placeholder="Dr. Budi"
          />
        </div>
      </div>

      <div>
        <label className="label">Deadline</label>
        <input
          name="deadline"
          type="date"
          value={form.deadline}
          onChange={handleChange}
          className="input"
          min={todayStr()}
        />
      </div>

      <div>
        <label className="label">Deskripsi (opsional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input min-h-[80px] resize-none"
          placeholder="Detail tambahan..."
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1">
          {editTask ? 'Simpan Perubahan' : 'Tambah Tugas'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Batal
        </button>
      </div>
    </form>
  )
}
