import { createContext, useContext, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //current user: pulls from browser localStorage
  const [user, setUser] = useState(() => { 
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  //store current user in localStorage
  const saveSession = ({ token, user }) => { 
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  //login: send credentials to backend and saves session if successful
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
  };

  //register: send new user info to backend and saves session if successful
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveSession(data);
  };

  //logout clear session data from local storage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);