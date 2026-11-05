import axios from 'axios';

// One Axios instance for the whole app: base URL + token interceptors.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 anywhere (expired/revoked token) logs the user out; the route guard then redirects to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

/** Laravel 422 errors -> { field: 'first message' } */
export const fieldErrors = (error) =>
  Object.fromEntries(
    Object.entries(error.response?.data?.errors || {}).map(([field, messages]) => [field, messages[0]])
  );

export const errorMessage = (error) =>
  error.response?.data?.message ||
  (error.request && !error.response ? 'Cannot reach the server. Check your connection.' : 'Something went wrong. Please try again.');

export default api;
