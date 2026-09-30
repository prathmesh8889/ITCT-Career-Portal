import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth(); const navigate = useNavigate()
  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'RECRUITER' ? '/recruiter' : '/candidate')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <span className="eyebrow">WELCOME BACK</span><h2>Login to CareerBridge</h2><p>Continue to your career dashboard.</p>
    {error && <div className="alert">{error}</div>}
    <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label>
    <label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></label>
    <button className="btn btn-primary btn-lg full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
    <small>New here? <Link to="/register">Create an account</Link></small>
  </form></main>
}
