/**
 * Authentication Hook
 * Provides user authentication state and methods
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // This would typically call your auth API
        // For now, we'll check localStorage
        const userStr = typeof window !== 'undefined' 
          ? localStorage.getItem('user') 
          : null;
        
        if (userStr) {
          setAuthState({
            user: JSON.parse(userStr),
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        setAuthState({
          user: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Auth check failed',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      // Call your auth API
      // const user = await api.login(email, password);
      // For demo:
      const user: User = { id: '1', email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(user));
      setAuthState({
        user,
        loading: false,
        error: null,
      });
      return user;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Login failed';
      setAuthState(prev => ({ ...prev, loading: false, error }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
      error: null,
    });
    router.push('/auth/login');
  };

  return {
    ...authState,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
}
