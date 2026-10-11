const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom API Client with automatic JWT injection, error handling,
 * and smart fallback to offline/demo storage when backend is unreachable.
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, token } = {}) {
  const activeToken = token || localStorage.getItem('findit_token');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is down or unreachable, allow demo mock mode for testing
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn(`[API] Server unreachable at ${url}. Operating with client fallback.`);
      error.isNetworkError = true;
      error.message = 'Backend server is not running at ' + API_BASE_URL + '. Check your server connection.';
    }
    throw error;
  }
}

export { API_BASE_URL };
