import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user data
          const response = await api.get<User>('/usuario/me');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signIn = async ({ email, senha }: LoginRequest) => {
    // Backend expects 'Email' and 'Senha'
    const response = await api.post<AuthResponse>('/auth/login', { email, senha });
    const { token, refreshToken, ...userData } = response.data; 
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    // Map flat response to User object
    // Or just fetch /usuario/me to be consistent
    api.defaults.headers.Authorization = `Bearer ${token}`;
    
    // We can use the data from login response too
    setUser({
      id: userData.id,
      email: userData.email,
      login: userData.login,
      nivel: userData.nivel,
    });
  };

  const signUp = async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
     const { token, refreshToken, ...userData } = response.data;
     
     localStorage.setItem('token', token);
     localStorage.setItem('refreshToken', refreshToken);
     api.defaults.headers.Authorization = `Bearer ${token}`;

     setUser({
      id: userData.id,
      email: userData.email,
      login: userData.login,
      nivel: userData.nivel,
    });
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
