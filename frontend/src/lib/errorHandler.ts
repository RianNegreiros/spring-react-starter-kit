export function hasAuthToken(): boolean {
  const cookies = document.cookie.split(';').map((c) => c.trim())
  return cookies.some((cookie) => {
    const cookieName = cookie.split('=')[0].toLowerCase()
    return (
      cookieName.includes('auth') ||
      cookieName.includes('jwt') ||
      cookieName.includes('token') ||
      cookieName.includes('session') ||
      cookieName === 'jsessionid' ||
      cookieName.includes('oauth')
    )
  })
}

export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (!error || typeof error !== 'object') return 'An unexpected error occurred'

  const { message, error: errorField } = error
  if (typeof message === 'string') return message
  if (typeof errorField === 'string') return errorField

  return 'An unexpected error occurred'
}

export async function parseJsonSafe(response: Response): Promise<any> {
  try {
    return await response.json()
  } catch {
    return { message: `HTTP ${response.status}: ${response.statusText}` }
  }
}

export function validateFile(
  file: File,
  { maxSizeMB = 5, allowedTypes = ['image/*'] } = {}
): string | null {
  const maxBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    return `File size exceeds ${maxSizeMB}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
  }

  const isValid = allowedTypes.some((type) =>
    type === 'image/*' ? file.type.startsWith('image/') : file.type === type
  )

  if (!isValid) {
    return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
  }

  return null
}
