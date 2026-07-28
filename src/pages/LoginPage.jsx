import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/authStore";
import { GraduationCap, LogIn } from "lucide-react";

export default function LoginPage() {
  const location = useLocation();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const justRegistered = location.state?.registered;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
            <GraduationCap size={28} className="text-primary-700" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Assignment List and Tuition Payment
          </h1>
          <p className="text-sm text-gray-400 mt-1">Masuk ke akun kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {justRegistered && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              Akun berhasil dibuat. Silakan masuk dengan akun kamu.
            </div>
          )}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
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

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
