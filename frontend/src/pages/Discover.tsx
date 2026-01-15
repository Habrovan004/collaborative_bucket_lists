import { useEffect, useState } from "react";
import { ActivityCard } from './ActivityBucket';
import type { Activity } from './ActivityBucket';
import { API_ENDPOINTS } from "../config/api";
import { Sparkles } from "lucide-react";
import axiosClient from "../config/axiosClients";

const Discover: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map backend bucket to frontend Activity
  const mapBucketToActivity = (bucket: any): Activity => {
    let imageUrl: string | undefined = undefined;
    if (bucket.image) {
      if (bucket.image.startsWith('http')) {
        imageUrl = bucket.image;
      } else if (bucket.image.startsWith('/')) {
        imageUrl = `http://localhost:8000${bucket.image}`;
      } else {
        imageUrl = `http://localhost:8000/media/${bucket.image}`;
      }
    }

    return {
      id: String(bucket.id),
      title: bucket.title,
      description: bucket.description || '',
      author: bucket.owner || 'Unknown',
      authorAvatar: undefined,
      createdAt: bucket.created_at,
      imageUrl,
      isCompleted: bucket.is_completed || false,
      isLiked: bucket.has_upvoted || false,
      likes: bucket.upvotes_count || 0,
      comments: (bucket.comments || []).map((comment: any) => ({
        id: String(comment.id),
        author: comment.user || 'Unknown',
        text: comment.text,
        createdAt: comment.created_at,
        authorAvatar: undefined,
      })),
    };
  };

  const fetchBuckets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get(API_ENDPOINTS.BUCKETS.LIST);
      const data = res.data;
      const buckets = Array.isArray(data) ? data : (data.results || []);
      const mappedActivities = buckets.map(mapBucketToActivity);
      setActivities(mappedActivities);
    } catch (err: any) {
      console.error('Error fetching buckets:', err);
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  const handleLike = async (id: string) => {
    try {
      await axiosClient.post(API_ENDPOINTS.BUCKETS.UPVOTE(id));
      fetchBuckets();
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to like item');
    }
  };

  const handleComment = async (id: string, text: string) => {
    try {
      await axiosClient.post(API_ENDPOINTS.BUCKETS.COMMENTS(id), { text });
      fetchBuckets();
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[240px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-purple-600" />
          Discover Adventures
          <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-pink-600" />
        </h1>
        <p className="text-gray-600 text-center text-sm sm:text-base">
          Explore bucket list items from our community and get inspired
        </p>
      </div>

      {/* Activities Grid */}
      <div className="space-y-5 sm:space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-gray-500 text-base sm:text-lg">No activities found. Be the first to add one!</p>
          </div>
        ) : (
          activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onLike={handleLike}
              onComment={handleComment}
              showActions={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Discover;
