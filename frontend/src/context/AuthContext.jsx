import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../services/resources.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token')); // restoring a session?

  // On first load, restore the session from the stored token.
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    authApi
      .me()
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  // The Axios interceptor fires this event when the API answers 401.
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const startSession = (res) => {
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user.data ?? res.data.user);
  };

  const login = useCallback(async (credentials) => startSession(await authApi.login(credentials)), []);
  const register = useCallback(async (data) => startSession(await authApi.register(data)), []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* token may already be invalid: still log out locally */
    }
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
