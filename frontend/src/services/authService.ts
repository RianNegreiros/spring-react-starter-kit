import { extractErrorMessage, parseJsonSafe } from '@/lib/errorHandler'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar_url?: string
}

const API_URL = import.meta.env.VITE_API_URL

function mapUserData(data: any): User {
  return {
    id: data.id || data.userId || data.sub,
    email: data.email,
    firstName: data.firstName || data.given_name || data.name || '',
    lastName: data.lastName || data.family_name || '',
    avatar_url: data.avatarUrl || data.avatar_url || data.picture,
  }
}

async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiCall('/auth/current')

    if (response.ok) {
      const data = await response.json()
      return mapUserData(data.data || data)
    }

    if (response.status === 401) {
      return null
    }

    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(`Failed to fetch user: ${errorMessage}`)
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

export async function login(email: string, password: string): Promise<User> {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(errorMessage)
  }

  const data = await response.json()
  return mapUserData(data.data || data)
}

export async function register(
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<void> {
  const response = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, firstName, lastName, password }),
  })

  if (!response.ok) {
    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(errorMessage)
  }
}

export async function logout(): Promise<void> {
  try {
    await apiCall('/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('logout error:', error)
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await apiCall('/user/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(errorMessage)
  }
}

export async function validateResetCode(
  email: string,
  code: string
): Promise<void> {
  const response = await apiCall('/user/password/validate-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })

  if (!response.ok) {
    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(errorMessage)
  }
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const response = await apiCall('/user/password/reset', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  })

  if (!response.ok) {
    const errorData = await parseJsonSafe(response)
    const errorMessage = extractErrorMessage(errorData)
    throw new Error(errorMessage)
  }
}
