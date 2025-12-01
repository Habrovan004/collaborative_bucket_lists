import { useState, useEffect } from 'react';
import { X, Trophy, Image as ImageIcon, Loader2 } from 'lucide-react';

// Define or import the Activity type
// Example definition (adjust fields as needed):
export interface Activity {
  id: string;
  title: string;
  experienceNote?: string;
  experienceImage?: string;
}

interface ShareExperienceModalProps {
  activity: Activity;
  onClose: () => void;
  onShare: (id: string, experienceNote: string, experienceImage?: string) => Promise<void> | void;
  isLoading?: boolean;
}

export function ShareExperienceModal({ 
  activity, 
  onClose, 
  onShare,
  isLoading = false 
}: ShareExperienceModalProps) {
  const [experienceNote, setExperienceNote] = useState(activity.experienceNote || '');
  const [experienceImage, setExperienceImage] = useState(activity.experienceImage || '');

  // Sync if activity changes (e.g. reopened)
  useEffect(() => {
    setExperienceNote(activity.experienceNote || '');
    setExperienceImage(activity.experienceImage || '');
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const note = experienceNote.trim();
    if (!note) {
      alert("Please share your experience!");
      return;
    }

    try {
      await onShare(activity.id, note, experienceImage || undefined);
      onClose();
    } catch (err) {
      console.error("Failed to mark complete:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Trophy className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Achievement Unlocked!</h2>
              <p className="text-sm text-gray-600">Share your amazing experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110 disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Activity Card Preview */}
          <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <p className="text-sm font-medium text-purple-700 mb-1">You completed:</p>
            <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
          </div>

          {/* Experience Note */}
          <div>
            <label htmlFor="experience-note" className="block text-sm font-semibold text-gray-700 mb-3">
              Tell the world how it felt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="experience-note"
              value={experienceNote}
              onChange={(e) => setExperienceNote(e.target.value)}
              placeholder="The view from the top was breathtaking... I cried happy tears when I finally stood there after years of dreaming!"
              rows={6}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base leading-relaxed placeholder-gray-400 transition-all"
              required
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-gray-500">
              {experienceNote.length}/500 characters
            </p>
          </div>

          {/* Experience Image */}
          <div>
            <label htmlFor="experience-image" className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                Proof Photo <span className="font-normal text-gray-500">(optional)</span>
              </span>
            </label>
            <input
              id="experience-image"
              type="url"
              value={experienceImage}
              onChange={(e) => setExperienceImage(e.target.value)}
              placeholder="https://yourphoto.com/amazing-moment.jpg"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base placeholder-gray-400 transition-all"
              disabled={isLoading}
            />

            {/* Live Preview */}
            {/* {experienceImageExperience && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-dashed border-gray-200">
                  <img
                    src={experienceImage}
                    alt="Your experience"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                          <span class="text-center px-4">Invalid image URL</span>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>
            )} */}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !experienceNote.trim()}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-3 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Mark as Complete & Share
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}