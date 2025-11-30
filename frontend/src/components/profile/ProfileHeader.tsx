import type { FC } from 'react';

interface User {
  username: string;
  email: string;
  location: string;
  bio?: string;
  avatar?: string;
}

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
  onAvatarChange: () => void;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, onEdit, onAvatarChange }) => {
  return (
    <>
      {/* Gradient header */}
      <div className="w-full h-40 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 relative">
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          ✏️
        </button>
      </div>

      {/* Profile card */}
      <div className="bg-white p-6 rounded-xl shadow-md -mt-12 relative z-10">
        <div className="flex items-center gap-5">
          {/* Profile Picture with Camera Icon */}
          <div className="relative">
            <div className="bg-gray-200 p-4 rounded-full">
              <div className="w-12 h-12 text-gray-700 flex items-center justify-center">
                👤
              </div>
            </div>
            <button 
              onClick={onAvatarChange}
              className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full shadow-md hover:bg-blue-600 transition-colors"
            >
              📷
            </button>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="text-gray-500">{user.bio}</p>

            {/* Email + Location */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <span>📧</span>
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <span>📍</span>
                {user.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;