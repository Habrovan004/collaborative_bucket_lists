const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is not defined in environment variables');
  console.log('Using fallback URL for development');
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/login/`,
    REGISTER: `${API_BASE_URL}/signup/`,
    USER: `${API_BASE_URL}/user/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/password/change/`,
    LOGOUT: `${API_BASE_URL}/logout/`,
    PROFILE_STATS: `${API_BASE_URL}/profile/stats/`,
  },
};

export default API_BASE_URL;
