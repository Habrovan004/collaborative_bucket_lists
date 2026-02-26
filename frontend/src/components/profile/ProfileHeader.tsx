import type { FC } from 'react';

interface User {
  username: string;
  email: string;
  location: string;
  bio?: string;
  avatar?: string;
  first_name: string;
  last_name: string;
}

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
  onAvatarChange: (file: File) => void;
}

const ProfileHeader: FC<ProfileHeaderProps> = ({ user, onEdit, onAvatarChange }) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange(file);
  };

  const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${fullName}&background=667eea&color=fff`;

  return (
    <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
      {/* Gradient Header with Edit Pencil */}
      <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 relative">
        <button 
          onClick={onEdit}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg"
          title="Edit Profile"
        >
          ✏️
        </button>
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6 -mt-12">
        <div className="flex items-start gap-4">
          {/* Avatar on left */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={avatarSrc}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              📷
            </label>
          </div>

          {/* User info on right */}
          <div className="flex-1 pt-12">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-gray-600">{user.username}</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span>📧</span>
                <span>{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            {user.bio && (
              <p className="text-gray-700 mt-4">{user.bio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;