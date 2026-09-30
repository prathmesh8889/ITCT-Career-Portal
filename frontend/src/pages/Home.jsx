import { Link } from 'react-router-dom'

export default function Home() {
  return <>
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">CAREER PORTAL • JOBS • INTERNSHIPS</span>
          <h1>Your next opportunity starts <em>right here.</em></h1>
          <p>Discover verified jobs and internships, apply in minutes, and track every application from one clean dashboard.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/jobs">Explore Jobs</Link>
            <Link className="btn btn-secondary btn-lg" to="/register">Create Profile</Link>
          </div>
          <div className="trust-row"><span>✓ Candidate dashboard</span><span>✓ Recruiter tools</span><span>✓ Live status tracking</span></div>
        </div>
        <div className="hero-card">
          <div className="mini-head"><b>Trending opportunities</b><span>Live</span></div>
          {['Frontend Developer', 'Java Backend Intern', 'UI/UX Designer'].map((x, i) => <div className="trend" key={x}>
            <div className="logo-dot">{['F','J','U'][i]}</div><div><b>{x}</b><small>{['Pune • Full Time','Nagpur • Internship','Remote • Full Time'][i]}</small></div><strong>→</strong>
          </div>)}
        </div>
      </div>
    </section>
    <section className="container section">
      <div className="section-title"><span>ONE PORTAL, THREE EXPERIENCES</span><h2>Built for candidates, recruiters and admins</h2></div>
      <div className="feature-grid">
        <article className="feature"><div>01</div><h3>Candidate</h3><p>Search jobs, apply, save your profile and follow each application status.</p></article>
        <article className="feature"><div>02</div><h3>Recruiter</h3><p>Post openings, review applicants and move candidates through hiring stages.</p></article>
        <article className="feature"><div>03</div><h3>Admin</h3><p>Monitor users, recruiters, jobs and portal activity from one control center.</p></article>
      </div>
    </section>
  </>
}
