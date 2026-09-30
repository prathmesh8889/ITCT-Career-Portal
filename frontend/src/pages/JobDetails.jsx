import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function JobDetails() {
  const { id } = useParams(); const { user } = useAuth(); const navigate = useNavigate()
  const [job,setJob]=useState(null); const [coverLetter,setCoverLetter]=useState(''); const [msg,setMsg]=useState(''); const [error,setError]=useState('')
  useEffect(()=>{api(`/jobs/${id}`).then(setJob).catch(e=>setError(e.message))},[id])
  const apply = async () => {
    if (!user) return navigate('/login')
    if (user.role !== 'CANDIDATE') return setError('Only candidate accounts can apply for jobs.')
    try { await api('/applications',{method:'POST',body:JSON.stringify({jobId:Number(id),coverLetter})}); setMsg('Application submitted successfully!'); setError('') }
    catch(e){ setError(e.message) }
  }
  if (!job) return <main className="container page">{error || 'Loading...'}</main>
  return <main className="container page"><Link to="/jobs" className="back">← Back to jobs</Link>
    <div className="details-grid"><section className="detail-card"><span className="tag">{job.type.replaceAll('_',' ')}</span><h1>{job.title}</h1><p className="company-line">{job.company} • {job.location}</p><div className="salary-box"><small>Salary / compensation</small><strong>{job.salary || 'Not disclosed'}</strong></div>
    <h3>About the role</h3><p className="preline">{job.description}</p><h3>Requirements</h3><p className="preline">{job.requirements || 'See role description for requirements.'}</p></section>
    <aside className="apply-card"><h3>Apply for this role</h3><p>Add a short note to the recruiter.</p>{msg && <div className="success">{msg}</div>}{error && <div className="alert">{error}</div>}<textarea rows="7" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} placeholder="Why are you a good fit?"/><button className="btn btn-primary btn-lg full" onClick={apply}>Apply now</button></aside></div>
  </main>
}
