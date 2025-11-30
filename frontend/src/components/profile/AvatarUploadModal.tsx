import { FC } from 'react';

interface AvatarUploadModalProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const AvatarUploadModal: FC<AvatarUploadModalProps> = ({ onCancel, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-lg">
        <h3 className="text-xl font-bold mb-4">Change Profile Picture</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-600">Upload a new profile picture</p>
            <input 
              type="file" 
              accept="image/*" 
              className="mt-4 mx-auto block"
              onChange={(e) => console.log('File selected:', e.target.files?.[0])}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSuccess}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;