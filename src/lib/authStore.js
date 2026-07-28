import { create } from 'zustand'
import { api } from './api'

export const useAuth = create((set, get) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  loading: true,

  setUser: (user, token) => {
    if (token) localStorage.setItem('auth_token', token)
    set({ user, token, loading: false })
  },

  login: async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem('auth_token', data.token)
    set({ user: data.user, token: data.token, loading: false })
  },

  register: async (name, email, password) => {
    await api.register(name, email, password)
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null, loading: false })
  },

  checkAuth: async () => {
    const token = get().token
    if (!token) {
      set({ loading: false })
      return
    }
    try {
      const data = await api.getMe()
      set({ user: data.user, token, loading: false })
    } catch {
      localStorage.removeItem('auth_token')
      set({ user: null, token: null, loading: false })
    }
  },
}))
