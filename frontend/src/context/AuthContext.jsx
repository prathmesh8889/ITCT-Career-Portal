import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('career_user')) } catch { return null }
  })

  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    localStorage.setItem('career_token', data.token)
    localStorage.setItem('career_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const register = async (payload) => {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
    localStorage.setItem('career_token', data.token)
    localStorage.setItem('career_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('career_token')
    localStorage.removeItem('career_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
