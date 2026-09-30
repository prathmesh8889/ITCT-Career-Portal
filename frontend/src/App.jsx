import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App(){return <BrowserRouter><AuthProvider><Navbar/><Routes>
  <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/jobs" element={<Jobs/>}/><Route path="/jobs/:id" element={<JobDetails/>}/>
  <Route path="/candidate" element={<ProtectedRoute roles={['CANDIDATE']}><CandidateDashboard/></ProtectedRoute>}/>
  <Route path="/recruiter" element={<ProtectedRoute roles={['RECRUITER','ADMIN']}><RecruiterDashboard/></ProtectedRoute>}/>
  <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard/></ProtectedRoute>}/>
  <Route path="*" element={<Home/>}/>
</Routes></AuthProvider></BrowserRouter>}
