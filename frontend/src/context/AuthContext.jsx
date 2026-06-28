import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin } from '../api/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'stayease_token';
const USER_KEY = 'stayease_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMe();
        setUser(data);
        localStorage.setItem(USER_KEY, JSON.stringify(data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const persistAuth = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  };

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    persistAuth(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const { data } = await apiRegister({ name, email, password, phone });
    persistAuth(data);
    return data;
  };

  const googleLogin = async (idToken) => {
    const { data } = await apiGoogleLogin({ idToken });
    persistAuth(data);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
