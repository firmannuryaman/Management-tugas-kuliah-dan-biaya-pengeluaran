import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/authStore'
import { api } from '../lib/api'
import { GraduationCap, KeyRound, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [generatedCode, setGeneratedCode] = useState('')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  async function handleSendCode(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email) { setError('Email harus diisi'); return }
    setSubmitting(true)
    try {
      const data = await api.forgotPassword(email)
      setGeneratedCode(data.code)
      setMessage('Kode reset telah dikirim ke email Anda.')
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!code || !password) { setError('Semua field harus diisi'); return }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    if (password !== confirmPassword) { setError('Konfirmasi password tidak cocok'); return }
    setSubmitting(true)
    try {
      await api.resetPassword(email, code, password)
      navigate('/login', { replace: true, state: { resetSuccess: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
            <KeyRound size={28} className="text-primary-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-400 mt-1">
            {step === 1 ? 'Masukkan email untuk menerima kode reset' : 'Masukkan kode dan password baru'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="card space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}
            {message && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">{message}</div>
            )}

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="nama@email.com"
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Mengirim...' : 'Kirim Kode Reset'}
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center gap-1">
                <ArrowLeft size={14} /> Kembali ke Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="card space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
            )}
            {generatedCode && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700 text-center">
                Kode reset Anda: <strong className="text-lg tracking-widest">{generatedCode}</strong>
              </div>
            )}

            <div>
              <label className="label">Kode Reset</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="label">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Ulangi password baru"
                required
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Memproses...' : 'Reset Password'}
            </button>

            <p className="text-center text-sm text-gray-400">
              <button
                type="button"
                onClick={() => { setStep(1); setGeneratedCode(''); setCode('') }}
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Ganti Email
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
