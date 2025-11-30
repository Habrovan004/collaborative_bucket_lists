import { FC, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileActions from "../components/profile/ProfileActions";
import PasswordChangeForm from "../components/profile/PasswordChangeForm";
import EditProfileForm from "../components/profile/EditProfileForm";
import AvatarUploadModal from "../components/profile/AvatarUploadModal";
import { useProfile } from "../hooks/useProfile";


const Profile: FC = () => {
  const { user, stats, loading, error, refetch } = useProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleEditProfile = () => setShowEditModal(true);
  const handleChangePassword = () => setShowPasswordModal(true);
  const handleAvatarChange = () => setShowAvatarModal(true);

  const handleEditSuccess = () => {
    setShowEditModal(false);
    refetch();
  };

  const handlePasswordSuccess = () => setShowPasswordModal(false);
  const handleAvatarSuccess = () => {
    setShowAvatarModal(false);
    refetch();
  };

  
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <ErrorMessage message="No user data found" />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <ProfileHeader 
          user={user} 
          onEdit={handleEditProfile}
          onAvatarChange={handleAvatarChange}
        />
        
        <ProfileStats {...( { stats: stats || { bucketItems: 0, completed: 0, activeGoals: 0 } } as any)} />
        
        <ProfileActions 
          onEditProfile={handleEditProfile}
          onChangePassword={handleChangePassword}
        />
      </div>

      {/* Modals */}
      {showEditModal && (
        <Modal>
          <EditProfileForm
            onCancel={() => setShowEditModal(false)}
            onSuccess={handleEditSuccess}
            user={user}
          />
        </Modal>
      )}

      {showPasswordModal && (
        <Modal>
          <PasswordChangeForm
            onCancel={() => setShowPasswordModal(false)}
            onSuccess={handlePasswordSuccess}
          />
        </Modal>
      )}

      {showAvatarModal && (
        <AvatarUploadModal
          onCancel={() => setShowAvatarModal(false)}
          onSuccess={handleAvatarSuccess}
        />
      )}
    </div>
  );
};

// Simple Error message component used when profile loading fails
const ErrorMessage: FC<{ message: string }> = ({ message }) => (
  <div className="max-w-md mx-auto text-center text-red-700 bg-red-50 border border-red-100 p-4 rounded-md">
    {message}
  </div>
);

// Reusable Modal Wrapper
const Modal: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-lg">
      {children}
    </div>
  </div>
);

export default Profile;