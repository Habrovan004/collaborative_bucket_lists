import { useState } from 'react';
import { Heart, MessageCircle, Calendar, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from "../components/ImageWithFallBack"
import { CommentSection } from './CommentSection';

// Define the Activity type if not imported from elsewhere
export interface Activity {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  imageUrl?: string;
  isCompleted: boolean;
  isLiked?: boolean;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
    authorAvatar?: string;
  }>;
  experienceNote?: string;
  experienceImage?: string;
}

interface ActivityCardProps {
  activity: Activity;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  showActions?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkComplete?: () => void;
}

export function ActivityCard({ 
  activity, 
  onLike, 
  onComment, 
  showActions = false,
  isOwner = false,
  onEdit,
  onDelete,
  onMarkComplete
}: ActivityCardProps) {
  const [showComments, setShowComments] = useState(false);

  // Fixed: Accept string, safely parse
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Safe avatar with fallback
  const getAvatar = (avatar?: string, name?: string) => {
    if (avatar) return avatar;
    const initial = name?.[0]?.toUpperCase() || '?';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=8b5cf6&color=fff&bold=true`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
      activity.isCompleted ? 'ring-4 ring-green-500 ring-opacity-20' : ''
    }`}>
      {/* Completed Badge */}
      {activity.isCompleted && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 flex items-center gap-2 font-medium">
          <CheckCircle className="w-5 h-5" />
          <span>Completed!</span>
        </div>
      )}

      {/* Main Image */}
      {activity.imageUrl && (
        <div className="relative w-full h-64 bg-gray-100">
          <ImageWithFallback
            src={activity.imageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <img
              src={getAvatar(activity.authorAvatar, activity.author)}
              alt={activity.author}
              className="w-12 h-12 rounded-full ring-4 ring-white shadow-lg object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.author)}&background=8b5cf6&color=fff`;
              }}
            />
            <div>
              <p className="font-semibold text-gray-900">{activity.author}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(activity.createdAt)}
              </div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-2">
              {!activity.isCompleted && onMarkComplete && (
                <button
                  onClick={onMarkComplete}
                  className="p-3 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-all transform hover:scale-110"
                  title="Mark as complete"
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all transform hover:scale-110"
                  title="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all transform hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {activity.isCompleted && <span className="line-through opacity-70">{activity.title}</span>}
          {!activity.isCompleted && activity.title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-5">{activity.description}</p>

        {/* Experience Note */}
        {activity.isCompleted && activity.experienceNote && (
          <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <p className="text-gray-800 italic leading-relaxed">"{activity.experienceNote}"</p>
            {activity.experienceImage && (
              <div className="mt-4 w-full h-64 rounded-xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={activity.experienceImage}
                  alt="My experience"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Like & Comment Actions */}
        {showActions && (
          <div className="flex items-center gap-8 pt-5 border-t border-gray-200">
            <button
              onClick={() => onLike(activity.id)}
              className={`flex items-center gap-2 transition-all transform hover:scale-110 ${
                activity.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${activity.isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{activity.likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all transform hover:scale-110"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{activity.comments.length}</span>
            </button>
          </div>
        )}

        {/* Comments */}
        {showComments && showActions && (
          <div className="mt-6 -mx-6 px-6 pb-4">
            <CommentSection
              comments={activity.comments}
              onAddComment={(text) => onComment(activity.id, text)}
            />
          </div>
        )}
      </div>
    </div>
  );
}