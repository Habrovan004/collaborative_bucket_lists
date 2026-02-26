import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface User {
  id: string;
  username: string;
  email: string;
  location: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
}

interface UserStats {
  bucketItems: number;
  completed: number;
  activeGoals: number;
}

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.AUTH.USER, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setError(null);
      } else if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem('access_token');
      } else {
        setError("Failed to load user data.");
      }
    } catch (error) {
      setError("Network error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch(API_ENDPOINTS.AUTH.PROFILE_STATS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchUserData();
    fetchUserStats();
  };

  return { user, stats, loading, error, refetch };
};