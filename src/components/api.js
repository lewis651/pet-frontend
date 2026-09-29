const API_BASE = (import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || 'https://pet-backend-ojqz.onrender.com/api').replace(/\/+$/, '');

export async function api(path, { token, ...options } = {}) {
  // Ensure path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_BASE}${cleanPath}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
  return data;
}

export { API_BASE };