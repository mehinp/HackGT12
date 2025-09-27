// src/hooks/Data Management Hooks/useAPI.js
const BASE = 'http://143.215.104.239:8080'

export default function useAPI() {
  async function req(path, init = {}) {
    const res = await fetch(BASE + path, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(init.headers || {}) },
      credentials: 'omit', // avoid cookies/CORS issues
      ...init,
    })

    const ct = res.headers.get('content-type') || ''
    const data = ct.includes('application/json')
      ? await res.json().catch(() => null)
      : await res.text().catch(() => '')

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || (typeof data === 'string' && data) || `${res.status} ${res.statusText}`
      throw new Error(msg)
    }
    return data
  }

  return {
    get: (p) => req(p),
    post: (p, body) => req(p, { method: 'POST', body: JSON.stringify(body) }),
    del: (p) => req(p, { method: 'DELETE' }),
    put: (p, body) => req(p, { method: 'PUT', body: JSON.stringify(body) }),
  }
}
