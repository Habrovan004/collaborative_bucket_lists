import { useState } from 'react';
import { Send } from 'lucide-react';

interface Comment {
  id: string | number;
  text: string;
  author: string;
  authorAvatar?: string;
  createdAt: string; // ← This comes as ISO string from Django
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (text) {
      onAddComment(text);
      setNewComment('');
    }
  };

  // Fixed: Accept string, safely parse
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Just now";
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Safe avatar fallback
  const getAvatar = (avatar?: string, name?: string) => {
    if (avatar) return avatar;
    const initial = name?.[0]?.toUpperCase() || '?';
    return `https://ui-avatars.com/api/?name=${initial}&background=random&color=fff&bold=true`;
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      {/* Existing Comments */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={getAvatar(comment.authorAvatar, comment.author)}
                alt={comment.author}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author)}&background=8b5cf6&color=fff`;
                }}
              />
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Write a comment..."
          className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          title="Send comment"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}