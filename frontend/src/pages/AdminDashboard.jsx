import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const emptyJob = { title:'', company:'', location:'', type:'FULL_TIME', salary:'', description:'', requirements:'' }

export default function AdminDashboard(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats,setStats]=useState({})
  const [users,setUsers]=useState([])
  const [jobs,setJobs]=useState([])
  const [applications,setApplications]=useState([])
  const [tab,setTab]=useState('jobs')
  const [jobForm,setJobForm]=useState(emptyJob)
  const [editingId,setEditingId]=useState(null)
  const [credentials,setCredentials]=useState({currentPassword:'',newEmail:user?.email||'',newPassword:''})
  const [error,setError]=useState('')
  const [msg,setMsg]=useState('')

  const load = async () => {
    try {
      const [s,u,j,a] = await Promise.all([
        api('/admin/stats'),
        api('/admin/users'),
        api('/admin/jobs'),
        api('/admin/applications')
      ])
      setStats(s); setUsers(u); setJobs(j); setApplications(a); setError('')
    } catch(e) { setError(e.message) }
  }

  useEffect(()=>{ load() },[])
  useEffect(()=>{ if(user?.email) setCredentials(c=>({...c,newEmail:user.email})) },[user?.email])

  const saveJob = async e => {
    e.preventDefault(); setError(''); setMsg('')
    try {
      if(editingId){
        await api(`/jobs/${editingId}`,{method:'PUT',body:JSON.stringify(jobForm)})
        setMsg('Job updated successfully.')
      } else {
        await api('/jobs',{method:'POST',body:JSON.stringify(jobForm)})
        setMsg('New job published successfully.')
      }
      setEditingId(null); setJobForm(emptyJob); await load()
    } catch(e){ setError(e.message) }
  }

  const startEdit = job => {
    setEditingId(job.id)
    setJobForm({
      title:job.title||'', company:job.company||'', location:job.location||'',
      type:job.type||'FULL_TIME', salary:job.salary||'',
      description:job.description||'', requirements:job.requirements||''
    })
    window.scrollTo({top:0,behavior:'smooth'})
  }

  const closeJob = async id => {
    if(!confirm('Close this job? It will disappear from the public jobs page.')) return
    try { await api(`/jobs/${id}`,{method:'DELETE'}); setMsg('Job closed.'); await load() }
    catch(e){ setError(e.message) }
  }

  const updateApplication = async (id,status) => {
    try {
      await api(`/applications/${id}/status`,{method:'PATCH',body:JSON.stringify({status})})
      setMsg('Application status updated.'); await load()
    } catch(e){ setError(e.message) }
  }

  const updateRole = async (id,role) => {
    try {
      await api(`/admin/users/${id}/role`,{method:'PATCH',body:JSON.stringify({role})})
      setMsg('User role updated.'); await load()
    } catch(e){ setError(e.message) }
  }

  const updateCredentials = async e => {
    e.preventDefault(); setError(''); setMsg('')
    try {
      await api('/admin/credentials',{method:'PATCH',body:JSON.stringify(credentials)})
      window.alert('Admin login updated successfully. Please sign in again with the new credentials.')
      logout()
      navigate('/login')
    } catch(e){ setError(e.message) }
  }

  return <main className="container page">
    <div className="page-head">
      <div><span className="eyebrow">ADMIN CONTROL CENTER</span><h1>Manage Career Portal</h1><p className="muted">Jobs, users, applications and admin access — all from one place.</p></div>
    </div>

    {msg&&<div className="success">{msg}</div>}
    {error&&<div className="alert">{error}</div>}

    <div className="stats-grid admin-stats">
      {[['Users',stats.users],['Candidates',stats.candidates],['Recruiters',stats.recruiters],['Active jobs',stats.activeJobs],['Applications',stats.applications]].map(([k,v])=><div className="stat" key={k}><strong>{v??0}</strong><span>{k}</span></div>)}
    </div>

    <div className="admin-tabs">
      <button className={tab==='jobs'?'active':''} onClick={()=>setTab('jobs')}>Jobs</button>
      <button className={tab==='applications'?'active':''} onClick={()=>setTab('applications')}>Applications</button>
      <button className={tab==='users'?'active':''} onClick={()=>setTab('users')}>Users</button>
      <button className={tab==='settings'?'active':''} onClick={()=>setTab('settings')}>Settings</button>
    </div>

    {tab==='jobs' && <div className="dashboard-grid">
      <form className="panel form-panel" onSubmit={saveJob}>
        <div className="panel-head"><h2>{editingId?'Edit job':'Add new job'}</h2>{editingId&&<button type="button" className="btn btn-ghost" onClick={()=>{setEditingId(null);setJobForm(emptyJob)}}>Cancel edit</button>}</div>
        <div className="form-grid">
          <label>Job title<input required value={jobForm.title} onChange={e=>setJobForm({...jobForm,title:e.target.value})}/></label>
          <label>Company<input required value={jobForm.company} onChange={e=>setJobForm({...jobForm,company:e.target.value})}/></label>
          <label>Location<input required value={jobForm.location} onChange={e=>setJobForm({...jobForm,location:e.target.value})}/></label>
          <label>Type<select value={jobForm.type} onChange={e=>setJobForm({...jobForm,type:e.target.value})}><option>FULL_TIME</option><option>PART_TIME</option><option>INTERNSHIP</option><option>CONTRACT</option><option>REMOTE</option></select></label>
          <label className="wide">Salary<input value={jobForm.salary} onChange={e=>setJobForm({...jobForm,salary:e.target.value})} placeholder="e.g. 4-6 LPA"/></label>
          <label className="wide">Description<textarea rows="5" required value={jobForm.description} onChange={e=>setJobForm({...jobForm,description:e.target.value})}/></label>
          <label className="wide">Requirements<textarea rows="4" value={jobForm.requirements} onChange={e=>setJobForm({...jobForm,requirements:e.target.value})}/></label>
        </div>
        <button className="btn btn-primary">{editingId?'Save changes':'Publish job'}</button>
      </form>

      <section className="panel">
        <div className="panel-head"><h2>All jobs</h2><span className="count-pill">{jobs.length}</span></div>
        {jobs.map(j=><div className="recruit-job" key={j.id}>
          <div><b>{j.title}</b><small>{j.company} • {j.location} • {j.active?'LIVE':'CLOSED'}</small></div>
          <div className="row-actions"><button className="btn btn-ghost" onClick={()=>startEdit(j)}>Edit</button>{j.active&&<button className="btn btn-danger" onClick={()=>closeJob(j.id)}>Close</button>}</div>
        </div>)}
        {!jobs.length&&<div className="empty">No jobs yet.</div>}
      </section>
    </div>}

    {tab==='applications' && <section className="panel">
      <div className="panel-head"><h2>All applications</h2><span className="count-pill">{applications.length}</span></div>
      <div className="table-wrap"><table><thead><tr><th>Candidate</th><th>Job</th><th>Company</th><th>Status</th><th>Applied</th><th>Manage</th></tr></thead><tbody>
        {applications.map(a=><tr key={a.id}><td><b>{a.candidate?.name}</b><br/><small>{a.candidate?.email}</small></td><td>{a.job?.title}</td><td>{a.job?.company}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td>{a.appliedAt?new Date(a.appliedAt).toLocaleDateString():'—'}</td><td><select value={a.status} onChange={e=>updateApplication(a.id,e.target.value)}><option>APPLIED</option><option>SHORTLISTED</option><option>INTERVIEW</option><option>SELECTED</option><option>REJECTED</option></select></td></tr>)}
      </tbody></table></div>
      {!applications.length&&<div className="empty">No applications yet.</div>}
    </section>}

    {tab==='users' && <section className="panel">
      <div className="panel-head"><h2>Registered users</h2><span className="count-pill">{users.length}</span></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Joined</th><th>Manage role</th></tr></thead><tbody>
        {users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><span className="tag">{u.role}</span></td><td>{u.companyName||'—'}</td><td>{u.createdAt?new Date(u.createdAt).toLocaleDateString():'—'}</td><td>{u.role==='ADMIN'?<span className="muted">Protected</span>:<select value={u.role} onChange={e=>updateRole(u.id,e.target.value)}><option value="CANDIDATE">CANDIDATE</option><option value="RECRUITER">RECRUITER</option></select>}</td></tr>)}
      </tbody></table></div>
    </section>}

    {tab==='settings' && <section className="panel" style={{maxWidth:700}}>
      <span className="eyebrow">ADMIN SECURITY</span>
      <h2>Change login ID & password</h2>
      <p className="muted">Your login ID is your admin email. Current password is required before any credential change.</p>
      <form className="form-panel" onSubmit={updateCredentials}>
        <label>Current password<input type="password" required value={credentials.currentPassword} onChange={e=>setCredentials({...credentials,currentPassword:e.target.value})}/></label>
        <label>Admin login ID / Email<input type="email" required value={credentials.newEmail} onChange={e=>setCredentials({...credentials,newEmail:e.target.value})}/></label>
        <label>New password <span className="muted">(leave blank to keep current password)</span><input type="password" minLength="8" value={credentials.newPassword} onChange={e=>setCredentials({...credentials,newPassword:e.target.value})}/></label>
        <button className="btn btn-primary">Update admin login</button>
      </form>
    </section>}
  </main>
}
