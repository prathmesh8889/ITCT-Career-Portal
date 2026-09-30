import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([]); const [q, setQ] = useState(''); const [type, setType] = useState('ALL'); const [error, setError] = useState('')
  useEffect(()=>{ api('/jobs').then(setJobs).catch(e=>setError(e.message)) },[])
  const filtered = useMemo(()=>jobs.filter(j => {
    const hay = `${j.title} ${j.company} ${j.location}`.toLowerCase()
    return hay.includes(q.toLowerCase()) && (type === 'ALL' || j.type === type)
  }),[jobs,q,type])
  return <main className="container page">
    <div className="page-head"><div><span className="eyebrow">OPPORTUNITIES</span><h1>Find the right job</h1></div><span className="count-pill">{filtered.length} openings</span></div>
    <div className="filters"><input placeholder="Search title, company, location..." value={q} onChange={e=>setQ(e.target.value)}/><select value={type} onChange={e=>setType(e.target.value)}><option value="ALL">All types</option><option>FULL_TIME</option><option>PART_TIME</option><option>INTERNSHIP</option><option>CONTRACT</option><option>REMOTE</option></select></div>
    {error && <div className="alert">{error}</div>}
    <div className="jobs-grid">{filtered.map(j=><Link to={`/jobs/${j.id}`} className="job-card" key={j.id}>
      <div className="job-top"><div className="company-avatar">{j.company?.[0] || 'C'}</div><span className="tag">{j.type.replaceAll('_',' ')}</span></div>
      <h3>{j.title}</h3><p className="muted">{j.company}</p><div className="job-meta"><span>⌖ {j.location}</span><span>₹ {j.salary || 'Not disclosed'}</span></div><div className="job-foot"><span>View details</span><strong>→</strong></div>
    </Link>)}</div>
    {!filtered.length && <div className="empty">No jobs match your filters.</div>}
  </main>
}
