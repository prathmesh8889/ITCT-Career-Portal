import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'CANDIDATE', companyName:'' })
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  const { register } = useAuth(); const navigate = useNavigate()
  const submit = async e => { e.preventDefault(); setLoading(true); setError('')
    try { const user = await register(form); navigate(user.role === 'RECRUITER' ? '/recruiter' : '/candidate') }
    catch(e){ setError(e.message) } finally { setLoading(false) }
  }
  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <span className="eyebrow">CREATE ACCOUNT</span><h2>Start your journey</h2><p>Join as a candidate or recruiter.</p>
    {error && <div className="alert">{error}</div>}
    <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
    <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    <label>I am a<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="CANDIDATE">Candidate</option><option value="RECRUITER">Recruiter</option></select></label>
    {form.role === 'RECRUITER' && <label>Company name<input value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})}/></label>}
    <button className="btn btn-primary btn-lg full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
  </form></main>
}
