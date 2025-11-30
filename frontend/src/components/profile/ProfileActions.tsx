import type { FC } from 'react';

interface ProfileActionsProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
}

const ProfileActions: FC<ProfileActionsProps> = ({ 
  onEditProfile, 
  onChangePassword 
}) => {
  return (
    <div className="mt-6 space-y-4">
      <button 
        onClick={onEditProfile}
        className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md text-left transition-shadow"
      >
        <h3 className="font-semibold">✏️ Edit Profile</h3>
        <p className="text-gray-500 text-sm">Update your personal information</p>
      </button>

      <button 
        onClick={onChangePassword}
        className="w-full bg-white p-4 rounded-xl shadow-sm hover:shadow-md text-left transition-shadow"
      >
        <h3 className="font-semibold">🔒 Change Password</h3>
        <p className="text-gray-500 text-sm">Update your password</p>
      </button>
    </div>
  );
};

export default ProfileActions;