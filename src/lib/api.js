const API_URL = '/api'

function getToken() {
  return localStorage.getItem('auth_token')
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })

  if (!res.ok && res.status === 401) {
    localStorage.removeItem('auth_token')
  }

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('Server error: response tidak valid')
  }

  if (!res.ok) {
    throw new Error(data.error || 'Terjadi kesalahan')
  }
  return data
}

export const api = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, code, password) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    }),

  getMe: () => request('/auth/me'),

  getTasks: () => request('/tasks'),
  createTask: (data) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) =>
    request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) =>
    request(`/tasks/${id}`, { method: 'DELETE' }),

  getExpenses: () => request('/expenses'),
  createExpense: (data) =>
    request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  updateExpense: (id, data) =>
    request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExpense: (id) =>
    request(`/expenses/${id}`, { method: 'DELETE' }),
}