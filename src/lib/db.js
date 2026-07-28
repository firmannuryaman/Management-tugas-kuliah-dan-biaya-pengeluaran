const STORE_KEYS = {
  tasks: 'app_tasks',
  expenses: 'app_expenses',
  semesters: 'app_semesters',
}

function load(key) {
  try {
    const raw = localStorage.getItem(STORE_KEYS[key])
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(key, data) {
  localStorage.setItem(STORE_KEYS[key], JSON.stringify(data))
}

export const db = {
  getTasks: () => load('tasks'),
  saveTasks: (tasks) => save('tasks', tasks),
  getExpenses: () => load('expenses'),
  saveExpenses: (expenses) => save('expenses', expenses),
  getSemesters: () => {
    const s = load('semesters')
    return s.length > 0 ? s : ['Semester 1 - 2025/2026']
  },
  saveSemesters: (s) => save('semesters', s),
}
