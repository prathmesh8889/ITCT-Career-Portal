import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RecruiterDashboard(){
  const { user } = useAuth()

  return <main className="container page">
    <div className="page-head">
      <div>
        <span className="eyebrow">RECRUITER DASHBOARD</span>
        <h1>Recruiter account</h1>
        <p className="muted">Job posting and job management are handled only by the portal admin.</p>
      </div>
    </div>

    <section className="panel">
      <h2>{user?.companyName || user?.name || 'Recruiter'}</h2>
      <p className="muted">Recruiters cannot add, edit, close, or delete job posts. Please contact the administrator when you want a vacancy published or updated.</p>
      <div className="row-actions" style={{marginTop:16}}>
        <Link className="btn btn-primary" to="/jobs">View public jobs</Link>
      </div>
    </section>
  </main>
}
