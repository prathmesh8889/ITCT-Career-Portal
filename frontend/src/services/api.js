const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export async function api(path, options = {}) {
  const token = localStorage.getItem('career_token')
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) throw new Error(body?.message || 'Request failed')
  return body
}
