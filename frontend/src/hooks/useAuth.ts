import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
  user?: any;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify({ username: data.username, id: data.id }));
        
        return { success: true, token: data.access, user: data };
      } else {
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check if backend is running.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string }): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          re_password: userData.password, 
          first_name: '', 
          last_name: '',
          location: ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        // Handle Django validation errors
        const errorMessage = data.errors ? Object.values(data.errors).flat().join(', ') : data.detail || 'Registration failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please check if backend is running.' };
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading };
};