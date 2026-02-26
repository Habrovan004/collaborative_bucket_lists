import { FC, useState, useEffect } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import EditProfileModal from "../components/profile/EditProfileForm";
import { API_ENDPOINTS } from "../config/api";
import axiosClient from "../config/axiosClients";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  location: string;
  bio?: string;
  avatar?: string;
}

const Profile: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ bucketItems: 0, completed: 0, activeGoals: 0 });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/auth';
        return;
      }

      // Fetch user profile
      const userRes = await axiosClient.get(API_ENDPOINTS.AUTH.PROFILE);
      const userData = userRes.data;
      setUser({
        id: String(userData.id || userData.user || '1'),
        username: userData.username || '',
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        location: userData.location || '',
        bio: userData.bio || '',
        avatar: userData.avatar || userData.profile_picture
      });

      // Fetch bucket stats
      const bucketsRes = await axiosClient.get(API_ENDPOINTS.BUCKETS.LIST);
      const data = bucketsRes.data;
      const buckets = Array.isArray(data) ? data : (data.results || []);
      // Filter to only show buckets owned by current user
      const userStr = localStorage.getItem('user');
      const storedUser = userStr ? JSON.parse(userStr) : null;
      const myBuckets = buckets.filter((b: any) => b.is_owner || b.owner === storedUser?.username);
      const completed = myBuckets.filter((b: any) => b.is_completed).length;
      const bucketItems = myBuckets.length;
      setStats({
        bucketItems,
        completed,
        activeGoals: bucketItems - completed
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const res = await axiosClient.patch(API_ENDPOINTS.AUTH.PROFILE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      setUser({ ...user, avatar: data.avatar || data.profile_picture });
      fetchProfileData(); // Refresh to get updated data
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar');
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-10 sm:py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full flex items-center justify-center p-4 py-10 sm:py-16">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No profile data</h2>
          <button onClick={() => window.location.href = '/auth'} className="bg-purple-500 text-white px-6 py-2 rounded-lg">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Back Button Header */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-gray-800">Profile</h1>
        </div>
      </div>

      <div className="py-4 sm:py-6 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          <ProfileHeader 
            user={user} 
            onEdit={() => setShowEditModal(true)}
            onAvatarChange={handleAvatarUpload}
          />
          
          <ProfileStats stats={stats} />
          

          <button onClick={() => {
            localStorage.clear();
            window.location.href = '/auth';
          }} className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3.5 sm:p-4 rounded-xl font-semibold shadow hover:shadow-lg">
            Logout
          </button>
        </div>
      </div>

      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchProfileData();
          }}
        />
      )}
    </div>
  );
};

export default Profile;