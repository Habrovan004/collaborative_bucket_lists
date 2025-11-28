import React, { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import { UserIcon, EnvelopeIcon, MapPinIcon, CameraIcon, PencilIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface UserStats {
  username: string;
  email: string;
  location: string;
  bucketItems: number;
  completed: number;
  activeGoals: number;
  bio?: string;
  phone?: string;
  website?: string;
}

const Profile: FC = () => {
  const { user: authUser, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<UserStats>({
    username: authUser?.username || "Current User",
    email: authUser?.email || "user@example.com",
    location: authUser?.location || "San Francisco, CA",
    bucketItems: 12,
    completed: 5,
    activeGoals: 7,
    bio: authUser?.bio || "Adventure seeker and dream chaser ✨",
    phone: authUser?.phone || "+1 (555) 123-4567",
    website: authUser?.website || "https://myportfolio.com"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [editData, setEditData] = useState({
    username: user.username,
    email: user.email,
    location: user.location,
    bio: user.bio,
    phone: user.phone,
    website: user.website
  });

  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        username: authUser.username,
        email: authUser.email,
        location: authUser.location || prev.location,
        bio: authUser.bio || prev.bio,
        phone: authUser.phone || prev.phone,
        website: authUser.website || prev.website
      }));
      
      setEditData({
        username: authUser.username,
        email: authUser.email,
        location: authUser.location || user.location,
        bio: authUser.bio || user.bio,
        phone: authUser.phone || user.phone,
        website: authUser.website || user.website
      });
    }
  }, [authUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handlePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      username: user.username,
      email: user.email,
      location: user.location,
      bio: user.bio,
      phone: user.phone,
      website: user.website
    });
  };

  const handleCancelPassword = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setMessage("");
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePic(event.target.result as string);
          setMessage("🎉 Profile picture updated successfully!");
          setTimeout(() => setMessage(""), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      setTimeout(() => {
        setUser(prev => ({
          ...prev,
          ...editData
        }));
        setMessage("✅ Profile updated successfully!");
        setIsEditing(false);
        setLoading(false);
        setTimeout(() => setMessage(""), 3000);
      }, 1000);
    } catch (error) {
      setMessage("❌ Failed to update profile");
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("❌ Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordData);
      if (result.success) {
        setMessage("✅ Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setIsChangingPassword(false);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setMessage("❌ Failed to change password");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center group-hover:shadow-md transition-shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="ml-2 font-medium">Back</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✅") || message.includes("🎉") 
              ? "bg-green-100 border border-green-300 text-green-700" 
              : "bg-red-100 border border-red-300 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <h1 className="text-3xl font-bold text-purple-800 mb-6">Profile</h1>

        {/* Gradient header - Using solid color instead of gradient */}
        <div className="w-full h-40 rounded-xl bg-purple-600 relative">
          <button 
            onClick={handleProfilePicClick}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <CameraIcon className="w-5 h-5 text-purple-600" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>

        {/* Profile card */}
        <div className="bg-white p-6 rounded-xl shadow-lg -mt-12 relative z-10 border border-gray-100">

          <div className="flex items-center gap-5">
            <div className="relative">
              {/* Using solid colors instead of gradients */}
              <div className="bg-purple-500 p-1 rounded-full">
                <div className="bg-white p-1 rounded-full">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-purple-600" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Username"
                  />
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleEditChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                  <p className="text-gray-600">{user.bio}</p>
                </>
              )}

              {/* Email + Location */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Email"
                    />
                  ) : (
                    user.email
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editData.location}
                      onChange={handleEditChange}
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      placeholder="Location"
                    />
                  ) : (
                    user.location
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{user.bucketItems}</p>
              <p className="text-gray-500 text-sm">Bucket List Items</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{user.completed}</p>
              <p className="text-gray-500 text-sm">Completed</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user.activeGoals}</p>
              <p className="text-gray-500 text-sm">Active Goals</p>
            </div>
          </div>

          {/* Edit/Save Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {/* Using solid color instead of gradient */}
              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Additional Sections */}
        <div className="mt-6 space-y-4">
          {!isEditing && !isChangingPassword && (
            <>
              <button 
                onClick={handleEditClick}
                className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PencilIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Edit Profile</h3>
                    <p className="text-gray-500 text-sm">Update your personal information</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={handlePasswordClick}
                className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LockClosedIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Change Password</h3>
                    <p className="text-gray-500 text-sm">Update your password</p>
                  </div>
                </div>
              </button>
            </>
          )}

          {/* Change Password Form */}
          {isChangingPassword && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {/* Using solid color instead of gradient */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;