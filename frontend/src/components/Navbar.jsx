import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const dashboard = user?.role === 'ADMIN' ? '/admin' : user?.role === 'RECRUITER' ? '/recruiter' : '/candidate'

  return <header className="navbar">
    <div className="container nav-inner">
      <Link className="brand" to="/"><span>CB</span> CareerBridge</Link>
      <nav>
        <NavLink to="/jobs">Find Jobs</NavLink>
        {user && <NavLink to={dashboard}>Dashboard</NavLink>}
      </nav>
      <div className="nav-actions">
        {!user ? <>
          <Link className="btn btn-ghost" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/register">Get Started</Link>
        </> : <>
          <span className="user-chip">{user.name}</span>
          <button className="btn btn-ghost" onClick={() => { logout(); navigate('/') }}>Logout</button>
        </>}
      </div>
    </div>
  </header>
}
