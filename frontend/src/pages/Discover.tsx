import { useEffect, useState } from "react";
import { ActivityCard } from './ActivityBucket';
import type { Activity } from './ActivityBucket';
import { API_ENDPOINTS } from "../config/api";

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
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(API_ENDPOINTS.BUCKETS.LIST, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch buckets');
      }

      const data = await response.json();
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login to like items');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.UPVOTE(id), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        // Refresh the list
        fetchBuckets();
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to like');
      }
    } catch (err) {
      console.error('Like error:', err);
      alert('Failed to like item');
    }
  };

  const handleComment = async (id: string, text: string) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const response = await fetch(API_ENDPOINTS.BUCKETS.COMMENTS(id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        // Refresh the list
        fetchBuckets();
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Comment error:', err);
      alert('Failed to add comment');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 flex items-center justify-center min-h-[400px]">
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
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Adventures</h1>
        <p className="text-gray-600">
          Explore bucket list items from our community and get inspired
        </p>
      </div>

      {/* Activities Grid */}
      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No activities found. Be the first to add one!</p>
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
