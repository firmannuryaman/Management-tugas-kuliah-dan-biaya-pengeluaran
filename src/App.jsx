import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './lib/authStore'
import Layout from './components/layout/Layout'
import AuthGuard from './components/layout/AuthGuard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import ExpensesPage from './pages/ExpensesPage'

export default function App() {
  const checkAuth = useAuth((s) => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Route>
    </Routes>
  )
}
