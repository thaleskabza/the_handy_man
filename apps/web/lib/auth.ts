/**
 * Auth helpers for the web app
 * Wraps the custom JWT backend
 */

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  // Session cookie lets the middleware protect routes server-side
  document.cookie = `handyman_session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export function clearTokens() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  document.cookie = 'handyman_session=; path=/; max-age=0'
}

export function isLoggedIn(): boolean {
  return !!getAccessToken()
}

/** Authenticated fetch — auto-attaches Bearer token */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessToken()
  return fetch(`${BACKEND}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })
}

export async function logout() {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {})
  }
  clearTokens()
  window.location.href = '/auth/login'
}
