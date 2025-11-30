const API_BASE_URL = 'http://localhost:8000/api';

// Generic API call function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),

  register: (userData: { username: string; email: string; password: string }) =>
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),

  getProfile: () => apiCall('/auth/me'),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    apiCall('/auth/change-password', { method: 'POST', body: JSON.stringify(passwords) }),
};

// User API calls
export const userAPI = {
  getProfile: () => apiCall('/user/profile'),
  updateProfile: (profileData: any) =>
    apiCall('/user/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  
  getStats: () => apiCall('/user/stats'),
  uploadAvatar: (formData: FormData) =>
    apiCall('/user/upload-avatar', { 
      method: 'POST', 
      body: formData,
      headers: {} 
    }),
};