import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function AdminDashboard(){
  const [stats,setStats]=useState({}); const [users,setUsers]=useState([]); const [error,setError]=useState('')
  useEffect(()=>{Promise.all([api('/admin/stats'),api('/admin/users')]).then(([s,u])=>{setStats(s);setUsers(u)}).catch(e=>setError(e.message))},[])
  return <main className="container page"><div className="page-head"><div><span className="eyebrow">ADMIN CONTROL CENTER</span><h1>Portal overview</h1></div></div>{error&&<div className="alert">{error}</div>}
    <div className="stats-grid admin-stats">{[['Users',stats.users],['Candidates',stats.candidates],['Recruiters',stats.recruiters],['Active jobs',stats.activeJobs],['Applications',stats.applications]].map(([k,v])=><div className="stat" key={k}><strong>{v??0}</strong><span>{k}</span></div>)}</div>
    <section className="panel"><div className="panel-head"><h2>Registered users</h2><span className="count-pill">{users.length}</span></div><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Joined</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><span className="tag">{u.role}</span></td><td>{u.companyName||'—'}</td><td>{u.createdAt?new Date(u.createdAt).toLocaleDateString():'—'}</td></tr>)}</tbody></table></div></section>
  </main>
}
