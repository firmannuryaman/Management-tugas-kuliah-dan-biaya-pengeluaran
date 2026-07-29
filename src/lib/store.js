import { create } from 'zustand'
import { api } from './api'

const STATUSES = ['todo', 'in_progress', 'done']
const STATUS_LABELS = {
  todo: 'Belum Dikerjakan',
  in_progress: 'Sedang Dikerjakan',
  done: 'Selesai',
}

function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

export const useStore = create((set, get) => ({
  tasks: [],
  expenses: [],
  semesters: [],
  activeSemester: '__all__',
  toasts: [],
  loaded: false,

  loadData: async () => {
    try {
      const [tasks, expenses] = await Promise.all([api.getTasks(), api.getExpenses()])
      const semesters = [...new Set(expenses.map((e) => e.semester).filter(Boolean))].sort()
      const current = get().activeSemester
      const activeSemester = current === '__all__' || !semesters.includes(current)
        ? '__all__'
        : current
      set({
        tasks,
        expenses,
        semesters: semesters.length > 0 ? semesters : ['Semester 1 - 2025/2026'],
        activeSemester,
        loaded: true,
      })
    } catch {
      set({ loaded: true })
    }
  },

  addToast: (message, type = 'success') => {
    const id = Date.now().toString()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3000)
  },

  // --- TASKS ---
  addTask: async (data) => {
    const task = await api.createTask(data)
    set((s) => ({ tasks: [task, ...s.tasks] }))
    get().addToast('Tugas berhasil ditambahkan')
  },

  updateTask: async (id, data) => {
    await api.updateTask(id, data)
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      ),
    }))
    get().addToast('Tugas berhasil diperbarui')
  },

  deleteTask: async (id) => {
    await api.deleteTask(id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
    get().addToast('Tugas berhasil dihapus')
  },

  moveTask: async (id, status) => {
    const prev = get().tasks
    const task = prev.find((t) => t.id === id)
    if (!task) return
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    }))
    try {
      await api.updateTask(id, {
        title: task.title,
        courseName: task.courseName,
        lecturerName: task.lecturerName,
        status,
        deadline: task.deadline,
        description: task.description,
      })
    } catch {
      set({ tasks: prev })
    }
  },

  // --- EXPENSES ---
  addExpense: async (data) => {
    const expense = await api.createExpense(data)
    set((s) => {
      const semesters = s.semesters
      if (!semesters.includes(data.semester) && data.semester) {
        return { expenses: [expense, ...s.expenses], semesters: [...semesters, data.semester].sort() }
      }
      return { expenses: [expense, ...s.expenses] }
    })
    get().addToast('Pengeluaran berhasil dicatat')
  },

  updateExpense: async (id, data) => {
    await api.updateExpense(id, data)
    set((s) => ({
      expenses: s.expenses.map((e) =>
        e.id === id ? { ...e, ...data, amount: Number(data.amount) } : e
      ),
    }))
    get().addToast('Pengeluaran berhasil diperbarui')
  },

  deleteExpense: async (id) => {
    await api.deleteExpense(id)
    set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }))
    get().addToast('Pengeluaran berhasil dihapus')
  },

  setActiveSemester: (s) => set({ activeSemester: s }),

  // --- COMPUTED ---
  getFilteredExpenses: () => {
    const { expenses, activeSemester } = get()
    if (activeSemester === '__all__') return expenses
    return expenses.filter((e) => e.semester === activeSemester)
  },

  getExpensesBySemester: (semester) => {
    if (semester === '__all__') return get().expenses
    return get().expenses.filter((e) => e.semester === semester)
  },

  getTotalExpenses: (semester) => {
    return get()
      .getExpensesBySemester(semester)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((t) => t.status === status)
  },

  getUpcomingDeadlines: () => {
    const now = new Date()
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return get()
      .tasks.filter((t) => {
        if (t.status === 'done' || !t.deadline) return false
        const d = new Date(t.deadline)
        return d >= now && d <= in7days
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  },

  getOverdueTasks: () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return get()
      .tasks.filter((t) => {
        if (t.status === 'done' || !t.deadline) return false
        return new Date(t.deadline) < now
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  },

  getExpenseCategories: (semester) => {
    const expenses = semester
      ? get().getExpensesBySemester(semester)
      : get().getFilteredExpenses()
    const map = {}
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0)
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  },
}))

export { STATUSES, STATUS_LABELS, formatRupiah, todayStr }
