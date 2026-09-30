import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function CandidateDashboard() {
  const { user } = useAuth(); const [apps,setApps]=useState([]); const [error,setError]=useState('')
  useEffect(()=>{api('/applications/mine').then(setApps).catch(e=>setError(e.message))},[])
  return <main className="container page"><div className="page-head"><div><span className="eyebrow">CANDIDATE DASHBOARD</span><h1>Hello, {user.name}</h1><p className="muted">Track all your job applications in one place.</p></div><Link className="btn btn-primary" to="/jobs">Browse jobs</Link></div>
    {error && <div className="alert">{error}</div>}
    <div className="stats-grid"><div className="stat"><strong>{apps.length}</strong><span>Total applications</span></div><div className="stat"><strong>{apps.filter(a=>a.status==='SHORTLISTED'||a.status==='INTERVIEW').length}</strong><span>In progress</span></div><div className="stat"><strong>{apps.filter(a=>a.status==='SELECTED').length}</strong><span>Selected</span></div></div>
    <section className="panel"><div className="panel-head"><h2>My applications</h2></div>{apps.length ? <div className="table-wrap"><table><thead><tr><th>Role</th><th>Company</th><th>Location</th><th>Status</th><th>Applied</th></tr></thead><tbody>{apps.map(a=><tr key={a.id}><td>{a.job.title}</td><td>{a.job.company}</td><td>{a.job.location}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td>{new Date(a.appliedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div> : <div className="empty">No applications yet. Start exploring jobs.</div>}</section>
  </main>
}
