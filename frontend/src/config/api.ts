const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/accounts';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/login/`,
    REGISTER: `${API_BASE_URL}/signup/`,
    PROFILE: `${API_BASE_URL}/profile/`,
    PROFILE_STATS: `${API_BASE_URL}/profile/stats/`,
    LOGOUT: `${API_BASE_URL}/logout/`,
  },
};

export default API_BASE_URL;