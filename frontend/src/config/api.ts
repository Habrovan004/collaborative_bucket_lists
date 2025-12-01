const API_BASE_URL = 'http://localhost:8000/api'

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL is not defined in environment variables');
  console.log('Using fallback URL for development');
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/accounts/login/`,
    REGISTER: `${API_BASE_URL}/accounts/signup/`,
    USER: `${API_BASE_URL}/accounts/user/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/accounts/password/change/`,
    LOGOUT: `${API_BASE_URL}/accounts/logout/`,
    PROFILE: `${API_BASE_URL}/accounts/profile/`,
    BUCKETS_CREATE: `${API_BASE_URL}/buckets/`,
    PROFILE_STATS: `${API_BASE_URL}/accounts/profile/stats/`,
  },
  BUCKETS: {
    LIST: `${API_BASE_URL}/buckets/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/buckets/${id}/`,
    TOGGLE_COMPLETE: (id: string | number) => `${API_BASE_URL}/buckets/${id}/toggle-complete/`,
    UPVOTE: (id: string | number) => `${API_BASE_URL}/buckets/${id}/upvote/`,
    COMMENTS: (id: string | number) => `${API_BASE_URL}/buckets/${id}/comments/`,
    DELETE_COMMENT: (id: string | number) => `${API_BASE_URL}/comments/${id}/delete/`,
  },
};

export default API_BASE_URL;