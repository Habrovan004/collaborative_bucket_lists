import React, { FC, useState, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface PasswordChangeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const PasswordChangeForm: FC<PasswordChangeFormProps> = ({ onCancel, onSuccess }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("❌ Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      if (!(auth as any).changePassword) {
        setError("❌ Password change not available");
      } else {
        const result = await (auth as any).changePassword(passwordData);
        if (result.success) {
          onSuccess();
        } else {
          setError(`❌ ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      setError("❌ Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Confirm new password"
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
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
  );
};

export default PasswordChangeForm;