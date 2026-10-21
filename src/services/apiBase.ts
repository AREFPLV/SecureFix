/**
 * API base for chat, live chat, and reviews.
 * Local Vite proxies /api → :3001.
 * On a static host, set VITE_API_BASE_URL to your Node API origin (no trailing slash).
 */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || ''
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function readApiJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  const trimmed = text.trim()
  if (!trimmed) {
    throw new Error('Empty response from the chat server')
  }
  if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
    throw new Error(
      'Chat API is not running on this host. Live team chat needs the SecureFix Node server (npm run start:api), or set VITE_API_BASE_URL to your API URL.',
    )
  }
  try {
    return JSON.parse(trimmed) as T
  } catch {
    throw new Error('Chat server returned an invalid response')
  }
}
