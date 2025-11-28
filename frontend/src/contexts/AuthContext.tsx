import React, { createContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  bio?: string;
  location?: string;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type PasswordData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

type AuthResult = {
  success: boolean;
  error?: string;
};

type AuthContextType = {
  user: User | null;
  login: (data: LoginData) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  changePassword: (data: PasswordData) => Promise<AuthResult>;
  loading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ==================== BACKEND INTEGRATION: Check Authentication ====================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // TODO: Replace with actual backend API call
          // UNCOMMENT WHEN BACKEND IS READY:
          /*
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            throw new Error('Token invalid');
          }
          */
          
          // CURRENT MOCK IMPLEMENTATION - DELETE WHEN BACKEND READY
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // ==================== BACKEND INTEGRATION: Login ====================
      // TODO: Replace with actual backend API call
      // UNCOMMENT WHEN BACKEND IS READY:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const { token, user } = result;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Login failed' };
      }
      */
      
      // CURRENT MOCK IMPLEMENTATION - DELETE WHEN BACKEND READY
      if (data.username && data.password) {
        const mockUser: User = {
          id: '1',
          username: data.username,
          email: `${data.username}@example.com`,
          fullName: data.username,
          bio: '🌟 Dreamer & Adventurer 🌟',
          location: 'Somewhere in the world'
        };
        
        const mockToken = 'mock-jwt-token';
        
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // ==================== BACKEND INTEGRATION: Register ====================
      // TODO: Replace with actual backend API call
      // UNCOMMENT WHEN BACKEND IS READY:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        const { token, user } = result;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Registration failed' };
      }
      */
      
      // CURRENT MOCK IMPLEMENTATION - DELETE WHEN BACKEND READY
      const mockUser: User = {
        id: '1',
        username: data.username,
        email: data.email,
        fullName: data.username,
        bio: '🌟 Dreamer & Adventurer 🌟',
        location: 'Somewhere in the world'
      };
      
      const mockToken = 'mock-jwt-token';
      
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    // ==================== BACKEND INTEGRATION: Logout ====================
    // TODO: Call backend logout if needed
    /*
    fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    */
    
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const changePassword = async (data: PasswordData): Promise<AuthResult> => {
    try {
      setLoading(true);
      
      // ==================== BACKEND INTEGRATION: Change Password ====================
      // TODO: Replace with actual backend API call
      // UNCOMMENT WHEN BACKEND IS READY:
      /*
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Password change failed' };
      }
      */
      
      // CURRENT MOCK IMPLEMENTATION - DELETE WHEN BACKEND READY
      if (data.newPassword === data.confirmPassword) {
        return { success: true };
      } else {
        return { success: false, error: 'Passwords do not match' };
      }
    } catch (error) {
      return { success: false, error: 'Password change failed' };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    changePassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};